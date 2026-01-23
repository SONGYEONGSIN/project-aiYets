'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (formData.password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('이용약관에 동의해주세요.');
      return;
    }

    setIsLoading(true);

    // TODO: API 연동 (현재는 데모)
    setTimeout(() => {
      router.push('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error on input
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <Card className="w-full max-w-md bg-white border-brutal shadow-brutal-lg p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-[#00D9FF] p-4 border-brutal shadow-brutal mb-4">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black mb-2">회원가입</h1>
          <p className="text-lg font-semibold text-muted-foreground">
            무료로 시작하고 최대 환급액을 받아보세요!
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border-brutal border-red-600 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-red-900">{error}</p>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name" className="text-base font-bold mb-2 block">
              이름
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="홍길동"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-base font-bold mb-2 block">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-base font-bold mb-2 block">
              비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="최소 8자 이상"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
              required
            />
            {formData.password && (
              <p className="mt-2 text-sm font-semibold text-muted-foreground flex items-center gap-2">
                {formData.password.length >= 8 ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">사용 가능한 비밀번호입니다</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-600">
                      {8 - formData.password.length}자 더 입력해주세요
                    </span>
                  </>
                )}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-base font-bold mb-2 block">
              비밀번호 확인
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호 재입력"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
              required
            />
            {formData.confirmPassword && (
              <p className="mt-2 text-sm font-semibold flex items-center gap-2">
                {formData.password === formData.confirmPassword ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">비밀번호가 일치합니다</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">비밀번호가 일치하지 않습니다</span>
                  </>
                )}
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start gap-3 bg-[#F5F5F5] border-brutal shadow-brutal-sm p-4">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => handleChange('agreeToTerms', checked as boolean)}
              className="mt-1 border-2 border-black"
            />
            <div className="flex-1">
              <label
                htmlFor="terms"
                className="text-sm font-bold cursor-pointer"
              >
                <Link href="/terms" className="text-[#FF6B35] hover:underline">
                  이용약관
                </Link>
                {' 및 '}
                <Link href="/privacy" className="text-[#FF6B35] hover:underline">
                  개인정보처리방침
                </Link>
                에 동의합니다
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white text-lg font-black py-6 border-brutal shadow-brutal hover-brutal disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '가입 처리 중...' : '회원가입 완료 →'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-base font-semibold text-muted-foreground">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="font-black text-[#00D9FF] hover:underline"
            >
              로그인 →
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
