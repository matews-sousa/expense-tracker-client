import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import jwtDecode from "jwt-decode";

type AuthTokens = {
  access: string;
  refresh: string;
};

type User = {
  id: number;
  name: string;
};

interface AuthContextProps {
  authTokens: AuthTokens | null;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const tokens: string | null = localStorage.getItem("authTokens");
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(() =>
    tokens ? JSON.parse(tokens) : null
  );
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    tokens ? jwtDecode(JSON.parse(tokens).access) : null
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/token", {
        email,
        password,
      });
      setAuthTokens(data);
      console.log(jwtDecode(data.access));
      setCurrentUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    setAuthTokens(null);
    setCurrentUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };

  const updateToken = async () => {
    try {
      const { data } = await api.post("/token/refresh", {
        refresh: authTokens?.refresh,
      });
      setAuthTokens(data);
      setCurrentUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } catch (error) {
      logout();
    }

    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    const fourMinutes = 1000 * 60 * 4;
    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);

    return () => clearInterval(interval);
  }, [authTokens, loading]);

  const value = {
    authTokens,
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
