# TASKS: AI 기반 연말정산 계산기 개발 작업 목록

**버전:** 1.0  
**작성일:** 2025-01-19  
**프로젝트 기간:** 12주 (3개월)  
**팀 구성:** 
- Frontend 개발자 x2 (FE1, FE2)
- Backend 개발자 x2 (BE1, BE2)
- AI/ML 엔지니어 x1 (AI)
- UI/UX 디자이너 x1 (UX)
- QA 엔지니어 x1 (QA)

---

## 📋 작업 우선순위

- 🔴 **P0 (Critical)**: MVP 필수 기능, 블로커
- 🟠 **P1 (High)**: 핵심 기능, 빠른 시일 내 구현
- 🟡 **P2 (Medium)**: 중요하지만 나중에 가능
- 🟢 **P3 (Low)**: Nice to have, 여유 있을 때

---

## 📅 전체 일정 개요

| Phase | 기간 | 목표 | 주요 기능 |
|-------|------|------|---------|
| **Phase 1** | Week 1-4 | MVP 완성 | 계산기 핵심, 텍스트 입력, 기본 UI |
| **Phase 2** | Week 5-8 | 고도화 | OCR, 엑셀 업로드, AI 분석 |
| **Phase 3** | Week 9-12 | 완성 | 카드사 연동, 리포트, 최적화 |

---

# Phase 1: MVP 개발 (Week 1-4)

## Week 1: 프로젝트 설정 및 기초 구조

### Sprint 1.1: 개발 환경 설정 (Day 1-2)

#### TASK-001: Git 저장소 및 개발 환경
🔴 **P0** | **담당:** Tech Lead | **공수:** 2h

**작업 내용:**
```bash
# Git 초기화
git init
git remote add origin https://github.com/org/tax-calculator.git

# 브랜치 전략
- main (production)
- develop (staging)
- feature/* (개발)
- hotfix/* (긴급 수정)
```

**체크리스트:**
- [ ] GitHub 저장소 생성
- [ ] 브랜치 보호 규칙 설정
- [ ] PR 템플릿 작성
- [ ] Issue 템플릿 작성
- [ ] CODE_OF_CONDUCT.md
- [ ] CONTRIBUTING.md

---

#### TASK-002: Next.js 프로젝트 초기 설정
🔴 **P0** | **담당:** FE1 | **공수:** 4h

**작업 내용:**
```bash
npx create-next-app@latest tax-calculator \\
  --typescript \\
  --tailwind \\
  --app \\
  --src-dir \\
  --import-alias "@/*"
```

**설치 패키지:**
```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.3.3",
    "zustand": "^4.4.7",
    "@tanstack/react-query": "^5.17.9",
    "react-hook-form": "^7.49.3",
    "zod": "^3.22.4",
    "framer-motion": "^10.18.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "prettier": "^3.1.1",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0"
  }
}
```

**체크리스트:**
- [ ] Next.js 프로젝트 생성
- [ ] TypeScript 설정 (tsconfig.json)
- [ ] ESLint 설정 (.eslintrc.json)
- [ ] Prettier 설정 (.prettierrc)
- [ ] Husky pre-commit hook
- [ ] 폴더 구조 생성

**폴더 구조:**
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/
│   │   ├── dashboard/
│   │   ├── calculator/
│   │   └── admin/
│   └── api/
├── components/
│   ├── ui/
│   ├── forms/
│   └── layout/
├── lib/
│   ├── api/
│   ├── utils/
│   └── validators/
├── store/
├── types/
└── styles/
```

---

#### TASK-003: 디자인 시스템 기초 구축
🔴 **P0** | **담당:** FE2, UX | **공수:** 12h

**작업 내용:**

**1. Tailwind 커스텀 설정**
```javascript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        accent: {
          1: '#FF6B35',
          2: '#F7CB15',
          3: '#00D9FF',
        },
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        brutal: '4px 4px 0px #000000',
        'brutal-sm': '2px 2px 0px #000000',
        'brutal-lg': '8px 8px 0px #000000',
      },
    },
  },
}
```

**2. 기본 컴포넌트 구현**
```typescript
// components/ui/Button.tsx
// components/ui/Input.tsx
// components/ui/Card.tsx
// components/ui/Badge.tsx
// components/ui/Toast.tsx
```

**3. Storybook 설정**
```bash
npx storybook init
```

**체크리스트:**
- [ ] Tailwind 커스텀 컬러 설정
- [ ] 폰트 파일 다운로드 및 적용
- [ ] Button 컴포넌트 (+Storybook)
- [ ] Input 컴포넌트 (+Storybook)
- [ ] Card 컴포넌트 (+Storybook)
- [ ] Badge 컴포넌트 (+Storybook)
- [ ] Toast 컴포넌트 (+Storybook)
- [ ] Storybook 배포 설정

---

#### TASK-004: PostgreSQL 데이터베이스 설정
🔴 **P0** | **담당:** BE1 | **공수:** 6h

**작업 내용:**

**1. AWS RDS 인스턴스 생성**
```
Engine: PostgreSQL 16
Instance: db.t3.medium
Storage: 100GB gp3
Multi-AZ: No (초기)
Backup: 7일
```

**2. Prisma 설정**
```bash
npm install prisma @prisma/client
npx prisma init
```

**3. 스키마 정의**
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model TaxCalculation {
  id            String   @id @default(uuid())
  userId        String
  year          Int
  totalSalary   BigInt
  refundAmount  BigInt?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id])
}
```

**체크리스트:**
- [ ] AWS RDS 인스턴스 생성
- [ ] 보안 그룹 설정
- [ ] Prisma 설치 및 설정
- [ ] 스키마 정의 (전체 테이블)
- [ ] 마이그레이션 실행
- [ ] Seed 데이터 작성

---

#### TASK-005: Redis 캐시 서버 설정
🔴 **P0** | **담당:** BE2 | **공수:** 4h

**작업 내용:**
```bash
npm install ioredis
```
```typescript
// lib/redis.ts
import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL);

export async function getCached<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function setCache(key: string, value: any, ttl: number = 3600) {
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
}
```

**체크리스트:**
- [ ] AWS ElastiCache 생성
- [ ] ioredis 라이브러리 설정
- [ ] 연결 테스트
- [ ] 캐시 유틸리티 함수 작성
- [ ] 에러 핸들링

---

#### TASK-006: CI/CD 파이프라인 구축
🔴 **P0** | **담당:** BE1 | **공수:** 6h

**작업 내용:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**체크리스트:**
- [ ] GitHub Actions 워크플로우 작성
- [ ] Vercel 프로젝트 생성 및 연결
- [ ] 환경변수 설정
- [ ] 자동 배포 테스트
- [ ] Slack 알림 연동

---

### Sprint 1.2: 인증 시스템 (Day 3-5)

#### TASK-101: 회원가입/로그인 API 구현
🔴 **P0** | **담당:** BE1 | **공수:** 12h

**작업 내용:**

**1. API 엔드포인트**
```typescript
// app/api/auth/signup/route.ts
export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  
  // Validation
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
  });
  
  const validated = schema.parse({ email, password, name });
  
  // Check existing user
  const existing = await prisma.user.findUnique({
    where: { email: validated.email },
  });
  
  if (existing) {
    return NextResponse.json(
      { error: 'Email already exists' },
      { status: 400 }
    );
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(validated.password, 10);
  
  // Create user
  const user = await prisma.user.create({
    data: {
      email: validated.email,
      password: hashedPassword,
      name: validated.name,
    },
  });
  
  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
  
  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
    token,
  }, { status: 201 });
}
```
```typescript
// app/api/auth/login/route.ts
export async function POST(req: Request) {
  const { email, password } = await req.json();
  
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
  
  const valid = await bcrypt.compare(password, user.password);
  
  if (!valid) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
  
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
  
  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });
  
  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
    token,
  });
}
```

**체크리스트:**
- [ ] POST /api/auth/signup 구현
- [ ] POST /api/auth/login 구현
- [ ] Zod 스키마 유효성 검사
- [ ] bcrypt 비밀번호 해싱
- [ ] JWT 토큰 발급
- [ ] 에러 핸들링
- [ ] Unit 테스트 작성
- [ ] Integration 테스트 작성

---

#### TASK-102: 인증 미들웨어 구현
🔴 **P0** | **담당:** BE1 | **공수:** 4h
```typescript
// lib/middleware/auth.ts
export async function authMiddleware(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new UnauthorizedError('No token provided');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
}

// Rate limiting
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests',
});
```

**체크리스트:**
- [ ] JWT 검증 미들웨어
- [ ] Rate limiting 설정
- [ ] 에러 클래스 정의
- [ ] 테스트 작성

---

#### TASK-103: 회원가입/로그인 UI 구현
🔴 **P0** | **담당:** FE2 | **공수:** 16h

**작업 내용:**

**1. 로그인 페이지**
```typescript
// app/(auth)/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth';

const loginSchema = z.object({
  email: z.string().email('이메일 형식이 올바르지 않습니다'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
});

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });
  
  const login = useAuthStore((state) => state.login);
  
  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (error) {
      toast.error('로그인 실패');
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">로그인</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register('email')}
            label="이메일"
            type="email"
            error={errors.email?.message}
          />
          <Input
            {...register('password')}
            label="비밀번호"
            type="password"
            error={errors.password?.message}
          />
          <Button type="submit" className="w-full mt-4">
            로그인
          </Button>
        </form>
      </Card>
    </div>
  );
}
```

**2. 회원가입 페이지**
```typescript
// app/(auth)/signup/page.tsx
// 유사한 구조로 구현
```

**체크리스트:**
- [ ] /login 페이지 UI
- [ ] /signup 페이지 UI
- [ ] React Hook Form 설정
- [ ] Zod 유효성 검사
- [ ] 에러 메시지 표시
- [ ] 로딩 상태 처리
- [ ] 토스트 알림
- [ ] 반응형 디자인

