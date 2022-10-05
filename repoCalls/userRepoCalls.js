import { database } from "../app";
import moment from "moment";
const bcrypt = require("bcrypt");

export const findUserByEmail = async (email) => {
  return database("user").where({ email: email.toLowerCase() });
};

export const findUserById = async (id) => {
  return database("user")
    .where({ id })
    .columns(["id", "email", "password"])
    .first();
};

export const getUserProfileById = async (id) => {
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
      "user_id AS id"
    ])
    .innerJoin("user", "user.id", "userprofile.user_id")
    .columns(["email"])
    .first();
};

export const mapUserToProfile = (user) => {
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
    updated_at
  };
  return profile;
};

export const updateProfile = async (profile) => {
  const userId = profile.user_id;
  return database("userprofile")
    .where({ user_id: userId })
    .update(profile)
    .catch((err) => {
      console.error("Unable to update profile: ", profile, "Error: ", err);
      throw new Error("Unable to update profile. ", err);
    });
};

export const getAllUsersIdNameAndEmail = async () => {
  return database("userprofile")
    .columns(["name", "user_id AS id"])
    .innerJoin("user", "user.id", "userprofile.user_id")
    .columns(["email"])
    .orderBy("name", "asc");
};

export const updatePassword = async (id, password) => {
  const now = moment().toISOString();
  const hash = bcrypt.hashSync(password, 10);
  return database("user")
    .where({ id: id })
    .update({ password: hash, updated_at: now });
};

export const updateEmail = async (id, newEmail) => {
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

export const processEmailSettingUpdate = async (userId, settingName, value) => {
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

export const findEmailSettingByNameAndUserId = async (userId, settingName) => {
  return database("email_setting")
    .where({ user_id: userId })
    .andWhere({ setting_name: settingName });
};

export const findAllEmailSettingsByUserId = async (userId) => {
  return database("email_setting")
    .columns(["setting_name", "value"])
    .where({ user_id: userId });
};

export const updateEmailSetting = async (settingId, value) => {
  const now = moment().toISOString();
  return database("email_setting")
    .where({ id: settingId })
    .update({ value, updated_at: now });
};

export const addEmailSettingForUser = async (userId, settingName, value) => {
  return database("email_setting").insert({
    user_id: userId,
    setting_name: settingName,
    value
  });
};

export const updateLogin = async (id) => {
  const now = moment().toISOString();
  return database("user").where({ id }).update({ last_login: now });
};
