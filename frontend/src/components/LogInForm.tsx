import { FC, FormEvent, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotifier } from "../context/NotifierContext";
import { Form, FormError, FormField } from "./Form";

const LogInForm: FC = () => {
  const [apiResponseErrorText, setApiResponseErrorText] = useState<
    string | null
  >(null);
  const { setAuthContext } = useAuthContext();
  const navigate = useNavigate();
  const notify = useNotifier();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setAuthContext({
        isUserLoggedIn: true,
        accessToken: data.token,
      });
      navigate("/");
    } else if (response.status === 401) {
      setApiResponseErrorText("Incorrect username or password");
    } else {
      notify.error("Something went wrong, try again later");
    }
  }

  const onFormErrorClose = () => {
    setApiResponseErrorText("");
  };

  return (
    <Form title="Log in" onSubmit={handleSubmit} buttonText="Log in">
      {apiResponseErrorText && (
        <FormError onClose={onFormErrorClose}>{apiResponseErrorText}</FormError>
      )}
      <FormField name="username" required label="username" />
      <FormField name="password" required label="password" type="password" />
    </Form>
  );
};

export default LogInForm;
