import { useForm } from "react-hook-form";
import TextField from "./TextField";

type FormValues = {
  name: string;
  type: "INCOME" | "EXPENSE";
};

interface Props {
  initialValues: FormValues;
  mutation: any;
}

const CategoryForm = ({ initialValues, mutation }: Props) => {
  console.log(initialValues);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    await mutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Type</span>
        </label>
        <select className="select select-bordered" {...register("type")}>
          <option value={"INCOME"}>Income</option>
          <option value={"EXPENSE"}>Expense</option>
        </select>
      </div>
      <TextField label="Name" name="name" register={register} />
      <button className="btn btn-success w-full mt-4 normal-case">Save</button>
    </form>
  );
};

export default CategoryForm;
