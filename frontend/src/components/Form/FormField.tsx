import {
  useEffect,
  useState,
  HTMLInputTypeAttribute,
  FC,
  ChangeEvent,
} from "react";

type FormFieldProps = {
  name: string;
  label: string;
  formValues: any;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  validator?: (value: string) => string | null;
};

export const FormField: FC<FormFieldProps> = (props) => {
  const [error, setError] = useState("");

  const { name, label, formValues, onChange, type, required, validator } =
    props;

  useEffect(() => {
    if (!validator) return;
    const errorMsg = validator(formValues[name]);
    if (errorMsg !== null) {
      setError(errorMsg);
    } else {
      setError("");
    }
  }, [formValues]);

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        type={type || "text"}
        name={name}
        id={name}
        value={formValues[name]}
        onChange={onChange}
        required={required}
      />
      <div className="form-field-error">{error}</div>
    </div>
  );
};
