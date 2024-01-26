import { safeTrim } from "../utils/helpers";
const POSSIBLE_STATUSES = ["ADMIN", "D2", "D1", "S2", "S1", "U"];
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_STATUS = "ADMIN";
const POSSIBLE_EMAIL_SETTINGS = [
  "reservation_deleted",
  "reservation_shortened",
  "reservation_reminder"
];

const USER_ID_REGEX = new RegExp(
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
);

const CITY_NAME_REGEX = new RegExp(
  /^s*[a-zA-Z]{1}[0-9a-zA-Z][0-9a-zA-Z '-.=#/]*$/
);

const STATE_CODE_REGEX = new RegExp(
  /^(([Aa][EeLlKkSsZzRr])|([Cc][AaOoTt])|([Dd][EeCc])|([Ff][MmLl])|([Gg][AaUu])|([Hh][Ii])|([Ii][DdLlNnAa])|([Kk][SsYy])|([Ll][Aa])|([Mm][EeHhDdAaIiNnSsOoTt])|([Nn][EeVvHhJjMmYyCcDd])|([Mm][Pp])|([Oo][HhKkRr])|([Pp][WwAaRr])|([Rr][Ii])|([Ss][CcDd])|([Tt][NnXx])|([Uu][Tt])|([Vv][TtIiAa])|([Ww][AaVvIiYy]))$/
);

const ZIP_CODE_REGEX = new RegExp(/[0-9]{5}/);

// This if for the 12 digit XXX-XXX-XXXX format
const PHONE_REGEX = new RegExp(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/);

const EMAIL_REGEX = new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/);

