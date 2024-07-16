import { createContext, FC, ReactElement, useContext, useState } from "react";

type InitializedAuthContextValue = {
  isUserLoggedIn: true;
  username: string;
  accessToken: string;
};

type NotInitializedAuthContextValue = {
  isUserLoggedIn: false;
};

type AuthContextValue =
  | InitializedAuthContextValue
  | NotInitializedAuthContextValue;

type AuthContextType = {
  authContext: AuthContextValue;
  setAuthContext: (authContext: AuthContextValue) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const useAuthContext = () => {
  const authContext = useContext(AuthContext);

  if (authContext === null) {
    throw new Error("useAuthContext is available only in AuthContextProvider");
  }
  return authContext;
};

type AuthContextWrapperProps = {
  children: ReactElement;
};

const AuthContextProvider: FC<AuthContextWrapperProps> = ({ children }) => {
  const [authContext, setAuthContext] = useState<AuthContextValue>({
    isUserLoggedIn: false,
  });
  return (
    <AuthContext.Provider value={{ authContext, setAuthContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuthContext, AuthContextProvider };
