import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'interactive';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-white border border-zinc-200/80 shadow-xs rounded-2xl p-5',
    subtle: 'bg-zinc-50/70 border border-zinc-200/60 rounded-2xl p-4',
    interactive: 'bg-white border border-zinc-200 shadow-xs hover:border-zinc-300 hover:shadow-sm rounded-2xl p-5 transition-all duration-200 cursor-pointer',
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
