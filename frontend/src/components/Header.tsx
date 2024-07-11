import { FC } from "react";
import { Link } from "react-router-dom";

import Logo from "./Logo";

const Header: FC = () => {
  return (
    <header className="header">
      <Logo />
      <nav>
        <a className="active" href="">
          Home
        </a>
        <Link to="/log-in">Log in</Link>
        <a href="">Sign up</a>
        <a href="">About</a>
      </nav>
    </header>
  );
};

export default Header;
