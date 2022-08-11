import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import api from "../lib/api";
import { ICategory } from "../types/ITransaction";

const useCategory = () => {
  const { authTokens, logout } = useAuth();
  const navigate = useNavigate();
  api.defaults.headers.common["Authorization"] = `Bearer ${authTokens?.access}`;
  api.interceptors.response.use((response) => {
    if (response.status === 401) {
      logout();
    }
    return response;
  });
  const { data: categories, refetch } = useQuery<ICategory[]>(
    ["categories"],
    async () => {
      const { data } = await api.get("/categories");
      return data;
    }
  );
  const newCategory = useMutation(
    (data: { name: string; type: "INCOME" | "EXPENSE" }) => {
      return api.post("/categories", data);
    },
    {
      onSuccess: () => {
        refetch();
        navigate("/categories");
      },
    }
  );
  const updateCategory = useMutation(
    (data: { id: number; name: string; type: "INCOME" | "EXPENSE" }) => {
      const { id, ...rest } = data;
      return api.put(`/categories/${id}`, { ...rest });
    },
    {
      onSuccess: () => {
        refetch();
        navigate("/categories");
      },
    }
  );
  const deleteCategory = useMutation(
    (id: number) => {
      return api.delete(`/categories/${id}`);
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  return { categories, newCategory, updateCategory, deleteCategory };
};

export default useCategory;
