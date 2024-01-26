import { logger } from "../../../utils/logging";
import {
  sendPasswordResetEmail,
  notifyMemberOfEmailChange,
  notifyMemberOfProfileChange,
  notifyMemberOfStatusChange
} from "../../../email";
import {
  validateUserProfile,
  canUserUpdate,
  validateEmail,
  canUpdateStatusOrPrivileges,
  validatePassword,
  validateEmailSetting,
  isAdmin,
  determineNameChange,
  hasStatusChanged
} from "../../../validations/userValidation";
import {
  loginLimiter,
  passwordResetLimiter
} from "../../../middleware/rate-limits";
import {
  validateRequestToken,
  generateWebtoken
} from "../../../middleware/auth";

import {
  validateSession,
  invalidateOtherSessions,
  RESET_TYPE,
  createResetSessionForUser
} from "../../../repoCalls/sessionRepoCalls";
import {
  findUserByEmail,
  findUserById,
  getUserProfileById,
  mapUserToProfile,
  updateProfile,
  getAllUsersIdNameAndEmail,
  updatePassword,
  updateEmail,
  processEmailSettingUpdate,
  findAllEmailSettingsByUserId,
  updateLogin
} from "../../../repoCalls/userRepoCalls";
import { forbiddenResponse } from "../../../utils/httpHelpers";
import {
  processNameChange,
  determineProfileChange
} from "../../../utils/helpers";
import dayjs from "dayjs";
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
    token: webToken
  };
  console.log({ user });
  logger("Successful login for user: ", request);
  res.status(200).json(responseBody).send();
  updateLogin(foundUser[0].id);
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
    let expiration = dayjs().add(2, "hours").calendar();
    const token = generateWebtoken(user, "2hr", "email", sessionId[0].id);
    const emailUrl = `${process.env.FRONT_END_BASE_URL}?reset=${token}`;
    delete user.password;
    try {
      await sendPasswordResetEmail(user, emailUrl, expiration);
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
    console.log({ isValid });
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
  const oldEmail = foundUser.email;
  const isVerifiedAdmin = isAdmin(userFromJwt);
  if (!foundUser) {
    return res.status(404).json({ error: "Invalid user ID." });
  }

  if ((foundUser.email || "").toLowerCase() === process.env.ADMIN_EMAIL) {
    return forbiddenResponse(res, "Cannot update this admin email.");
  }

  if (!canUserUpdate(userFromJwt, id)) {
    return res.status(403).status({ error: "Unauthorized." });
  }

  if (!newEmail || !password) {
    return res.status(409).json({ error: "New email and password required." });
  }
  const matchingEmails = await findUserByEmail(newEmail);
  if (matchingEmails.length > 0) {
    return res.status(409).json({ error: "This email already exists." });
  }

  const didAdminChange = userFromJwt.id !== foundUser.id;

  if (isVerifiedAdmin) {
    let adminUser = await findUserById(userFromJwt.id);
    const adminHash = adminUser.password;
    let isValidPassword = bcrypt.compareSync(password, adminHash);
    if (!isValidPassword) {
      return forbiddenResponse(res);
    }
    delete adminUser.password;
  } else {
    const hash = foundUser.password;
    let isValidPassword = bcrypt.compareSync(password, hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    delete foundUser.password;
  }

  console.log({ foundUser });

  const error = validateEmail(newEmail);

  if (Object.keys(error).length) {
    return res.status(422).json(error);
  }

  try {
    return updateEmail(id, newEmail)
      .then(async (email) => {
        logger("Sucessfully updated email to: " + email, req);
        const updatedUser = isVerifiedAdmin ? userFromJwt : foundUser;
        if (!isVerifiedAdmin) {
          updatedUser.email = email;
          updatedUser.name = userFromJwt.name;
          updatedUser.status = userFromJwt.status;
        }
        const webToken = generateWebtoken(updatedUser, "1hr");
        res.status(200).json({ email, token: webToken }).send();
        await notifyMemberOfEmailChange(
          oldEmail,
          newEmail,
          userFromJwt,
          didAdminChange
        );
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

  if (!user) {
    return res
      .status(409)
      .json({ error: "Must include a profile to updated." });
  }

  if (!canUserUpdate(jwtUser, id)) {
    return res.status(403).json({ error: "Unauthorized." });
  }
  let profileToUpdate = await getUserProfileById(id);

  if (!profileToUpdate) {
    return res
      .status(404)
      .json({ error: "Unable to find profile with id: " + id });
  }

  const profile = mapUserToProfile(user);
  if (!canUpdateStatusOrPrivileges(jwtUser, profileToUpdate, profile)) {
    return res.status(403).json({
      error: "Only an admin can update a member's status or privileges."
    });
  }

  const error = validateUserProfile(profile, user.email);
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
      const nameHasChanged = determineNameChange(
        profileToUpdate,
        newUserProfile
      );
      logger("Sucessfully updated profile.", req);
      const webToken = generateWebtoken(user, "1hr");
      const responseBody = {
        user: newUserProfile,
        token: webToken,
        updatedReservations: null
      };
      if (nameHasChanged) {
        processNameChange(res, newUserProfile, profileToUpdate, responseBody);
      } else {
        res.status(200).json(responseBody).send();
      }
      if (
        newUserProfile.id !== jwtUser.id &&
        isAdmin(jwtUser) &&
        determineProfileChange(profileToUpdate, newUserProfile)
      ) {
        try {
          await notifyMemberOfProfileChange(newUserProfile, jwtUser);
        } catch (error) {
          console.error("Unable to notify member of address change. ", error);
        }
      }
      if (hasStatusChanged(profileToUpdate, newUserProfile)) {
        try {
          await notifyMemberOfStatusChange(profileToUpdate, newUserProfile, jwtUser);
        } catch (error) {
          console.error("Unable to notifyl member of status update. ", error);
        }
      }
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
  const userFromJwt = res.locals.user;

  if (!canUserUpdate(userFromJwt, userId)) {
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

export default router;
