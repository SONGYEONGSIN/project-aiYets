'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // 이미 로그인된 경우 대시보드로 리다이렉트
  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // TODO: API 연동 (현재는 데모)
    setTimeout(() => {
      if (email && password) {
        router.push('/dashboard');
      } else {
        setError('이메일과 비밀번호를 입력해주세요.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch {
      setError('Google 로그인에 실패했습니다.');
      setIsGoogleLoading(false);
    }
  };

  // 로딩 중일 때 표시
  if (status === 'loading') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md bg-white border-brutal shadow-brutal-lg p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-[#FF6B35] p-4 border-brutal shadow-brutal mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black mb-2">로그인</h1>
          <p className="text-lg font-semibold text-muted-foreground">
            AI 연말정산 계산기에 오신 것을 환영합니다!
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border-brutal border-red-600 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-red-900">{error}</p>
          </div>
        )}

        {/* Google Login Button - Primary */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="w-full bg-white text-black border-brutal shadow-brutal text-base font-bold py-6 hover-brutal disabled:opacity-50 mb-6"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              로그인 중...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google로 로그인
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 border-t-4 border-black"></div>
          <span className="font-bold text-muted-foreground">또는</span>
          <div className="flex-1 border-t-4 border-black"></div>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-base font-bold mb-2 block">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white text-lg font-black py-6 border-brutal shadow-brutal hover-brutal disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '로그인 중...' : '로그인 →'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-base font-semibold text-muted-foreground">
            계정이 없으신가요?{' '}
            <Link
              href="/signup"
              className="font-black text-[#FF6B35] hover:underline"
            >
              회원가입 →
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
