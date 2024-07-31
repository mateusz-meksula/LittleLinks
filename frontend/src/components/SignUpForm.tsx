import { FC, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifier } from "../context/NotifierContext";

const SignUpForm: FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");

  const navigate = useNavigate();
  const notify = useNotifier();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!username || !password || !repeatPassword) {
      return;
    }

    const requestData = {
      username,
      password,
    };

    const response = await fetch("/api/users/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      setUsername("");
      setPassword("");
      setRepeatPassword("");
      notify.success("Account created successfully");
      navigate("/log-in");
    } else if (response.status === 409) {
      setUsernameError("Username already taken");
    } else {
      notify.error("Something went wrong, try again later");
    }
  }

  useEffect(() => {
    if (!username || username.length >= 5) {
      setUsernameError("");
      return;
    }
    if (username.length < 5) {
      setUsernameError("Username to short");
      return;
    }
    if (username.length > 20) {
      setUsernameError("Username to long");
      return;
    }
  }, [username]);

  useEffect(() => {
    if (!password || isPasswordSecure(password)) {
      setPasswordError("");
      return;
    }
    if (!isPasswordSecure(password)) {
      setPasswordError("Password is not secure");
      return;
    }
  }, [password]);

  useEffect(() => {
    if ((!password && !repeatPassword) || password === repeatPassword) {
      setRepeatPasswordError("");
      return;
    }
    if (password !== repeatPassword) {
      setRepeatPasswordError("Passwords does not match");
      return;
    }
  }, [password, repeatPassword]);

  return (
    <section className="center-page card">
      <form onSubmit={handleSubmit}>
        <p className="form-title">Sign up</p>
        <div className="form-field">
          <label htmlFor="username">username</label>
          <input
            type="text"
            name="username"
            id="username"
            required
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError("");
            }}
          />
          <div className="form-field-error">{usernameError}</div>
        </div>
        <div className="form-field">
          <label htmlFor="password">password</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="form-field-error">{passwordError}</div>
        </div>
        <div className="form-field">
          <label htmlFor="repeat-password">repeat password</label>
          <input
            type="password"
            name="repeat-password"
            id="repeat-password"
            required
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          <div className="form-field-error">{repeatPasswordError}</div>
        </div>
        <button className="form-button" type="submit">
          Sign up
        </button>
      </form>
    </section>
  );
};

export default SignUpForm;

function isPasswordSecure(password: string): boolean {
  // TODO
  return password.length > 5;
}
