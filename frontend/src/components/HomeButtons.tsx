import { FC } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const HomeButtons: FC = () => {
  const { authContext } = useAuthContext();

  return (
    <section className="center-page">
      <div className="home-buttons">
        <Link to="/create-link">
          <button>Create little link</button>
        </Link>
        {authContext.isUserLoggedIn && <button>My little links</button>}
      </div>
    </section>
  );
};

export default HomeButtons;
