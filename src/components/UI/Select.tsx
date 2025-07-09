import React from "react";
import type { SelectProps } from "../../types";

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  error,
  className = "",
  multiple = false,
}) => {
  const baseClasses =
    "w-full px-4 py-2 bg-dark-800 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";

  const classes = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        multiple={multiple}
        className={classes}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="bg-dark-800 text-gray-100"
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
