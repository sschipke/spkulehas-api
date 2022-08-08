import moment from "moment";
import * as jwt from "jsonwebtoken";
import { database } from "../../../app";
import { logger } from "../../../utils/logging";
import { sendPasswordResetEmail } from "../../../email";
import {
  loginLimiter,
  passwordResetLimiter,
} from "../../../middleware/rate-limits";
import {
  validateRequestToken,
  generateWebtoken,
} from "../../../middleware/auth";

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
router.use(validateRequestToken);

router.post("/login", loginLimiter, async (request, res) => {
  const { email, password } = request.body;
  const foundUser = await findUserByEmail(email);
  if (!foundUser || !foundUser.length) {
    return res.status(404).json({ error: "Incorrect email or password." });
  }
  const hash = foundUser[0].password;
  let isValidPassword = bcrypt.compareSync(password, hash);
  if (!isValidPassword) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  const user = await getUserProfileById(foundUser[0].id);
  console.log({ user });
  const usersInfo = await getAllUsersIdNameAndEmail();
  const webToken = generateWebtoken(user, "1hr");
  const responseBody = {
    user,
    usersInfo: usersInfo,
    token: webToken,
  };
  console.log({ user });
  logger("Successful login for user: ", request);
  return res.status(200).json(responseBody);
});

router.put("/update/password/:id", async (req, res) => {
  const { id } = req.params;
  const { newPassword, password } = req.body;
  const foundUser = await findUserById(id);
  const hash = foundUser.password;
  let isValidPassword = bcrypt.compareSync(password, hash);
  if (!isValidPassword) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    return updatePassword(id, newPassword).then((success) => {
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
  console.log(email, req.body);
  const usersByEmail = await findUserByEmail(email);
  if (usersByEmail.length === 1) {
    const user = usersByEmail[0];
    const token = generateWebtoken(user, "2hr", "email");
    const emailUrl = `${process.env.FRONT_END_BASE_URL}?reset=${token}`;
    try {
      let success = await sendPasswordResetEmail(user, emailUrl);
      return res
        .status(200)
        .json("If a user with this email exists, an email has been sent.");
    } catch (error) {
      console.error(
        "Unable to send password reset email to: " + user.email + " " + error
      );
      return res.status(500).json("Unable to send email.");
    }
  } else {
    console.error(
      "Password reset email not sent due to duplicate or insufficient emails. ",
      { usersByEmail }
    );
    return res
      .status(200)
      .json("If a user with this email exists, an email has been sent.");
  }
});

router.put("/reset/password", passwordResetLimiter, async (req, res) => {
  const { newPassword } = req.body;
  const { user, tokenType } = res.locals;
  if (tokenType !== "email") {
    console.error("Attempt to reset password with non-email token.");
    return res.status(403).json("Unauthorized");
  }
  try {
    return updatePassword(user.id, newPassword).then((success) => {
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
  const localUser = res.locals.user;
  const foundUser = await findUserById(id);
  console.log({ foundUser });
  if (!foundUser) {
    return res.status(404).json({ error: "Invalid user ID." });
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

  try {
    return updateEmail(id, newEmail)
      .then((email) => {
        logger("Sucessfully updated email to: " + email, req);
        const updatedUser = foundUser;
        updatedUser.email = email;
        updatedUser.name = localUser.name;
        updatedUser.status = localUser.status;
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

  let profileToUpdate = await getUserProfileById(id);

  if (!profileToUpdate) {
    return res
      .status(404)
      .json({ error: "Unable to find profile with id: " + reservationId });
  }

  //TODO: Add Validation!

  return updateProfile(user)
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

const updateProfile = async (user) => {
  const profile = mapUserToProfile(user);
  return database("userprofile")
    .where({ user_id: user.id })
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

export default router;
