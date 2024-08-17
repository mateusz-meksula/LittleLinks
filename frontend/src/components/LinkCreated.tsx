import { FC } from "react";
import { FaShare, FaCopy } from "react-icons/fa";
import { useNotifier } from "../context/NotifierContext";
import { FormReadOnlyField } from "./Form/FormReadOnlyField";
import { Button } from "./Utility/Button";
import { Card } from "./Utility/Card";

type LinkCreatedProps = {
  onAnother: () => void;
  longUrl: string;
  alias: string;
};

const LinkCreated: FC<LinkCreatedProps> = ({ onAnother, longUrl, alias }) => {
  const notify = useNotifier();
  const littleLink = window.location.origin + "/" + alias;
  const onClick = () => {
    navigator.clipboard.writeText(littleLink);
    notify.success("Link copied!");
  };
  return (
    <Card>
      <div>
        <FormReadOnlyField label="Long URL" name="longUrl" value={longUrl} />
        <FormReadOnlyField
          label="Little Link"
          name="littleLink"
          value={littleLink}
        />
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button>
          <FaShare /> visit
        </Button>
        <Button onClick={onClick}>
          <FaCopy /> copy
        </Button>
      </div>
      <Button kind="form" onClick={onAnother}>
        Another
      </Button>
    </Card>
  );
};

export default LinkCreated;
