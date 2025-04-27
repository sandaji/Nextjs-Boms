import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
}

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  error,
  min,
  max,
  step,
}: InputFieldProps) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-slate-900 dark:text-slate-100"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={`w-full px-4 py-2 rounded-md shadow-sm
          text-slate-800 dark:text-slate-100 
          bg-white dark:bg-slate-700
          border ${
            error
              ? "border-red-500 dark:border-red-500"
              : "border-slate-300 dark:border-slate-600"
          }
          placeholder-slate-400 dark:placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          transition-all duration-300`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};


export default InputField;
