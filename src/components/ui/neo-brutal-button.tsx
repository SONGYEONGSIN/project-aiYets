'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface NeoBrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'violet' | 'pink' | 'red' | 'orange' | 'yellow' | 'lime' | 'cyan';
    size?: 'sm' | 'md' | 'lg';
    rounded?: 'none' | 'md' | 'full';
}

const colorVariants = {
    default: 'bg-white hover:bg-gray-100 active:bg-gray-200',
    violet: 'bg-[#A8A6FF] hover:bg-[#918efa] active:bg-[#807dfa]',
    pink: 'bg-[#FFA6F6] hover:bg-[#fa8cef] active:bg-[#fa7fee]',
    red: 'bg-[#FF9F9F] hover:bg-[#fa7a7a] active:bg-[#f76363]',
    orange: 'bg-[#FFC29F] hover:bg-[#FF965B] active:bg-[#fa8543]',
    yellow: 'bg-[#FFF066] hover:bg-[#FFE500] active:bg-[#ffd500]',
    lime: 'bg-[#B8FF9F] hover:bg-[#9dfc7c] active:bg-[#7df752]',
    cyan: 'bg-[#A6FAFF] hover:bg-[#79F7FF] active:bg-[#53f2fc]',
};

const sizeVariants = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
};

const roundedVariants = {
    none: 'rounded-none',
    md: 'rounded-md',
    full: 'rounded-full',
};

const NeoBrutalButton = forwardRef<HTMLButtonElement, NeoBrutalButtonProps>(
    ({ className, variant = 'default', size = 'md', rounded = 'none', disabled, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled}
                className={cn(
                    'font-bold border-2 border-black transition-all',
                    'shadow-[4px_4px_0px_rgba(0,0,0,1)]',
                    'hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]',
                    'active:shadow-[0px_0px_0px_rgba(0,0,0,1)]',
                    'disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-400 disabled:shadow-none disabled:cursor-not-allowed',
                    colorVariants[variant],
                    sizeVariants[size],
                    roundedVariants[rounded],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

NeoBrutalButton.displayName = 'NeoBrutalButton';

export { NeoBrutalButton };
