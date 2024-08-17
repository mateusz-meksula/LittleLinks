import { FC, FormEvent, PropsWithChildren } from "react";
import { Button } from "../Utility/Button";
import { Card } from "../Utility/Card";

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
    <Card>
      <form onSubmit={onSubmit}>
        <p className="form-title">{title}</p>
        {children}
        <Button kind="form" type="submit">
          {buttonText}
        </Button>
      </form>
    </Card>
  );
};
