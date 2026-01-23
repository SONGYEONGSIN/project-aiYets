'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  FileSpreadsheet,
  Camera,
  CreditCard,
  Save,
  RefreshCw,
  Calendar,
  DollarSign,
  Heart,
  Building2,
  GraduationCap,
  Bus,
  Landmark,
  CheckCircle,
} from 'lucide-react';

// Mock data for demonstration
const mockMonthlyData = {
  salary: {
    total: 5682278,
    nonTaxable: 100000,
    nationalPension: 225852,
    healthInsurance: 201520,
    employmentInsurance: 51140,
  },
  cards: {
    credit: 1234567,
    debit: 456789,
    traditionalMarket: 50000,
    publicTransport: 80000,
  },
};

export default function AdminPage() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date().toLocaleTimeString('ko-KR'));
    }, 1000);
  };

  const handleFileUpload = (type: 'excel' | 'image') => {
    alert(`${type === 'excel' ? '엑셀' : '이미지'} 파일 업로드 기능은 곧 추가될 예정입니다!`);
  };

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
  const FormattedInput = ({ defaultValue, placeholder, ...props }: { defaultValue?: number; placeholder?: string;[key: string]: any }) => {
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black">관리자 페이지</h1>
          <p className="text-lg font-semibold text-muted-foreground mt-2">
            급여 및 지출 데이터를 관리하세요
          </p>
        </div>

        {lastSaved && (
          <Badge className="bg-green-500 text-white font-bold border-2 border-black px-4 py-2">
            <CheckCircle className="w-4 h-4 mr-2" />
            마지막 저장: {lastSaved}
          </Badge>
        )}
      </div>

      {/* Year/Month Selector */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <div className="flex items-center gap-2 bg-white border-brutal shadow-brutal px-4 h-12">
          <Calendar className="w-5 h-5" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-lg font-bold bg-transparent border-none outline-none cursor-pointer"
          >
            <option value="2025">2025년</option>
            <option value="2024">2024년</option>
            <option value="2023">2023년</option>
          </select>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedMonth('all')}
            className={`px-4 h-12 font-bold border-brutal shadow-brutal-sm hover-brutal ${selectedMonth === 'all'
              ? 'bg-[#FF6B35] text-white'
              : 'bg-white'
              }`}
          >
            전체
          </button>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(String(month))}
              className={`w-12 h-12 font-bold border-brutal shadow-brutal-sm hover-brutal ${selectedMonth === String(month)
                ? 'bg-[#F7CB15]'
                : 'bg-white'
                }`}
            >
              {month}월
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="salary" className="w-full">
        <TabsList className="mb-6 bg-white border-brutal shadow-brutal p-2 gap-2 flex-wrap w-full justify-start">
          <TabsTrigger
            value="salary"
            className="px-4 py-2 font-bold data-[state=active]:bg-[#F7CB15] data-[state=active]:shadow-brutal-sm"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            급여
          </TabsTrigger>
          <TabsTrigger
            value="personal"
            className="px-4 py-2 font-bold data-[state=active]:bg-[#00D9FF] data-[state=active]:shadow-brutal-sm"
          >
            👨‍👩‍👧‍👦 인적공제
          </TabsTrigger>
          <TabsTrigger
            value="cards"
            className="px-4 py-2 font-bold data-[state=active]:bg-[#FF6B35] data-[state=active]:shadow-brutal-sm"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            카드·현금
          </TabsTrigger>
          <TabsTrigger
            value="insurance"
            className="px-4 py-2 font-bold data-[state=active]:bg-[#F7CB15] data-[state=active]:shadow-brutal-sm"
          >
            <Heart className="w-4 h-4 mr-2" />
            보험·연금
          </TabsTrigger>
          <TabsTrigger
            value="medical"
            className="px-4 py-2 font-bold data-[state=active]:bg-[#00D9FF] data-[state=active]:shadow-brutal-sm"
          >
            🏥 의료비
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className="px-4 py-2 font-bold data-[state=active]:bg-[#FF6B35] data-[state=active]:shadow-brutal-sm"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            교육비
          </TabsTrigger>
          <TabsTrigger
            value="donation"
            className="px-4 py-2 font-bold data-[state=active]:bg-[#F7CB15] data-[state=active]:shadow-brutal-sm"
          >
            ❤️ 기부금
          </TabsTrigger>
          <TabsTrigger
            value="housing"
            className="px-4 py-2 font-bold data-[state=active]:bg-[#00D9FF] data-[state=active]:shadow-brutal-sm"
          >
            <Building2 className="w-4 h-4 mr-2" />
            주택
          </TabsTrigger>
        </TabsList>

        {/* Upload Buttons - Outside card, right aligned */}
        <div className="flex justify-end gap-2 flex-wrap mb-4">
          <Button
            onClick={() => handleFileUpload('excel')}
            className="bg-[#00D9FF] text-black font-bold border-brutal shadow-brutal hover:bg-[#00D9FF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none px-4 py-2 h-10"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            엑셀
          </Button>
          <Button
            onClick={() => handleFileUpload('image')}
            className="bg-[#FF6B35] text-black font-bold border-brutal shadow-brutal hover:bg-[#FF6B35] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none px-4 py-2 h-10"
          >
            <Camera className="w-4 h-4 mr-2" />
            사진
          </Button>
          <Button
            disabled
            className="bg-gray-200 text-gray-500 font-bold border-brutal shadow-brutal-sm px-4 py-2 h-10 cursor-not-allowed"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            카드사 연동
          </Button>
        </div>

        {/* Salary Tab */}
        <TabsContent value="salary">
          <Card className="bg-white border-brutal shadow-brutal-lg p-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              <DollarSign className="w-7 h-7" />
              💰 급여 정보
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-bold mb-2 block">총 급여 (원)</Label>
                <FormattedInput defaultValue={mockMonthlyData.salary.total} />
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">비과세 소득 (원)</Label>
                <FormattedInput defaultValue={mockMonthlyData.salary.nonTaxable} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 식대, 자가운전보조금 등
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">국민연금 (원)</Label>
                <FormattedInput defaultValue={mockMonthlyData.salary.nationalPension} />
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">건강보험료 (원)</Label>
                <FormattedInput defaultValue={mockMonthlyData.salary.healthInsurance} />
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">고용보험료 (원)</Label>
                <FormattedInput defaultValue={mockMonthlyData.salary.employmentInsurance} />
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">노인장기요양보험료 (원)</Label>
                <FormattedInput defaultValue={26060} />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Personal Deduction Tab */}
        <TabsContent value="personal">
          <Card className="bg-white border-brutal shadow-brutal-lg p-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              👨‍👩‍👧‍👦 인적공제
            </h3>

            {/* 본인 및 배우자 */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label className="text-base font-bold mb-2 block">본인</Label>
                <div className="relative">
                  <FormattedInput defaultValue={1500000} disabled />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">원</span>
                </div>
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
            <div className="border-t-4 border-black pt-6">
              <h4 className="text-lg font-black mb-4">부양가족공제</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-bold mb-2 block">직계존속 (인)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    defaultValue="0"
                    className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                  />
                  <p className="text-sm text-muted-foreground font-semibold mt-1">
                    💡 부,모,장인,장모,시부,시모,조부,조모 / 만60세이상, '64.12.31 이전 출생
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
                    💡 만20세이하, '04.1.1 이후 출생
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
                    💡 동생,처남,처제 포함 / 만20세 이하 또는 만60세 이상
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
                    💡 해당연도 6개월 이상 위탁양육, '2004.1.1 이후 출생
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
                    💡 국민기초생활보장법에 의한 수급자 (배우자, 부양가족이 아닌 사람)
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards">
          <Card className="bg-white border-brutal shadow-brutal-lg p-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              <CreditCard className="w-7 h-7" />
              💳 카드·현금 사용액
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-bold mb-2 block">신용카드 (원)</Label>
                <FormattedInput defaultValue={mockMonthlyData.cards.credit} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 15% 공제율 적용
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">체크카드 (원)</Label>
                <FormattedInput defaultValue={mockMonthlyData.cards.debit} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 30% 공제율 적용
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">현금영수증 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 30% 공제율 적용
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">전통시장 (원)</Label>
                <FormattedInput defaultValue={mockMonthlyData.cards.traditionalMarket} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 40% 공제율 적용
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">대중교통 (원)</Label>
                <FormattedInput defaultValue={mockMonthlyData.cards.publicTransport} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 40% 공제율 적용
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">문화체육 (도서·공연·체육시설 등) (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 30% 공제율 적용 (연 100만원 한도)
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Insurance Tab */}
        <TabsContent value="insurance">
          <Card className="bg-white border-brutal shadow-brutal-lg p-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              <Heart className="w-7 h-7" />
              🏥 보험·연금 정보
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-bold mb-2 block">보장성 보험료 (원)</Label>
                <FormattedInput placeholder="연간 납입액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 연 100만원 한도, 12% 공제
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">연금저축 (원)</Label>
                <FormattedInput placeholder="연간 납입액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 연 400만원 한도, 16.5% 공제
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">퇴직연금(IRP) (원)</Label>
                <FormattedInput placeholder="연간 납입액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 연금저축 합산 700만원 한도
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">ISA 추가 납입액 (원)</Label>
                <FormattedInput placeholder="연간 납입액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 연 2,000만원 한도, 비과세 혜택
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Housing Tab */}
        <TabsContent value="housing">
          <Card className="bg-white border-brutal shadow-brutal-lg p-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              <Building2 className="w-7 h-7" />
              🏠 주택 관련 지출
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-bold mb-2 block">주택청약저축 (원)</Label>
                <FormattedInput placeholder="연간 납입액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 연 300만원 한도, 40% 공제
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">월세 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 연 750만원 한도, 12% 공제
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">주택임차차입금원리금상환액 (원)</Label>
                <FormattedInput placeholder="연간 상환액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 연 400만원 한도, 40% 공제
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">장기주택저당차입금 이자상환액 (원)</Label>
                <FormattedInput placeholder="연간 이자상환액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 상환기간에 따라 300~1,800만원 한도
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education">
          <Card className="bg-white border-brutal shadow-brutal-lg p-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              <GraduationCap className="w-7 h-7" />
              📚 교육비
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-bold mb-2 block">본인 교육비 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 한도 없음, 15% 공제
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">자녀 교육비 - 유치원 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 1인당 연 300만원 한도
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">자녀 교육비 - 초중고 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 1인당 연 300만원 한도
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">자녀 교육비 - 대학 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 1인당 연 900만원 한도
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Medical Tab */}
        <TabsContent value="medical">
          <Card className="bg-white border-brutal shadow-brutal-lg p-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              🏥 의료비
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-bold mb-2 block">본인 의료비 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 한도 없음, 15% 공제
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">65세 이상 부양가족 의료비 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 한도 없음, 15% 공제
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">장애인 의료비 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 한도 없음, 15% 공제
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">그 외 부양가족 의료비 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 연 700만원 한도, 15% 공제
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">난임 시술비 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 한도 없음, 30% 공제
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">미숙아·선천성이상아 의료비 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 한도 없음, 20% 공제
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Donation Tab */}
        <TabsContent value="donation">
          <Card className="bg-white border-brutal shadow-brutal-lg p-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              ❤️ 기부금
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-bold mb-2 block">정치자금 기부금 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 10만원까지 100%, 초과분 15%~25%
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">법정 기부금 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 소득 100% 한도, 15%~25% 공제
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">우리사주조합 기부금 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 소득 30% 한도
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">지정 기부금 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 소득 30% 한도, 15%~25% 공제
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">종교단체 기부금 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 소득 10% 한도, 15%~25% 공제
                </p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">고향사랑 기부금 (원)</Label>
                <FormattedInput placeholder="연간 지출액" />
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  💡 10만원까지 100%, 초과분 16.5% (연 500만원 한도)
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 bg-black text-white text-xl font-black py-6 border-brutal shadow-brutal hover-brutal disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-6 h-6 mr-2 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="w-6 h-6 mr-2" />
              저장하기
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="border-brutal shadow-brutal text-lg font-bold py-6 px-8 hover-brutal"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          초기화
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="bg-[#F7CB15] border-brutal shadow-brutal-lg p-6 mt-8">
        <h3 className="text-2xl font-black mb-4">📊 요약</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white border-brutal shadow-brutal-sm p-4">
            <p className="text-sm font-bold text-muted-foreground">총 급여</p>
            <p className="text-2xl font-black">{mockMonthlyData.salary.total.toLocaleString()}원</p>
          </div>
          <div className="bg-white border-brutal shadow-brutal-sm p-4">
            <p className="text-sm font-bold text-muted-foreground">카드 사용액</p>
            <p className="text-2xl font-black">
              {(mockMonthlyData.cards.credit + mockMonthlyData.cards.debit).toLocaleString()}원
            </p>
          </div>
          <div className="bg-white border-brutal shadow-brutal-sm p-4">
            <p className="text-sm font-bold text-muted-foreground">4대 보험</p>
            <p className="text-2xl font-black">
              {(
                mockMonthlyData.salary.nationalPension +
                mockMonthlyData.salary.healthInsurance +
                mockMonthlyData.salary.employmentInsurance
              ).toLocaleString()}원
            </p>
          </div>
          <div className="bg-white border-brutal shadow-brutal-sm p-4">
            <p className="text-sm font-bold text-muted-foreground">데이터 상태</p>
            <Badge className="bg-green-500 text-white font-bold border-2 border-black mt-2">
              ✓ 입력 완료
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
