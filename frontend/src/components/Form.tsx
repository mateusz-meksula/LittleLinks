import { FC, FormEvent, ReactElement } from "react";
import FormError from "./FormError";

type FormProps = {
  title: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  errorText: string | null;
  children: ReactElement[];
  buttonText: string;
};

const Form: FC<FormProps> = ({
  title,
  onSubmit,
  children,
  buttonText,
  errorText,
}) => {
  return (
    <section className="center-page card">
      <form onSubmit={onSubmit}>
        <p className="form-title">{title}</p>
        {errorText && <FormError text={errorText} />}
        {children}
        <button className="form-button" type="submit">
          {buttonText}
        </button>
      </form>
    </section>
  );
};

export default Form;
