import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../lib/axios";

type User = {
  id: number;
  name: string;
};

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
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
  const accessToken: string | null = localStorage.getItem("ACCESS_TOKEN");
  const [token, setToken] = useState<string | null>(accessToken);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/login`, {
        email,
        password,
      });
      setToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem("ACCESS_TOKEN", data.token);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    await api.post("/logout");
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem("ACCESS_TOKEN");
    navigate("/login");
  };

  const getUser = async () => {
    try {
      const {data} = await api.get("/user");
      setCurrentUser(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [token]);

  const value = {
    token,
    setToken,
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
