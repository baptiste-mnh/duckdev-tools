import React from "react";
import type { TextareaProps } from "../../types";

const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  disabled = false,
  error,
  className = "",
  resize = "vertical",
  maxLength,
  minLength,
  autoFocus = false,
}) => {
  const baseClasses =
    "w-full px-4 py-2 bg-dark-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";

  const resizeClasses = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize",
  };

  const classes = `${baseClasses} ${errorClasses} ${resizeClasses[resize]} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        minLength={minLength}
        autoFocus={autoFocus}
        className={classes}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Textarea;
