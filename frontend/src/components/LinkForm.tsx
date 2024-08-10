import { FC, FormEvent, useRef } from "react";
import { useAuthContext } from "../context/AuthContext";
import useApiClient from "../hooks/useApiClient";
import { useNotifier } from "../context/NotifierContext";

type LinkFormProps = {
  onSubmit: () => void;
  littleLinkId: number | null;
  setLittleLinkId: (id: number) => void;
};

const LinkForm: FC<LinkFormProps> = ({ onSubmit, setLittleLinkId }) => {
  const longUrlInput = useRef<HTMLInputElement>(null);
  const { authContext } = useAuthContext();
  const apiClient = useApiClient();
  const notify = useNotifier();

  async function createLittleLink(e: FormEvent) {
    e.preventDefault();
    const longUrl = longUrlInput.current?.value;
    if (!longUrl) {
      return;
    }

    const response = await apiClient("/links/", {
      method: "POST",
      body: JSON.stringify({ url: longUrl }),
    });

    if (response.ok) {
      const data = await response.json();
      setLittleLinkId(data.id);
      onSubmit();
    } else {
      notify.error("Something went wrong, try again later");
    }
  }

  return (
    <section className="center-page card">
      <form onSubmit={createLittleLink}>
        <p className="form-title">Create your little link</p>
        <div className="form-field">
          <label htmlFor="url">url</label>
          <input type="url" name="url" id="url" required ref={longUrlInput} />
          <div className="form-field-error"></div>
        </div>
        <div className="form-field">
          <label htmlFor="alias">
            alias (
            {authContext.isUserLoggedIn ? "optional" : "for logged in users"})
          </label>
          <input
            disabled={!authContext.isUserLoggedIn}
            type="text"
            name="alias"
            id="alias"
          />
          <div className="form-field-error"></div>
        </div>
        <button className="form-button" type="submit">
          Create little link
        </button>
      </form>
    </section>
  );
};

export default LinkForm;
