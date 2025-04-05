
import React from 'react';
import { cn } from '@/lib/utils';

interface InputGroupProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
  labelClassName?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  required,
  error,
  children,
  hint,
  className,
  labelClassName
}) => {
  return (
    <div className={cn("mb-4", className)}>
      <label className={cn(
        "block text-sm font-medium mb-1",
        error ? "text-destructive" : "text-foreground",
        labelClassName
      )}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      
      {children}
      
      {hint && !error && (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = 2,
  gap = 4,
  className
}) => {
  return (
    <div className={cn(
      "grid gap-4",
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-1 sm:grid-cols-2",
      columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      `gap-${gap}`,
      className
    )}>
      {children}
    </div>
  );
};
