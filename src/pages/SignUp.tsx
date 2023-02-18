import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import TextField from "../components/TextField";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";

const schema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  password_confirmation: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

const SignUp = () => {
  const { currentUser, setCurrentUser, setToken } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const mutation = useMutation(
    (newUser: { name: string; email: string; password: string, password_confirmation: string }) => {
      return axios.post(`${import.meta.env.VITE_BASE_API_URL}/register`, newUser);
    }
  );
  const navigate = useNavigate();

  const onSubmit = async (_data: FormValues) => {
    try {
      const {data} = await mutation.mutateAsync(_data);
      localStorage.setItem("ACCESS_TOKEN", data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      navigate("/");
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
        <TextField
          label="Name"
          name="name"
          register={register}
          errors={errors.name}
        />
        <TextField
          label="Email"
          name="email"
          type="text"
          register={register}
          errors={errors.email}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          register={register}
          errors={errors.password}
        />
        <TextField
          label="Password Confirm"
          name="password_confirmation"
          type="password"
          register={register}
          errors={errors.password_confirmation}
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