---

#### TASK-104: Zustand 상태 관리
🔴 **P0** | **담당:** FE2 | **공수:** 4h
```typescript
// store/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      
      login: async (email, password) => {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
          throw new Error('Login failed');
        }
        
        const { user, token } = await response.json();
        set({ user, token });
      },
      
      logout: () => {
        set({ user: null, token: null });
      },
      
      signup: async (email, password, name) => {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });
        
        if (!response.ok) {
          throw new Error('Signup failed');
        }
        
        const { user, token } = await response.json();
        set({ user, token });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

**체크리스트:**
- [ ] Zustand store 설정
- [ ] persist 미들웨어 설정
- [ ] login 액션
- [ ] logout 액션
- [ ] signup 액션
- [ ] 타입 정의

---

## Week 2: 계산기 핵심 로직 (Day 6-10)

### Sprint 2.1: 세금 계산 엔진 (Day 6-8)

#### TASK-201: 근로소득공제 계산 함수
🔴 **P0** | **담당:** BE1 | **공수:** 8h
```typescript
// lib/tax-calculator/deductions.ts

export function calculateIncomeDeduction(totalSalary: number): number {
  if (totalSalary <= 5000000) {
    return totalSalary * 0.7;
  } else if (totalSalary <= 15000000) {
    return 3500000 + (totalSalary - 5000000) * 0.4;
  } else if (totalSalary <= 45000000) {
    return 7500000 + (totalSalary - 15000000) * 0.15;
  } else if (totalSalary <= 100000000) {
    return 12000000 + (totalSalary - 45000000) * 0.05;
  } else {
    return 14750000 + (totalSalary - 100000000) * 0.02;
  }
}
```

**체크리스트:**
- [ ] 근로소득공제 계산 함수
- [ ] 단위 테스트 (10개 케이스)
- [ ] 경계값 테스트
- [ ] 문서화

---

#### TASK-202: 인적공제 계산 함수
🔴 **P0** | **담당:** BE1 | **공수:** 6h
```typescript
export function calculatePersonalDeductions(input: {
  hasSpouse: boolean;
  dependents: {
    parents: number;
    children: number;
    siblings: number;
    others: number;
  };
  additional: {
    senior: number;
    disabled: number;
    singleParent: boolean;
    womenHead: boolean;
  };
}): number {
  let total = 1500000; // 본인
  
  if (input.hasSpouse) {
    total += 1500000;
  }
  
  const totalDependents =
    input.dependents.parents +
    input.dependents.children +
    input.dependents.siblings +
    input.dependents.others;
  
  total += totalDependents * 1500000;
  
  // 추가공제
  total += input.additional.senior * 1000000;
  total += input.additional.disabled * 2000000;
  
  if (input.additional.singleParent) {
    total += 1000000;
  } else if (input.additional.womenHead) {
    total += 500000;
  }
  
  return total;
}
```

**체크리스트:**
- [ ] 기본공제 계산
- [ ] 추가공제 계산
- [ ] 단위 테스트
- [ ] 문서화

---

#### TASK-203: 연금보험료공제 계산
🔴 **P0** | **담당:** BE1 | **공수:** 4h
```typescript
export function calculatePensionDeduction(input: {
  nationalPension: number;
  publicPension: number;
}): number {
  return input.nationalPension + input.publicPension;
}

export function estimateNationalPension(totalSalary: number): number {
  return Math.min(totalSalary * 0.045, 3258900);
}
```

**체크리스트:**
- [ ] 국민연금 계산
- [ ] 공적연금 계산
- [ ] 추정 계산 함수
- [ ] 테스트

---

#### TASK-204: 특별소득공제 계산
🔴 **P0** | **담당:** BE2 | **공수:** 8h
```typescript
export function calculateSpecialDeductions(input: {
  healthInsurance: number;
  employmentInsurance: number;
  housingLoan?: number;
  housingInterest?: number;
}): number {
  let total = input.healthInsurance + input.employmentInsurance;
  
  if (input.housingLoan) {
    total += input.housingLoan * 0.4;
  }
  
  if (input.housingInterest) {
    total += input.housingInterest;
  }
  
  return total;
}

export function estimateHealthInsurance(totalSalary: number): number {
  const base = totalSalary * 0.03545;
  const longTermCare = totalSalary * 0.0709 * 0.1281 * 0.5;
  return Math.round(base + longTermCare);
}

export function estimateEmploymentInsurance(totalSalary: number): number {
  return Math.round(totalSalary * 0.009);
}
```

**체크리스트:**
- [ ] 건강보험료 계산
- [ ] 고용보험료 계산
- [ ] 주택 관련 공제
- [ ] 추정 계산 함수
- [ ] 테스트

---

#### TASK-205: 그 밖의 소득공제 계산
🟠 **P1** | **담당:** BE2 | **공수:** 10h
```typescript
export function calculateOtherDeductions(input: {
  personalPension?: number;
  smallBusinessFund?: number;
  housingSavings?: number;
  cardUsage?: {
    creditCard: number;
    debitCard: number;
    cashReceipt: number;
    traditionalMarket: number;
    publicTransport: number;
  };
}): number {
  let total = 0;
  
  // 개인연금저축 (40%, 한도 72만원)
  if (input.personalPension) {
    total += Math.min(input.personalPension * 0.4, 720000);
  }
  
  // 소기업공제부금 (전액, 한도는 소득에 따라)
  if (input.smallBusinessFund) {
    total += Math.min(input.smallBusinessFund, 5000000);
  }
  
  // 주택마련저축 (40%, 한도 240만원)
  if (input.housingSavings) {
    total += Math.min(input.housingSavings * 0.4, 2400000);
  }
  
  // 신용카드 등
  if (input.cardUsage) {
    total += calculateCardDeduction(input.cardUsage, totalSalary);
  }
  
  return total;
}

function calculateCardDeduction(
  usage: CardUsage,
  totalSalary: number
): number {
  const threshold = totalSalary * 0.25;
  const totalUsage =
    usage.creditCard +
    usage.debitCard +
    usage.cashReceipt +
    usage.traditionalMarket +
    usage.publicTransport;
  
  if (totalUsage <= threshold) return 0;
  
  const excessAmount = totalUsage - threshold;
  
  // 신용카드 15%, 나머지 30%
  const creditCardDeduction = Math.min(usage.creditCard - threshold, 0) * 0.15;
  const otherDeduction =
    (usage.debitCard +
      usage.cashReceipt +
      usage.traditionalMarket +
      usage.publicTransport) *
    0.3;
  
  const deduction = creditCardDeduction + otherDeduction;
  
  // 한도 적용
  const limit = totalSalary <= 70000000 ? 3000000 : 2500000;
  return Math.min(deduction, limit);
}
```

**체크리스트:**
- [ ] 개인연금저축 계산
- [ ] 소기업공제부금 계산
- [ ] 주택마련저축 계산
- [ ] 신용카드 공제 계산 (복잡)
- [ ] 우리사주조합 계산
- [ ] 테스트 (20개 케이스)

---

#### TASK-206: 세액공제 계산
🔴 **P0** | **담당:** BE2 | **공수:** 12h
```typescript
export function calculateTaxCredits(input: {
  income: number;
  pensionSavings: number;
  retirementPension: number;
  insurance: number;
  medicalExpenses: number;
  educationExpenses: number;
  donations: DonationsInput;
}): TaxCreditsResult {
  const result: TaxCreditsResult = {
    pensionCredit: 0,
    insuranceCredit: 0,
    medicalCredit: 0,
    educationCredit: 0,
    donationCredit: 0,
    total: 0,
  };
  
  // 연금계좌 세액공제 (15% or 12%)
  const pensionRate = input.income <= 55000000 ? 0.15 : 0.12;
  const pensionTotal = input.pensionSavings + input.retirementPension;
  const pensionLimit = input.age >= 50 ? 12000000 : 9000000;
  result.pensionCredit = Math.min(pensionTotal, pensionLimit) * pensionRate;
  
  // 보장성보험료 (12%, 한도 100만원)
  result.insuranceCredit = Math.min(input.insurance, 1000000) * 0.12;
  
  // 의료비 (15%)
  const medicalThreshold = input.income * 0.03;
  const medicalExcess = Math.max(input.medicalExpenses - medicalThreshold, 0);
  result.medicalCredit = medicalExcess * 0.15;
  
  // 교육비 (15%)
  result.educationCredit = input.educationExpenses * 0.15;
  
  // 기부금
  result.donationCredit = calculateDonationCredit(input.donations);
  
  result.total =
    result.pensionCredit +
    result.insuranceCredit +
    result.medicalCredit +
    result.educationCredit +
    result.donationCredit;
  
  return result;
}

