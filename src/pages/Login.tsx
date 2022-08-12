import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import TextField from "../components/TextField";
import { useAuth } from "../context/AuthProvider";

type FormValues = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const { currentUser, login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    const { email, password } = data;
    try {
      await login(email, password);
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
      <h1 className="text-4xl font-semibold text-white mb-4">Login</h1>
      <form className="max-w-xs w-full" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          name="email"
          type="email"
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
        <button
          className={`btn btn-accent normal-case w-full mt-5 ${
            isSubmitting && "btn-disabled loading"
          }`}
        >
          Login
        </button>
      </form>
      <p className="mt-5">
        Do not have an account yet?{" "}
        <Link to="/signup" className="link text-blue-400">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
