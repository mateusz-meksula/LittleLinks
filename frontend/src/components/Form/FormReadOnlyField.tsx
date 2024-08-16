import { FC } from "react";

type FormReadOnlyFieldProps = {
  name: string;
  label: string;
  value: string;
};

export const FormReadOnlyField: FC<FormReadOnlyFieldProps> = ({
  name,
  label,
  value,
}) => {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input type="text" name={name} id={name} value={value} readOnly />
    </div>
  );
};
