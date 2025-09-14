import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseClasses = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";

  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-200 border border-gray-200 dark:border-neutral-700",
    brand: "bg-brand/10 text-brand border border-brand/20",
    success: "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    error: "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;