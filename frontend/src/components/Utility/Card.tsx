import { FC, PropsWithChildren } from "react";

export const Card: FC<PropsWithChildren> = ({ children }) => {
  return <section className="center-page card">{children}</section>;
};
