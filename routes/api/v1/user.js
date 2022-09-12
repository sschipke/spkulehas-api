import moment from "moment";
import { database } from "../../../app";
import { logger } from "../../../utils/logging";
import { sendPasswordResetEmail } from "../../../email";
import {
  validateUserProfile,
  canUserUpdate,
  validateEmail,
  validateStatus,
  validatePassword,
  validateEmailSetting,
} from "../../../validations/userValidation";
import {
  loginLimiter,
  passwordResetLimiter,
} from "../../../middleware/rate-limits";
import {
  validateRequestToken,
  generateWebtoken,
} from "../../../middleware/auth";

import {
  validateSession,
  invalidateOtherSessions,
  RESET_TYPE,
  createResetSessionForUser,
} from "../../../repoCalls/sessionRepoCalls";
import { forbiddenResponse } from "../../../utils/httpHelpers";

const SEND_EMAIL_DELAY_MS = 900;

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
router.use(validateRequestToken);

router.post("/login", loginLimiter, async (request, res) => {
  const { email, password } = request.body;
  const foundUser = await findUserByEmail(email);
  if (!foundUser || !foundUser.length) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }
  const hash = foundUser[0].password;
  let isValidPassword = bcrypt.compareSync(password, hash);
  if (!isValidPassword) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  const user = await getUserProfileById(foundUser[0].id);
  const usersInfo = await getAllUsersIdNameAndEmail();
  const emailSettings = await findAllEmailSettingsByUserId(foundUser[0].id);
  const webToken = generateWebtoken(user, "1hr");
  //TODO: For now there should only be one email setting for deletion emails
  //Once we support more, we can remove the index here
  const responseBody = {
    user,
    emailSettings: emailSettings.length ? emailSettings[0] : null,
    usersInfo: usersInfo,
    token: webToken,
  };
  console.log({ user });
  logger("Successful login for user: ", request);
  return res.status(200).json(responseBody);
});

router.put("/update/password/:id", passwordResetLimiter, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  let { newPassword } = req.body;
  const userFromJwt = res.locals.user;
  const foundUser = await findUserById(id);

  if (!canUserUpdate(userFromJwt, id, true)) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  const hash = foundUser.password;
  let isValidPassword = bcrypt.compareSync(password, hash);
  if (!isValidPassword) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (password === newPassword) {
    return res.status(422).json({ error: "Cannot use old password" });
  }

  const error = validatePassword(newPassword);
  if (Object.keys(error).length) {
    return res.status(422).json(error);
  }

  try {
    return updatePassword(id, newPassword).then(() => {
      logger("Sucessfully updated password. ", req);
      return res.status(200).json("Successfully updated password.");
    });
  } catch (error) {
    console.error("Unable to update password. ", error);
    return res.status(500).json({ error: "Unable to update password." });
  }
});

router.post("/forgot/password", passwordResetLimiter, async (req, res) => {
  const { email } = req.body;
  const usersByEmail = await findUserByEmail(email);
  if (usersByEmail.length === 1) {
    const user = usersByEmail[0];
    await invalidateOtherSessions(user.id, RESET_TYPE);
    const sessionId = await createResetSessionForUser(user.id);
    const token = generateWebtoken(user, "2hr", "email", sessionId[0].id);
    const emailUrl = `${process.env.FRONT_END_BASE_URL}?reset=${token}`;
    delete user.password;
    try {
      await sendPasswordResetEmail(user, emailUrl);
      res
        .status(200)
        .json("If a user with this email exists, an email has been sent.")
        .send();
    } catch (error) {
      console.error(
        "Unable to send password reset email to: " + user.email + " " + error
      );
    }
  } else {
    console.error(
      "Password reset email not sent due to duplicate or missing emails. ",
      { usersByEmail }
    );

    //This delay was added to roughly match the latency it took for successful emails to be sent.
    //This is to make it harder for an attacker to determine if an email exists in the db or not
    setTimeout(() => {
      return res
        .status(200)
        .json("If a user with this email exists, an email has been sent.");
    }, SEND_EMAIL_DELAY_MS);
  }
});

