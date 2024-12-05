import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading,
  fullWidth,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:opacity-90',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:text-primary-600',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed';
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabledStyles}
        ${widthStyles}
        ${className}
      `}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="animate-spin">⌛</span>
      ) : Icon && (
        <Icon className="h-5 w-5" />
      )}
      {children}
    </button>
  );
}