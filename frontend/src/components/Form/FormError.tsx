import { FC, PropsWithChildren } from "react";
import { FaTimes } from "react-icons/fa";
import { Button } from "../Utility/Button";

type FormErrorProps = {
  onClose: () => void;
};

export const FormError: FC<PropsWithChildren<FormErrorProps>> = ({
  onClose,
  children,
}) => {
  return (
    <div className="form-error">
      {children}
      <Button onClick={onClose}>
        <FaTimes />
      </Button>
    </div>
  );
};
