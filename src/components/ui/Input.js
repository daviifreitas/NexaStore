import React from 'react';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  icon,
  className = '',
  ...props
}) => {
  const baseClasses = "w-full rounded-2xl border border-gray-300 bg-white/80 px-3 py-2 text-sm placeholder:text-gray-400 dark:bg-neutral-800 dark:border-neutral-700 dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50 disabled:cursor-not-allowed";

  const withIcon = icon ? "pl-9" : "";

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${baseClasses} ${withIcon} ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;