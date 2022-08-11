import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextField from "./TextField";

type FormValues = {
  id?: number;
  name: string;
  type: "INCOME" | "EXPENSE";
};

interface Props {
  initialValues: FormValues;
  mutation: any;
}

const CategoryForm = ({ initialValues, mutation }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    await mutation.mutateAsync({ id: initialValues?.id, ...data });
    navigate("/categories");
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

export default CategoryForm;
