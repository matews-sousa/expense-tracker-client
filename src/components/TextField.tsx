import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register?: any;
  errors?: any;
}

const TextField = ({ label, name, register, errors, ...props }: Props) => {
  return (
    <div className="form-control w-full">
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input
        className={`input input-bordered w-full ${errors && "input-error"}`}
        id={name}
        {...register(name)}
        {...props}
      />
      <label className="label">
        <span className="label-text-alt text-red-400">
          {errors && errors.message}
        </span>
      </label>
    </div>
  );
};

export default TextField;
