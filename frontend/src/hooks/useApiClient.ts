import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useNotifier } from "../context/NotifierContext";

const API_BASE_URL = "/api";

const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const config = {
    method: "GET",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  return fetch(`${API_BASE_URL}${endpoint}`, config);
};

const useApiClient = (): typeof apiClient => {
  const { authContext, setAuthContext } = useAuthContext();
  const navigate = useNavigate();
  const notify = useNotifier();

  if (!authContext.isUserLoggedIn) {
    return apiClient;
  }

  return async function authFetch(
    endpoint: string,
    options?: RequestInit
  ): Promise<Response> {
    const reqInit: RequestInit = options || {};
    reqInit.headers = {
      ...reqInit.headers,
      Authorization: `Bearer ${authContext.accessToken}`,
    };

    const response = await apiClient(endpoint, reqInit);

    if (response.status === 401) {
      const refreshResponse = await apiClient("/auth/refresh");
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
        return await apiClient(endpoint, reqInit);
      } else if (refreshResponse.status === 422) {
        // that case happens when refreshToken is expired
        // that means user should log in again
        notify.info("Your session has expired, please log in again");
        navigate("/log-in");
      }
    }
    return response;
  };
};

export default useApiClient;
