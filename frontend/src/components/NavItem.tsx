import { FC } from "react";
import { NavLink } from "react-router-dom";

type NavItemProps = {
  text: string;
  to?: string;
  onClick?: () => void;
};

export const NavItem: FC<NavItemProps> = ({ text, to, onClick }) => {
  if (to) {
    return <NavLink to={to}>{text}</NavLink>;
  }

  return (
    <div className="nav-item" onClick={onClick}>
      {text}
    </div>
  );
};
