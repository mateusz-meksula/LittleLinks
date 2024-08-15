import {
  FC,
  HTMLInputTypeAttribute,
  useContext,
  useEffect,
  useState,
} from "react";
import { formFieldValidator } from "../../lib/types";
import { FormValidationContext } from "../../context/FormValidationContext";

type FormFieldProps = {
  name: string;
  label: string;
  disabled?: boolean;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  validator?: formFieldValidator;
  validationDependencies?: string[];
  dependencyUpdaters?: ((val: string) => void)[];
};

export const FormField: FC<FormFieldProps> = (props) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const setIsValidationError = useContext(FormValidationContext);

  const {
    name,
    label,
    disabled,
    type,
    required,
    validator,
    validationDependencies,
    dependencyUpdaters,
  } = props;

  useEffect(() => {
    setError(
      validator ? validator(value, ...(validationDependencies || [])) || "" : ""
    );

    if (setIsValidationError) {
      setIsValidationError(Boolean(error));
    }

    if (dependencyUpdaters) {
      dependencyUpdaters.forEach((updater) => updater(value));
    }
  }, [value, validationDependencies]);

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        type={type || "text"}
        name={name}
        id={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        disabled={disabled}
      />
      <div className="form-field-error">{error}</div>
    </div>
  );
};
