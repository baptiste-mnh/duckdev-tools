import React from "react";
import type { InputProps } from "../../types";

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
  error,
  className = "",
  icon,
  maxLength,
  minLength,
  pattern,
  autoComplete,
  autoFocus = false,
}) => {
  const baseClasses =
    "w-full px-4 py-2 bg-dark-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";
  const iconClasses = icon ? "pl-10" : "";

  const classes = `${baseClasses} ${errorClasses} ${iconClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={classes}
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
