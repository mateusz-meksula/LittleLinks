import { FC } from "react";
import { FaShare, FaCopy } from "react-icons/fa";
import { useNotifier } from "../context/NotifierContext";
import { FormReadOnlyField } from "./Form/FormReadOnlyField";
import { Button } from "./Utility/Button";
import { Card } from "./Utility/Card";
import { copyToClipBoard, getLittleLinkUrl } from "../lib/utils";

type LinkCreatedProps = {
  onAnother: () => void;
  longUrl: string;
  alias: string;
};

const LinkCreated: FC<LinkCreatedProps> = ({ onAnother, longUrl, alias }) => {
  const notify = useNotifier();

  const littleLinkUrl = getLittleLinkUrl(alias);
  const copyAndNotify = () => {
    copyToClipBoard(littleLinkUrl);
    notify.success("Link copied!");
  };
  return (
    <Card>
      <div>
        <FormReadOnlyField label="Long URL" name="longUrl" value={longUrl} />
        <FormReadOnlyField
          label="Little Link"
          name="littleLink"
          value={littleLinkUrl}
        />
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button>
          <FaShare /> visit
        </Button>
        <Button onClick={copyAndNotify}>
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
