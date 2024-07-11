import { FC } from "react";
import Logo from "./Logo";

const Banner: FC = () => {
  return (
    <div className="banner">
      <Logo />
      <h1>Little Links</h1>
    </div>
  );
};

export default Banner;
