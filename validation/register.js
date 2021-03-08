const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";
  data.roles = !isEmpty(data.roles) ? data.roles : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.repeatPassword = !isEmpty(data.repeatPassword) ? data.repeatPassword : "";
  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.message = "Name field is required";
  }
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.message = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.message = "Email is invalid";
  }
  // Phone checks
  if (Validator.isEmpty(data.phoneNumber)) {
    errors.message = "Phone field is required";
  } else if (!Validator.isMobilePhone(data.phoneNumber)) {
    errors.message = "Phone number is invalid";
  }
  // Roles checks
  if (!data.roles) {
    errors.message = "Roles field is required";
  }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.message = "Password field is required";
  }
  if (Validator.isEmpty(data.repeatPassword)) {
    errors.message = "Confirm password field is required";
  }
  if (!Validator.isLength(data.password, { min: 3, max: 30 })) {
    errors.message = "Password must be at least 3 characters, but not more than 30";
  }
  if (!Validator.equals(data.password, data.repeatPassword)) {
    errors.message = "Passwords must match";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};