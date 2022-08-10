import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

interface AuthContextProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
  } | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/user");
      setCurrentUser(data);
    } catch (error) {
      console.log(error);
      setCurrentUser(null);
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    await api.post("/login", {
      email,
      password,
    });
    fetchUser();
  };

  const logout = async () => {
    await api.post("/logout");
    setCurrentUser(null);
    navigate("/login");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <h1>Loading...</h1> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
