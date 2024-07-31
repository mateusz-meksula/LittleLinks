import { FC, FormEvent, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotifier } from "../context/NotifierContext";

const LogInForm: FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { setAuthContext } = useAuthContext();
  const navigate = useNavigate();
  const notify = useNotifier();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username || !password) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setAuthContext({
        isUserLoggedIn: true,
        accessToken: data.token,
      });
      navigate("/");
    } else if (response.status === 401) {
      setUsernameError("Incorrect username or password");
      setPasswordError("Incorrect username or password");
    } else {
      notify.error("Something went wrong, try again later");
    }
  }

  return (
    <section className="center-page card">
      <form onSubmit={handleSubmit}>
        <p className="form-title">Log in</p>
        <div className="form-field">
          <label htmlFor="username">username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError("");
            }}
            required
          />
          <div className="form-field-error">{usernameError}</div>
        </div>
        <div className="form-field">
          <label htmlFor="password">password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            required
          />
          <div className="form-field-error">{passwordError}</div>
        </div>
        <button className="form-button" type="submit">
          Log in
        </button>
      </form>
    </section>
  );
};

export default LogInForm;
