import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApiClient } from "../lib/hooks/useApiClient";
import { Card } from "../components/Utility/Card";

const LinkRedirectPage: FC = () => {
  const { alias } = useParams();
  const apiClient = useApiClient();

  useEffect(() => {
    const redirectToUrl = async () => {
      const response = await apiClient(`/links/alias/${alias}`);
      const data = await response.json();

      await apiClient(`/links/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({ new_count: data.visit_count + 1 }),
      });

      window.location.href = data.url;
    };

    redirectToUrl();
  }, []);

  return <Card>You are being redirected</Card>;
};

export default LinkRedirectPage;
