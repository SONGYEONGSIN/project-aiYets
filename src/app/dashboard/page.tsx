'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, Lightbulb, Bell } from 'lucide-react';

export default function DashboardPage() {
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
                    {/* Tax Summary Card */}
                    <Card className="bg-white border-brutal shadow-brutal-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">📊 2026년 예상 결과</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-muted-foreground font-semibold mb-2">총 급여</p>
                                <p className="text-3xl font-black">68,187,336원</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground font-semibold mb-2">총 공제액</p>
                                <p className="text-3xl font-black">15,230,726원</p>
                            </div>
                            <div className="bg-[#F7CB15] border-brutal shadow-brutal p-4">
                                <p className="font-bold mb-2 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    환급 예상액
                                </p>
                                <p className="text-4xl font-black">956,610원</p>
                                <p className="text-sm font-bold mt-1 text-green-700">
                                    ▲ 지난해 대비 +12.3%
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* AI Analysis Card */}
                    <Card className="bg-white border-brutal shadow-brutal-lg p-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Lightbulb className="w-7 h-7" />
                            🤖 AI 실시간 분석
                        </h2>
                        <div className="space-y-4">
                            {/* High Priority Tip */}
                            <div className="bg-[#FF6B35] border-brutal shadow-brutal p-6">
                                <div className="flex items-start gap-3">
                                    <Badge className="bg-red-600 text-white font-bold border-2 border-black px-3 py-1">
                                        🔴 HIGH
                                    </Badge>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg mb-2">
                                            신용카드를 30만원 더 사용하면 15만원 추가 절세 가능
                                        </h4>
                                        <p className="text-sm font-semibold opacity-90 mb-3">
                                            현재 신용카드 사용액이 총급여의 23%입니다. 25%까지 사용하시면 공제율이 증가합니다.
                                        </p>
                                        <button className="bg-black text-white px-4 py-2 font-bold border-2 border-black shadow-brutal-sm hover-brutal text-sm">
                                            자세히 보기 →
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Medium Priority Tip */}
                            <div className="bg-[#00D9FF] border-brutal shadow-brutal p-6">
                                <div className="flex items-start gap-3">
                                    <Badge className="bg-yellow-500 text-black font-bold border-2 border-black px-3 py-1">
                                        🟡 MEDIUM
                                    </Badge>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg mb-2">
                                            퇴직연금 300만원 납입 시 45만원 세액공제 받을 수 있음
                                        </h4>
                                        <p className="text-sm font-semibold opacity-90 mb-3">
                                            퇴직연금(IRP) 계좌에 300만원을 납입하면 최대 15% 세액공제를 받을 수 있습니다.
                                        </p>
                                        <button className="bg-black text-white px-4 py-2 font-bold border-2 border-black shadow-brutal-sm hover-brutal text-sm">
                                            자세히 보기 →
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Low Priority Tip */}
                            <div className="bg-white border-brutal shadow-brutal p-6">
                                <div className="flex items-start gap-3">
                                    <Badge className="bg-green-500 text-white font-bold border-2 border-black px-3 py-1">
                                        🟢 LOW
                                    </Badge>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg mb-2">
                                            기부금 10만원으로 9만원 공제 가능
                                        </h4>
                                        <p className="text-sm font-semibold text-muted-foreground mb-3">
                                            정치자금 기부금은 10만원까지 100% 세액공제됩니다.
                                        </p>
                                        <button className="bg-black text-white px-4 py-2 font-bold border-2 border-black shadow-brutal-sm hover-brutal text-sm">
                                            자세히 보기 →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* 2026 Changes Card */}
                    <Card className="bg-[#F7CB15] border-brutal shadow-brutal-lg p-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Bell className="w-7 h-7" />
                            🔔 2026년 변경사항
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-white border-brutal shadow-brutal-sm p-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-[#FF6B35] p-2 border-2 border-black flex-shrink-0">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">📌 결혼세액공제 신설 (50만원)</h4>
                                        <p className="text-sm font-semibold text-muted-foreground mt-1">
                                            2026년 혼인신고자는 최대 50만원 세액공제 가능
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border-brutal shadow-brutal-sm p-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-[#00D9FF] p-2 border-2 border-black flex-shrink-0">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">📌 주택마련저축 한도 상향 (300만원)</h4>
                                        <p className="text-sm font-semibold text-muted-foreground mt-1">
                                            주택청약종합저축 공제한도 240만원 → 300만원 증가
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border-brutal shadow-brutal-sm p-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-white p-2 border-2 border-black flex-shrink-0">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">📌 ISA 연금계좌 세액공제 추가</h4>
                                        <p className="text-sm font-semibold text-muted-foreground mt-1">
                                            ISA 만기 후 연금계좌 전환 시 추가 공제 혜택
                                        </p>
                                    </div>
                                </div>
                            </div>
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
        </div>
    );
}
