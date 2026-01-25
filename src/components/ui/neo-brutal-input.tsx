'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface NeoBrutalInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    focusColor?: 'violet' | 'pink' | 'red' | 'orange' | 'yellow' | 'lime' | 'cyan';
    rounded?: 'none' | 'md' | 'full';
    inputSize?: 'sm' | 'md' | 'lg';
}

const focusColorVariants = {
    violet: 'focus:bg-[#A8A6FF]/20',
    pink: 'focus:bg-[#FFA6F6]/20',
    red: 'focus:bg-[#FF9F9F]/20',
    orange: 'focus:bg-[#FFC29F]/20',
    yellow: 'focus:bg-[#FFF066]/20',
    lime: 'focus:bg-[#B8FF9F]/20',
    cyan: 'focus:bg-[#A6FAFF]/20',
};

const roundedVariants = {
    none: 'rounded-none',
    md: 'rounded-md',
    full: 'rounded-full',
};

const sizeVariants = {
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-3 py-2.5 text-base',
    lg: 'px-4 py-3 text-lg',
};

const NeoBrutalInput = forwardRef<HTMLInputElement, NeoBrutalInputProps>(
    ({ className, focusColor = 'cyan', rounded = 'none', inputSize = 'md', ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    'w-full border-2 border-black bg-white font-medium transition-all',
                    'placeholder:text-gray-500',
                    'focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)]',
                    'active:shadow-[2px_2px_0px_rgba(0,0,0,1)]',
                    'disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
                    focusColorVariants[focusColor],
                    roundedVariants[rounded],
                    sizeVariants[inputSize],
                    className
                )}
                {...props}
            />
        );
    }
);

NeoBrutalInput.displayName = 'NeoBrutalInput';

export { NeoBrutalInput };
