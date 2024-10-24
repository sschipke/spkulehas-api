const specialChars = "!$%^&*#";
const generatePassword = () => {
  return (
    Math.random().toString(36).slice(4) +
    specialChars.charAt(Math.floor(Math.random() * specialChars.length)) +
    Math.random().toString(36).toUpperCase().slice(4)
  );
};

module.exports = {
  generatePassword
};
