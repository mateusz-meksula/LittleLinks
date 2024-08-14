export type SignUpFormValues = {
  username: string;
  password: string;
  repeatPassword: string;
};

export type LogInFormValues = {
  username: string;
  password: string;
};

export type LinkFormValues = {
  url: string;
  alias: string;
};

export type FormValuesBase = { [key: string]: string };

export type formFieldValidator<T extends FormValuesBase> = (
  value: string,
  formValues?: T
) => string | null;

type InitializedAuthContextValue = {
  isUserLoggedIn: true;
  accessToken: string;
};

type NotInitializedAuthContextValue = {
  isUserLoggedIn: false;
};

export type AuthContextValue =
  | InitializedAuthContextValue
  | NotInitializedAuthContextValue;

export type AuthContextType = {
  authContext: AuthContextValue;
  setAuthContext: (authContext: AuthContextValue) => void;
};

export type NotifierType = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};
