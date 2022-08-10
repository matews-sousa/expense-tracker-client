import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import TextField from "../components/TextField";
import { useAuth } from "../context/AuthProvider";

type FormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const { currentUser, login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
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
