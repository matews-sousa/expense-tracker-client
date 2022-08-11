import axios from "axios";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthProvider";
import baseURL from "../constants/baseURL";

const useAxios = () => {
  const { authTokens, setAuthTokens, setCurrentUser } = useAuth();

  const api = axios.create({
    baseURL: baseURL,
    headers: {
      Authorization: authTokens ? `Bearer ${authTokens.access}` : "",
    },
  });

  api.interceptors.request.use(async (req) => {
    if (authTokens) {
      const user: any = jwtDecode(authTokens.access);
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
      if (!isExpired) return req;
      const response = await axios.post(`${baseURL}/token/refresh`, {
        refresh: authTokens.refresh,
      });
      localStorage.setItem("authTokens", JSON.stringify(response.data));

      setAuthTokens(response.data);
      setCurrentUser(jwtDecode(response.data.access));

      req.headers!.Authorization = response.data.access
        ? `Bearer ${response.data.access}`
        : "";
    }

    return req;
  });

  return api;
};

export default useAxios;
