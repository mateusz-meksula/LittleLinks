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
      const url = data.url;

      window.location.href = url;
    };

    redirectToUrl();
  }, []);

  return <Card>You are being redirected</Card>;
};

export default LinkRedirectPage;
