'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Format number with thousand separators
const formatNumber = (value: number | string): string => {
    const num = typeof value === 'string' ? parseInt(value.replace(/,/g, ''), 10) : value;
    if (isNaN(num)) return '';
    return num.toLocaleString('ko-KR');
};

interface DeductionInfo {
    amount: number;
    rate: number;
    deduction: number;
    excess?: number;
}

interface CardInputProps {
    label: string;
    fieldName: string;
    value: number;
    rate: number;
    placeholder: string;
    deductionInfo?: DeductionInfo;
    onChange: (fieldName: string, value: number) => void;
}

export default function CardInput({
    label,
    fieldName,
    value,
    rate,
    placeholder,
    deductionInfo,
    onChange
}: CardInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        const numValue = parseInt(rawValue, 10) || 0;
        onChange(fieldName, numValue);
        e.target.value = formatNumber(numValue);
    };

    return (
        <div className="space-y-2">
            <Label className="text-base font-bold mb-2 block">{label} (원)</Label>
            <Input
                ref={inputRef}
                type="text"
                defaultValue={formatNumber(value)}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
            />
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-semibold">
                    💡 총급여의 25% 초과분 {rate}% 공제
                </p>
                {deductionInfo && (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                        {isOpen ? '접기 ▲' : '공제 상세 ▼'}
                    </button>
                )}
            </div>
            {isOpen && deductionInfo && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">사용액</span>
                        <span className="font-semibold">{formatNumber(deductionInfo.amount)}원</span>
                    </div>
                    {deductionInfo.excess !== undefined && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">25% 초과분</span>
                            <span className="font-semibold">{formatNumber(deductionInfo.excess)}원</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">공제율</span>
                        <span className="font-semibold">{deductionInfo.rate}%</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                        <span className={`font-bold ${deductionInfo.deduction > 0 ? 'text-green-600' : 'text-gray-500'}`}>예상 공제금액</span>
                        <span className={`font-black ${deductionInfo.deduction > 0 ? 'text-green-600' : 'text-gray-500'}`}>{formatNumber(deductionInfo.deduction)}원</span>
                    </div>
                    {deductionInfo.deduction === 0 && deductionInfo.excess === 0 && (
                        <p className="text-xs text-orange-600 font-semibold mt-1">
                            ⚠️ 전액이 25% 기준 충당에 사용되어 공제 대상이 없습니다
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
