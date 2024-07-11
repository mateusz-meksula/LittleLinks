import { FC } from "react";
import { Link } from "react-router-dom";

const HomeButtons: FC = () => {
  return (
    <section className="center-page">
      <div className="home-buttons">
        <Link to="/create-link">
          <button>Create little link</button>
        </Link>
        <button>My little links</button>
      </div>
    </section>
  );
};

export default HomeButtons;
