import moment from "moment";
import * as jwt from "jsonwebtoken";
import { database } from "../../../app";
import { logger } from "../../../utils/logging";
import {
  validateRequestToken,
  generateWebtoken,
} from "../../../middleware/auth";

const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
router.use(validateRequestToken);

router.post("/login", async (request, res) => {
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
  // const tokenSecret = process.env.TOKEN_SECRET;
  const user = await getUserProfileById(foundUser[0].id);
  const webToken = generateWebtoken(user);
  if (user.status === "ADMIN") {
    const admin = user;
    const usersInfoForAdmin = await getSimpleProfileInfoForAdmin();
    request.body.user = admin;
    const responseBody = {
      user,
      usersInfo: usersInfoForAdmin,
      token: webToken,
    };
    return res.status(200).json(responseBody);
  } else {
    const userToReturn = user;
    console.log({ user: userToReturn });
    request.body.user = userToReturn;
    logger("Successful login for user: ", request);
    return res.status(200).json({ user: userToReturn, token: webToken });
  }
});

router.put("/update/password/:id", async (req, res) => {
  const { id } = req.params;
  const { newPassword, password } = req.body;
  const foundUser = await findUserById(id);
  req.body.user = foundUser;
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

router.put("/update/email/:id", async (req, res) => {
  const { newEmail, password } = req.body;
  const { id } = req.params;
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
  req.body.user = foundUser;

  const hash = foundUser.password;
  let isValidPassword = bcrypt.compareSync(password, hash);
  if (!isValidPassword) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    return updateEmail(id, newEmail)
      .then((email) => {
        logger("Sucessfully updated email to: " + email, req);
        console.log({ email });
        return res.status(200).json({ email });
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
      const query = await getUserProfileById(id);
      const newUserProfile = query[0];
      console.log({ newUserProfile });
      logger("Sucessfully updated profile.", req);
      return res.status(200).json({ user: newUserProfile });
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

const getSimpleProfileInfoForAdmin = async () => {
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
