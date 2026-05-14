// ===========================================
// EZRA PORTAL - Button Component
// ===========================================

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 font-medium',
      'rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'dark:focus:ring-offset-surface-900'
    );

    const variants = {
      primary: cn(
        'bg-ezra-500 text-white',
        'hover:bg-ezra-600',
        'focus:ring-ezra-500',
        'shadow-sm hover:shadow-md',
        'active:scale-[0.98]'
      ),
      secondary: cn(
        'bg-surface-100 text-surface-900',
        'dark:bg-surface-800 dark:text-surface-100',
        'hover:bg-surface-200 dark:hover:bg-surface-700',
        'focus:ring-surface-500',
        'border border-surface-200 dark:border-surface-700'
      ),
      outline: cn(
        'border-2 border-ezra-500 text-ezra-500',
        'dark:border-ezra-400 dark:text-ezra-400',
        'hover:bg-ezra-500/10',
        'focus:ring-ezra-500'
      ),
      ghost: cn(
        'text-surface-700 dark:text-surface-300',
        'hover:bg-surface-100 dark:hover:bg-surface-800',
        'focus:ring-surface-500'
      ),
      danger: cn(
        'bg-danger-500 text-white',
        'hover:bg-danger-600',
        'focus:ring-danger-500'
      ),
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
