import { FC } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer: FC = () => {
  return (
    <footer className="footer">
      <div className="creator">Created By Mati</div>
      <nav>
        <a href="https://github.com/mateusz-meksula">
          <FaGithub style={{ marginRight: "1rem", fontSize: "1.5rem" }} />
        </a>
        <a href="https://www.linkedin.com/in/mateusz-meksuła-2397982b0">
          <FaLinkedin style={{ fontSize: "1.5rem" }} />
        </a>
      </nav>
    </footer>
  );
};

export default Footer;
