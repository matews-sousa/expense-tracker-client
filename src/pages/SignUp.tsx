import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import TextField from "../components/TextField";
import baseURL from "../constants/baseURL";
import { useAuth } from "../context/AuthProvider";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const { currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const mutation = useMutation(
    (newUser: { name: string; email: string; password: string }) => {
      return axios.post(`${baseURL}/signup`, newUser);
    }
  );
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    try {
      await mutation.mutateAsync(data);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col">
      <h1 className="text-4xl font-semibold text-white mb-4">Sign Up</h1>
      <form className="max-w-xs w-full" onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Name" name="name" register={register} />
        <TextField
          label="Email"
          name="email"
          type="email"
          register={register}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          register={register}
        />
        <button
          className={`btn btn-accent normal-case w-full mt-5 ${
            isSubmitting && "btn-disabled loading"
          }`}
        >
          Sign Up
        </button>
      </form>
      <p className="mt-5">
        Already have an account?{" "}
        <Link to="/login" className="link text-blue-400">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
