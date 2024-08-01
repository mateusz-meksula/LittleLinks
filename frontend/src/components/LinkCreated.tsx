import { FC } from "react";
import { FaShare, FaCopy } from "react-icons/fa";
import { useNotifier } from "../context/NotifierContext";

type LinkCreatedProps = {
  onAnother: () => void;
  longUrl: string;
  littleLink: string;
};

const LinkCreated: FC<LinkCreatedProps> = ({
  onAnother,
  longUrl,
  littleLink,
}) => {
  const notify = useNotifier();
  return (
    <section className="center-page card">
      <div>
        <div className="form-field">
          <label htmlFor="">Long URL</label>
          <input type="text" readOnly={true} value={longUrl} />
        </div>
        <div className="form-field">
          <label htmlFor="">Little Link</label>
          <input
            type="text"
            readOnly={true}
            value={window.location.origin + "/" + littleLink}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button className="icon-button">
          <FaShare /> visit
        </button>
        <button
          className="icon-button"
          onClick={() => {
            navigator.clipboard.writeText(
              window.location.origin + "/" + littleLink
            );
            notify.success("Link copied!");
          }}
        >
          <FaCopy />
          copy
        </button>
      </div>
      <button className="form-button" onClick={onAnother}>
        Another
      </button>
    </section>
  );
};

export default LinkCreated;
