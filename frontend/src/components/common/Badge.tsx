import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'danger' | 'info' | 'purple' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  dot = false,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    outline: 'bg-transparent text-zinc-600 border-zinc-200',
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: 'bg-zinc-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    purple: 'bg-purple-500',
    outline: 'bg-zinc-400',
  };

  const sizeStyles = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors ${variantStyles[variant]} ${sizeStyles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
