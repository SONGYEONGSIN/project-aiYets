'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CalculatorPage() {
    const [results, setResults] = useState({
        totalSalary: 68187336,           // 총 급여액
        incomeDeduction: 15230726,       // 근로소득공제
        incomeAmount: 52956610,          // 근로소득금액
        itemizedDeduction: 7956610,      // 소득공제
        taxableIncome: 45000000,         // 종합소득과세표준
        calculatedTax: 6660000,          // 산출세액
        taxCredit: 956610,               // 세액감면 및 세액공제
        determinedTax: 5703390,          // 결정세액
        paidTax: 6660000,                // 기납부세액
        refundAmount: 956610,            // 환급 예상액
    });

    // 카드·현금 사용액 State
    const [cardData, setCardData] = useState({
        totalSalary: 68187336,           // 총 급여액 (공제 기준)
        creditCard: 15665472,            // 신용카드
        debitCard: 3000000,              // 체크카드
        cash: 2000000,                   // 현금영수증
        traditionalMarket: 500000,       // 전통시장
        publicTransport: 960000,         // 대중교통
    });

    // 카드 공제 계산 함수
    const calculateCardDeduction = () => {
        const threshold = cardData.totalSalary * 0.25; // 총급여의 25%
        const totalUsage = cardData.creditCard + cardData.debitCard + cardData.cash + cardData.traditionalMarket + cardData.publicTransport;

        if (totalUsage <= threshold) {
            return { total: 0, details: null };
        }

        // 공제 순서: 신용카드 15% → 체크카드/현금 30% → 전통시장/대중교통 40%
        let remaining = totalUsage - threshold;

        // 1. 신용카드 공제 (15%)
        const creditDeductible = Math.min(cardData.creditCard, remaining);
        const creditDeduction = creditDeductible * 0.15;
        remaining -= creditDeductible;

        // 2. 체크카드 + 현금영수증 공제 (30%)
        const debitCashTotal = cardData.debitCard + cardData.cash;
        const debitCashDeductible = Math.min(debitCashTotal, remaining);
        const debitCashDeduction = debitCashDeductible * 0.30;
        remaining -= debitCashDeductible;

        // 3. 전통시장 + 대중교통 공제 (40%)
        const specialTotal = cardData.traditionalMarket + cardData.publicTransport;
        const specialDeductible = Math.min(specialTotal, remaining);
        const specialDeduction = specialDeductible * 0.40;

        // 한도 계산 (총급여 7천만원 이하: 300만원)
        const limit = cardData.totalSalary <= 70000000 ? 3000000 : 2500000;
        const totalDeduction = Math.min(creditDeduction + debitCashDeduction + specialDeduction, limit);

        return {
            total: Math.round(totalDeduction),
            threshold: Math.round(threshold),
            totalUsage,
            excessAmount: totalUsage - threshold,
            details: {
                creditCard: { amount: cardData.creditCard, rate: 15, deduction: Math.round(creditDeduction) },
                debitCard: { amount: cardData.debitCard, rate: 30, deduction: Math.round((cardData.debitCard / debitCashTotal) * debitCashDeduction) || 0 },
                cash: { amount: cardData.cash, rate: 30, deduction: Math.round((cardData.cash / debitCashTotal) * debitCashDeduction) || 0 },
                traditionalMarket: { amount: cardData.traditionalMarket, rate: 40, deduction: Math.round((cardData.traditionalMarket / specialTotal) * specialDeduction) || 0 },
                publicTransport: { amount: cardData.publicTransport, rate: 40, deduction: Math.round((cardData.publicTransport / specialTotal) * specialDeduction) || 0 },
            },
            limit,
        };
    };

    const cardDeduction = calculateCardDeduction();

    // Format number with thousand separators
    const formatNumber = (value: number | string): string => {
        const num = typeof value === 'string' ? parseInt(value.replace(/,/g, ''), 10) : value;
        if (isNaN(num)) return '';
        return num.toLocaleString('ko-KR');
    };

    // Parse formatted number back to number
    const parseNumber = (value: string): number => {
        return parseInt(value.replace(/,/g, ''), 10) || 0;
    };

    // Formatted Number Input Component
    const FormattedInput = ({ defaultValue, placeholder, ...props }: { defaultValue?: number | string; placeholder?: string;[key: string]: any }) => {
        const [displayValue, setDisplayValue] = useState(defaultValue ? formatNumber(defaultValue) : '');

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value.replace(/[^0-9]/g, '');
            setDisplayValue(rawValue ? formatNumber(rawValue) : '');
        };

        return (
            <Input
                type="text"
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                {...props}
            />
        );
    };

    // Card Input Component with collapsible calculation details
    const CardInput = ({
        label,
        field,
        rate,
        placeholder
    }: {
        label: string;
        field: keyof typeof cardData;
        rate: number;
        placeholder: string;
    }) => {
        const [isOpen, setIsOpen] = useState(false);
        const deductionInfo = cardDeduction.details?.[field as keyof typeof cardDeduction.details];

        return (
            <div className="space-y-2">
                <Label className="text-base font-bold mb-2 block">{label} (원)</Label>
                <Input
                    type="text"
                    value={formatNumber(cardData[field])}
                    onChange={(e) => {
                        const value = parseNumber(e.target.value);
                        setCardData(prev => ({ ...prev, [field]: value }));
                    }}
                    placeholder={placeholder}
                    className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                />
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-semibold">
                        💡 총급여의 25% 초과분 {rate}% 공제
                    </p>
                    {deductionInfo && deductionInfo.deduction > 0 && (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                            {isOpen ? '접기 ▲' : '공제 상세 ▼'}
                        </button>
                    )}
                </div>
                {isOpen && deductionInfo && deductionInfo.deduction > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">사용액</span>
                            <span className="font-semibold">{formatNumber(deductionInfo.amount)}원</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">공제율</span>
                            <span className="font-semibold">{deductionInfo.rate}%</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between">
                            <span className="font-bold text-green-600">예상 공제금액</span>
                            <span className="font-black text-green-600">{formatNumber(deductionInfo.deduction)}원</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black mb-8">연말정산 계산기</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Calculator Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Accordion type="multiple" className="space-y-4" defaultValue={['income']}>
                        {/* 1. 급여 정보 */}
                        <AccordionItem value="income" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#F7CB15] transition-colors">
                                💰 1. 급여 정보
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-4">
                                <div>
                                    <Label className="text-base font-bold mb-2 block">연봉 (원)</Label>
                                    <FormattedInput
                                        placeholder="69,387,336"
                                        defaultValue={69387336}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 급여 + 상여
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">비과세 소득 (원)</Label>
                                    <FormattedInput
                                        placeholder="1,200,000"
                                        defaultValue={1200000}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 식대, 보육수당, 자가운전보조금 등
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">총 급여액 (원)</Label>
                                    <FormattedInput
                                        placeholder="68,187,336"
                                        defaultValue={68187336}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 급여 + 상여 - 비과세소득
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 2. 인적공제 */}
                        <AccordionItem value="personal" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#00D9FF] transition-colors">
                                👨‍👩‍👧‍👦 2. 인적공제
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-6">
                                {/* 본인 및 배우자 */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-base font-bold mb-2 block">본인</Label>
                                        <FormattedInput defaultValue={1500000} />
                                        <p className="text-sm text-muted-foreground font-semibold mt-1">
                                            💡 자동계산
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-base font-bold mb-2 block">배우자공제</Label>
                                        <select className="w-full border-brutal shadow-brutal-sm text-lg font-semibold h-12 px-3">
                                            <option value="no">없음</option>
                                            <option value="yes">있음 (150만원 공제)</option>
                                        </select>
                                        <p className="text-sm text-muted-foreground font-semibold mt-1">
                                            💡 근로소득자: 연봉 500만원 이하 / 다른소득자: 소득금액 100만원 이하
                                        </p>
                                    </div>
                                </div>

                                {/* 부양가족공제 */}
                                <div className="border-t-2 border-black/30 pt-4">
                                    <h4 className="text-base font-black mb-4">부양가족공제</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-base font-bold mb-2 block">직계존속 (인)</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                defaultValue="0"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 부,모,장인,장모 등 / 만60세 이상
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-base font-bold mb-2 block">자녀 (인)</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                defaultValue="0"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 만20세 이하
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-base font-bold mb-2 block">형제 자매 (인)</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                defaultValue="0"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 만20세 이하 또는 만60세 이상
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-base font-bold mb-2 block">위탁아동 (인)</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                defaultValue="0"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 6개월 이상 위탁양육
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-base font-bold mb-2 block">수급자 (인)</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                defaultValue="0"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 기초생활수급자
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 3. 국민연금·건강/장기/고용보험료 공제 */}
                        <AccordionItem value="insurance" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#FF6B35] transition-colors">
                                🏥 3. 국민연금·건강/장기/고용보험료 공제
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-4">
                                <div>
                                    <Label className="text-base font-bold mb-2 block">국민연금 (원)</Label>
                                    <FormattedInput
                                        placeholder="2,710,224"
                                        defaultValue={2710224}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 전액 소득공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">건강보험료 (원)</Label>
                                    <FormattedInput
                                        placeholder="2,418,241"
                                        defaultValue={2418241}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 본인 부담금 전액 공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">노인장기요양보험료 (원)</Label>
                                    <FormattedInput
                                        placeholder="312,700"
                                        defaultValue={312700}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 전액 소득공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">고용보험료 (원)</Label>
                                    <FormattedInput
                                        placeholder="613,686"
                                        defaultValue={613686}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 전액 소득공제
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 4. 카드·현금 사용액 */}
                        <AccordionItem value="card" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#F7CB15] transition-colors">
                                💳 4. 카드·현금 사용액
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-4">
                                <CardInput label="신용카드 사용액" field="creditCard" rate={15} placeholder="15,665,472" />
                                <CardInput label="체크카드" field="debitCard" rate={30} placeholder="3,000,000" />
                                <CardInput label="현금영수증" field="cash" rate={30} placeholder="2,000,000" />
                                <CardInput label="전통시장" field="traditionalMarket" rate={40} placeholder="500,000" />
                                <CardInput label="대중교통 사용액" field="publicTransport" rate={40} placeholder="960,000" />

                                {/* 총 공제 요약 - 심플 버전 */}
                                <div className="bg-gray-100 border-2 border-black rounded-lg p-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">📊 카드 사용 총 공제금액</span>
                                        <span className="text-2xl font-black text-green-600">{formatNumber(cardDeduction.total)}원</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        총 사용액 {formatNumber(cardData.creditCard + cardData.debitCard + cardData.cash + cardData.traditionalMarket + cardData.publicTransport)}원 중 공제 대상 {formatNumber(cardDeduction.excessAmount || 0)}원 (한도: {formatNumber(cardDeduction.limit || 3000000)}원)
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-base font-bold mb-2 block">문화체육 (도서·공연·체육시설 등) (원)</Label>
                                    <FormattedInput
                                        placeholder="300,000"
                                        defaultValue={300000}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 총급여의 25% 초과분 30% 공제 (연 100만원 한도)
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 5. 교육비·의료비 */}
                        <AccordionItem value="education" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#00D9FF] transition-colors">
                                📚 5. 교육비·의료비
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-4">
                                <div>
                                    <Label className="text-base font-bold mb-2 block">본인 교육비 (원)</Label>
                                    <FormattedInput
                                        placeholder="0"
                                        defaultValue={0}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 한도 없음, 15% 공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">자녀 교육비 - 유치원 (원)</Label>
                                    <FormattedInput
                                        placeholder="2,000,000"
                                        defaultValue={2000000}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 1인당 연 300만원 한도
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">자녀 교육비 - 초중고 (원)</Label>
                                    <FormattedInput
                                        placeholder="2,000,000"
                                        defaultValue={2000000}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 1인당 연 300만원 한도
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">자녀 교육비 - 대학 (원)</Label>
                                    <FormattedInput
                                        placeholder="2,000,000"
                                        defaultValue={2000000}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 1인당 연 900만원 한도
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">의료비 지출액 (원)</Label>
                                    <FormattedInput
                                        placeholder="1,500,000"
                                        defaultValue={1500000}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 총급여의 3% 초과분 15% 공제
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 6. 기부금 */}
                        <AccordionItem value="donation" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#FF6B35] transition-colors">
                                ❤️ 6. 기부금
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-4">
                                <div>
                                    <Label className="text-base font-bold mb-2 block">정치자금 기부금 (원)</Label>
                                    <FormattedInput
                                        placeholder="100,000"
                                        defaultValue={100000}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 10만원까지 100%, 초과분 15%~25%
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">고향사랑 기부금 (원)</Label>
                                    <FormattedInput
                                        placeholder="100,000"
                                        defaultValue={100000}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 10만원까지 100%, 초과분 16.5% (연 500만원 한도)
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">법정 기부금 (원)</Label>
                                    <FormattedInput
                                        placeholder="0"
                                        defaultValue={0}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 소득 100% 한도, 15%~25% 공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">우리사주조합 기부금 (원)</Label>
                                    <FormattedInput
                                        placeholder="0"
                                        defaultValue={0}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 소득 30% 한도
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">지정 기부금 (종교단체 외) (원)</Label>
                                    <FormattedInput
                                        placeholder="500,000"
                                        defaultValue={500000}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 소득 30% 한도, 15%~25% 공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">종교단체 기부금 (원)</Label>
                                    <FormattedInput
                                        placeholder="0"
                                        defaultValue={0}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 소득 10% 한도, 15%~25% 공제
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 7. 보험·연금 */}
                        <AccordionItem value="pension" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#F7CB15] transition-colors">
                                🏦 7. 보험·연금
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-4">
                                <div>
                                    <Label className="text-base font-bold mb-2 block">보장성 보험료 (원)</Label>
                                    <FormattedInput
                                        placeholder="1,000,000"
                                        defaultValue={1000000}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 연 100만원 한도, 12% 공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">연금저축 (원)</Label>
                                    <FormattedInput
                                        placeholder="4,000,000"
                                        defaultValue={4000000}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 최대 400만원, 16.5% 세액공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">퇴직연금(IRP) (원)</Label>
                                    <FormattedInput
                                        placeholder="3,000,000"
                                        defaultValue={3000000}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 연금저축 합산 최대 700만원, 16.5% 세액공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">ISA 추가 납입액 (원)</Label>
                                    <FormattedInput
                                        placeholder="0"
                                        defaultValue={0}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 연 2,000만원 한도, 비과세 혜택
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 8. 주택자금 */}
                        <AccordionItem value="housing" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#00D9FF] transition-colors">
                                🏠 8. 주택자금
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-4">
                                <div>
                                    <Label className="text-base font-bold mb-2 block">주택청약저축 (원)</Label>
                                    <FormattedInput
                                        placeholder="2,400,000"
                                        defaultValue={2400000}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 연 300만원 한도, 40% 공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">월세 (원)</Label>
                                    <FormattedInput
                                        placeholder="0"
                                        defaultValue={0}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 연 750만원 한도, 12% 공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">주택임차차입금원리금상환액 (원)</Label>
                                    <FormattedInput
                                        placeholder="0"
                                        defaultValue={0}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 연 400만원 한도, 40% 공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">장기주택저당차입금 이자상환액 (원)</Label>
                                    <FormattedInput
                                        placeholder="0"
                                        defaultValue={0}
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 상환기간에 따라 300~1,800만원 한도
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* Calculate Button */}
                    <div className="flex gap-4">
                        <Button className="flex-1 bg-black text-white text-xl font-black py-6 border-brutal shadow-brutal hover-brutal">
                            💡 AI 분석 요청
                        </Button>
                        <Button className="flex-1 bg-[#FF6B35] text-black text-xl font-black py-6 border-brutal shadow-brutal hover-brutal hover:text-white">
                            🧮 계산하기
                        </Button>
                    </div>
                </div>

                {/* Right: Results Panel (Sticky) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-4">
                        <Card className="bg-[#F7CB15] border-brutal shadow-brutal-lg p-6">
                            <h3 className="text-2xl font-black mb-4">📊 계산 결과</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground mb-1">총 급여액</p>
                                    <p className="text-xl font-black">
                                        {results.totalSalary.toLocaleString()}원
                                    </p>
                                </div>
                                <div className="border-t-2 border-black/30 pt-3">
                                    <p className="text-sm font-semibold text-muted-foreground mb-1">근로소득공제</p>
                                    <p className="text-xl font-black text-blue-700">
                                        -{results.incomeDeduction.toLocaleString()}원
                                    </p>
                                </div>
                                <div className="border-t-2 border-black/30 pt-3">
                                    <p className="text-sm font-semibold text-muted-foreground mb-1">근로소득금액</p>
                                    <p className="text-xl font-black">
                                        {results.incomeAmount.toLocaleString()}원
                                    </p>
                                </div>
                                <div className="border-t-2 border-black/30 pt-3">
                                    <p className="text-sm font-semibold text-muted-foreground mb-1">소득공제</p>
                                    <p className="text-xl font-black text-blue-700">
                                        -{results.itemizedDeduction.toLocaleString()}원
                                    </p>
                                </div>
                                <div className="border-t-4 border-black pt-3">
                                    <p className="text-sm font-semibold text-muted-foreground mb-1">종합소득과세표준</p>
                                    <p className="text-xl font-black">
                                        {results.taxableIncome.toLocaleString()}원
                                    </p>
                                </div>
                                <div className="border-t-2 border-black/30 pt-3">
                                    <p className="text-sm font-semibold text-muted-foreground mb-1">산출세액</p>
                                    <p className="text-xl font-black">
                                        {results.calculatedTax.toLocaleString()}원
                                    </p>
                                </div>
                                <div className="border-t-2 border-black/30 pt-3">
                                    <p className="text-sm font-semibold text-muted-foreground mb-1">세액감면 및 세액공제</p>
                                    <p className="text-xl font-black text-blue-700">
                                        -{results.taxCredit.toLocaleString()}원
                                    </p>
                                </div>
                                <div className="border-t-2 border-black/30 pt-3">
                                    <p className="text-sm font-semibold text-muted-foreground mb-1">결정세액</p>
                                    <p className="text-xl font-black">
                                        {results.determinedTax.toLocaleString()}원
                                    </p>
                                </div>
                                <div className="border-t-2 border-black/30 pt-3">
                                    <p className="text-sm font-semibold text-muted-foreground mb-1">기납부세액</p>
                                    <p className="text-xl font-black text-blue-700">
                                        -{results.paidTax.toLocaleString()}원
                                    </p>
                                </div>
                                <div className="border-t-4 border-black pt-3 bg-white border-brutal shadow-brutal p-4">
                                    <p className="text-sm font-bold mb-1 flex items-center gap-2">
                                        환급 예상액
                                        <span className="inline-block animate-bounce text-xl">🎉</span>
                                    </p>
                                    <p className="text-3xl font-black text-[#FF6B35]">
                                        {results.refundAmount.toLocaleString()}원
                                    </p>
                                    <Badge className="mt-2 bg-green-500 text-white font-bold border-2 border-black">
                                        ▲ 전년 대비 +12.3%
                                    </Badge>
                                </div>
                            </div>
                        </Card>

                        <Button className="w-full bg-black text-white text-xl font-black py-6 border-brutal shadow-brutal hover-brutal">
                            📄 PDF 리포트 다운로드
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
