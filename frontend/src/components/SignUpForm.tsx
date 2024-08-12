import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifier } from "../context/NotifierContext";
import Form from "./Form";
import FormField from "./FormField";
import { formDataToObj, withFormErrorSetter } from "../utils";

type SignUpFormValues = {
  username: string;
  password: string;
  repeatPassword: string;
};

const SignUpForm: FC = () => {
  const [formErrorText, setFormErrorText] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [formValues, setFormValues] = useState<SignUpFormValues>({
    username: "",
    password: "",
    repeatPassword: "",
  });

  const navigate = useNavigate();
  const notify = useNotifier();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isError) return;

    const requestData = formDataToObj(new FormData(e.currentTarget));

    const response = await fetch("/api/users/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      notify.success("Account created successfully");
      navigate("/log-in");
    } else if (response.status === 409) {
      setFormErrorText("Username already taken");
    } else {
      notify.error("Something went wrong, try again later");
    }
  }

  function usernameValidator(username: string) {
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
  }

  function passwordValidator(password: string) {
    if (!password || isPasswordSecure(password)) {
      return null;
    }
    if (!isPasswordSecure(password)) {
      return "Password is not secure";
    }
    return null;
  }

  function repeatPasswordValidator(repeatPassword: string) {
    const password = formValues.password;
    if ((!password && !repeatPassword) || password === repeatPassword) {
      return null;
    }
    if (password !== repeatPassword) {
      return "Passwords does not match";
    }
    return null;
  }

  const fieldOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  return (
    <Form
      title="Sign up"
      onSubmit={handleSubmit}
      buttonText="Sign up"
      errorText={formErrorText}
    >
      <FormField
        name="username"
        required
        label="username"
        formValues={formValues}
        onChange={fieldOnChange}
        validator={withFormErrorSetter(usernameValidator, setIsError)}
      />
      <FormField
        name="password"
        required
        label="password"
        type="password"
        formValues={formValues}
        onChange={fieldOnChange}
        validator={withFormErrorSetter(passwordValidator, setIsError)}
      />
      <FormField
        name="repeatPassword"
        required
        label="repeat password"
        type="password"
        onChange={fieldOnChange}
        formValues={formValues}
        validator={withFormErrorSetter(repeatPasswordValidator, setIsError)}
      />
    </Form>
  );
};

export default SignUpForm;

function isPasswordSecure(password: string): boolean {
  // TODO
  return password.length > 5;
}
