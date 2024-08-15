export type formFieldValidator = (
  value: string,
  ...otherFields: string[]
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

export type FormValidationContextType = (isError: boolean) => void;
