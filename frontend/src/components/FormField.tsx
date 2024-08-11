import { FC, HTMLInputTypeAttribute, useEffect, useState } from "react";

type FormFieldProps = {
  name: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  validator?: (value: string) => string | null;
};

const FormField: FC<FormFieldProps> = (props) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const { name, label, type, required, validator } = props;

  useEffect(() => {
    if (!validator) return;
    const errorMsg = validator(value);
    if (errorMsg !== null) {
      setError(errorMsg);
    } else {
      setError("");
    }
  }, [value]);

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
      />
      <div className="form-field-error">{error}</div>
    </div>
  );
};

export default FormField;
