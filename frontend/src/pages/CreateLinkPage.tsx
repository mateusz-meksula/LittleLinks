import { FC, useEffect, useState } from "react";
import LinkForm from "../components/LinkForm";
import LinkCreated from "../components/LinkCreated";
import { useApiClient } from "../lib/hooks/useApiClient";

const CreateLinkPage: FC = () => {
  const [formVisible, setFormVisible] = useState(true);
  const [longUrl, setLongUrl] = useState("");
  const [littleLink, setLittleLink] = useState("");
  const [littleLinkId, setLittleLinkId] = useState<number | null>(null);
  const apiClient = useApiClient();

  useEffect(() => {
    if (!littleLinkId) {
      return;
    }

    async function getLittleLinkInfo() {
      const response = await apiClient(`/links/${littleLinkId}`);
      if (response.ok) {
        const data = await response.json();
        setLongUrl(data.url);
        setLittleLink(data.alias);
      }
    }

    getLittleLinkInfo();
  }, [littleLinkId]);

  if (formVisible) {
    return (
      <LinkForm
        littleLinkId={littleLinkId}
        setLittleLinkId={setLittleLinkId}
        onSubmit={() => {
          setFormVisible(false);
        }}
      />
    );
  } else {
    return (
      <LinkCreated
        onAnother={() => {
          setFormVisible(true);
        }}
        longUrl={longUrl}
        alias={littleLink}
      />
    );
  }
};

export default CreateLinkPage;
