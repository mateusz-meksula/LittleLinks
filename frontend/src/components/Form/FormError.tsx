import { FC, PropsWithChildren } from "react";
import { FaTimes } from "react-icons/fa";

type FormErrorProps = {
  onClose: () => void;
};

export const FormError: FC<PropsWithChildren<FormErrorProps>> = ({
  onClose,
  children,
}) => {
  return (
    <div className="form-error">
      <div>{children}</div>
      <button className="icon-button" onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
};