const VALID_PASSWORD_REGEX = new RegExp(
  /^(?!.* )(?!.*[\s])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,20}$/
);

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 20;
const HAS_CAPITAL_REGEX = new RegExp(/(?=.*[A-Z])/);
const HAS_LOWERCASE_REGEX = new RegExp(/(?=.*[a-z])/);
const HAS_NUMBER_REGEX = new RegExp(/(?=.*[0-9])/);
const HAS_SPECIAL_CHARACTER_REGEX = new RegExp(/(?=.*[!@#$%^&*])/);

const HAS_WHITE_SPACE = new RegExp(/\s/);

export const validateUserProfile = (userProfile, email) => {
  const {
    user_id,
    first_name,
    last_name,
    name,
    street,
    city,
    state,
    zipcode,
    phone,
    status,
    isadmin
  } = userProfile;

  const processedEmail = safeTrim(email).toLowerCase();

  if (!USER_ID_REGEX.test(user_id)) {
    return { error: "Invalid user id." };
  }

  const trimmedFirstName = safeTrim(first_name);
  if (
    !trimmedFirstName ||
    trimmedFirstName.length < 1 ||
    trimmedFirstName.length > 30
  ) {
    return { error: "Invalid first name." };
  }

  userProfile.first_name = trimmedFirstName;

  const trimmedLastName = safeTrim(last_name);
  if (
    !trimmedLastName ||
    trimmedLastName.length < 1 ||
    trimmedLastName.length > 30
  ) {
    return { error: "Invalid last name." };
  }

  userProfile.last_name = trimmedLastName;

  const trimmedName = safeTrim(name);
  if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 30) {
    return { error: "Invalid name." };
  }
  userProfile.name = trimmedName;

  const trimmedStreet = safeTrim(street);
  if (
    !trimmedStreet ||
    trimmedStreet.length < 10 ||
    trimmedStreet.length > 50
  ) {
    return { error: "Invalid street address." };
  }
  userProfile.street = trimmedStreet;

  const trimmedCity = safeTrim(city);
  if (
    !trimmedCity ||
    trimmedCity.length > 20 ||
    !CITY_NAME_REGEX.test(trimmedCity)
  ) {
    return { error: "Invalid city name." };
  }
  userProfile.city = trimmedCity;

  const trimmedStateCode = safeTrim(state);
  if (
    trimmedStateCode.length !== 2 ||
    !STATE_CODE_REGEX.test(trimmedStateCode)
  ) {
    return { error: "Invalid state code." };
  }
  userProfile.state = trimmedStateCode;

  const trimmedZipCode = safeTrim(zipcode);
  if (trimmedZipCode.length !== 5 || !ZIP_CODE_REGEX.test(trimmedZipCode)) {
    return { error: "Invalid zip code." };
  }
  userProfile.zipcode = trimmedZipCode;

  const trimmedPhoneNumber = safeTrim(phone);
  if (!trimmedPhoneNumber || !PHONE_REGEX.test(trimmedPhoneNumber)) {
    return { error: "Invalid phone number." };
  }

  if (processedEmail === ADMIN_EMAIL && !isadmin) {
    return { error: "SpKuLeHaS admin must always be an admin." };
  }

  userProfile.phone = trimmedPhoneNumber;
  if (!POSSIBLE_STATUSES.includes(status)) {
    return { error: "Invalid status." };
  }
  if (status === ADMIN_STATUS && processedEmail !== ADMIN_EMAIL) {
    return { error: "ADMIN status is reserved for SpKuLeHaS admin user." };
  }

  if (processedEmail === ADMIN_EMAIL && status !== ADMIN_STATUS) {
    return { error: "The SpKuLeHaS admin status cannot be changed." };
  }

  return {};
};

export const canUserUpdate = (jwtUser, id, isPassword) => {
  if (isPassword) {
    return jwtUser.id === id;
  }
  return jwtUser.isAdmin || jwtUser.id === id;
};

export function canUpdateStatusOrPrivileges(
  jwtUser,
  dbProfile,
  requestedProfile
) {
  console.log({ dbProfile }, { requestedProfile });
  const trimmedStatus = (requestedProfile.status || "").trim();
  if (!jwtUser.isAdmin && dbProfile.status !== trimmedStatus) {
    return false;
  }
  if (!jwtUser.isAdmin && dbProfile.isAdmin !== requestedProfile.isadmin) {
    return false;
  }
  requestedProfile.status = trimmedStatus;
  return true;
}

export const hasStatusChanged = (currentProfile, updatedProfile) => {
  const trimmedStatus = (updatedProfile.status || "").trim();
  return currentProfile.status !== trimmedStatus;
};

export const validateEmail = (email) => {
  const processedEmail = email.trim().toLowerCase();
  if (!processedEmail || !EMAIL_REGEX.test(processedEmail)) {
    return { error: "Invalid email address." };
  }
  email = processedEmail;
  return {};
};

export const validatePassword = (newPassword) => {
  if (!newPassword) {
    return { error: "Password is missing" };
  }
  if (
    newPassword.length < MIN_PASSWORD_LENGTH ||
    newPassword.length > MAX_PASSWORD_LENGTH
  ) {
    return { error: "Password must be between 8 & 20 characters" };
  }
  if (!HAS_CAPITAL_REGEX.test(newPassword)) {
    return { error: "Password must contain a capital letter" };
  }
  if (!HAS_LOWERCASE_REGEX.test(newPassword)) {
    return { error: "Password must contain a lower case letter" };
  }
  if (!HAS_NUMBER_REGEX.test(newPassword)) {
    return { error: "Password must contain at least one number" };
  }
  if (!HAS_SPECIAL_CHARACTER_REGEX.test(newPassword)) {
    return {
      error: "Password must contain at least one of the following: !@#$%^&*"
    };
  }
  if (HAS_WHITE_SPACE.test(newPassword)) {
    return { error: "Password cannot contain white space" };
  }
  if (!VALID_PASSWORD_REGEX.test(newPassword)) {
    return { error: "Invalid password" };
  }
  return {};
};

export const validateEmailSetting = (emailSetting, value) => {
  return (
    POSSIBLE_EMAIL_SETTINGS.includes(emailSetting) && typeof value === "boolean"
  );
};

export const isAdmin = (user) => {
  return user && user.isAdmin;
};

export const determineNameChange = (oldUser, updatedUser) => {
  return oldUser.name !== updatedUser.name;
};
