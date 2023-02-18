import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { ICategory } from "../types/ITransaction";

const useCategory = () => {
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
