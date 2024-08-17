import {
  ButtonHTMLAttributes,
  FC,
  MouseEventHandler,
  PropsWithChildren,
} from "react";

type ButtonProps = {
  kind?: "form" | "home" | "normal";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  kind = "normal",
  children,
  onClick,
  type,
}) => {
  const className = "button " + (kind !== "normal" ? kind : "");
  return (
    <button className={className} type={type} onClick={onClick}>
      {children}
    </button>
  );
};
