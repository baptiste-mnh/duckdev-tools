import React from "react";
import type { CheckboxProps } from "../../types";

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  className = "",
  indeterminate = false,
}) => {
  const baseClasses =
    "w-4 h-4 text-blue-600 bg-dark-800 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed";
  const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";

  const classes = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate;
        }}
        className={classes}
      />

      {label && (
        <label className="ml-2 text-sm font-medium text-gray-300 cursor-pointer">
          {label}
        </label>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Checkbox;
