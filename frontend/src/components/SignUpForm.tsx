import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifier } from "../context/NotifierContext";
import { formDataToObj, withFormErrorSetter } from "../lib/utils";
import { Form, FormError, FormField } from "./Form";
import {
  passwordValidator,
  repeatPasswordValidator,
  usernameValidator,
} from "../lib/field-validators";
import { SignUpFormValues } from "../lib/types";

const SignUpForm: FC = () => {
  const [isValidationError, setIsValidationError] = useState(false);
  const [apiResponseErrorText, setApiResponseErrorText] = useState<
    string | null
  >(null);
  const [formValues, setFormValues] = useState<SignUpFormValues>({
    username: "",
    password: "",
    repeatPassword: "",
  });

  const navigate = useNavigate();
  const notify = useNotifier();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isValidationError) return;

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
      setApiResponseErrorText("Username already taken");
    } else {
      notify.error("Something went wrong, try again later");
    }
  }

  const fieldOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const onFormErrorClose = () => {
    setApiResponseErrorText("");
  };

  return (
    <Form title="Sign up" onSubmit={handleSubmit} buttonText="Sign up">
      {apiResponseErrorText && (
        <FormError onClose={onFormErrorClose}>{apiResponseErrorText}</FormError>
      )}
      <FormField
        name="username"
        required
        label="username"
        formValues={formValues}
        onChange={fieldOnChange}
        validator={withFormErrorSetter(usernameValidator, setIsValidationError)}
      />
      <FormField
        name="password"
        required
        label="password"
        type="password"
        formValues={formValues}
        onChange={fieldOnChange}
        validator={withFormErrorSetter(passwordValidator, setIsValidationError)}
      />
      <FormField
        name="repeatPassword"
        required
        label="repeat password"
        type="password"
        onChange={fieldOnChange}
        formValues={formValues}
        validator={withFormErrorSetter(
          repeatPasswordValidator,
          setIsValidationError
        )}
      />
    </Form>
  );
};

export default SignUpForm;
