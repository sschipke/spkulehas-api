import { database } from "../app";
import dayjs from "dayjs";
const bcrypt = require("bcrypt");

export const mapProfileToModel = (profile) => {
  const { firstName, lastName } = profile;
  profile.first_name = firstName.trim();
  profile.last_name = lastName.trim();
  profile.name = `${profile.first_name} ${profile.last_name}`;
};

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
      "first_name AS firstName",
      "last_name AS lastName",
      "isadmin AS isAdmin",
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

export const getMemberNameAndEmailById = async (id) => {
  return database("userprofile")
    .where({ user_id: id })
    .columns([
      "name",
      "user_id AS id"
    ])
    .innerJoin("user", "user.id", "userprofile.user_id")
    .columns(["email"])
    .first();
};

export const mapUserToProfile = (user) => {
  const {
    id,
    firstName,
    lastName,
    status,
    street,
    city,
    state,
    zipcode,
    phone,
    isAdmin
  } = user;
  const first_name = firstName;
  const last_name = lastName;
  const fullName = `${first_name} ${last_name}`;

  const updated_at = dayjs().toISOString();
  const profile = {
    user_id: id,
    first_name,
    last_name,
    name: fullName,
    isadmin: isAdmin || false,
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
  const now = dayjs().toISOString();
  const hash = bcrypt.hashSync(password, 10);
  return database("user")
    .where({ id: id })
    .update({ password: hash, updated_at: now });
};

export const updateEmail = async (id, newEmail) => {
  const now = dayjs().toISOString();
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
  const now = dayjs().toISOString();
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
  const now = dayjs().toISOString();
  return database("user").where({ id }).update({ last_login: now });
};

export const getUserProfilesDetailView = async () => {
  // const memberDetails = await
  return database("userprofile")
    .whereNot({ status: "ADMIN" })
    .columns([
      "name",
      "isadmin AS isAdmin",
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
    .orderByRaw(
      `
  CASE status
    WHEN 'S2' THEN 1
    WHEN 'S1' THEN 2
    WHEN 'D1' THEN 3
    WHEN 'D2' THEN 4
    ELSE 5
  END;`
    );
};

export const addProfile = async (profile) => {
  return database("userprofile")
    .insert(profile)
    .catch((err) => {
      console.error("Unable to add profile: ", profile, "Error: ", err);
      throw new Error("Unable to add profile. ", err);
    });
};

export const addNewUser = async (user) => {
  const { email, id, password } = user;
  return database("user").insert({
    id,
    email,
    password
  }, "id")
  .then(() => {
    const { profile } = user;
    console.log("Adding new profile: ", profile);
    return addProfile(profile);
  })
  .catch(error => {
    console.error("Error adding new user: ", error.toString())
    if (error.toString().includes("unique")) {
      throw { message: "Email already exists."};
    }
    throw new Error("Unable to add.")
  })
};
