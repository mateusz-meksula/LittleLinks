import { formFieldValidator, LinkFormValues, SignUpFormValues } from "./types";
import { isPasswordSecure } from "./utils";

export const usernameValidator: formFieldValidator<SignUpFormValues> = (
  username
) => {
  if (!username) {
    return null;
  }
  if (username.length < 5) {
    return "Username to short";
  }
  if (username.length > 20) {
    return "Username to long";
  }
  return null;
};

export const passwordValidator: formFieldValidator<SignUpFormValues> = (
  password
) => {
  if (!password || isPasswordSecure(password)) {
    return null;
  }
  if (!isPasswordSecure(password)) {
    return "Password is not secure";
  }
  return null;
};

export const repeatPasswordValidator: formFieldValidator<SignUpFormValues> = (
  repeatPassword,
  formValues
) => {
  const password = formValues?.password;
  if ((!password && !repeatPassword) || password === repeatPassword) {
    return null;
  }
  if (password !== repeatPassword) {
    return "Passwords does not match";
  }
  return null;
};

export const aliasValidator: formFieldValidator<LinkFormValues> = (alias) => {
  if (alias.length > 10) {
    return "alias to long";
  }
  return null;
};
