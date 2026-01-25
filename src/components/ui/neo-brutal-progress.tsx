'use client';

import { cn } from '@/lib/utils';

export interface NeoBrutalProgressBarProps {
    progress: number; // 0-100
    color?: 'violet' | 'pink' | 'red' | 'orange' | 'yellow' | 'lime' | 'cyan';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
}

const colorVariants = {
    violet: 'bg-[#A8A6FF]',
    pink: 'bg-[#FFA6F6]',
    red: 'bg-[#FF9F9F]',
    orange: 'bg-[#FFC29F]',
    yellow: 'bg-[#FFF066]',
    lime: 'bg-[#B8FF9F]',
    cyan: 'bg-[#A6FAFF]',
};

const sizeVariants = {
    sm: 'h-3',
    md: 'h-5',
    lg: 'h-8',
};

const NeoBrutalProgressBar = ({
    progress,
    color = 'cyan',
    size = 'md',
    showLabel = false,
    className,
}: NeoBrutalProgressBarProps) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div className={cn('w-full', className)}>
            <div
                className={cn(
                    'w-full border-2 border-black bg-gray-100 overflow-hidden',
                    sizeVariants[size]
                )}
            >
                <div
                    className={cn(
                        'h-full transition-all duration-500 flex items-center justify-end pr-2',
                        colorVariants[color]
                    )}
                    style={{ width: `${clampedProgress}%` }}
                >
                    {showLabel && clampedProgress >= 15 && (
                        <span className="text-xs font-bold text-black">
                            {clampedProgress.toFixed(0)}%
                        </span>
                    )}
                </div>
            </div>
            {showLabel && clampedProgress < 15 && (
                <span className="text-xs font-bold text-black ml-1">
                    {clampedProgress.toFixed(0)}%
                </span>
            )}
        </div>
    );
};

export { NeoBrutalProgressBar };
