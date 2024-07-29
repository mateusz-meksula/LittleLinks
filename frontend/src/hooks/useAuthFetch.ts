import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const useAuthFetch = (): typeof fetch => {
  const { authContext, setAuthContext } = useAuthContext();
  const navigate = useNavigate();

  if (!authContext.isUserLoggedIn) {
    return fetch;
  }

  return async function authFetch(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const reqInit: RequestInit = init || {};
    reqInit.headers = {
      ...reqInit.headers,
      Authorization: `Bearer ${authContext.accessToken}`,
    };

    const response = await fetch(input, reqInit);

    if (response.status === 401) {
      const refreshResponse = await fetch("/api/auth/refresh");
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setAuthContext({
          isUserLoggedIn: true,
          accessToken: data.token,
        });

        reqInit.headers = {
          ...reqInit.headers,
          Authorization: `Bearer ${data.token}`,
        };
        return await fetch(input, reqInit);
      } else if (refreshResponse.status === 422) {
        // that case happens when refreshToken is expired
        // that means user should log in again
        toast.info("Your session has expired, please log in again", {
          className: "toast",
        });
        navigate("/log-in");
      }
    }
    return response;
  };
};

export default useAuthFetch;
