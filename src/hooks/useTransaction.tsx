import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import api from "../lib/api";
import { ITransaction } from "../types/ITransaction";

type FormValues = {
  id: number;
  category: number;
  amount: number;
  date: string;
  description: string;
};

const useTransaction = () => {
  const { authTokens, logout } = useAuth();
  api.defaults.headers.common["Authorization"] = `Bearer ${authTokens?.access}`;
  const { data: transactions, refetch } = useQuery<ITransaction[]>(
    ["transactions"],
    async () => {
      const { data } = await api.get("/transactions");
      return data;
    }
  );

  const newTransaction = useMutation((data: Omit<FormValues, "id">) => {
    return api.post("/transactions", data);
  });

  const editTransaction = useMutation(
    (data: FormValues) => {
      const { id, ...rest } = data;
      return api.put(`/transactions/${data.id}`, { ...rest });
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const income = transactions?.filter(
    (transaction) => transaction.category.type === "INCOME"
  );

  const expense = transactions?.filter(
    (transaction) => transaction.category.type === "EXPENSE"
  );

  const totalIncome = income
    ? income.reduce((acc, transaction) => {
        return acc + Number(transaction.amount);
      }, 0)
    : 0;

  const totalExpense = expense
    ? expense.reduce((acc, transaction) => {
        return acc + Number(transaction.amount);
      }, 0)
    : 0;

  const balance = totalIncome - totalExpense;

  return {
    newTransaction,
    editTransaction,
    transactions,
    income,
    expense,
    totalIncome,
    totalExpense,
    balance,
    refetch,
  };
};

export default useTransaction;