router.put("/reset/password", passwordResetLimiter, async (req, res) => {
  const { newPassword } = req.body;
  const { user, tokenType, sessionId } = res.locals;
  if (tokenType !== "email") {
    console.error("Attempt to reset password with non-email token.");
    return forbiddenResponse();
  }
  const { isValid, message } = await validateSession(
    sessionId,
    RESET_TYPE,
    user.id
  );
  if (!isValid) {
    return res.status(401).json({ error: message });
  }
  const error = validatePassword(newPassword);
  if (Object.keys(error).length) {
    return res.status(422).json(error);
  }
  try {
    return updatePassword(user.id, newPassword).then(() => {
      logger("Sucessfully reset password. ", req);
      return res.status(200).json("Successfully reset password.");
    });
  } catch (error) {
    console.error("Unable to reset password. ", error);
    return res.status(500).json({ error: "Unable to reset password." });
  }
});

router.put("/update/email/:id", async (req, res) => {
  const { newEmail, password } = req.body;
  const { id } = req.params;
  const userFromJwt = res.locals.user;
  const foundUser = await findUserById(id);
  console.log({ foundUser });
  if (!foundUser) {
    return res.status(404).json({ error: "Invalid user ID." });
  }

  if (!canUserUpdate(userFromJwt, id)) {
    return res.status(403).status({ error: "Unauthorized." });
  }

  if (!newEmail || !password) {
    return res.status(422).json({ error: "New email and password required." });
  }
  const matchingEmails = await findUserByEmail(newEmail);
  if (matchingEmails.length > 0) {
    return res.status(409).json({ error: "This email already exists." });
  }

  const hash = foundUser.password;
  let isValidPassword = bcrypt.compareSync(password, hash);
  if (!isValidPassword) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const error = validateEmail(newEmail);

  if (Object.keys(error).length) {
    return res.status(422).json(error);
  }

  try {
    return updateEmail(id, newEmail)
      .then((email) => {
        logger("Sucessfully updated email to: " + email, req);
        const updatedUser = foundUser;
        updatedUser.email = email;
        updatedUser.name = userFromJwt.name;
        updatedUser.status = userFromJwt.status;
        const webToken = generateWebtoken(updatedUser, "1hr");
        return res.status(200).json({ email, token: webToken });
      })
      .catch((err) => {
        console.error("Unable to update email. ", err);
        return res.status(500).json({ error: "Unable to update email." });
      });
  } catch (error) {
    console.error("Unable to update email. ", error);
    return res.status(500).json({ error: "Unable to update email." });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const jwtUser = res.locals.user;

  if (!canUserUpdate(jwtUser, id)) {
    return res.status(403).status({ error: "Unauthorized." });
  }

  let profileToUpdate = await getUserProfileById(id);

  if (!profileToUpdate) {
    return res
      .status(404)
      .json({ error: "Unable to find profile with id: " + reservationId });
  }

  const profile = mapUserToProfile(user);
  if (!validateStatus(jwtUser, profileToUpdate, profile)) {
    return res
      .status(403)
      .json({ error: "Only the admin can update a member's status." });
  }
  const error = validateUserProfile(profile);
  if (Object.keys(error).length) {
    return res.status(422).json(error);
  }

  return updateProfile(profile)
    .then(async (numberOfUpdates) => {
      if (numberOfUpdates <= 0) {
        return res
          .status(404)
          .json({ error: "No profile found with id: " + id });
      }

      const newUserProfile = await getUserProfileById(id);
      console.log({ newUserProfile });
      logger("Sucessfully updated profile.", req);
      const webToken = generateWebtoken(user, "1hr");
      return res.status(200).json({ user: newUserProfile, token: webToken });
    })
    .catch((err) => {
      console.error("Unable to successfuly update profile.", err);
      return res
        .status(500)
        .json({ error: "Unable to update profile sucessfully." });
    });
});

router.put("/email_setting/:userId", async (req, res) => {
  const { userId } = req.params;
  const { settingName, value } = req.body;
  console.log(req.body);
  const userFromJwt = res.locals.user;

  if (!canUserUpdate(userFromJwt, userId, true)) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (!validateEmailSetting(settingName, value)) {
    return res.status(422).json({ error: "Invalid email setting" });
  }

  try {
    return processEmailSettingUpdate(userId, settingName, value).then(() => {
      let successMessage = value
        ? "You will be notified when reservations are deleted."
        : "You will no longer receive deletion emails.";
      logger("Sucessfully updated email setting. ", req);
      return res.status(200).json(successMessage);
    });
  } catch (error) {
    console.error("Unable to update password. ", error);
    return res.status(500).json({ error: "Unable to update email setting." });
  }
});

const findUserByEmail = async (email) => {
  return database("user").where({ email: email.toLowerCase() });
};

const findUserById = async (id) => {
  return database("user")
    .where({ id })
    .columns(["id", "email", "password"])
    .first();
};

const getUserProfileById = async (id) => {
  return database("userprofile")
    .where({ user_id: id })
    .columns([
      "name",
      "status",
      "street",
      "city",
      "state",
      "zipcode",
      "phone",
      "user_id AS id",
    ])
    .innerJoin("user", "user.id", "userprofile.user_id")
    .columns(["email"])
    .first();
};

const mapUserToProfile = (user) => {
  const { id, name, status, street, city, state, zipcode, phone } = user;
  const updated_at = moment().toISOString();
  const profile = {
    user_id: id,
    name,
    status,
    street,
    city,
    state,
    zipcode,
    phone,
    updated_at,
  };
  return profile;
};

const updateProfile = async (profile) => {
  const userId = profile.user_id;
  return database("userprofile")
    .where({ user_id: userId })
    .update(profile)
    .catch((err) => {
      console.error("Unable to update profile: ", profile, "Error: ", err);
      throw new Error("Unable to update profile. ", err);
    });
};

const getAllUsersIdNameAndEmail = async () => {
  return database("userprofile")
    .columns(["name", "user_id AS id"])
    .innerJoin("user", "user.id", "userprofile.user_id")
    .columns(["email"])
    .orderBy("name", "asc");
};

const updatePassword = async (id, password) => {
  const now = moment().toISOString();
  const hash = bcrypt.hashSync(password, 10);
  return database("user")
    .where({ id: id })
    .update({ password: hash, updated_at: now });
};

const updateEmail = async (id, newEmail) => {
  const now = moment().toISOString();
  return database("user")
    .where({ id })
    .update({ email: newEmail, updated_at: now }, ["email"])
    .then((res) => {
      if (res && res.length > 0) {
        return res[0].email;
      }
    });
};

const processEmailSettingUpdate = async (userId, settingName, value) => {
  const possibleExistingSetting = await findEmailSettingByNameAndUserId(
    userId,
    settingName
  );
  if (possibleExistingSetting.length === 1) {
    try {
      const existingSetting = possibleExistingSetting[0];
      const settingId = existingSetting.id;
      return updateEmailSetting(settingId, value);
    } catch (error) {
      console.error(
        "Error updating existing email setting setting for: ",
        userId,
        error
      );
      throw new Error({ error: "Unable to update email setting." });
    }
  } else if (possibleExistingSetting.length === 0) {
    try {
      return addEmailSettingForUser(userId, settingName, value);
    } catch (error) {
      console.error("Error adding email setting setting for: ", userId, error);

      throw new Error({ error: "Unable to update email setting." });
    }
  } else {
    throw new Error({ error: "Duplicate email settings for user: ", userId });
  }
};

const findEmailSettingByNameAndUserId = async (userId, settingName) => {
  return database("email_setting")
    .where({ user_id: userId })
    .andWhere({ setting_name: settingName });
};

const findAllEmailSettingsByUserId = async (userId) => {
  return database("email_setting")
    .columns(["setting_name", "value"])
    .where({ user_id: userId });
};

const updateEmailSetting = async (settingId, value) => {
  const now = moment().toISOString();
  return database("email_setting")
    .where({ id: settingId })
    .update({ value, updated_at: now });
};

const addEmailSettingForUser = async (userId, settingName, value) => {
  return database("email_setting").insert({
    user_id: userId,
    setting_name: settingName,
    value,
  });
};

export default router;
