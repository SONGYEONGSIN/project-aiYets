'use client';

import { useState, useRef, useEffect } from 'react';
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
  X,
} from 'lucide-react';

// 데이터 타입 정의
interface AdminData {
  salary: {
    annualSalary: number;
    mealAllowance: number;
    childcareChildren: number;
    paidTax: number;
  };
  socialInsurance: {
    nationalPension: number;
    healthInsurance: number;
    employmentInsurance: number;
    longTermCare: number;
  };
  cards: {
    credit: number;
    debit: number;
    cash: number;
    traditionalMarket: number;
    publicTransport: number;
    culture: number;
  };
  eduMedical: {
    selfEducation: number;
    childPreschool: number;
    childSchool: number;
    childUniversity: number;
    infertility: number;
    prematureChild: number;
    selfMedical: number;
    familyMedical: number;
    insuranceRefund: number;
  };
  donation: {
    political: number;
    hometown: number;
    hometownDisaster: number;
    special: number;
    employee: number;
    designated: number;
    religious: number;
  };
  insurance: {
    protection: number;
    pension: number;
    irp: number;
    isa: number;
  };
  housing: {
    housingSavings: number;
    rent: number;
    leaseLoan: number;
    mortgageInterest: number;
  };
}

// 기본 데이터
const getDefaultData = (): AdminData => ({
  salary: { annualSalary: 0, mealAllowance: 0, childcareChildren: 0, paidTax: 0 },
  socialInsurance: { nationalPension: 0, healthInsurance: 0, employmentInsurance: 0, longTermCare: 0 },
  cards: { credit: 0, debit: 0, cash: 0, traditionalMarket: 0, publicTransport: 0, culture: 0 },
  eduMedical: { selfEducation: 0, childPreschool: 0, childSchool: 0, childUniversity: 0, infertility: 0, prematureChild: 0, selfMedical: 0, familyMedical: 0, insuranceRefund: 0 },
  donation: { political: 0, hometown: 0, hometownDisaster: 0, special: 0, employee: 0, designated: 0, religious: 0 },
  insurance: { protection: 0, pension: 0, irp: 0, isa: 0 },
  housing: { housingSavings: 0, rent: 0, leaseLoan: 0, mortgageInterest: 0 },
});

// localStorage 키 생성
const getStorageKey = (year: string, month: string) => `admin_data_${year}_${month}`;

// Format number with thousand separators
const formatNumber = (value: number | string): string => {
  const num = typeof value === 'string' ? parseInt(value.replace(/,/g, ''), 10) : value;
  if (isNaN(num) || num === 0) return '';
  return num.toLocaleString('ko-KR');
};

// Formatted Number Input Component (외부 정의)
const FormattedInput = ({
  value,
  onChange,
  placeholder = "0",
}: {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    onChange(parseInt(rawValue, 10) || 0);
  };

  return (
    <Input
      type="text"
      value={formatNumber(value)}
      onChange={handleChange}
      placeholder={placeholder}
      className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
    />
  );
};

