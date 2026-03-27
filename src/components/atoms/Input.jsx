import React from 'react';

// Using forwardRef so it can be used nicely in forms if needed
export const Input = React.forwardRef(({ className = '', monospace, ...props }, ref) => {
  const fontClass = monospace ? "font-mono text-xs" : "font-sans text-sm";
  return (
    <input 
      ref={ref}
      className={`w-full bg-bg border border-border rounded-md px-3 py-2 text-text outline-none focus:border-accent transition-colors ${fontClass} ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';
