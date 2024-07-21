import { FC } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import Logo from "./Logo";
import { useAuthContext } from "../context/AuthContext";
import HeaderButton from "./HeaderButton";

const Header: FC = () => {
  const { authContext, setAuthContext } = useAuthContext();
  const isUserLoggedIn = authContext.isUserLoggedIn;
  const navigate = useNavigate();

  async function handleLogOut() {
    const response = await fetch("/api/auth/logout");

    if (response.ok) {
      setAuthContext({ isUserLoggedIn: false });
      navigate("/");
    }
  }

  return (
    <header className="header">
      <Logo />
      <nav>
        <HeaderButton text="Home" to="/" />
        {!isUserLoggedIn && <HeaderButton text="Log in" to="/log-in" />}
        {!isUserLoggedIn && <HeaderButton text="Sign up" to="/sign-up" />}
        {isUserLoggedIn && (
          <HeaderButton text="Log out" onClick={handleLogOut} />
        )}
      </nav>
    </header>
  );
};

export default Header;
