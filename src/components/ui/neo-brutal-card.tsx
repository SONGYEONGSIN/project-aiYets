import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface NeoBrutalCardProps {
    thumbnail?: string;
    date?: string;
    title?: string;
    description?: string;
    callToActionText?: string;
    href?: string;
    children?: ReactNode;
    className?: string;
}

const NeoBrutalCard = ({
    thumbnail,
    date,
    title,
    description,
    callToActionText,
    href,
    children,
    className,
}: NeoBrutalCardProps) => {
    const CardWrapper = ({ children: wrapperChildren }: { children: ReactNode }) => {
        if (href) {
            return <Link href={href}>{wrapperChildren}</Link>;
        }
        return <>{wrapperChildren}</>;
    };

    return (
        <div
            className={cn(
                'w-full border-2 border-black bg-white transition-all',
                'hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]',
                className
            )}
        >
            <CardWrapper>
                <article className="w-full h-full">
                    {thumbnail && (
                        <figure className="w-full border-black border-b-2 overflow-hidden">
                            <img
                                src={thumbnail}
                                alt="thumbnail"
                                className="w-full h-48 object-cover"
                            />
                        </figure>
                    )}
                    <div className="px-6 py-5 text-left">
                        {date && <p className="text-sm text-gray-500 mb-2">{date}</p>}
                        {title && (
                            <h2 className="text-2xl font-bold mb-3">{title}</h2>
                        )}
                        {description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                {description}
                            </p>
                        )}
                        {callToActionText && (
                            <strong className="text-sm font-bold">{callToActionText}</strong>
                        )}
                        {children}
                    </div>
                </article>
            </CardWrapper>
        </div>
    );
};

export { NeoBrutalCard };
