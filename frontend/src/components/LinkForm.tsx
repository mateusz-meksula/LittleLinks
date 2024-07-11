import { FC } from "react";

const LinkForm: FC = () => {
  return (
    <section className="center-page">
      <form action="">
        <p className="form-title">Create your little link</p>
        <div className="form-field">
          <label htmlFor="">url</label>
          <input type="url" name="" id="" required />
          <div className="form-field-error"></div>
        </div>
        <div className="form-field">
          <label htmlFor="">your short (optional)</label>
          <input disabled type="text" name="" id="" />
          <div className="form-field-error"></div>
        </div>
        <button type="submit">Create</button>
      </form>
    </section>
  );
};

export default LinkForm;
