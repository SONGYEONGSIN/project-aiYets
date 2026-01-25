'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { TrendingUp, Target, ChevronRight, Info, CheckCircle2, Lightbulb } from 'lucide-react';
import FloatingNewsWidget from '@/components/FloatingNewsWidget';

// 공제 항목 데이터 타입
interface DeductionItem {
    name: string;
    amount: number;
    maxLimit: number;
    category: '소득공제' | '세액공제';
    description: string;
    tip: string;
}

// 샘플 데이터 (실제로는 계산기에서 가져와야 함)
const deductionData: DeductionItem[] = [
    { name: '신용카드 등 사용금액', amount: 2500000, maxLimit: 3000000, category: '소득공제', description: '신용카드, 체크카드, 현금영수증 사용액에 대한 공제', tip: '총급여의 25% 초과분부터 공제 적용' },
    { name: '보험료', amount: 1000000, maxLimit: 1000000, category: '소득공제', description: '건강보험, 고용보험, 보장성보험료 공제', tip: '보장성보험료는 연 100만원 한도' },
    { name: '의료비', amount: 800000, maxLimit: 7000000, category: '세액공제', description: '본인 및 부양가족 의료비 지출액', tip: '총급여 3% 초과분부터 15% 공제' },
    { name: '교육비', amount: 1500000, maxLimit: 3000000, category: '세액공제', description: '본인 및 자녀 교육비 지출', tip: '대학생 자녀는 연 900만원 한도' },
    { name: '연금저축', amount: 4000000, maxLimit: 6000000, category: '세액공제', description: '연금저축계좌 납입액', tip: '퇴직연금(IRP) 포함 연 900만원 한도' },
    { name: '기부금', amount: 500000, maxLimit: 2000000, category: '세액공제', description: '법정기부금, 정치자금, 종교단체 등', tip: '정치자금 10만원까지는 100% 세액공제' },
    { name: '주택자금', amount: 2400000, maxLimit: 3000000, category: '소득공제', description: '주택청약저축, 주택임차차입금 등', tip: '2026년부터 청약저축 한도 300만원으로 상향' },
    { name: '월세 세액공제', amount: 750000, maxLimit: 1125000, category: '세액공제', description: '무주택 세대주의 월세 지출', tip: '총급여 8,000만원 이하 시 17% 공제율' },
];

