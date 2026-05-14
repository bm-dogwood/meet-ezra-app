// ===========================================
// EZRA PORTAL - Card Component
// ===========================================

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = 'default', padding = 'md', hover = false, children, ...props },
    ref
  ) => {
    const variants = {
      default: cn(
        'bg-white dark:bg-surface-850',
        'border border-surface-200 dark:border-surface-700/50'
      ),
      elevated: cn(
        'bg-white dark:bg-surface-850',
        'shadow-card dark:shadow-none',
        'border border-surface-100 dark:border-surface-700/50'
      ),
      outlined: cn(
        'bg-transparent',
        'border-2 border-surface-200 dark:border-surface-700'
      ),
      glass: cn(
        'bg-white/80 dark:bg-surface-900/80',
        'backdrop-blur-xl',
        'border border-white/20 dark:border-surface-700/50'
      ),
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl',
          variants[variant],
          paddings[padding],
          hover && 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header subcomponent
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  description,
  action,
  className,
  ...props
}) => (
  <div
    className={cn('flex items-start justify-between mb-4', className)}
    {...props}
  >
    <div>
      <h3 className="text-heading-sm text-surface-900 dark:text-surface-100">
        {title}
      </h3>
      {description && (
        <p className="text-body-sm text-surface-500 dark:text-surface-400 mt-0.5">
          {description}
        </p>
      )}
    </div>
    {action && <div className="ml-4">{action}</div>}
  </div>
);

CardHeader.displayName = 'CardHeader';

// Card Content subcomponent
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('', className)} {...props}>
    {children}
  </div>
);

CardContent.displayName = 'CardContent';

// Card Footer subcomponent
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      'mt-4 pt-4 border-t border-surface-200 dark:border-surface-700',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

CardFooter.displayName = 'CardFooter';

export default Card;
