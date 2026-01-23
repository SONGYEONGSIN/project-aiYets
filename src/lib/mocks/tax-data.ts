export interface TaxCalculationResult {
    totalSalary: number;
    incomeDeduction: number;
    taxableIncome: number;
    personalDeductions: number;
    specialDeductions: number;
    otherDeductions: number;
    totalDeductions: number;
    taxBase: number;
    calculatedTax: number;
    totalCredits: number;
    finalTax: number;
    prepaidTax: number;
    refundAmount: number;
    localIncomeTax: number;
    totalRefund: number;
}

export const MOCK_CALCULATION: TaxCalculationResult = {
    totalSalary: 50000000,
    incomeDeduction: 12500000, // Roughly calculated based on generic KR brackets
    taxableIncome: 37500000,
    personalDeductions: 1500000, // Self
    specialDeductions: 3000000, // Health insurance, housing, etc.
    otherDeductions: 2500000, // Credit card
    totalDeductions: 7000000,
    taxBase: 30500000,
    calculatedTax: 3960000, // Approx 15% bracket
    totalCredits: 500000,
    finalTax: 3460000,
    prepaidTax: 4200000,
    refundAmount: 740000, // 4200000 - 3460000
    localIncomeTax: 74000, // 10% of refund
    totalRefund: 814000,
};

export const MOCK_CHART_DATA = [
    { name: '1월', refunds: 4000 },
    { name: '2월', refunds: 3000 },
    { name: '3월', refunds: 2000 },
    { name: '4월', refunds: 2780 },
    { name: '5월', refunds: 1890 },
    { name: '6월', refunds: 2390 },
    { name: '7월', refunds: 3490 },
    { name: '8월', refunds: 3000 },
    { name: '9월', refunds: 2000 },
    { name: '10월', refunds: 2780 },
    { name: '11월', refunds: 1890 },
    { name: '12월', refunds: 3490 },
];
