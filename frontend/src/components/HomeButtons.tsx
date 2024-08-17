import { FC } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { Button } from "./Utility/Button";

const HomeButtons: FC = () => {
  const { authContext } = useAuthContext();

  return (
    <section className="center-page">
      <div className="home-buttons">
        <Button kind="home">
          <Link to="/create-link">Create little link</Link>
        </Button>
        {authContext.isUserLoggedIn && (
          <Button kind="home">My little links</Button>
        )}
      </div>
    </section>
  );
};

export default HomeButtons;
