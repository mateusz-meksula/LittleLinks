import { FC } from "react";
import { Link } from "react-router-dom";

import Logo from "./Logo";

const Header: FC = () => {
  return (
    <header className="header">
      <Logo />
      <nav>
        <Link to="/">Home</Link>
        <Link to="/log-in">Log in</Link>
        <Link to="/sign-up">Sign up</Link>
      </nav>
    </header>
  );
};

export default Header;