function calculateDonationCredit(donations: DonationsInput): number {
  let total = 0;
  
  // 정치자금 (10만원 이하 110/11, 초과 15%)
  if (donations.political) {
    if (donations.political <= 100000) {
      total += (donations.political / 11) * 10;
    } else {
      total += 90909 + (donations.political - 100000) * 0.15;
    }
  }
  
  // 고향사랑 (동일)
  if (donations.hometown) {
    if (donations.hometown <= 100000) {
      total += (donations.hometown / 11) * 10;
    } else {
      total += 90909 + (donations.hometown - 100000) * 0.165;
    }
  }
  
  // 일반기부금 (15% or 30%)
  if (donations.general) {
    total += donations.general * 0.15;
  }
  
  return total;
}
```

**체크리스트:**
- [ ] 연금계좌 세액공제
- [ ] 보장성보험료 공제
- [ ] 의료비 공제
- [ ] 교육비 공제
- [ ] 기부금 공제 (복잡)
- [ ] 근로소득세액공제
- [ ] 테스트 (30개 케이스)

---

#### TASK-207: 산출세액 계산
🔴 **P0** | **담당:** BE1 | **공수:** 6h
```typescript
export function calculateTaxAmount(taxableIncome: number): number {
  if (taxableIncome <= 14000000) {
    return taxableIncome * 0.06;
  } else if (taxableIncome <= 50000000) {
    return taxableIncome * 0.15 - 1260000;
  } else if (taxableIncome <= 88000000) {
    return taxableIncome * 0.24 - 5760000;
  } else if (taxableIncome <= 150000000) {
    return taxableIncome * 0.35 - 15440000;
  } else if (taxableIncome <= 300000000) {
    return taxableIncome * 0.38 - 19940000;
  } else if (taxableIncome <= 500000000) {
    return taxableIncome * 0.40 - 25940000;
  } else if (taxableIncome <= 1000000000) {
    return taxableIncome * 0.42 - 35940000;
  } else {
    return taxableIncome * 0.45 - 65940000;
  }
}

export function calculateEarnedIncomeCredit(
  calculatedTax: number,
  totalSalary: number
): number {
  let credit = 0;
  
  if (calculatedTax <= 1300000) {
    credit = calculatedTax * 0.55;
  } else {
    credit = 715000 + (calculatedTax - 1300000) * 0.3;
  }
  
  // 한도 적용 (총급여에 따라)
  let limit = 0;
  if (totalSalary <= 33000000) {
    limit = 740000;
  } else if (totalSalary <= 70000000) {
    limit = 660000;
  } else {
    limit = 500000;
  }
  
  return Math.min(credit, limit);
}
```

**체크리스트:**
- [ ] 세율 구간별 계산
- [ ] 누진공제 적용
- [ ] 근로소득세액공제
- [ ] 테스트 (모든 구간)

---

#### TASK-208: 통합 계산 함수
🔴 **P0** | **담당:** BE1, BE2 | **공수:** 8h
```typescript
// lib/tax-calculator/index.ts

export interface TaxCalculationInput {
  // Basic
  totalSalary: number;
  
  // Personal deductions
  hasSpouse: boolean;
  dependents: DependentsInput;
  additional: AdditionalDeductionsInput;
  
  // Pension insurance
  nationalPension: number;
  publicPension: number;
  
  // Special deductions
  healthInsurance: number;
  employmentInsurance: number;
  housing?: HousingDeductionInput;
  
  // Other deductions
  cardUsage?: CardUsageInput;
  pensionSavings?: number;
  // ... more
  
  // Tax credits
  insurance?: number;
  medicalExpenses?: number;
  educationExpenses?: number;
  donations?: DonationsInput;
  
  // Prepaid tax
  prepaidTax: number;
}

export interface TaxCalculationResult {
  // Step by step
  totalSalary: number;
  incomeDeduction: number;
  taxableIncome: number;
  
  personalDeductions: number;
  pensionDeductions: number;
  specialDeductions: number;
  otherDeductions: number;
  totalDeductions: number;
  
  taxBase: number;
  calculatedTax: number;
  
  taxCredits: TaxCreditsResult;
  earnedIncomeCredit: number;
  totalCredits: number;
  
  finalTax: number;
  prepaidTax: number;
  refundAmount: number; // positive: refund, negative: additional payment
  
  localIncomeTax: number; // 10%
  totalRefund: number;
}

