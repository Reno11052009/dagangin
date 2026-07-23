import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none';
    
    // Variant styles
    const variants: Record<ButtonVariant, string> = {
        primary: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 focus:ring-indigo-500 border border-transparent',
        secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-400 border border-transparent hover:-translate-y-0.5',
        danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-200 hover:-translate-y-0.5 focus:ring-red-500 border border-transparent',
        ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-400 border border-transparent',
        outline: 'bg-transparent hover:bg-slate-50 text-slate-700 border border-slate-200 focus:ring-slate-400',
    };

    // Size styles
    const sizes: Record<ButtonSize, string> = {
        sm: 'py-2 px-3 text-xs',
        md: 'py-3.5 px-4 text-sm',
        lg: 'py-4 px-6 text-base',
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const variantClass = variants[variant];
    const sizeClass = sizes[size];
    
    // Disable interaction when loading
    const isDisabled = disabled || isLoading;

    return (
        <button
            disabled={isDisabled}
            className={`${baseStyles} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
            {...props}
        >
            {isLoading ? (
                <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 17} className="animate-spin" />
            ) : (
                leftIcon
            )}
            {children}
            {!isLoading && rightIcon}
        </button>
    );
}

export default Button;
