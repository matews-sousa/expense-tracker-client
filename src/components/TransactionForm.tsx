import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { ICategory } from "../types/ITransaction";
import TextField from "./TextField";

interface Props {
  initialValues: {
    transactionId?: number;
    categoryId: number | string;
    amount: number | string;
    date: string;
    description: string;
  };
  mutation: any;
}

const TransactionForm = ({ initialValues, mutation }: Props) => {
  const { data: categories } = useQuery<ICategory[]>(
    ["categories"],
    async () => {
      const { data } = await api.get("/categories");
      return data;
    }
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialValues,
  });
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    const { categoryId, amount, date, description } = data;
    await mutation.mutateAsync({
      id: initialValues.transactionId,
      category: Number(categoryId),
      amount: Number(amount),
      date,
      description,
    });
    navigate("/transactions");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Pick a category</span>
        </label>
        <select className="select select-bordered" {...register("categoryId")}>
          <option disabled>Pick one</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <TextField
        label="Amount"
        type="number"
        name="amount"
        register={register}
      />
      <TextField label="Date" type="date" name="date" register={register} />
      <TextField
        label="Description"
        type="text"
        name="description"
        register={register}
      />
      <button
        className={`${
          isSubmitting && "loading"
        } btn btn-success w-full mt-4 normal-case`}
      >
        Save
      </button>
    </form>
  );
};

export default TransactionForm;
