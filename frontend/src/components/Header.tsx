import { FC } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "./Logo";
import { useAuthContext } from "../context/AuthContext";
import { NavItem } from "./NavItem";

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
        <NavItem text="Home" to="/" />
        {!isUserLoggedIn && <NavItem text="Log in" to="/log-in" />}
        {!isUserLoggedIn && <NavItem text="Sign up" to="/sign-up" />}
        {isUserLoggedIn && <NavItem text="Log out" onClick={handleLogOut} />}
      </nav>
    </header>
  );
};

export default Header;
