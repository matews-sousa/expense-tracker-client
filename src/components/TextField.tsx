import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register?: any;
}

const TextField = ({ label, name, register, ...props }: Props) => {
  return (
    <div className="form-control w-full">
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input
        className="input input-bordered w-full"
        id={name}
        {...register(name)}
        {...props}
      />
    </div>
  );
};

export default TextField;
