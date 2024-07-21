import { FC } from "react";
import { NavLink } from "react-router-dom";

type HeaderButtonProps = {
  text: string;
  to?: string;
  onClick?: () => void;
};

const HeaderButton: FC<HeaderButtonProps> = ({ text, to, onClick }) => {
  if (to) {
    return <NavLink to={to}>{text}</NavLink>;
  }

  return (
    <div className="header-button" onClick={onClick}>
      {text}
    </div>
  );
};

export default HeaderButton;
