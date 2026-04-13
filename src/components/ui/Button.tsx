import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    
    const baseClass = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-[0_0_15px_rgba(255,90,0,0.3)]",
      secondary: "bg-muted text-foreground hover:bg-muted/80",
      outline: "border border-border bg-transparent hover:bg-accent text-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground text-foreground",
    };
    
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-6 py-2",
      lg: "h-14 px-8 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !isLoading ? { scale: 1.03 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
        className={cn(baseClass, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
