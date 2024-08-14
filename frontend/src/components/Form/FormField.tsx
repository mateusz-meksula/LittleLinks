import {
  useEffect,
  useState,
  HTMLInputTypeAttribute,
  ChangeEvent,
} from "react";
import { formFieldValidator, FormValuesBase } from "../../lib/types";

type FormFieldProps<T extends FormValuesBase> = {
  name: string;
  label: string;
  formValues: T;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  validator?: formFieldValidator<T>;
};

export const FormField = <T extends FormValuesBase>(
  props: FormFieldProps<T>
) => {
  const [error, setError] = useState("");

  const { name, label, formValues, onChange, type, required, validator } =
    props;

  useEffect(() => {
    if (!validator) return;
    const errorMsg = validator(formValues[name], formValues);
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
