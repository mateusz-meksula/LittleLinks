import {
  createContext,
  FC,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import useLocalStorage from "../hooks/useLocalStorage";

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
  const [storedAuthContext, storeAuthContext] =
    useLocalStorage<AuthContextValue>("authContext");
  const [authContext, setAuthContext] = useState<AuthContextValue>(
    storedAuthContext || {
      isUserLoggedIn: false,
    }
  );

  useEffect(() => {
    storeAuthContext(authContext);
  }, [authContext]);

  return (
    <AuthContext.Provider value={{ authContext, setAuthContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuthContext, AuthContextProvider };
