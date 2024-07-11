import { FC } from "react";

const LogInForm: FC = () => {
  return (
    <section className="center-page">
      <form action="">
        <p className="form-title">Log in</p>
        <div className="form-field">
          <label htmlFor="">username</label>
          <input type="text" name="" id="" required />
          <div className="form-field-error"></div>
        </div>
        <div className="form-field">
          <label htmlFor="">password</label>
          <input type="password" name="" id="" required />
          <div className="form-field-error"></div>
        </div>
        <button type="submit">Log in</button>
      </form>
    </section>
  );
};

export default LogInForm;