export function calculateYearEndTax(
  input: TaxCalculationInput
): TaxCalculationResult {
  // Step 1: 근로소득금액
  const incomeDeduction = calculateIncomeDeduction(input.totalSalary);
  const taxableIncome = input.totalSalary - incomeDeduction;
  
  // Step 2: 소득공제
  const personalDeductions = calculatePersonalDeductions({
    hasSpouse: input.hasSpouse,
    dependents: input.dependents,
    additional: input.additional,
  });
  
  const pensionDeductions = calculatePensionDeduction({
    nationalPension: input.nationalPension,
    publicPension: input.publicPension,
  });
  
  const specialDeductions = calculateSpecialDeductions({
    healthInsurance: input.healthInsurance,
    employmentInsurance: input.employmentInsurance,
    housingLoan: input.housing?.loan,
    housingInterest: input.

  const otherDeductions = calculateOtherDeductions({
    personalPension: input.pensionSavings,
    cardUsage: input.cardUsage,
    // ... more
  });
  
  const totalDeductions =
    personalDeductions +
    pensionDeductions +
    specialDeductions +
    otherDeductions;
  
  // Step 3: 과세표준
  const taxBase = taxableIncome - totalDeductions;
  
  // Step 4: 산출세액
  const calculatedTax = calculateTaxAmount(taxBase);
  
  // Step 5: 세액공제
  const taxCredits = calculateTaxCredits({
    income: taxableIncome,
    pensionSavings: input.pensionSavings || 0,
    // ... more
  });
  
  const earnedIncomeCredit = calculateEarnedIncomeCredit(
    calculatedTax,
    input.totalSalary
  );
  
  const totalCredits = taxCredits.total + earnedIncomeCredit;
  
  // Step 6: 결정세액
  const finalTax = Math.max(calculatedTax - totalCredits, 0);
  
  // Step 7: 환급/추가납부
  const refundAmount = input.prepaidTax - finalTax;
  const localIncomeTax = Math.round(refundAmount * 0.1);
  const totalRefund = refundAmount + localIncomeTax;
  
  return {
    totalSalary: input.totalSalary,
    incomeDeduction,
    taxableIncome,
    personalDeductions,
    pensionDeductions,
    specialDeductions,
    otherDeductions,
    totalDeductions,
    taxBase,
    calculatedTax,
    taxCredits,
    earnedIncomeCredit,
    totalCredits,
    finalTax,
    prepaidTax: input.prepaidTax,
    refundAmount,
    localIncomeTax,
    totalRefund,
  };
}
**체크리스트:**
- [ ] 전체 계산 플로우 구현
- [ ] 타입 정의
- [ ] 에러 핸들링
- [ ] 통합 테스트 (10개 시나리오)
- [ ] 성능 테스트
- [ ] 문서화

### Sprint 2.2: 계산기 API (Day 9-10)

#### TASK-209: 계산기 API 엔드포인트 구현
🔴 **P0** | **담당:** BE1 | **공수:** 8h

```typescript
// app/api/calculations/route.ts

export async function POST(req: Request) {
  const user = await authMiddleware(req);
  const input = await req.json();
  
  // Validate input
  const validated = taxCalculationSchema.parse(input);
  
  // Calculate
  const result = calculateYearEndTax(validated);
  
  // Save to database
  const calculation = await prisma.taxCalculation.create({
    data: {
      userId: user.userId,
      year: validated.year,
      totalSalary: validated.totalSalary,
      refundAmount: result.refundAmount,
      calculatedTax: result.finalTax,
      prepaidTax: validated.prepaidTax,
      data: JSON.stringify(result),
    },
  });
  
  return NextResponse.json(result, { status: 201 });
}

export async function GET(req: Request) {
  const user = await authMiddleware(req);
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get('year') || '2025');
  
  const calculation = await prisma.taxCalculation.findFirst({
    where: {
      userId: user.userId,
      year,
    },
    orderBy: { createdAt: 'desc' },
  });
  
  if (!calculation) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(JSON.parse(calculation.data));
}
```

**체크리스트:**
- [ ] POST /api/calculations (생성)
- [ ] GET /api/calculations (조회)
- [ ] PUT /api/calculations/:id (수정)
- [ ] DELETE /api/calculations/:id (삭제)
- [ ] 인증 미들웨어 적용
- [ ] 입력 유효성 검사
- [ ] 에러 핸들링
- [ ] API 테스트

---

### Week 3-4: 계산기 UI 및 Admin 페이지 (Day 11-20)

#### Sprint 3.1: 계산기 UI (Day 11-15)

#### TASK-301: 대시보드 페이지
🔴 **P0** | **담당:** FE1, UX | **공수:** 16h

```typescript
// app/(main)/dashboard/page.tsx

export default async function DashboardPage() {
  const calculation = await getLatestCalculation();
  
  return (
    <div className="container mx-auto py-8">
      {/* 환급 예상액 카드 */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-4">📊 2026년 예상 결과</h2>
        <div className="text-center">
          <p className="text-gray-600 mb-2">환급 예상액</p>
          <p className="text-5xl font-black text-accent-1">
            {calculation?.refundAmount.toLocaleString()}원
          </p>
          <p className="text-sm text-gray-500 mt-2">
            ▲ 지난해 대비 +12.3%
          </p>
        </div>
      </Card>
      
      {/* AI 실시간 분석 */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-4">🤖 AI 실시간 분석</h2>
        <AIAnalysisList calculationId={calculation?.id} />
      </Card>
      
      {/* 2026년 변경사항 */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">🔔 2026년 변경사항</h2>
        <TaxLawChanges year={2026} />
      </Card>
    </div>
  );
}
```

**체크리스트:**
- [ ] 레이아웃 구조
- [ ] 환급액 카드 UI
- [ ] AI 분석 섹션 (빈 컴포넌트)
- [ ] 세법 변경 섹션 (빈 컴포넌트)
- [ ] 반응형 디자인
- [ ] 로딩 스켈레톤
- [ ] 에러 바운더리

#### TASK-302: 계산기 페이지 - 섹션 1-3 
🔴 **P0** | **담당:** FE1 | **공수:** 20h

```typescript
// app/(main)/calculator/page.tsx

export default function CalculatorPage() {
  const [formData, setFormData] = useState<TaxCalculationInput>(defaultData);
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  
  const handleCalculate = async () => {
    const response = await fetch('/api/calculations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    setResult(data);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 입력 폼 */}
      <div className="lg:col-span-2">
        <h1 className="text-4xl font-black mb-8">연말정산 계산기</h1>
        
        {/* 섹션 1: 기본입력사항 */}
        <Accordion>
          <AccordionItem value="basic">
            <AccordionTrigger>1. 기본입력사항</AccordionTrigger>
            <AccordionContent>
              <NumberInput
                label="총급여"
                value={formData.totalSalary}
                onChange={(v) => setFormData({...formData, totalSalary: v})}
                tooltip="급여 + 상여 - 비과세소득"
              />
              <div className="text-sm text-gray-600 mt-2">
                근로소득공제: {calculateIncomeDeduction(formData.totalSalary).toLocaleString()}원
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* 섹션 2: 기본공제 */}
          <AccordionItem value="personal">
            <AccordionTrigger>2. 기본공제</AccordionTrigger>
            <AccordionContent>
              <Checkbox
                label="배우자"
                checked={formData.hasSpouse}
                onChange={(v) => setFormData({...formData, hasSpouse: v})}
                tooltip="연소득 100만원 이하"
              />
              <Select
                label="자녀 (만20세 이하)"
                value={formData.dependents.children}
                options={[0,1,2,3,4,5]}
                onChange={(v) => setFormData({...formData, dependents: {...formData.dependents, children: v}})}
              />
            </AccordionContent>
          </AccordionItem>
          
          {/* ... 나머지 섹션 */}
        </Accordion>
        
        <Button onClick={handleCalculate} className="w-full mt-8">
          계산하기
        </Button>
      </div>
      
      {/* 결과 패널 (고정) */}
      <div className="lg:sticky lg:top-8 lg:h-screen">
        {result && <ResultPanel result={result} />}
      </div>
    </div>
  );
}
```

**체크리스트:**
- [ ] 섹션 1: 기본입력사항
- [ ] 섹션 2: 기본공제
- [ ] 섹션 3: 추가공제
- [ ] Accordion 컴포넌트
- [ ] 입력 필드 컴포넌트들
- [ ] 툴팁 컴포넌트
- [ ] 반응형 레이아웃

#### TASK-303: 계산기 페이지 - 섹션 4-7
🔴 **P0** | **담당:** FE2 | **공수:** 20h

**체크리스트:**
- [ ] 섹션 4: 연금보험료공제
- [ ] 섹션 5: 특별소득공제
- [ ] 섹션 6: 그 밖의 소득공제
- [ ] 섹션 7: 세액공제
- [ ] 자동계산 버튼 UI
- [ ] 입력 검증 및 에러 표시

#### TASK-304: 결과 패널    
🔴 **P0** | **담당:** FE2 | **공수:** 8h

```typescript
// components/ResultPanel.tsx

export function ResultPanel({ result }: { result: TaxCalculationResult }) {
  return (
    <Card className="sticky top-8">
      <h3 className="text-2xl font-bold mb-6">계산 결과</h3>
      
      {/* 최종 환급액 */}
      <div className="mb-6 p-4 bg-accent-1/10 border-3 border-accent-1">
        <p className="text-sm text-gray-600">환급 예상액</p>
        <p className="text-4xl font-black text-accent-1">
          {result.totalRefund.toLocaleString()}원
        </p>
      </div>
      
      {/* 계산 단계 */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>총급여</span>
          <span className="font-bold">{result.totalSalary.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>- 근로소득공제</span>
          <span>{result.incomeDeduction.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span>= 근로소득금액</span>
          <span className="font-bold">{result.taxableIncome.toLocaleString()}원</span>
        </div>
        
        {/* ... 나머지 단계 */}
        
        <div className="border-t-3 border-black pt-3 mt-3">
          <div className="flex justify-between font-bold">
            <span>결정세액</span>
            <span>{result.finalTax.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span>기납부세액</span>
            <span>{result.prepaidTax.toLocaleString()}원</span>
          </div>
        </div>
      </div>
      
      {/* 저장 버튼 */}
      <Button className="w-full mt-6">결과 저장</Button>
    </Card>
  );
}
```

**체크리스트:**
- [ ] 결과 패널 UI
- [ ] 계산 단계별 표시
- [ ] 환급/추가납부 표시
- [ ] 저장 기능
- [ ] 인쇄 기능

### Sprint 3.2: Admin 페이지 (Day 16-20)

#### TASK-305: Admin 페이지 레이아웃
🟠 **P1** | **담당:** FE1, UX | **공수:** 12h

```typescript
// app/(main)/admin/page.tsx

export default function AdminPage() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(1);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-black mb-8">⚙️ 관리자 페이지</h1>
      
      {/* 연도/월 선택 */}
      <div className="flex gap-4 mb-8">
        <Select
          options={[2025, 2024, 2023]}
          value={selectedYear}
          onChange={setSelectedYear}
        />
        <Select
          options={[1,2,3,4,5,6,7,8,9,10,11,12]}
          value={selectedMonth}
          onChange={setSelectedMonth}
        />
      </div>
      
      {/* 카테고리별 입력 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeSection year={selectedYear} month={selectedMonth} />
        <CardUsageSection year={selectedYear} month={selectedMonth} />
        <InsuranceSection year={selectedYear} />
        <PensionSection year={selectedYear} />
      </div>
    </div>
  );
}
```

**체크리스트:**
- [ ] 레이아웃 구조
- [ ] 연도/월 선택기
- [ ] 카테고리별 섹션 컴포넌트
- [ ] 반응형 디자인

#### TASK-306: 급여 입력 섹션
🟠 **P1** | **담당:** FE1 | **공수:** 8h

```typescript
// components/admin/IncomeSection.tsx

export function IncomeSection({ year, month }: { year: number; month: number }) {
  const [income, setIncome] = useState<MonthlyIncome>(defaultIncome);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/admin/income/${year}/${month}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(income),
      });
      
      toast.success('저장되었습니다');
      
      // WebSocket을 통해 계산기에 실시간 반영
    } catch (error) {
      toast.error('저장 실패');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">💰 급여 ({year}년 {month}월)</h3>
      
      <NumberInput
        label="총급여"
        value={income.grossSalary}
        onChange={(v) => setIncome({...income, grossSalary: v})}
      />
      <NumberInput
        label="상여금"
        value={income.bonus}
        onChange={(v) => setIncome({...income, bonus: v})}
      />
      <NumberInput
        label="국민연금"
        value={income.nationalPension}
        onChange={(v) => setIncome({...income, nationalPension: v})}
      />
      
      {/* ... 나머지 필드 */}
      
      <div className="flex gap-2 mt-4">
        <Button onClick={handleSave} loading={isSaving}>
          저장
        </Button>
        <Button variant="outline" onClick={() => setIncome(defaultIncome)}>
          초기화
        </Button>
      </div>
    </Card>
  );
}
```

**체크리스트:**
- [ ] 급여 입력 폼
- [ ] 자동저장 기능
- [ ] WebSocket 동기화
- [ ] 로딩 상태 처리

#### TASK-307: 파일 업로드 UI
🟠 **P1** | **담당:** FE2 | **공수:** 12h

```typescript
// components/admin/FileUpload.tsx

export function FileUpload({ type, year, month }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('year', year.toString());
    formData.append('month', month.toString());
    
    try {
      const response = await fetch('/api/admin/upload/excel', {
        method: 'POST',
        body: formData,
      });
      
      const { uploadId } = await response.json();
      
      // Poll for status
      await pollUploadStatus(uploadId, (progress) => {
        setProgress(progress);
      });
      
      toast.success('업로드 완료');
    } catch (error) {
      toast.error('업로드 실패');
    } finally {
      setUploading(false);
      setFile(null);
      setProgress(0);
    }
  };
  
  return (
    <div className="border-3 border-dashed border-gray-300 rounded p-6">
      {/* Drag & Drop 영역 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="text-center"
      >
        <Upload className="mx-auto mb-4 w-12 h-12 text-gray-400" />
        <p className="mb-2">파일을 드래그하거나 클릭하여 업로드</p>
        <input
          type="file"
          accept=".xlsx,.csv,.jpg,.png"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button as="span" variant="outline">
            파일 선택
          </Button>
        </label>
      </div>
      
      {/* 파일 정보 */}
      {file && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="text-sm font-medium">{file.name}</p>
          <p className="text-xs text-gray-600">
            {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}
      
      {/* 업로드 버튼 */}
      {file && !uploading && (
        <Button onClick={handleUpload} className="w-full mt-4">
          업로드
        </Button>
      )}
      
      {/* 프로그레스 바 */}
      {uploading && (
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-full bg-accent-1 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-center mt-2">{progress}%</p>
        </div>
      )}
    </div>
  );
}
```

**체크리스트:**
- [ ] Drag & Drop UI
- [ ] 파일 선택 UI
- [ ] 업로드 진행률 표시
- [ ] 지원 파일 형식 체크
- [ ] 에러 처리

#### TASK-308: Admin API 엔드포인트
🟠 **P1** | **담당:** BE1 | **공수:** 12h

```typescript
// app/api/admin/income/[year]/[month]/route.ts

export async function POST(
  req: Request,
  { params }: { params: { year: string; month: string } }
) {
  const user = await authMiddleware(req);
  const data = await req.json();
  
  const year = parseInt(params.year);
  const month = parseInt(params.month);
  
  // Upsert monthly income
  const income = await prisma.monthlyIncome.upsert({
    where: {
      userId_year_month: {
        userId: user.userId,
        year,
        month,
      },
    },
    update: data,
    create: {
      userId: user.userId,
      year,
      month,
      ...data,
    },
  });
  
  // Trigger WebSocket notification
  wss.sendToUser(user.userId, {
    type: 'sync',
    entity: 'income',
    action: 'update',
    data: income,
  });
  
  // Update calculation automatically
  await updateCalculation(user.userId, year);
  
  return NextResponse.json(income);
}
```

**체크리스트:**
- [ ] POST /api/admin/income/:year/:month
- [ ] POST /api/admin/cards/:year/:month
- [ ] POST /api/admin/insurance/:year
- [ ] WebSocket 동기화
- [ ] 자동 계산 업데이트
- [ ] 테스트

#### Sprint 3.3: 테스트 및 버그 수정 (Day 18-20)

#### TASK-309: E2E 테스트 작성
🟡 **P2** | **담당:** QA | **공수:** 12h

```typescript
// e2e/calculation-flow.spec.ts

import { test, expect } from '@playwright/test';

test.describe('연말정산 계산 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name=email]', 'test@example.com');
    await page.fill('[name=password]', 'password123');
    await page.click('button[type=submit]');
  });
  
  test('기본 계산 플로우', async ({ page }) => {
    // 계산기 페이지 이동
    await page.goto('/calculator');
    
    // 총급여 입력
    await page.fill('[name=totalSalary]', '50000000');
    
    // 자녀 선택
    await page.selectOption('[name="dependents.children"]', '2');
    
    // 계산 버튼 클릭
    await page.click('button:has-text("계산하기")');
    
    // 결과 확인
    await expect(page.locator('.result-panel')).toBeVisible();
    await expect(page.locator('.refund-amount')).toContainText('원');
  });
  
  test('Admin 데이터 입력 및 동기화', async ({ page }) => {
    await page.goto('/admin');
    
    // 급여 입력
    await page.fill('[name=grossSalary]', '5000000');
    await page.click('button:has-text("저장")');
    
    // 저장 확인
    await expect(page.locator('.toast')).toContainText('저장되었습니다');
    
    // 계산기로 이동하여 반영 확인
    await page.goto('/calculator');
    await expect(page.locator('[name=totalSalary]')).toHaveValue('60000000'); // 12개월 합계
  });
});
```

**체크리스트:**
- [ ] 회원가입 플로우 테스트
- [ ] 로그인 플로우 테스트
- [ ] 계산기 입력 테스트
- [ ] Admin 데이터 입력 테스트
- [ ] 실시간 동기화 테스트
- [ ] 모바일 반응형 테스트

#### TASK-310: 버그 수정 및 성능 최적화
🔴 **P0** | **담당:** 전체팀 | **공수:** 16h

**체크리스트:**
- [ ] 발견된 버그 수정
- [ ] 성능 프로파일링
- [ ] 번들 크기 최적화
- [ ] 이미지 최적화
- [ ] 코드 스플리팅
- [ ] Lighthouse 점수 90+ 달성

### Phase 2: 고도화 (Week 5-8)

#### Week 5-6: AI 분석 및 OCR (Day 21-30)

#### Sprint 4.1: AI 서비스 구축 (Day 21-25)

#### TASK-401: Python FastAPI 서버 설정
🟠 **P1** | **담당:** AI | **공수:** 8h

```python
# ai_service/main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
import os

app = FastAPI()

llm = ChatOpenAI(
    model="gpt-4-turbo",
    temperature=0.2,
    api_key=os.getenv("OPENAI_API_KEY")
)

class AnalysisRequest(BaseModel):
    calculationId: str
    userData: dict

@app.post("/api/ai/analyze")
async def analyze_tax_data(request: AnalysisRequest):
    try:
        analyses = await generate_tax_tips(request.userData)
        return {"analyses": analyses, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def generate_tax_tips(userData: dict) -> list:
    prompt = ChatPromptTemplate.from_messages([
        ("system", """당신은 한국 연말정산 전문가입니다.
        사용자의 데이터를 분석하여 실질적인 절세 팁을 제공하세요.
        
        응답 형식 (JSON):
        [
          {{
            "priority": "high|medium|low",
            "title": "20자 이내 제목",
            "content": "100자 이내 설명",
            "potentialSavings": 금액,
            "actionItems": ["실행 방법 1", "실행 방법 2"]
          }}
        ]
        """),
        ("user", "사용자 데이터:\\n{user_data}")
    ])
    
    chain = LLMChain(llm=llm, prompt=prompt)
    result = await chain.arun(user_data=str(userData))
    
    return json.loads(result)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**체크리스트:**
- [ ] FastAPI 프로젝트 설정
- [ ] OpenAI API 연동
- [ ] LangChain 설정
- [ ] API 엔드포인트 구현
- [ ] 에러 핸들링
- [ ] 테스트

#### TASK-402: Vector DB 설정 및 세법 지식 임베딩
🟠 **P1** | **담당:** AI | **공수:** 12h

```python
# ai_service/vectorstore.py

from langchain.vectorstores import Pinecone
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import pinecone

# Initialize Pinecone
pinecone.init(
    api_key=os.getenv("PINECONE_API_KEY"),
    environment=os.getenv("PINECONE_ENVIRONMENT")
)

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

def create_tax_knowledge_base():
    """세법 문서를 벡터 DB에 저장"""
    
    # 세법 문서 로드
    documents = load_tax_documents()  # 소득세법, 조세특례제한법 등
    
    # 청크로 분할
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = text_splitter.split_documents(documents)
    
    # Pinecone에 저장
    vectorstore = Pinecone.from_documents(
        documents=chunks,
        embedding=embeddings,
        index_name="tax-knowledge-base"
    )
    
    return vectorstore

def retrieve_relevant_laws(query: str, k: int = 5):
    """관련 세법 검색"""
    vectorstore = Pinecone.from_existing_index("tax-knowledge-base", embeddings)
    docs = vectorstore.similarity_search(query, k=k)
    return docs
```

**체크리스트:**
- [ ] Pinecone 인덱스 생성
- [ ] 소득세법 문서 수집 및 전처리
- [ ] 문서 청크 분할
- [ ] 벡터 임베딩 및 저장
- [ ] 검색 기능 테스트
- [ ] 10,000개 이상 청크 저장

#### TASK-403: 세법 변경 크롤러
🟠 **P1** | **담당:** AI, BE2 | **공수:** 16h

```python
# ai_service/scraper.py

from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import asyncio
from datetime import datetime

async def scrape_nts_announcements():
    """국세청 공지사항 크롤링"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        await page.goto('https://www.nts.go.kr/nts/na/ntt/selectNttList.do?mi=2445&bbsId=1092')
        await page.wait_for_selector('.board-list')
        
        content = await page.content()
        soup = BeautifulSoup(content, 'html.parser')
        
        announcements = []
        for item in soup.select('.board-list tbody tr'):
            title_elem = item.select_one('.subject a')
            if not title_elem:
                continue
                
            title = title_elem.text.strip()
            link = title_elem['href']
            date_elem = item.select_one('.date')
            date = date_elem.text.strip() if date_elem else None
            
            # 연말정산 관련 키워드 필터링
            if any(keyword in title for keyword in ['연말정산', '세액공제', '소득공제', '기부금', '신용카드']):
                announcements.append({
                    'title': title,
                    'link': f"https://www.nts.go.kr{link}",
                    'date': date,
                    'source': '국세청'
                })
        
        await browser.close()
        return announcements

async def detect_law_changes(announcements: list) -> list:
    """AI로 세법 변경사항 감지 및 분석"""
    changes = []
    
    for announcement in announcements:
        # 전체 내용 가져오기
        content = await fetch_announcement_content(announcement['link'])
        
        # AI 분석
        prompt = f"""
        다음 공지사항을 분석하여 연말정산에 영향을 미치는 세법 변경사항인지 판단하세요.
        
        제목: {announcement['title']}
        내용: {content[:2000]}
        
        다음 JSON 형식으로 응답하세요:
        {{
            "isLawChange": true/false,
            "summary": "3줄 이내 요약",
            "impactLevel": "high/medium/low",
            "affectedCategories": ["deduction", "credit", "rate"],
            "effectiveDate": "YYYY-MM-DD"
        }}
        """
        
        result = await llm.apredict(prompt)
        parsed = json.loads(result)
        
        if parsed['isLawChange']:
            changes.append({
                **announcement,
                **parsed
            })
    
    return changes

# Scheduler (AWS Lambda / Cron)
async def daily_tax_law_check():
    """매일 실행되는 세법 변경 체크"""
    announcements = await scrape_nts_announcements()
    changes = await detect_law_changes(announcements)
    
    # 데이터베이스에 저장
    for change in changes:
        await save_tax_law_change(change)
        
        # 사용자에게 알림
        await notify_users_about_change(change)
```

**체크리스트:**
- [ ] Playwright 설정
- [ ] 국세청 크롤러 구현
- [ ] 기획재정부 크롤러 구현
- [ ] AI 변경사항 감지
- [ ] 스케줄러 설정 (AWS Lambda)
- [ ] 알림 시스템 연동
- [ ] 테스트

#### TASK-404: AI 분석 API 통합
🟠 **P1** | **담당:** BE1 | **공수:** 8h

```typescript
// app/api/ai/analyze/route.ts

export async function POST(req: Request) {
  const user = await authMiddleware(req);
  const { calculationId } = await req.json();
  
  // Get calculation data
  const calculation = await prisma.taxCalculation.findUnique({
    where: { id: calculationId },
    include: {
      monthlyIncomes: true,
      cardUsages: true,
      // ...
    },
  });
  
  if (!calculation) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  // Call AI service
  const response = await fetch('http://ai-service:8000/api/ai/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      calculationId,
      userData: calculation,
    }),
  });
  
  const { analyses } = await response.json();
  
  // Save analyses to database
  await Promise.all(
    analyses.map(analysis =>
      prisma.aiAnalysis.create({
        data: {
          userId: user.userId,
          calculationId,
          priority: analysis.priority,
          title: analysis.title,
          content: analysis.content,
          potentialSavings: analysis.potentialSavings,
          actionItems: JSON.stringify(analysis.actionItems),
        },
      })
    )
  );
  
  return NextResponse.json({ analyses });
}

 타입 정의
 에러 핸들링
 통합 테스트 (10개 시나리오)
 성능 테스트
 문서화

### Sprint 2.2: 계산기 API (Day 9-10)

#### TASK-209: 계산기 API 엔드포인트 구현
🔴 P0 | 담당: BE1 | 공수: 8h

// app/api/calculations/route.ts

export async function POST(req: Request) {
  const user = await authMiddleware(req);
  const input = await req.json();
  
  // Validate input
  const validated = taxCalculationSchema.parse(input);
  
  // Calculate
  const result = calculateYearEndTax(validated);
  
  // Save to database
  const calculation = await prisma.taxCalculation.create({
    data: {
      userId: user.userId,
      year: validated.year,
      totalSalary: validated.totalSalary,
      refundAmount: result.refundAmount,
      calculatedTax: result.finalTax,
      prepaidTax: validated.prepaidTax,
      data: JSON.stringify(result),
    },
  });
  
  return NextResponse.json(result, { status: 201 });
}

export async function GET(req: Request) {
  const user = await authMiddleware(req);
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get('year') || '2025');
  
  const calculation = await prisma.taxCalculation.findFirst({
    where: {
      userId: user.userId,
      year,
    },
    orderBy: { createdAt: 'desc' },
  });
  
  if (!calculation) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(JSON.parse(calculation.data));
}

체크리스트:

 POST /api/calculations (생성)
 GET /api/calculations (조회)
 PUT /api/calculations/:id (수정)
 DELETE /api/calculations/:id (삭제)
 인증 미들웨어 적용
 입력 유효성 검사
 에러 핸들링
 API 테스트

 

### Week 3-4: 계산기 UI 및 Admin 페이지 (Day 11-20)

#### Sprint 3.1: 계산기 UI (Day 11-15)

#### TASK-301: 대시보드 페이지
🔴 P0 | 담당: FE1, UX | 공수: 16h
// app/(main)/dashboard/page.tsx

export default async function DashboardPage() {
  const calculation = await getLatestCalculation();
  
  return (
    <div className="container mx-auto py-8">
      {/* 환급 예상액 카드 */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-4">📊 2026년 예상 결과</h2>
        <div className="text-center">
          <p className="text-gray-600 mb-2">환급 예상액</p>
          <p className="text-5xl font-black text-accent-1">
            {calculation?.refundAmount.toLocaleString()}원
          </p>
          <p className="text-sm text-gray-500 mt-2">
            ▲ 지난해 대비 +12.3%
          </p>
        </div>
      </Card>
      
      {/* AI 실시간 분석 */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-4">🤖 AI 실시간 분석</h2>
        <AIAnalysisList calculationId={calculation?.id} />
      </Card>
      
      {/* 2026년 변경사항 */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">🔔 2026년 변경사항</h2>
        <TaxLawChanges year={2026} />
      </Card>
    </div>
  );
}
체크리스트:

 레이아웃 구조
 환급액 카드 UI
 AI 분석 섹션 (빈 컴포넌트)
 세법 변경 섹션 (빈 컴포넌트)
 반응형 디자인
 로딩 스켈레톤
 에러 바운더리

#### TASK-302: 계산기 페이지 - 섹션 1-3 
🔴 P0 | 담당: FE1 | 공수: 20h
// app/(main)/calculator/page.tsx

export default function CalculatorPage() {
  const [formData, setFormData] = useState<TaxCalculationInput>(defaultData);
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  
  const handleCalculate = async () => {
    const response = await fetch('/api/calculations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    setResult(data);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 입력 폼 */}
      <div className="lg:col-span-2">
        <h1 className="text-4xl font-black mb-8">연말정산 계산기</h1>
        
        {/* 섹션 1: 기본입력사항 */}
        <Accordion>
          <AccordionItem value="basic">
            <AccordionTrigger>1. 기본입력사항</AccordionTrigger>
            <AccordionContent>
              <NumberInput
                label="총급여"
                value={formData.totalSalary}
                onChange={(v) => setFormData({...formData, totalSalary: v})}
                tooltip="급여 + 상여 - 비과세소득"
              />
              <div className="text-sm text-gray-600 mt-2">
                근로소득공제: {calculateIncomeDeduction(formData.totalSalary).toLocaleString()}원
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* 섹션 2: 기본공제 */}
          <AccordionItem value="personal">
            <AccordionTrigger>2. 기본공제</AccordionTrigger>
            <AccordionContent>
              <Checkbox
                label="배우자"
                checked={formData.hasSpouse}
                onChange={(v) => setFormData({...formData, hasSpouse: v})}
                tooltip="연소득 100만원 이하"
              />
              <Select
                label="자녀 (만20세 이하)"
                value={formData.dependents.children}
                options={[0,1,2,3,4,5]}
                onChange={(v) => setFormData({...formData, dependents: {...formData.dependents, children: v}})}
              />
            </AccordionContent>
          </AccordionItem>
          
          {/* ... 나머지 섹션 */}
        </Accordion>
        
        <Button onClick={handleCalculate} className="w-full mt-8">
          계산하기
        </Button>
      </div>
      
      {/* 결과 패널 (고정) */}
      <div className="lg:sticky lg:top-8 lg:h-screen">
        {result && <ResultPanel result={result} />}
      </div>
    </div>
  );
}
체크리스트:

 섹션 1: 기본입력사항
 섹션 2: 기본공제
 섹션 3: 추가공제
 Accordion 컴포넌트
 입력 필드 컴포넌트들
 툴팁 컴포넌트
 반응형 레이아웃


#### TASK-303: 계산기 페이지 - 섹션 4-7
🔴 P0 | 담당: FE2 | 공수: 20h
체크리스트:

 섹션 4: 연금보험료공제
 섹션 5: 특별소득공제
 섹션 6: 그 밖의 소득공제
 섹션 7: 세액공제
 자동계산 버튼 UI
 입력 검증 및 에러 표시

#### TASK-304: 결과 패널    
🔴 P0 | 담당: FE2 | 공수: 8h

// components/ResultPanel.tsx

export function ResultPanel({ result }: { result: TaxCalculationResult }) {
  return (
    <Card className="sticky top-8">
      <h3 className="text-2xl font-bold mb-6">계산 결과</h3>
      
      {/* 최종 환급액 */}
      <div className="mb-6 p-4 bg-accent-1/10 border-3 border-accent-1">
        <p className="text-sm text-gray-600">환급 예상액</p>
        <p className="text-4xl font-black text-accent-1">
          {result.totalRefund.toLocaleString()}원
        </p>
      </div>
      
      {/* 계산 단계 */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>총급여</span>
          <span className="font-bold">{result.totalSalary.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>- 근로소득공제</span>
          <span>{result.incomeDeduction.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span>= 근로소득금액</span>
          <span className="font-bold">{result.taxableIncome.toLocaleString()}원</span>
        </div>
        
        {/* ... 나머지 단계 */}
        
        <div className="border-t-3 border-black pt-3 mt-3">
          <div className="flex justify-between font-bold">
            <span>결정세액</span>
            <span>{result.finalTax.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span>기납부세액</span>
            <span>{result.prepaidTax.toLocaleString()}원</span>
          </div>
        </div>
      </div>
      
      {/* 저장 버튼 */}
      <Button className="w-full mt-6">결과 저장</Button>
    </Card>
  );
}
체크리스트:

 결과 패널 UI
 계산 단계별 표시
 환급/추가납부 표시
 저장 기능
 인쇄 기능

### Sprint 3.2: Admin 페이지 (Day 16-20)
#### TASK-305: Admin 페이지 레이아웃
🟠 P1 | 담당: FE1, UX | 공수: 12h
// app/(main)/admin/page.tsx

export default function AdminPage() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState(1);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-black mb-8">⚙️ 관리자 페이지</h1>
      
      {/* 연도/월 선택 */}
      <div className="flex gap-4 mb-8">
        <Select
          options={[2025, 2024, 2023]}
          value={selectedYear}
          onChange={setSelectedYear}
        />
        <Select
          options={[1,2,3,4,5,6,7,8,9,10,11,12]}
          value={selectedMonth}
          onChange={setSelectedMonth}
        />
      </div>
      
      {/* 카테고리별 입력 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeSection year={selectedYear} month={selectedMonth} />
        <CardUsageSection year={selectedYear} month={selectedMonth} />
        <InsuranceSection year={selectedYear} />
        <PensionSection year={selectedYear} />
      </div>
    </div>
  );
}
체크리스트:

 레이아웃 구조
 연도/월 선택기
 카테고리별 섹션 컴포넌트
 반응형 디자인

#### TASK-306: 급여 입력 섹션
🟠 P1 | 담당: FE1 | 공수: 8h
// components/admin/IncomeSection.tsx

export function IncomeSection({ year, month }: { year: number; month: number }) {
  const [income, setIncome] = useState<MonthlyIncome>(defaultIncome);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/admin/income/${year}/${month}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(income),
      });
      
      toast.success('저장되었습니다');
      
      // WebSocket을 통해 계산기에 실시간 반영
    } catch (error) {
      toast.error('저장 실패');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">💰 급여 ({year}년 {month}월)</h3>
      
      <NumberInput
        label="총급여"
        value={income.grossSalary}
        onChange={(v) => setIncome({...income, grossSalary: v})}
      />
      <NumberInput
        label="상여금"
        value={income.bonus}
        onChange={(v) => setIncome({...income, bonus: v})}
      />
      <NumberInput
        label="국민연금"
        value={income.nationalPension}
        onChange={(v) => setIncome({...income, nationalPension: v})}
      />
      
      {/* ... 나머지 필드 */}
      
      <div className="flex gap-2 mt-4">
        <Button onClick={handleSave} loading={isSaving}>
          저장
        </Button>
        <Button variant="outline" onClick={() => setIncome(defaultIncome)}>
          초기화
        </Button>
      </div>
    </Card>
  );
}
체크리스트:

 급여 입력 폼
 자동저장 기능
 WebSocket 동기화
 로딩 상태 처리

#### TASK-307: 파일 업로드 UI
🟠 P1 | 담당: FE2 | 공수: 12h
// components/admin/FileUpload.tsx

export function FileUpload({ type, year, month }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('year', year.toString());
    formData.append('month', month.toString());
    
    try {
      const response = await fetch('/api/admin/upload/excel', {
        method: 'POST',
        body: formData,
      });
      
      const { uploadId } = await response.json();
      
      // Poll for status
      await pollUploadStatus(uploadId, (progress) => {
        setProgress(progress);
      });
      
      toast.success('업로드 완료');
    } catch (error) {
      toast.error('업로드 실패');
    } finally {
      setUploading(false);
      setFile(null);
      setProgress(0);
    }
  };
  
  return (
    <div className="border-3 border-dashed border-gray-300 rounded p-6">
      {/* Drag & Drop 영역 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="text-center"
      >
        <Upload className="mx-auto mb-4 w-12 h-12 text-gray-400" />
        <p className="mb-2">파일을 드래그하거나 클릭하여 업로드</p>
        <input
          type="file"
          accept=".xlsx,.csv,.jpg,.png"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button as="span" variant="outline">
            파일 선택
          </Button>
        </label>
      </div>
      
      {/* 파일 정보 */}
      {file && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="text-sm font-medium">{file.name}</p>
          <p className="text-xs text-gray-600">
            {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}
      
      {/* 업로드 버튼 */}
      {file && !uploading && (
        <Button onClick={handleUpload} className="w-full mt-4">
          업로드
        </Button>
      )}
      
      {/* 프로그레스 바 */}
      {uploading && (
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-full bg-accent-1 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-center mt-2">{progress}%</p>
        </div>
      )}
    </div>
  );
}
체크리스트:

 Drag & Drop UI
 파일 선택 UI
 업로드 진행률 표시
 지원 파일 형식 체크
 에러 처리

#### TASK-308: Admin API 엔드포인트
🟠 P1 | 담당: BE1 | 공수: 12h
// app/api/admin/income/[year]/[month]/route.ts

export async function POST(
  req: Request,
  { params }: { params: { year: string; month: string } }
) {
  const user = await authMiddleware(req);
  const data = await req.json();
  
  const year = parseInt(params.year);
  const month = parseInt(params.month);
  
  // Upsert monthly income
  const income = await prisma.monthlyIncome.upsert({
    where: {
      userId_year_month: {
        userId: user.userId,
        year,
        month,
      },
    },
    update: data,
    create: {
      userId: user.userId,
      year,
      month,
      ...data,
    },
  });
  
  // Trigger WebSocket notification
  wss.sendToUser(user.userId, {
    type: 'sync',
    entity: 'income',
    action: 'update',
    data: income,
  });
  
  // Update calculation automatically
  await updateCalculation(user.userId, year);
  
  return NextResponse.json(income);
}
체크리스트:

 POST /api/admin/income/:year/:month
 POST /api/admin/cards/:year/:month
 POST /api/admin/insurance/:year
 WebSocket 동기화
 자동 계산 업데이트
 테스트

#### Sprint 3.3: 테스트 및 버그 수정 (Day 18-20)
#### TASK-309: E2E 테스트 작성
🟡 P2 | 담당: QA | 공수: 12h
// e2e/calculation-flow.spec.ts

import { test, expect } from '@playwright/test';

test.describe('연말정산 계산 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name=email]', 'test@example.com');
    await page.fill('[name=password]', 'password123');
    await page.click('button[type=submit]');
  });
  
  test('기본 계산 플로우', async ({ page }) => {
    // 계산기 페이지 이동
    await page.goto('/calculator');
    
    // 총급여 입력
    await page.fill('[name=totalSalary]', '50000000');
    
    // 자녀 선택
    await page.selectOption('[name="dependents.children"]', '2');
    
    // 계산 버튼 클릭
    await page.click('button:has-text("계산하기")');
    
    // 결과 확인
    await expect(page.locator('.result-panel')).toBeVisible();
    await expect(page.locator('.refund-amount')).toContainText('원');
  });
  
  test('Admin 데이터 입력 및 동기화', async ({ page }) => {
    await page.goto('/admin');
    
    // 급여 입력
    await page.fill('[name=grossSalary]', '5000000');
    await page.click('button:has-text("저장")');
    
    // 저장 확인
    await expect(page.locator('.toast')).toContainText('저장되었습니다');
    
    // 계산기로 이동하여 반영 확인
    await page.goto('/calculator');
    await expect(page.locator('[name=totalSalary]')).toHaveValue('60000000'); // 12개월 합계
  });
});
체크리스트:

 회원가입 플로우 테스트
 로그인 플로우 테스트
 계산기 입력 테스트
 Admin 데이터 입력 테스트
 실시간 동기화 테스트
 모바일 반응형 테스트

#### TASK-310: 버그 수정 및 성능 최적화
🔴 P0 | 담당: 전체팀 | 공수: 16h
체크리스트:

 발견된 버그 수정
 성능 프로파일링
 번들 크기 최적화
 이미지 최적화
 코드 스플리팅
 Lighthouse 점수 90+ 달성


#### Phase 2: 고도화 (Week 5-8)
#### Week 5-6: AI 분석 및 OCR (Day 21-30)
#### Sprint 4.1: AI 서비스 구축 (Day 21-25)
#### TASK-401: Python FastAPI 서버 설정
🟠 P1 | 담당: AI | 공수: 8h     

# ai_service/main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
import os

app = FastAPI()

llm = ChatOpenAI(
    model="gpt-4-turbo",
    temperature=0.2,
    api_key=os.getenv("OPENAI_API_KEY")
)

class AnalysisRequest(BaseModel):
    calculationId: str
    userData: dict

@app.post("/api/ai/analyze")
async def analyze_tax_data(request: AnalysisRequest):
    try:
        analyses = await generate_tax_tips(request.userData)
        return {"analyses": analyses, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def generate_tax_tips(userData: dict) -> list:
    prompt = ChatPromptTemplate.from_messages([
        ("system", """당신은 한국 연말정산 전문가입니다.
        사용자의 데이터를 분석하여 실질적인 절세 팁을 제공하세요.
        
        응답 형식 (JSON):
        [
          {{
            "priority": "high|medium|low",
            "title": "20자 이내 제목",
            "content": "100자 이내 설명",
            "potentialSavings": 금액,
            "actionItems": ["실행 방법 1", "실행 방법 2"]
          }}
        ]
        """),
        ("user", "사용자 데이터:\\n{user_data}")
    ])
    
    chain = LLMChain(llm=llm, prompt=prompt)
    result = await chain.arun(user_data=str(userData))
    
    return json.loads(result)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

체크리스트:

 FastAPI 프로젝트 설정
 OpenAI API 연동
 LangChain 설정
 API 엔드포인트 구현
 에러 핸들링
 테스트

#### TASK-402: Vector DB 설정 및 세법 지식 임베딩
🟠 P1 | 담당: AI | 공수: 12h
# ai_service/vectorstore.py

from langchain.vectorstores import Pinecone
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
import pinecone

# Initialize Pinecone
pinecone.init(
    api_key=os.getenv("PINECONE_API_KEY"),
    environment=os.getenv("PINECONE_ENVIRONMENT")
)

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

def create_tax_knowledge_base():
    """세법 문서를 벡터 DB에 저장"""
    
    # 세법 문서 로드
    documents = load_tax_documents()  # 소득세법, 조세특례제한법 등
    
    # 청크로 분할
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = text_splitter.split_documents(documents)
    
    # Pinecone에 저장
    vectorstore = Pinecone.from_documents(
        documents=chunks,
        embedding=embeddings,
        index_name="tax-knowledge-base"
    )
    
    return vectorstore

def retrieve_relevant_laws(query: str, k: int = 5):
    """관련 세법 검색"""
    vectorstore = Pinecone.from_existing_index("tax-knowledge-base", embeddings)
    docs = vectorstore.similarity_search(query, k=k)
    return docs

 체크리스트:

 Pinecone 인덱스 생성
 소득세법 문서 수집 및 전처리
 문서 청크 분할
 벡터 임베딩 및 저장
 검색 기능 테스트
 10,000개 이상 청크 저장

#### TASK-403: 세법 변경 크롤러
🟠 P1 | 담당: AI, BE2 | 공수: 16h
# ai_service/scraper.py

from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import asyncio
from datetime import datetime

async def scrape_nts_announcements():
    """국세청 공지사항 크롤링"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        await page.goto('https://www.nts.go.kr/nts/na/ntt/selectNttList.do?mi=2445&bbsId=1092')
        await page.wait_for_selector('.board-list')
        
        content = await page.content()
        soup = BeautifulSoup(content, 'html.parser')
        
        announcements = []
        for item in soup.select('.board-list tbody tr'):
            title_elem = item.select_one('.subject a')
            if not title_elem:
                continue
                
            title = title_elem.text.strip()
            link = title_elem['href']
            date_elem = item.select_one('.date')
            date = date_elem.text.strip() if date_elem else None
            
            # 연말정산 관련 키워드 필터링
            if any(keyword in title for keyword in ['연말정산', '세액공제', '소득공제', '기부금', '신용카드']):
                announcements.append({
                    'title': title,
                    'link': f"https://www.nts.go.kr{link}",
                    'date': date,
                    'source': '국세청'
                })
        
        await browser.close()
        return announcements

async def detect_law_changes(announcements: list) -> list:
    """AI로 세법 변경사항 감지 및 분석"""
    changes = []
    
    for announcement in announcements:
        # 전체 내용 가져오기
        content = await fetch_announcement_content(announcement['link'])
        
        # AI 분석
        prompt = f"""
        다음 공지사항을 분석하여 연말정산에 영향을 미치는 세법 변경사항인지 판단하세요.
        
        제목: {announcement['title']}
        내용: {content[:2000]}
        
        다음 JSON 형식으로 응답하세요:
        {{
            "isLawChange": true/false,
            "summary": "3줄 이내 요약",
            "impactLevel": "high/medium/low",
            "affectedCategories": ["deduction", "credit", "rate"],
            "effectiveDate": "YYYY-MM-DD"
        }}
        """
        
        result = await llm.apredict(prompt)
        parsed = json.loads(result)
        
        if parsed['isLawChange']:
            changes.append({
                **announcement,
                **parsed
            })
    
    return changes

# Scheduler (AWS Lambda / Cron)
async def daily_tax_law_check():
    """매일 실행되는 세법 변경 체크"""
    announcements = await scrape_nts_announcements()
    changes = await detect_law_changes(announcements)
    
    # 데이터베이스에 저장
    for change in changes:
        await save_tax_law_change(change)
        
        # 사용자에게 알림
        await notify_users_about_change(change)

 체크리스트:

 Playwright 설정
 국세청 크롤러 구현
 기획재정부 크롤러 구현
 AI 변경사항 감지
 스케줄러 설정 (AWS Lambda)
 알림 시스템 연동
 테스트

#### TASK-404: AI 분석 API 통합
🟠 P1 | 담당: BE1 | 공수: 8h

// app/api/ai/analyze/route.ts

export async function POST(req: Request) {
  const user = await authMiddleware(req);
  const { calculationId } = await req.json();
  
  // Get calculation data
  const calculation = await prisma.taxCalculation.findUnique({
    where: { id: calculationId },
    include: {
      monthlyIncomes: true,
      cardUsages: true,
      // ...
    },
  });
  
  if (!calculation) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  // Call AI service
  const response = await fetch('http://ai-service:8000/api/ai/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      calculationId,
      userData: calculation,
    }),
  });
  
  const { analyses } = await response.json();
  
  // Save analyses to database
  await Promise.all(
    analyses.map(analysis =>
      prisma.aiAnalysis.create({
        data: {
          userId: user.userId,
          calculationId,
          priority: analysis.priority,
          title: analysis.title,
          content: analysis.content,
          potentialSavings: analysis.potentialSavings,
          actionItems: JSON.stringify(analysis.actionItems),
        },
      })
    )
  );
  
  return NextResponse.json({ analyses });
}

