import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, leftIcon, rightIcon, fullWidth = true, className = '', ...props }, ref) => {
        const widthClass = fullWidth ? 'w-full' : '';
        const errorClass = error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
            : 'border-slate-200 focus:ring-indigo-500 focus:border-transparent';
            
        return (
            <div className={`${widthClass} ${className}`}>
                {label && (
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
                            ${widthClass} 
                            ${leftIcon ? 'pl-10' : 'pl-4'} 
                            ${rightIcon ? 'pr-10' : 'pr-4'} py-3 
                            border rounded-xl text-sm bg-slate-50 
                            focus:bg-white focus:outline-none focus:ring-2 transition-all input-glow
                            ${errorClass}
                        `}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
