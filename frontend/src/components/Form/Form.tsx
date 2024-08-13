import { FC, FormEvent, PropsWithChildren } from "react";

type FormProps = {
  title: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  buttonText: string;
};

export const Form: FC<PropsWithChildren<FormProps>> = ({
  title,
  onSubmit,
  children,
  buttonText,
}) => {
  return (
    <section className="center-page card">
      <form onSubmit={onSubmit}>
        <p className="form-title">{title}</p>
        {children}
        <button className="form-button" type="submit">
          {buttonText}
        </button>
      </form>
    </section>
  );
};
