import { FC, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifier } from "../context/NotifierContext";
import { formDataToObj } from "../lib/utils";
import { Form, FormError, FormField } from "./Form";
import {
  passwordValidator,
  repeatPasswordValidator,
  usernameValidator,
} from "../lib/field-validators";
import { FormValidationContext } from "../context/FormValidationContext";

const SignUpForm: FC = () => {
  const [isValidationError, setIsValidationError] = useState(false);
  const [apiResponseErrorText, setApiResponseErrorText] = useState<
    string | null
  >(null);

  const [passwordDep, passwordDepUpdater] = useState("");

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

  const onFormErrorClose = () => {
    setApiResponseErrorText("");
  };

  return (
    <FormValidationContext.Provider value={setIsValidationError}>
      <Form title="Sign up" onSubmit={handleSubmit} buttonText="Sign up">
        {apiResponseErrorText && (
          <FormError onClose={onFormErrorClose}>
            {apiResponseErrorText}
          </FormError>
        )}
        <FormField
          name="username"
          required
          label="username"
          validator={usernameValidator}
        />
        <FormField
          name="password"
          required
          label="password"
          type="password"
          validator={passwordValidator}
          dependencyUpdaters={[passwordDepUpdater]}
        />
        <FormField
          name="repeatPassword"
          required
          label="repeat password"
          type="password"
          validator={repeatPasswordValidator}
          validationDependencies={[passwordDep]}
        />
      </Form>
    </FormValidationContext.Provider>
  );
};

export default SignUpForm;
