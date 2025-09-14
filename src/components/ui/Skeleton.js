import React from 'react';

const Skeleton = ({
  className = '',
  width,
  height,
  ...props
}) => {
  const baseClasses = "animate-pulse rounded-2xl bg-gray-200 dark:bg-neutral-800";

  const style = {
    ...(width && { width }),
    ...(height && { height })
  };

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={style}
      {...props}
    />
  );
};

export const SkeletonCard = () => (
  <div className="overflow-hidden rounded-3xl border bg-white dark:bg-neutral-900 dark:border-neutral-800">
    <Skeleton className="aspect-[4/3] rounded-none" />
    <div className="p-3 space-y-2">
      <Skeleton height="1rem" width="75%" />
      <Skeleton height="0.875rem" width="50%" />
      <div className="flex justify-between items-center mt-3">
        <Skeleton height="1.5rem" width="30%" />
        <Skeleton height="2rem" width="2rem" className="rounded-xl" />
      </div>
    </div>
  </div>
);

export default Skeleton;