import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'secondary', 
    size = 'md', 
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    className = '', 
    disabled, 
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      primary: 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm border border-transparent',
      secondary: 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-200/60',
      outline: 'bg-white text-zinc-800 hover:bg-zinc-50 border border-zinc-300 shadow-xs',
      ghost: 'bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm border border-transparent',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2 gap-2 h-9',
      lg: 'text-sm px-5 py-2.5 gap-2.5 h-11',
      icon: 'p-2 h-9 w-9 rounded-full',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
