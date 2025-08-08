import React from 'react';
import { ButtonProps } from '../../types/ui';

/**
 * Button component with various styles and states
 */
export const Button: React.FC<ButtonProps> = ({
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/20',
    secondary: 'bg-neutral-700 text-white hover:bg-neutral-600 focus:ring-neutral-500/20',
    outline: 'border border-neutral-600 bg-transparent text-neutral-200 hover:bg-neutral-800 focus:ring-neutral-500/20',
    ghost: 'bg-transparent text-neutral-200 hover:bg-neutral-800 focus:ring-neutral-500/20',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/20',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const handleClick = () => {
    if (!loading && !disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Handle Enter and Space key presses for accessibility
    if ((e.key === 'Enter' || e.key === ' ') && !loading && !disabled && onClick) {
      e.preventDefault();
      onClick();
    }
    props.onKeyDown?.(e);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading...
        </>
      ) : (
        <>
          {icon && <div className="flex-shrink-0">{icon}</div>}
          {children}
        </>
      )}
    </button>
  );
};