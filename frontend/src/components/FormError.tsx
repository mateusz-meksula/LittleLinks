import { FC, useState } from "react";
import { FaTimes } from "react-icons/fa";

type FormErrorProps = {
  text: string;
};

const FormError: FC<FormErrorProps> = ({ text }) => {
  const [isVisible, setIsVisible] = useState(true);
  if (isVisible) {
    return (
      <div className="form-error">
        <div>{text}</div>
        <button className="icon-button" onClick={() => setIsVisible(false)}>
          <FaTimes />
        </button>
      </div>
    );
  }
  return <></>;
};

export default FormError;