export default function AdminPage() {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ type: string; name: string; size: string }[]>([]);
  const [adminData, setAdminData] = useState<AdminData>(getDefaultData());
  const [isClient, setIsClient] = useState(false);

  const excelInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // 클라이언트 마운트 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 연/월 변경 시 데이터 불러오기
  useEffect(() => {
    if (!isClient) return;
    const key = getStorageKey(selectedYear, selectedMonth);
    const savedData = localStorage.getItem(key);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const defaults = getDefaultData();
        // 새 스키마와 병합 (누락된 필드는 기본값 사용)
        const merged: AdminData = {
          salary: { ...defaults.salary, ...parsed.salary },
          socialInsurance: { ...defaults.socialInsurance, ...parsed.socialInsurance },
          cards: { ...defaults.cards, ...parsed.cards },
          eduMedical: { ...defaults.eduMedical, ...parsed.eduMedical },
          donation: { ...defaults.donation, ...parsed.donation },
          insurance: { ...defaults.insurance, ...parsed.insurance },
          housing: { ...defaults.housing, ...parsed.housing },
        };
        setAdminData(merged);
      } catch {
        setAdminData(getDefaultData());
      }
    } else {
      setAdminData(getDefaultData());
    }
  }, [selectedYear, selectedMonth, isClient]);

  // 데이터 저장
  const handleSave = () => {
    setIsSaving(true);
    const key = getStorageKey(selectedYear, selectedMonth);
    localStorage.setItem(key, JSON.stringify(adminData));
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date().toLocaleString('ko-KR'));
    }, 500);
  };

  // 데이터 초기화
  const handleReset = () => {
    if (confirm(`${selectedYear}년 ${selectedMonth === 'all' ? '전체' : selectedMonth + '월'} 데이터를 초기화하시겠습니까?`)) {
      setAdminData(getDefaultData());
    }
  };

  // 데이터 업데이트 헬퍼
  const updateData = <K extends keyof AdminData>(
    category: K,
    field: keyof AdminData[K],
    value: number
  ) => {
    setAdminData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleFileUpload = (type: 'excel' | 'image') => {
    if (type === 'excel') {
      excelInputRef.current?.click();
    } else {
      imageInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const sizeInKB = (file.size / 1024).toFixed(1);
      setUploadedFiles(prev => [...prev, {
        type,
        name: file.name,
        size: `${sizeInKB} KB`
      }]);
      alert(`${type === 'excel' ? '엑셀' : '이미지'} 파일 "${file.name}"이(가) 업로드되었습니다!\n\n실제 파싱 기능은 추후 구현 예정입니다.`);
    }
    e.target.value = '';
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 요약 계산
  const summary = {
    totalSalary: adminData.salary.annualSalary,
    totalCards: adminData.cards.credit + adminData.cards.debit + adminData.cards.cash +
      adminData.cards.traditionalMarket + adminData.cards.publicTransport + adminData.cards.culture,
    totalInsurance: adminData.socialInsurance.nationalPension + adminData.socialInsurance.healthInsurance +
      adminData.socialInsurance.employmentInsurance + adminData.socialInsurance.longTermCare,
    totalEduMedical: adminData.eduMedical.selfEducation + adminData.eduMedical.childPreschool +
      adminData.eduMedical.childSchool + adminData.eduMedical.childUniversity +
      adminData.eduMedical.infertility + adminData.eduMedical.prematureChild +
      adminData.eduMedical.selfMedical + adminData.eduMedical.familyMedical,
    totalDonation: adminData.donation.political + adminData.donation.hometown +
      adminData.donation.hometownDisaster + adminData.donation.special +
      adminData.donation.employee + adminData.donation.designated + adminData.donation.religious,
    totalPension: adminData.insurance.protection + adminData.insurance.pension +
      adminData.insurance.irp + adminData.insurance.isa,
    totalHousing: adminData.housing.housingSavings + adminData.housing.rent +
      adminData.housing.leaseLoan + adminData.housing.mortgageInterest,
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
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="salary" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-2 bg-white border-brutal shadow-brutal p-4 mb-6">
          <TabsTrigger
            value="salary"
            className="px-4 py-2 font-bold data-[state=active]:bg-[#F7CB15] data-[state=active]:shadow-brutal-sm"
          >
            💰 급여
          </TabsTrigger>
          <TabsTrigger
            value="socialInsurance"
            className="px-4 py-2 font-bold data-[state=active]:bg-[#00D9FF] data-[state=active]:shadow-brutal-sm"
          >
            🏥 4대보험
          </TabsTrigger>
          <TabsTrigger
            value="cards"
            className="px-4 py-2 font-bold data-[state=active]:bg-[#FF6B35] data-[state=active]:shadow-brutal-sm"
          >
            💳 카드·현금
          </TabsTrigger>
          <TabsTrigger
            value="eduMedical"
            className="px-4 py-2 font-bold data-[state=active]:bg-[#F7CB15] data-[state=active]:shadow-brutal-sm"
          >
            📚 교육비·의료비
          </TabsTrigger>
          <TabsTrigger
            value="donation"
            className="px-4 py-2 font-bold data-[state=active]:bg-[#00D9FF] data-[state=active]:shadow-brutal-sm"
          >
            ❤️ 기부금
          </TabsTrigger>
          <TabsTrigger
            value="insurance"
            className="px-4 py-2 font-bold data-[state=active]:bg-[#FF6B35] data-[state=active]:shadow-brutal-sm"
          >
            🏦 보험·연금
          </TabsTrigger>
          <TabsTrigger
            value="housing"
            className="px-4 py-2 font-bold data-[state=active]:bg-[#F7CB15] data-[state=active]:shadow-brutal-sm"
          >
            🏠 주택자금
          </TabsTrigger>
        </TabsList>

        {/* Hidden File Inputs */}
        <input
          ref={excelInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'excel')}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'image')}
        />

        {/* Upload Buttons */}
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

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mb-4 p-4 bg-white border-brutal shadow-brutal">
            <h4 className="font-bold mb-2">📁 업로드된 파일</h4>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <Badge
                  key={index}
                  className={`px-3 py-2 text-sm font-bold border-2 border-black flex items-center gap-2 ${file.type === 'excel' ? 'bg-[#00D9FF]' : 'bg-[#FF6B35]'}`}
                >
                  {file.type === 'excel' ? <FileSpreadsheet className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                  {file.name} ({file.size})
                  <button onClick={() => removeUploadedFile(index)} className="ml-1 hover:bg-black/20 rounded p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Salary Tab */}
        <TabsContent value="salary">
          <Card className="bg-white border-brutal shadow-brutal-lg p-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">💰 급여 정보</h3>
            <div className="space-y-6">
              <div>
                <Label className="text-base font-bold mb-2 block">연봉 (원)</Label>
                <FormattedInput value={adminData.salary.annualSalary} onChange={(v) => updateData('salary', 'annualSalary', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 급여 + 상여</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-bold mb-2 block">비과세(식대) (원)</Label>
                  <FormattedInput value={adminData.salary.mealAllowance} onChange={(v) => updateData('salary', 'mealAllowance', v)} />
                  <p className="text-sm text-muted-foreground font-semibold mt-1">💡 월 20만원 한도 × 12개월 = 연 240만원</p>
                </div>
                <div>
                  <Label className="text-base font-bold mb-2 block">비과세(보육수당) 자녀 수 (인)</Label>
                  <Input type="number" min="0" value={adminData.salary.childcareChildren} onChange={(e) => updateData('salary', 'childcareChildren', parseInt(e.target.value) || 0)} className="border-brutal shadow-brutal-sm text-lg font-semibold h-12" />
                  <p className="text-sm text-muted-foreground font-semibold mt-1">💡 6세 이하 자녀 수 입력 (1인당 월 20만원 × 12개월)</p>
                </div>
              </div>
              <div className="border-t-4 border-orange-400 pt-4">
                <Label className="text-base font-bold mb-2 block">기납부세액 (원)</Label>
                <FormattedInput value={adminData.salary.paidTax} onChange={(v) => updateData('salary', 'paidTax', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 해당 연도 급여 자료 중 "소득세" 합산 금액</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Social Insurance Tab */}
        <TabsContent value="socialInsurance">
          <Card className="bg-white border-brutal shadow-brutal-lg p-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">🏥 국민연금·4대보험료 공제</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-bold mb-2 block">국민연금 (원)</Label>
                <FormattedInput value={adminData.socialInsurance.nationalPension} onChange={(v) => updateData('socialInsurance', 'nationalPension', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 전액 소득공제</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">건강보험료 (원)</Label>
                <FormattedInput value={adminData.socialInsurance.healthInsurance} onChange={(v) => updateData('socialInsurance', 'healthInsurance', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 본인 부담금 전액 공제</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">고용보험료 (원)</Label>
                <FormattedInput value={adminData.socialInsurance.employmentInsurance} onChange={(v) => updateData('socialInsurance', 'employmentInsurance', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 전액 소득공제</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">노인장기요양보험료 (원)</Label>
                <FormattedInput value={adminData.socialInsurance.longTermCare} onChange={(v) => updateData('socialInsurance', 'longTermCare', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 전액 소득공제</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards">
          <Card className="bg-white border-brutal shadow-brutal-lg p-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">💳 카드·현금 사용액</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-bold mb-2 block">신용카드 (원)</Label>
                <FormattedInput value={adminData.cards.credit} onChange={(v) => updateData('cards', 'credit', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 15% 공제율 적용</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">체크카드 (원)</Label>
                <FormattedInput value={adminData.cards.debit} onChange={(v) => updateData('cards', 'debit', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 30% 공제율 적용</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">현금영수증 (원)</Label>
                <FormattedInput value={adminData.cards.cash} onChange={(v) => updateData('cards', 'cash', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 30% 공제율 적용</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">전통시장 (원)</Label>
                <FormattedInput value={adminData.cards.traditionalMarket} onChange={(v) => updateData('cards', 'traditionalMarket', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 40% 공제율 적용</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">대중교통 (원)</Label>
                <FormattedInput value={adminData.cards.publicTransport} onChange={(v) => updateData('cards', 'publicTransport', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 40% 공제율 적용</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">문화체육 (도서·공연·체육시설 등) (원)</Label>
                <FormattedInput value={adminData.cards.culture} onChange={(v) => updateData('cards', 'culture', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 30% 공제율 적용 (연 100만원 한도)</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Insurance Tab */}
        <TabsContent value="insurance">
          <Card className="bg-white border-brutal shadow-brutal-lg p-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">🏦 보험·연금</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-bold mb-2 block">보장성 보험료 (원)</Label>
                <FormattedInput value={adminData.insurance.protection} onChange={(v) => updateData('insurance', 'protection', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 연 100만원 한도, 12% 세액공제</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">연금저축 (원)</Label>
                <FormattedInput value={adminData.insurance.pension} onChange={(v) => updateData('insurance', 'pension', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 최대 600만원 한도, 총급여 5,500만원 이하 15% / 초과 12%</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">퇴직연금(IRP) (원)</Label>
                <FormattedInput value={adminData.insurance.irp} onChange={(v) => updateData('insurance', 'irp', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 연금저축 합산 최대 900만원 한도</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">ISA 추가 납입액 (원)</Label>
                <FormattedInput value={adminData.insurance.isa} onChange={(v) => updateData('insurance', 'isa', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 3,000만원 한도, 10% 세액공제 (최대 300만원)</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Housing Tab */}
        <TabsContent value="housing">
          <Card className="bg-white border-brutal shadow-brutal-lg p-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">🏠 주택자금</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-bold mb-2 block">주택청약저축 (원)</Label>
                <FormattedInput value={adminData.housing.housingSavings} onChange={(v) => updateData('housing', 'housingSavings', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 <span className="text-red-500 font-bold">총급여 7,000만원 이하</span> | 납입액 300만원 한도 × 40% 소득공제</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">월세 (원)</Label>
                <FormattedInput value={adminData.housing.rent} onChange={(v) => updateData('housing', 'rent', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 연 1,000만원 한도, 총급여 5,500만원 이하 17% / 초과 15% 세액공제</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">주택임차차입금원리금상환액 (원)</Label>
                <FormattedInput value={adminData.housing.leaseLoan} onChange={(v) => updateData('housing', 'leaseLoan', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 원리금상환액 × 40% 소득공제 (주택마련저축과 합산 400만원 한도)</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">장기주택저당차입금 이자상환액 (원)</Label>
                <FormattedInput value={adminData.housing.mortgageInterest} onChange={(v) => updateData('housing', 'mortgageInterest', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 전액 소득공제 (상환조건에 따라 600만~2,000만원 한도)</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Education & Medical Tab */}
        <TabsContent value="eduMedical">
          <Card className="bg-white border-brutal shadow-brutal-lg p-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">📚 교육비·의료비</h3>
            <div className="mb-8">
              <h4 className="text-lg font-black mb-4 text-blue-700 border-b-2 border-blue-300 pb-2">📖 교육비</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-bold mb-2 block">본인 교육비 (원)</Label>
                  <FormattedInput value={adminData.eduMedical.selfEducation} onChange={(v) => updateData('eduMedical', 'selfEducation', v)} />
                  <p className="text-sm text-muted-foreground font-semibold mt-1">💡 한도 없음, 15% 공제</p>
                </div>
                <div>
                  <Label className="text-base font-bold mb-2 block">자녀 교육비 - 미취학 (원)</Label>
                  <FormattedInput value={adminData.eduMedical.childPreschool} onChange={(v) => updateData('eduMedical', 'childPreschool', v)} />
                  <p className="text-sm text-muted-foreground font-semibold mt-1">💡 1인당 연 300만원 한도</p>
                </div>
                <div>
                  <Label className="text-base font-bold mb-2 block">자녀 교육비 - 초중고 (원)</Label>
                  <FormattedInput value={adminData.eduMedical.childSchool} onChange={(v) => updateData('eduMedical', 'childSchool', v)} />
                  <p className="text-sm text-muted-foreground font-semibold mt-1">💡 1인당 연 300만원 한도</p>
                </div>
                <div>
                  <Label className="text-base font-bold mb-2 block">자녀 교육비 - 대학 (원)</Label>
                  <FormattedInput value={adminData.eduMedical.childUniversity} onChange={(v) => updateData('eduMedical', 'childUniversity', v)} />
                  <p className="text-sm text-muted-foreground font-semibold mt-1">💡 1인당 연 900만원 한도</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-black mb-4 text-green-700 border-b-2 border-green-300 pb-2">🏥 의료비</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-bold mb-2 block">난임시술비 (원)</Label>
                  <FormattedInput value={adminData.eduMedical.infertility} onChange={(v) => updateData('eduMedical', 'infertility', v)} />
                  <p className="text-sm text-muted-foreground font-semibold mt-1">💡 한도 없음, 30% 공제</p>
                </div>
                <div>
                  <Label className="text-base font-bold mb-2 block">미숙아·선천성이상아 (원)</Label>
                  <FormattedInput value={adminData.eduMedical.prematureChild} onChange={(v) => updateData('eduMedical', 'prematureChild', v)} />
                  <p className="text-sm text-muted-foreground font-semibold mt-1">💡 한도 없음, 20% 공제</p>
                </div>
                <div>
                  <Label className="text-base font-bold mb-2 block">본인/장애인/65세이상 의료비 (원)</Label>
                  <FormattedInput value={adminData.eduMedical.selfMedical} onChange={(v) => updateData('eduMedical', 'selfMedical', v)} />
                  <p className="text-sm text-muted-foreground font-semibold mt-1">💡 한도 없음, 15% 공제</p>
                </div>
                <div>
                  <Label className="text-base font-bold mb-2 block">그 밖의 부양가족 의료비 (원)</Label>
                  <FormattedInput value={adminData.eduMedical.familyMedical} onChange={(v) => updateData('eduMedical', 'familyMedical', v)} />
                  <p className="text-sm text-muted-foreground font-semibold mt-1">💡 연 700만원 한도, 15% 공제</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-base font-bold mb-2 block">실손의료보험금 (원)</Label>
                  <FormattedInput value={adminData.eduMedical.insuranceRefund} onChange={(v) => updateData('eduMedical', 'insuranceRefund', v)} />
                  <p className="text-sm text-muted-foreground font-semibold mt-1">💡 차감 의료비 (공제대상에서 제외)</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Donation Tab */}
        <TabsContent value="donation">
          <Card className="bg-white border-brutal shadow-brutal-lg p-6">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">❤️ 기부금</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-bold mb-2 block">정치자금 기부금 (원)</Label>
                <FormattedInput value={adminData.donation.political} onChange={(v) => updateData('donation', 'political', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 10만원까지 100%, 초과분 15%~25%</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">고향사랑 기부금 (원)</Label>
                <FormattedInput value={adminData.donation.hometown} onChange={(v) => updateData('donation', 'hometown', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 10만원까지 100%, 초과분 15% (연 2,000만원 한도)</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">고향사랑 특별재난지역 (원)</Label>
                <FormattedInput value={adminData.donation.hometownDisaster} onChange={(v) => updateData('donation', 'hometownDisaster', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 10만원까지 100%, 초과분 30%</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">특례기부금 (원)</Label>
                <FormattedInput value={adminData.donation.special} onChange={(v) => updateData('donation', 'special', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 소득 100% 한도, 1천만원 이하 15% / 초과분 30%</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">우리사주조합 기부금 (원)</Label>
                <FormattedInput value={adminData.donation.employee} onChange={(v) => updateData('donation', 'employee', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 소득 30% 한도, 1천만원 이하 15% / 초과분 30%</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">지정기부금 (종교단체 외) (원)</Label>
                <FormattedInput value={adminData.donation.designated} onChange={(v) => updateData('donation', 'designated', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 소득 30% 한도, 1천만원 이하 15% / 초과분 30%</p>
              </div>
              <div>
                <Label className="text-base font-bold mb-2 block">종교단체 기부금 (원)</Label>
                <FormattedInput value={adminData.donation.religious} onChange={(v) => updateData('donation', 'religious', v)} />
                <p className="text-sm text-muted-foreground font-semibold mt-1">💡 소득 10% 한도, 1천만원 이하 15% / 초과분 30%</p>
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
          onClick={handleReset}
          variant="outline"
          className="border-brutal shadow-brutal text-lg font-bold py-6 px-8 hover-brutal"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          초기화
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="bg-[#F7CB15] border-brutal shadow-brutal-lg p-6 mt-8">
        <h3 className="text-2xl font-black mb-4">
          📊 {selectedYear}년 {selectedMonth === 'all' ? '전체' : `${selectedMonth}월`} 요약
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 급여 */}
          <div className="bg-white border-brutal shadow-brutal-sm p-4">
            <p className="text-sm font-bold text-muted-foreground mb-2">💰 급여</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>연봉: <span className="font-bold text-black">{adminData.salary.annualSalary.toLocaleString()}원</span></p>
              <p>비과세(식대): <span className="font-bold text-black">{adminData.salary.mealAllowance.toLocaleString()}원</span></p>
              <p>보육수당 자녀: <span className="font-bold text-black">{adminData.salary.childcareChildren}명</span></p>
              <p>기납부세액: <span className="font-bold text-black">{adminData.salary.paidTax.toLocaleString()}원</span></p>
            </div>
          </div>
          {/* 4대 보험 */}
          <div className="bg-white border-brutal shadow-brutal-sm p-4">
            <p className="text-sm font-bold text-muted-foreground mb-2">🏥 4대 보험</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>국민연금: <span className="font-bold text-black">{adminData.socialInsurance.nationalPension.toLocaleString()}원</span></p>
              <p>건강보험: <span className="font-bold text-black">{adminData.socialInsurance.healthInsurance.toLocaleString()}원</span></p>
              <p>고용보험: <span className="font-bold text-black">{adminData.socialInsurance.employmentInsurance.toLocaleString()}원</span></p>
              <p>장기요양: <span className="font-bold text-black">{adminData.socialInsurance.longTermCare.toLocaleString()}원</span></p>
            </div>
          </div>
          {/* 카드·현금 */}
          <div className="bg-white border-brutal shadow-brutal-sm p-4">
            <p className="text-sm font-bold text-muted-foreground mb-2">💳 카드·현금</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>신용카드: <span className="font-bold text-black">{adminData.cards.credit.toLocaleString()}원</span></p>
              <p>체크카드: <span className="font-bold text-black">{adminData.cards.debit.toLocaleString()}원</span></p>
              <p>현금영수증: <span className="font-bold text-black">{adminData.cards.cash.toLocaleString()}원</span></p>
              <p>전통시장: <span className="font-bold text-black">{adminData.cards.traditionalMarket.toLocaleString()}원</span></p>
              <p>대중교통: <span className="font-bold text-black">{adminData.cards.publicTransport.toLocaleString()}원</span></p>
              <p>문화체육: <span className="font-bold text-black">{adminData.cards.culture.toLocaleString()}원</span></p>
            </div>
          </div>
          {/* 교육비·의료비 */}
          <div className="bg-white border-brutal shadow-brutal-sm p-4">
            <p className="text-sm font-bold text-muted-foreground mb-2">📚 교육비·의료비</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>본인교육비: <span className="font-bold text-black">{adminData.eduMedical.selfEducation.toLocaleString()}원</span></p>
              <p>자녀(미취학): <span className="font-bold text-black">{adminData.eduMedical.childPreschool.toLocaleString()}원</span></p>
              <p>자녀(초중고): <span className="font-bold text-black">{adminData.eduMedical.childSchool.toLocaleString()}원</span></p>
              <p>자녀(대학): <span className="font-bold text-black">{adminData.eduMedical.childUniversity.toLocaleString()}원</span></p>
              <p>본인의료비: <span className="font-bold text-black">{adminData.eduMedical.selfMedical.toLocaleString()}원</span></p>
              <p>부양가족의료비: <span className="font-bold text-black">{adminData.eduMedical.familyMedical.toLocaleString()}원</span></p>
            </div>
          </div>
          {/* 기부금 */}
          <div className="bg-white border-brutal shadow-brutal-sm p-4">
            <p className="text-sm font-bold text-muted-foreground mb-2">❤️ 기부금</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>정치자금: <span className="font-bold text-black">{adminData.donation.political.toLocaleString()}원</span></p>
              <p>고향사랑: <span className="font-bold text-black">{adminData.donation.hometown.toLocaleString()}원</span></p>
              <p>고향사랑재난: <span className="font-bold text-black">{adminData.donation.hometownDisaster.toLocaleString()}원</span></p>
              <p>특례기부금: <span className="font-bold text-black">{adminData.donation.special.toLocaleString()}원</span></p>
              <p>우리사주조합: <span className="font-bold text-black">{adminData.donation.employee.toLocaleString()}원</span></p>
              <p>지정기부금: <span className="font-bold text-black">{adminData.donation.designated.toLocaleString()}원</span></p>
              <p>종교단체: <span className="font-bold text-black">{adminData.donation.religious.toLocaleString()}원</span></p>
            </div>
          </div>
          {/* 보험·연금 */}
          <div className="bg-white border-brutal shadow-brutal-sm p-4">
            <p className="text-sm font-bold text-muted-foreground mb-2">🏦 보험·연금</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>보장성보험: <span className="font-bold text-black">{adminData.insurance.protection.toLocaleString()}원</span></p>
              <p>연금저축: <span className="font-bold text-black">{adminData.insurance.pension.toLocaleString()}원</span></p>
              <p>퇴직연금(IRP): <span className="font-bold text-black">{adminData.insurance.irp.toLocaleString()}원</span></p>
              <p>ISA: <span className="font-bold text-black">{adminData.insurance.isa.toLocaleString()}원</span></p>
            </div>
          </div>
          {/* 주택자금 */}
          <div className="bg-white border-brutal shadow-brutal-sm p-4">
            <p className="text-sm font-bold text-muted-foreground mb-2">🏠 주택자금</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>주택청약: <span className="font-bold text-black">{adminData.housing.housingSavings.toLocaleString()}원</span></p>
              <p>월세: <span className="font-bold text-black">{adminData.housing.rent.toLocaleString()}원</span></p>
              <p>임차차입금: <span className="font-bold text-black">{adminData.housing.leaseLoan.toLocaleString()}원</span></p>
              <p>장기주택이자: <span className="font-bold text-black">{adminData.housing.mortgageInterest.toLocaleString()}원</span></p>
            </div>
          </div>
          {/* 데이터 상태 */}
          <div className="bg-white border-brutal shadow-brutal-sm p-4">
            <p className="text-sm font-bold text-muted-foreground mb-2">데이터 상태</p>
            {summary.totalSalary > 0 ? (
              <Badge className="bg-green-500 text-white font-bold border-2 border-black mt-2">
                ✓ 입력 완료
              </Badge>
            ) : (
              <Badge className="bg-gray-400 text-white font-bold border-2 border-black mt-2">
                입력 필요
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