**체크리스트:**
- [ ] AI 서비스 호출 로직 구현
- [ ] 분석 결과 DB 저장 (AiAnalysis 테이블)
- [ ] 에러 핸들링 (Timeouts, API failures)
- [ ] 비동기 처리 및 응답 최적화
- [ ] 통합 테스트 (API + AI Service)

---

### Sprint 4.2: OCR 파이프라인 (Day 26-28)

#### TASK-405: OCR 이미지 처리 파이프라인
🟠 **P1** | **담당:** BE2 | **공수:** 10h

**작업 내용:**
1. **Google Vision API 연동**: 이미지 텍스트 추출
2. **GPT-4 Vision 파싱**: 비정형 텍스트 → 구조화된 JSON 데이터 변환
3. **이미지 전처리**: Resizing, Grayscale 변환

```typescript
// lib/ocr/pipeline.ts 구조
export async function processImage(buffer: Buffer) {
  // 1. Upload to S3
  // 2. Google Vision API OCR
  // 3. GPT-4 Parsing
  // 4. Data Validation
}
```

**체크리스트:**
- [ ] Google Cloud Vision API 프로젝트 설정 및 키 발급
- [ ] 이미지 업로드 (S3) 및 URL 생성
- [ ] OCR 텍스트 추출 서비스 구현
- [ ] LLM 프롬프트 최적화 (급여명세서, 영수증 파싱)
- [ ] 개인정보(주민번호 등) 마스킹 처리

