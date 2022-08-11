import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
import baseURL from "../constants/baseURL";

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
  setAuthTokens: (tokens: AuthTokens | null) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${baseURL}/token`, {
        email,
        password,
      });
      setAuthTokens(data);
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

  useEffect(() => {
    if (authTokens) {
      setCurrentUser(jwtDecode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens, loading]);

  const value = {
    authTokens,
    setAuthTokens,
    currentUser,
    setCurrentUser,
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
