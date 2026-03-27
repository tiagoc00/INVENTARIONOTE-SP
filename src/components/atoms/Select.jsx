import React from 'react';

export const Select = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <select 
      ref={ref}
      className={`w-full bg-bg border border-border rounded-md px-3 py-2 text-text text-sm outline-none focus:border-accent transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';