#### TASK-406: OCR 백그라운드 작업 처리
🟡 **P2** | **담당:** BE2 | **공수:** 6h

**작업 내용:**
- 대용량/고화질 이미지 처리를 위한 비동기 큐 도입
- 작업 상태(Pending, Processing, Completed, Failed) 관리

**체크리스트:**
- [ ] 작업 큐(Queue) 설정 (Redis/BullMQ)
- [ ] 상태 조회 API 구현
- [ ] 처리 완료 시 WebSocket 알림

---

### Sprint 4.3: 모바일 최적화 및 엑셀 (Day 29-30)

#### TASK-407: 엑셀 대량 업로드 처리
🟠 **P1** | **담당:** BE1 | **공수:** 8h

**작업 내용:**
- XLSX/CSV 라이브러리 활용 서버 사이드 파싱
- 대량 데이터 유효성 검사 및 Bulk Insert

**체크리스트:**
- [ ] 엑셀 파싱 유틸리티 구현
- [ ] Row 단위 데이터 유효성 검사 (Zod)
- [ ] 트랜잭션 처리 및 Bulk Insert
- [ ] 에러 리포트 생성 (실패한 Row 안내)

#### TASK-408: 모바일 반응형 UI 보완
🔴 **P0** | **담당:** FE1, FE2 | **공수:** 12h

