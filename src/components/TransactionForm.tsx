import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useCategory from "../hooks/useCategory";
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

const schema = z.object({
  categoryId: z
    .string()
    .min(1, "Category is required.")
    .transform((val) => parseInt(val)),
  amount: z
    .string()
    .min(1, "Amount is required.")
    .transform((val) => Number(val)),
  date: z.string().min(1, "Date is required."),
  description: z.string().min(1, "Description is required."),
});

const TransactionForm = ({ initialValues, mutation }: Props) => {
  const { categories } = useCategory();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    const { categoryId, amount, date, description } = data;
    await mutation.mutateAsync({
      id: initialValues.transactionId,
      category: categoryId,
      amount,
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
        <select
          className={`select select-bordered ${
            errors.categoryId && "select-error"
          }`}
          disabled={!categories || categories?.length === 0}
          {...register("categoryId")}
        >
          <option disabled>Pick one</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} - {category.type}
            </option>
          ))}
        </select>
        {!categories ||
          (categories.length === 0 && (
            <label className="label">
              <span className="label-text-alt">
                You don't have any category registred.{" "}
                <Link to="/categories/new" className="link">
                  Create one
                </Link>
                .
              </span>
            </label>
          ))}
        <label className="label">
          <span className="label-text-alt text-red-400">
            {errors && errors.categoryId && errors.categoryId.message}
          </span>
        </label>
      </div>
      <TextField
        label="Amount"
        type="number"
        name="amount"
        register={register}
        errors={errors.amount}
      />
      <TextField
        label="Date"
        type="date"
        name="date"
        register={register}
        errors={errors.date}
      />
      <TextField
        label="Description"
        type="text"
        name="description"
        register={register}
        errors={errors.description}
      />
      <button
        className={`${
          isSubmitting && "btn-disabled loading"
        } btn btn-success w-full mt-4 normal-case`}
      >
        Save
      </button>
    </form>
  );
};

export default TransactionForm;