export default function DashboardPage() {
    const [refundGoal, setRefundGoal] = useState<number>(1000000);
    const [isGoalSaved, setIsGoalSaved] = useState(false);

    // 샘플 데이터
    const totalSalary = 68187336;
    const totalDeduction = 15230726;
    const expectedRefund = 956610;
    const incomeTax = 4850000;
    const localTax = 485000;

    // 목표 달성률
    const goalProgress = Math.min((expectedRefund / refundGoal) * 100, 100);

    // 소득공제/세액공제 합계
    const incomeDeductionTotal = deductionData.filter(d => d.category === '소득공제').reduce((sum, d) => sum + d.amount, 0);
    const taxCreditTotal = deductionData.filter(d => d.category === '세액공제').reduce((sum, d) => sum + d.amount, 0);

    const handleSaveGoal = () => {
        setIsGoalSaved(true);
        setTimeout(() => setIsGoalSaved(false), 2000);
    };

    const formatNumber = (num: number) => num.toLocaleString('ko-KR');

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black mb-8">대시보드</h1>

            <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="mb-8 bg-white border-brutal shadow-brutal p-2 gap-2">
                    <TabsTrigger
                        value="dashboard"
                        className="px-6 py-3 text-lg font-bold data-[state=active]:bg-[#F7CB15] data-[state=active]:shadow-brutal-sm"
                    >
                        📊 대시보드
                    </TabsTrigger>
                    <TabsTrigger
                        value="calculator"
                        className="px-6 py-3 text-lg font-bold data-[state=active]:bg-[#00D9FF] data-[state=active]:shadow-brutal-sm"
                    >
                        🧮 계산기
                    </TabsTrigger>
                </TabsList>

                {/* Dashboard Tab */}
                <TabsContent value="dashboard" className="space-y-8">
                    {/* Tax Summary Card - Clean Design */}
                    <Card className="bg-white border-brutal shadow-brutal-lg p-8">
                        <h2 className="text-2xl font-bold mb-8">📊 2026년 예상 결과</h2>

                        {/* Main Stats Row */}
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="text-center p-6 bg-gray-50 border-2 border-black">
                                <p className="text-sm font-semibold text-muted-foreground mb-1">총 급여</p>
                                <p className="text-3xl font-black">{formatNumber(totalSalary)}<span className="text-lg">원</span></p>
                            </div>
                            <div className="text-center p-6 bg-gray-50 border-2 border-black">
                                <p className="text-sm font-semibold text-muted-foreground mb-1">총 공제액</p>
                                <p className="text-3xl font-black text-[#00D9FF]">{formatNumber(totalDeduction)}<span className="text-lg">원</span></p>
                            </div>
                            <div className="text-center p-6 bg-[#F7CB15] border-brutal shadow-brutal">
                                <p className="text-sm font-bold mb-1 flex items-center justify-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    환급 예상액
                                </p>
                                <p className="text-3xl font-black">{formatNumber(expectedRefund)}<span className="text-lg">원</span></p>
                                <p className="text-xs font-bold text-green-700 mt-1">▲ 전년 대비 +12.3%</p>
                            </div>
                        </div>

                        {/* Tax Calculation Flow */}
                        <div className="bg-gray-50 border-2 border-black p-6">
                            <h3 className="font-bold text-sm text-muted-foreground mb-4">세금 계산 흐름</h3>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="text-center flex-1">
                                    <p className="text-xs text-muted-foreground">과세표준</p>
                                    <p className="text-xl font-black">{formatNumber(totalSalary - totalDeduction)}원</p>
                                    <p className="text-xs text-muted-foreground">(세율 15% 구간)</p>
                                </div>
                                <div className="text-2xl font-black text-gray-300 hidden md:block">→</div>
                                <div className="text-center flex-1">
                                    <p className="text-xs text-muted-foreground">결정세액</p>
                                    <p className="text-xl font-black text-[#FF6B35]">{formatNumber(incomeTax + localTax)}원</p>
                                </div>
                                <div className="text-2xl font-black text-gray-300 hidden md:block">−</div>
                                <div className="text-center flex-1">
                                    <p className="text-xs text-muted-foreground">기납부세액</p>
                                    <p className="text-xl font-black text-[#00D9FF]">{formatNumber(incomeTax + localTax + expectedRefund)}원</p>
                                </div>
                                <div className="text-2xl font-black text-gray-300 hidden md:block">=</div>
                                <div className="text-center flex-1 bg-green-100 border-2 border-green-500 p-3 -m-3">
                                    <p className="text-xs text-green-700 font-semibold">차감징수세액</p>
                                    <p className="text-xl font-black text-green-700">−{formatNumber(expectedRefund)}원</p>
                                    <p className="text-xs font-bold text-green-600">(환급)</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* NEW: Refund Goal Setting */}
                    <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-brutal shadow-brutal-lg p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <Target className="w-6 h-6" />
                            <h3 className="text-xl font-bold">🎯 환급액 목표 설정</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 opacity-90">나의 환급 목표액</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        value={formatNumber(refundGoal)}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/,/g, '').replace(/[^0-9]/g, '');
                                            setRefundGoal(parseInt(value) || 0);
                                        }}
                                        className="bg-white/20 border-2 border-white/50 text-white placeholder:text-white/60 font-bold flex-1"
                                        placeholder="목표 금액 입력"
                                    />
                                    <button
                                        onClick={handleSaveGoal}
                                        className="bg-white text-purple-600 px-6 py-2 font-bold border-2 border-white hover:bg-white/90 transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                                    >
                                        {isGoalSaved && <CheckCircle2 className="w-4 h-4" />}
                                        {isGoalSaved ? '저장됨' : '저장'}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm font-semibold mb-2">
                                    <span>목표 달성률</span>
                                    <span>{goalProgress.toFixed(1)}%</span>
                                </div>
                                <div className="bg-white/20 rounded-full h-6 border-2 border-white/50 overflow-hidden">
                                    <div
                                        className="h-full bg-white transition-all duration-500 flex items-center justify-end pr-2"
                                        style={{ width: `${goalProgress}%` }}
                                    >
                                        {goalProgress >= 20 && <span className="text-xs font-bold text-purple-600">{formatNumber(expectedRefund)}원</span>}
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs mt-1 opacity-80">
                                    <span>0원</span>
                                    <span>목표: {formatNumber(refundGoal)}원</span>
                                </div>
                            </div>
                        </div>
                        {goalProgress >= 100 ? (
                            <div className="mt-4 bg-white/20 border-2 border-white/50 p-3 rounded-lg flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-bold">🎉 축하합니다! 목표를 달성했습니다!</span>
                            </div>
                        ) : (
                            <div className="mt-4 bg-white/20 border-2 border-white/50 p-3 rounded-lg">
                                <span className="font-semibold">💡 목표까지 {formatNumber(refundGoal - expectedRefund)}원 남았습니다. AI 분석 팁을 확인해보세요!</span>
                            </div>
                        )}
                    </Card>

                    {/* AI Real-time Analysis - Deduction Breakdown Table with Progress Bars */}
                    <Card className="bg-white border-brutal shadow-brutal-lg p-8">
                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            🤖 AI 실시간 분석
                        </h2>
                        <p className="text-muted-foreground mb-6">AI가 분석한 공제 항목별 활용 현황입니다. 각 항목을 클릭하면 상세 설명을 볼 수 있습니다</p>

                        {/* 요약 */}
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-[#00D9FF]/20 border-2 border-[#00D9FF] p-4 rounded-lg">
                                <p className="text-sm font-semibold text-muted-foreground">소득공제 합계</p>
                                <p className="text-2xl font-black">{formatNumber(incomeDeductionTotal)}원</p>
                            </div>
                            <div className="bg-[#FF6B35]/20 border-2 border-[#FF6B35] p-4 rounded-lg">
                                <p className="text-sm font-semibold text-muted-foreground">세액공제 합계</p>
                                <p className="text-2xl font-black">{formatNumber(taxCreditTotal)}원</p>
                            </div>
                        </div>

                        {/* 테이블 */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-4 border-black">
                                        <th className="text-left py-3 px-2 font-bold">공제 항목</th>
                                        <th className="text-left py-3 px-2 font-bold">구분</th>
                                        <th className="text-right py-3 px-2 font-bold">공제 금액</th>
                                        <th className="text-right py-3 px-2 font-bold hidden md:table-cell">한도</th>
                                        <th className="py-3 px-2 font-bold w-40 hidden lg:table-cell">활용률</th>
                                        <th className="py-3 px-2 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deductionData.map((item, index) => {
                                        const utilizationRate = (item.amount / item.maxLimit) * 100;
                                        return (
                                            <Dialog key={index}>
                                                <DialogTrigger asChild>
                                                    <tr className="border-b-2 border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                                                        <td className="py-4 px-2">
                                                            <span className="font-semibold">{item.name}</span>
                                                        </td>
                                                        <td className="py-4 px-2">
                                                            <Badge
                                                                className={`font-bold border-2 border-black ${item.category === '소득공제'
                                                                    ? 'bg-[#00D9FF] text-black'
                                                                    : 'bg-[#FF6B35] text-white'
                                                                    }`}
                                                            >
                                                                {item.category}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-4 px-2 text-right font-bold">
                                                            {formatNumber(item.amount)}원
                                                        </td>
                                                        <td className="py-4 px-2 text-right text-muted-foreground hidden md:table-cell">
                                                            {formatNumber(item.maxLimit)}원
                                                        </td>
                                                        <td className="py-4 px-2 hidden lg:table-cell">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex-1 bg-gray-200 rounded-full h-3 border border-black overflow-hidden">
                                                                    <div
                                                                        className={`h-full transition-all ${utilizationRate >= 80 ? 'bg-green-500' :
                                                                            utilizationRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                                            }`}
                                                                        style={{ width: `${Math.min(utilizationRate, 100)}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-sm font-bold w-12">{utilizationRate.toFixed(0)}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-2">
                                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                                        </td>
                                                    </tr>
                                                </DialogTrigger>
                                                <DialogContent className="border-brutal shadow-brutal-lg">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                                            <Info className="w-5 h-5" />
                                                            {item.name}
                                                        </DialogTitle>
                                                        <DialogDescription className="text-base">
                                                            {item.description}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 pt-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="bg-gray-100 p-4 rounded-lg border-2 border-black">
                                                                <p className="text-sm text-muted-foreground font-semibold">현재 공제액</p>
                                                                <p className="text-2xl font-black">{formatNumber(item.amount)}원</p>
                                                            </div>
                                                            <div className="bg-gray-100 p-4 rounded-lg border-2 border-black">
                                                                <p className="text-sm text-muted-foreground font-semibold">공제 한도</p>
                                                                <p className="text-2xl font-black">{formatNumber(item.maxLimit)}원</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between text-sm font-semibold mb-2">
                                                                <span>한도 활용률</span>
                                                                <span>{utilizationRate.toFixed(1)}%</span>
                                                            </div>
                                                            <Progress
                                                                value={Math.min(utilizationRate, 100)}
                                                                className="h-4 border-2 border-black"
                                                            />
                                                        </div>
                                                        <div className="bg-[#F7CB15] border-2 border-black p-4 rounded-lg">
                                                            <p className="font-bold flex items-center gap-2 mb-1">
                                                                <Lightbulb className="w-4 h-4" />
                                                                절세 TIP
                                                            </p>
                                                            <p className="text-sm font-semibold">{item.tip}</p>
                                                        </div>
                                                        {utilizationRate < 100 && (
                                                            <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg">
                                                                <p className="font-bold text-green-700">
                                                                    💰 추가 공제 가능: {formatNumber(item.maxLimit - item.amount)}원
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>

                {/* Calculator Tab */}
                <TabsContent value="calculator">
                    <Card className="bg-white border-brutal shadow-brutal-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">🧮 연말정산 계산기</h2>
                        <p className="text-lg font-semibold text-muted-foreground mb-6">
                            계산기 페이지는 곧 추가될 예정입니다. 계산기 전용 페이지로 이동하세요.
                        </p>
                        <a
                            href="/calculator"
                            className="inline-block bg-black text-white px-8 py-4 text-lg font-bold border-brutal shadow-brutal hover-brutal"
                        >
                            계산기로 이동 →
                        </a>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Floating News Widget */}
            <FloatingNewsWidget />
        </div>
    );
}
