export interface ICategory {
  id: number;
  name: string;
  type: "INCOME" | "EXPENSE";
}

export interface ITransaction {
  id: number;
  amount: string;
  date: Date;
  description: string;
  category: ICategory;
  user: number;
}