**작업 내용:**
- 모바일 뷰포트 최적화, 터치 타겟 조정
- 복잡한 테이블의 모바일 카드 뷰 변환

**체크리스트:**
- [ ] 메인 레이아웃 모바일 대응 (Navigation Bar)
- [ ] 입력 폼 모바일 최적화 (Input type, Keyboard)
- [ ] 결과 대시보드 모바일 뷰 구현
- [ ] 실제 모바일 기기 테스트

---

# Phase 3: 완성 및 고도화 (Week 9-12)

## Week 9: 보안 및 외부 연동 (Day 41-45)

### Sprint 5.1: 보안 강화 및 외부 API

#### TASK-501: 데이터 암호화 및 보안 감사
🔴 **P0** | **담당:** BE1 | **공수:** 12h

**작업 내용:**
- 개인정보(PII) 데이터베이스 암호화 적용
- API 보안 헤더 및 요청 검증 강화

**체크리스트:**
- [ ] DB 컬럼 암호화 (AES-256) 적용
- [ ] 보안 미들웨어 강화 (Helmet, Rate Limit)
- [ ] SQL Injection, XSS 취약점 점검

#### TASK-502: 카드사 API 연동 (Mock)
🟡 **P2** | **담당:** BE2 | **공수:** 16h

**작업 내용:**
- 금융결제원 또는 카드사 API 명세 구현
- 실제 연동 전 테스트를 위한 Mock Server 구축

