import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApiClient } from "../lib/hooks/useApiClient";
import { Card } from "../components/Utility/Card";
import NotFoundPage from "./NotFoundPage";

const LinkRedirectPage: FC = () => {
  const { alias } = useParams();
  const apiClient = useApiClient();
  const [linkExists, setLinkExists] = useState(true);

  useEffect(() => {
    const redirectToUrl = async () => {
      let controller = new AbortController();
      const response = await apiClient(`/links/alias/${alias}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        controller.abort();
        setLinkExists(false);
      }
      const data = await response.json();

      await apiClient(`/links/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ new_count: data.visit_count + 1 }),
      });

      window.location.href = data.url;
    };

    redirectToUrl();
  }, []);

  if (linkExists) {
    return <Card>You are being redirected</Card>;
  } else {
    return <NotFoundPage />;
  }
};

export default LinkRedirectPage;
