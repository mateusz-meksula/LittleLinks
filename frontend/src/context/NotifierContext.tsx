import { createContext, FC, ReactElement, useContext } from "react";
import { toast } from "react-toastify";

type NotifierType = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const NotifierContext = createContext<NotifierType | null>(null);

const useNotifier = () => {
  const notifier = useContext(NotifierContext);

  if (notifier === null) {
    throw new Error("useNotifier is available only in NotifierContextProvider");
  }
  return notifier;
};

type NotifierContextProviderProps = { children: ReactElement };

const NotifierContextProvider: FC<NotifierContextProviderProps> = ({
  children,
}) => {
  const notifier = {
    success: (message: string) => {
      return toast.success(message, { className: "toast" });
    },
    error: (message: string) => {
      return toast.error(message, { className: "toast" });
    },
    info: (message: string) => {
      return toast.info(message, { className: "toast" });
    },
  };
  return (
    <NotifierContext.Provider value={notifier}>
      {children}
    </NotifierContext.Provider>
  );
};

export { useNotifier, NotifierContextProvider };