**체크리스트:**
- [ ] 카드사 인증 프로세스 (OAuth 2.0) 구현
- [ ] 월별 카드 사용내역 조회 API 구현
- [ ] Mock 데이터 생성 및 테스트 시나리오 작성

---

## Week 10: 리포트 및 문서화 (Day 46-50)

### Sprint 5.2: 리포팅 및 마무리

#### TASK-503: PDF 리포트 생성
🟢 **P3** | **담당:** FE2 | **공수:** 12h

**작업 내용:**
- 연말정산 최종 결과를 깔끔한 PDF 리포트로 제공
- 클라이언트 또는 서버 사이드 PDF 렌더링

**체크리스트:**
- [ ] 리포트 UI 템플릿 디자인
- [ ] PDF 생성 라이브러리 연동 (React-pdf 등)
- [ ] 다운로드 및 인쇄 기능 구현

#### TASK-504: 최종 사용자 및 API 문서화
🟠 **P1** | **담당:** All | **공수:** 8h

**작업 내용:**
- 사용자를 위한 기능 가이드 및 개발자를 위한 API 문서

**체크리스트:**
- [ ] 사용자 매뉴얼(User Guide) 작성
- [ ] API 명세서 최신화 (Swagger/OpenAPI)
- [ ] 배포 및 운영 가이드 작성

---

## Week 11: 성능 최적화 (Day 51-55)

### Sprint 6.1: 성능 튜닝

#### TASK-601: 백엔드 성능 최적화
🟠 **P1** | **담당:** BE1 | **공수:** 16h

**체크리스트:**
- [ ] 데이터베이스 인덱스 최적화 및 실행 계획 분석
- [ ] N+1 Query 문제 해결
- [ ] Redis 캐싱 적용 범위 확대
- [ ] API 응답 속도 모니터링 및 개선

#### TASK-602: 프론트엔드 최적화
🟠 **P1** | **담당:** FE1 | **공수:** 16h

**체크리스트:**
- [ ] Lighthouse 성능 점수 90점 이상 달성
- [ ] 이미지 최적화 (Next/Image, WebP)
- [ ] 번들 사이즈 감소 (Code Splitting, Tree Shaking)
- [ ] 렌더링 최적화 (Memoization)

---

## Week 12: 최종 점검 및 배포 (Day 56-60)

### Sprint 6.2: 런칭 준비

#### TASK-603: 최종 QA 및 버그 수정
🔴 **P0** | **담당:** QA, All | **공수:** 20h

**체크리스트:**
- [ ] 전체 기능 통합 테스트 (E2E)
- [ ] 모바일/데스크톱 크로스 브라우징 테스트
- [ ] 버그 수정 및 회귀 테스트

#### TASK-604: 프로덕션 배포
🔴 **P0** | **담당:** DevOps | **공수:** 8h

**체크리스트:**
- [ ] 프로덕션 환경 구성 (검증)
- [ ] 도메인 연결 및 SSL 적용
- [ ] 로깅 및 모니터링 시스템(Sentry, CloudWatch) 최종 점검
- [ ] 서비스 런칭

---