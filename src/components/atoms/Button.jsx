export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const baseClasses = 'inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-150 justify-center border';
  
  const variants = {
    primary: 'bg-accent text-white border-transparent hover:bg-blue-600',
    ghost: 'bg-transparent text-text-dim border-border hover:bg-surface2 hover:text-text',
    danger: 'bg-transparent text-red-500 border-red-500/25 hover:bg-red-500/10',
    success: 'bg-green-700 text-white border-transparent hover:bg-green-800'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}
