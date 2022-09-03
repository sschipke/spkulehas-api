const fs = require("fs");
const env = process.env.NODE_ENV || "dev";

const copyUser = (user) => {
  const userInfo = {
    userId: user.id,
    name: user.profile.name,
    email: user.email,
    password: user.password,
  };
  content = JSON.stringify(userInfo) + ",";
  fs.appendFile(`./passwords-${env}.json`, content, (err) => {
    if (err) {
      console.error("Error writing to file", err);
      return new Error("Error writing to file: ", err);
    }
    console.log("Successfully wrote ", user.email, " to file.");
  });
};

const resetPassFile = () => {
  try {
    fs.unlinkSync(`./passwords-${env}.json`);
  } catch (err) {
    console.error("Error resetting file. ", err);
  }
  console.log("Successfully deleted file!");
};

module.exports = {
  copyUser,
  resetPassFile,
};
