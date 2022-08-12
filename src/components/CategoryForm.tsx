import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const schema = z.object({
  type: z.string().min(1, "Type is required."),
  name: z.string().min(1, "Name is required."),
});

const CategoryForm = ({ initialValues, mutation }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
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
        <label className="label">
          <span className="label-text text-red-400">
            {errors && errors.type && errors.type.message}
          </span>
        </label>
      </div>
      <TextField
        label="Name"
        name="name"
        register={register}
        errors={errors.name}
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

export default CategoryForm;
