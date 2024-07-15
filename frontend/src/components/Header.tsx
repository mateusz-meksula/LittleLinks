import { FC } from "react";
import { NavLink } from "react-router-dom";

import Logo from "./Logo";

const Header: FC = () => {
  return (
    <header className="header">
      <Logo />
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/log-in">Log in</NavLink>
        <NavLink to="/sign-up">Sign up</NavLink>
      </nav>
    </header>
  );
};

export default Header;
