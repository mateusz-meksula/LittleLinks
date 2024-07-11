import { FC } from "react";

import Logo from "./Logo";

const Header: FC = () => {
  return (
    <header className="header">
      <Logo />
      <nav>
        <a className="active" href="">
          Home
        </a>
        <a href="">Log in</a>
        <a href="">Sign up</a>
        <a href="">About</a>
      </nav>
    </header>
  );
};

export default Header;
