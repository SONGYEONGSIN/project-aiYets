# TRD: AI 기반 연말정산 계산기 기술 명세서

**버전:** 1.0  
**작성일:** 2025-01-19  
**작성자:** Engineering Team  
**상태:** Draft

---

## 목차

1. [시스템 아키텍처](#1-시스템-아키텍처)
2. [기술 스택](#2-기술-스택)
3. [데이터베이스 스키마](#3-데이터베이스-스키마)
4. [API 설계](#4-api-설계)
5. [AI 서비스 아키텍처](#5-ai-서비스-아키텍처)
6. [OCR 처리 파이프라인](#6-ocr-처리-파이프라인)
7. [실시간 동기화](#7-실시간-동기화-websocket)
8. [보안](#8-보안)
9. [성능 최적화](#9-성능-최적화)
10. [모니터링 및 로깅](#10-모니터링-및-로깅)
11. [배포 전략](#11-배포-전략)
12. [테스트 전략](#12-테스트-전략)
13. [용량 계획](#13-용량-계획)
14. [마이그레이션 전략](#14-마이그레이션-전략)
15. [문서화](#15-문서화)

---

## 1. 시스템 아키텍처

### 1.1 전체 구조도
```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                       │
│  ┌──────────────┐  ┌──────────────┐                 │
│  │   Web App    │  │  Mobile App  │                 │
│  │  (React 18)  │  │  (React 18)  │                 │
│  │  Next.js 14  │  │  Next.js 14  │                 │
│  └──────┬───────┘  └──────┬───────┘                 │
└─────────┼──────────────────┼───────────────────────┘
          │                  │
     HTTPS │              WSS │
          │                  │
┌─────────▼──────────────────▼───────────────────────┐
│              API Gateway Layer                      │
│         Next.js API Routes + Middleware             │
│  ┌──────────────────────────────────────────────┐  │
│  │  Rate Limiting │ Auth │ CORS │ Validation   │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
          │
    ┌─────┼─────┬─────────────┬──────────────┐
    │     │     │             │              │
┌───▼───┐ │ ┌───▼──────┐ ┌───▼───────┐ ┌───▼──────┐
│Business│ │ │   AI     │ │  WebSocket│ │ External │
│ Logic  │ │ │ Service  │ │  Service  │ │ Services │
│Node.js │ │ │ Python   │ │  Node.js  │ │          │
└────┬───┘ │ └────┬─────┘ └─────┬─────┘ └─────┬────┘
     │     │      │             │             │
     │     │      │       ┌─────▼─────┐       │
     │     │      │       │  Redis    │       │
     │     │      │       │ (PubSub)  │       │
     │     │      │       └───────────┘       │
     │     │      │                           │
     │     │  ┌───▼──────────┐                │
     │     │  │  Vector DB   │                │
     │     │  │  (Pinecone)  │                │
     │     │  └──────────────┘                │
     │     │                                   │
┌────▼─────▼────────────────────────┐          │
│       Database Layer               │          │
│  ┌──────────┐  ┌──────────────┐   │          │
│  │PostgreSQL│  │     Redis     │   │          │
│  │  (RDS)   │  │   (Cache)     │   │          │
│  │  16.0    │  │   7.2         │   │          │
│  └──────────┘  └──────────────┘   │          │
└────────────────────────────────────┘          │
                                                │
┌───────────────────────────────────────────────▼──┐
│              External Services                    │
│  • OpenAI API (GPT-4 Turbo)                       │
│  • Google Vision API (OCR)                        │
│  • AWS S3 (File Storage)                          │
│  • Card Company APIs (Optional)                   │
│  • Sentry (Error Tracking)                        │
│  • Vercel Analytics                               │
└───────────────────────────────────────────────────┘
```

### 1.2 데이터 흐름

#### 사용자 입력 → 계산 결과
```
1. User Input (Frontend)
   ↓
2. API Request (REST)
   ↓
3. Validation (Zod)
   ↓
4. Business Logic (Tax Calculator)
   ↓
5. Database Save (PostgreSQL)
   ↓
6. WebSocket Broadcast (실시간 동기화)
   ↓
7. AI Analysis Trigger (Background Job)
   ↓
8. Response (JSON)
```

#### Admin 데이터 입력 → 실시간 반영
```
1. Admin Upload (Excel/Image)
   ↓
2. File Storage (S3)
   ↓
3. Background Job (OCR/Parse)
   ↓
4. Database Update
   ↓
5. WebSocket Broadcast
   ↓
6. Frontend Auto Update
   ↓
7. Recalculate Tax (Automatic)
```

---

## 2. 기술 스택

### 2.1 Frontend
```json
{
  "framework": "Next.js 14.0.4 (App Router)",
  "language": "TypeScript 5.3",
  "ui-library": "React 18.2",
  "state-management": {
    "global": "Zustand 4.4",
    "server": "TanStack Query 5.17"
  },
  "styling": {
    "css-framework": "Tailwind CSS 3.4",
    "animation": "Framer Motion 10.18"
  },
  "forms": {
    "validation": "React Hook Form 7.49 + Zod 3.22",
    "file-upload": "react-dropzone"
  },
  "charts": "Recharts 2.10",
  "utils": {
    "date": "date-fns 3.0",
    "toast": "sonner",
    "icons": "lucide-react"
  }
}
```

**주요 라이브러리 선택 이유:**
- **Next.js 14**: App Router, Server Components, Server Actions 활용
- **Zustand**: 간단한 API, TypeScript 지원 우수
- **TanStack Query**: 서버 상태 관리, 캐싱, 자동 refetch
- **Tailwind CSS**: 빠른 개발, 네오브루탈리즘 디자인 구현 용이
- **Zod**: TypeScript와 완벽한 통합, 런타임 검증

### 2.2 Backend
```json
{
  "runtime": "Node.js 20 LTS",
  "framework": "Next.js 14 API Routes",
  "language": "TypeScript 5.3",
  "orm": "Prisma 5.7",
  "validation": "Zod 3.22",
  "authentication": "NextAuth.js v5 (Auth.js)",
  "security": {
    "password-hashing": "bcrypt",
    "jwt": "jsonwebtoken",
    "rate-limiting": "express-rate-limit",
    "helmet": "helmet.js"
  },
  "websocket": "Socket.io 4.6"
}
```

### 2.3 AI/ML Service
```python
{
  "runtime": "Python 3.11",
  "framework": "FastAPI 0.109",
  "ai-framework": "LangChain 0.1.0",
  "llm": "OpenAI GPT-4-Turbo-Preview",
  "embeddings": "OpenAI text-embedding-3-large",
  "vector-db": "Pinecone",
  "web-scraping": "Playwright + BeautifulSoup4",
  "async": "asyncio + httpx"
}
```

### 2.4 Database & Cache
```yaml
Primary Database:
  engine: PostgreSQL 16
  provider: AWS RDS
  instance: db.t3.medium (2 vCPU, 4GB RAM)
  storage: 100GB gp3 (3000 IOPS)
  backup: Automated daily (7-day retention)
  encryption: AES-256

Cache & Session:
  engine: Redis 7.2
  provider: AWS ElastiCache
  instance: cache.t3.micro
  purpose:
    - Session store
    - API response cache
    - Rate limiting
    - WebSocket PubSub

Vector Database:
  provider: Pinecone (Managed)
  index: tax-knowledge-base
  dimension: 3072
  metric: cosine
  pods: 1x s1
```

### 2.5 Infrastructure
```yaml
Hosting:
  platform: Vercel
  regions: 
    - Seoul (primary)
    - Tokyo (failover)
  cdn: Vercel Edge Network
  functions: Edge Runtime + Serverless

File Storage:
  service: AWS S3
  bucket: tax-calculator-uploads
  region: ap-northeast-2
  encryption: SSE-S3
  lifecycle: 1 year retention

Background Jobs:
  service: AWS Lambda
  trigger: EventBridge (Cron)
  jobs:
    - Daily tax law scraping
    - Monthly data aggregation
    - Email notifications

Monitoring:
  error-tracking: Sentry
  performance: Vercel Analytics
  logs: CloudWatch Logs
  uptime: Uptime Robot
```

---

## 3. 데이터베이스 스키마

### 3.1 ERD
```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │──┐
│ email       │  │
│ password    │  │
│ name        │  │
│ phone       │  │
│ createdAt   │  │
│ updatedAt   │  │
│ lastLogin   │  │
└─────────────┘  │
                 │
      ┌──────────┴────────────────────┬─────────────┬──────────────┐
      │                               │             │              │
      ▼                               ▼             ▼              ▼
┌──────────────┐              ┌──────────────┐ ┌─────────┐  ┌──────────┐
│TaxCalculation│              │MonthlyIncome │ │CardUsage│  │Insurance │
├──────────────┤              ├──────────────┤ ├─────────┤  ├──────────┤
│ id (PK)      │              │ id (PK)      │ │id (PK)  │  │id (PK)   │
│ userId (FK)  │              │ userId (FK)  │ │userId   │  │userId    │
│ year         │              │ year         │ │year     │  │year      │
│ totalSalary  │              │ month        │ │month    │  │type      │
│ refundAmount │              │ grossSalary  │ │credit   │  │amount    │
│ ...          │              │ ...          │ │...      │  │...       │
└──────────────┘              └──────────────┘ └─────────┘  └──────────┘
      │
      │
      ▼
┌──────────────┐
│ AiAnalysis   │
├──────────────┤
│ id (PK)      │
│ userId (FK)  │
│ calcId (FK)  │
│ priority     │
│ title        │
│ content      │
│ savings      │
└──────────────┘
```

### 3.2 주요 테이블 스키마

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

#### TaxCalculations Table
```sql
CREATE TABLE tax_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  year INT NOT NULL,
  
  -- Basic amounts
  total_salary BIGINT NOT NULL,
  income_deduction BIGINT,
  taxable_income BIGINT,
  
  -- Deductions
  personal_deductions BIGINT DEFAULT 0,
  pension_deductions BIGINT DEFAULT 0,
  special_deductions BIGINT DEFAULT 0,
  other_deductions BIGINT DEFAULT 0,
  total_deductions BIGINT,
  
  -- Tax calculation
  tax_base BIGINT,
  calculated_tax BIGINT,
  tax_credits BIGINT DEFAULT 0,
  earned_income_credit BIGINT DEFAULT 0,
  total_credits BIGINT,
  
  -- Final result
  final_tax BIGINT,
  prepaid_tax BIGINT,
  refund_amount BIGINT,
  local_income_tax BIGINT,
  total_refund BIGINT,
  
  -- Full data (JSON)
  data JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_user_year UNIQUE(user_id, year)
);

CREATE INDEX idx_calculations_user_year ON tax_calculations(user_id, year);
CREATE INDEX idx_calculations_created_at ON tax_calculations(created_at DESC);
```

#### MonthlyIncomes Table
```sql
CREATE TABLE monthly_incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  year INT NOT NULL,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  
  gross_salary BIGINT NOT NULL,
  bonus BIGINT DEFAULT 0,
  non_taxable_income BIGINT DEFAULT 0,
  
  national_pension BIGINT,
  health_insurance BIGINT,
  employment_insurance BIGINT,
  withheld_tax BIGINT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_user_year_month UNIQUE(user_id, year, month)
);

CREATE INDEX idx_monthly_incomes_user_year ON monthly_incomes(user_id, year);
```

#### CardUsages Table
```sql
CREATE TABLE card_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  year INT NOT NULL,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  
  credit_card BIGINT DEFAULT 0,
  debit_card BIGINT DEFAULT 0,
  cash_receipt BIGINT DEFAULT 0,
  traditional_market BIGINT DEFAULT 0,
  public_transport BIGINT DEFAULT 0,
  culture_sports BIGINT DEFAULT 0,
  
  source VARCHAR(50), -- 'manual' | 'api' | 'excel' | 'ocr'
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_user_year_month_card UNIQUE(user_id, year, month)
);

CREATE INDEX idx_card_usages_user_year ON card_usages(user_id, year);
```

#### AiAnalyses Table
```sql
CREATE TABLE ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  calculation_id UUID REFERENCES tax_calculations(id) ON DELETE CASCADE,
  
  analysis_type VARCHAR(50), -- 'tips' | 'law_changes' | 'optimization'
  priority VARCHAR(10), -- 'high' | 'medium' | 'low'
  
  title VARCHAR(200),
  content TEXT,
  potential_savings BIGINT,
  action_items JSONB,
  
  is_read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT check_priority CHECK (priority IN ('high', 'medium', 'low'))
);

CREATE INDEX idx_ai_analyses_user_unread ON ai_analyses(user_id, is_read);
CREATE INDEX idx_ai_analyses_created_at ON ai_analyses(created_at DESC);
```

#### TaxLawChanges Table
```sql
CREATE TABLE tax_law_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  year INT NOT NULL,
  title VARCHAR(300) NOT NULL,
  summary TEXT,
  source_url TEXT,
  impact_level VARCHAR(10), -- 'high' | 'medium' | 'low'
  affected_categories JSONB, -- ['deduction', 'credit', 'rate']
  
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tax_law_changes_year ON tax_law_changes(year DESC);
CREATE INDEX idx_tax_law_changes_impact ON tax_law_changes(impact_level);
```

#### FileUploads Table
```sql
CREATE TABLE file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  file_type VARCHAR(50), -- 'excel' | 'image' | 'pdf'
  file_name VARCHAR(255),
  file_url TEXT NOT NULL,
  file_size BIGINT,
  
  processing_status VARCHAR(20), -- 'pending' | 'processing' | 'completed' | 'failed'
  ocr_result JSONB,
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);

CREATE INDEX idx_file_uploads_user_status ON file_uploads(user_id, processing_status);
```

#### AuditLogs Table
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_action ON audit_logs(user_id, action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
```

---

## 4. API 설계

### 4.1 RESTful API Endpoints

#### Authentication APIs

**POST /api/auth/signup**
```typescript
// Request
{
  email: string;      // Required, email format
  password: string;   // Required, min 8 chars
  name: string;       // Required, min 2 chars
  phone?: string;     // Optional
}

// Response 201
{
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  };
  token: string;
  expiresIn: number;
}

// Error 400
{
  error: string;
  details?: Record<string, string[]>;
}
```

**POST /api/auth/login**
```typescript
// Request
{
  email: string;
  password: string;
}

// Response 200
{
  user: UserDTO;
  token: string;
  expiresIn: number;
}

// Error 401
{
  error: "Invalid credentials"
}
```

**POST /api/auth/logout**
```typescript
// Request
// No body (uses JWT from header)

// Response 200
{
  message: "Logged out successfully"
}
```

---

#### Tax Calculation APIs

**GET /api/calculations**
```typescript
// Query params
?year=2025&page=1&limit=10

// Response 200
{
  calculations: Array<{
    id: string;
    year: number;
    totalSalary: number;
    refundAmount: number;
    createdAt: string;
    updatedAt: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**GET /api/calculations/:id**
```typescript
// Response 200
{
  id: string;
  year: number;
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
  taxCredits: number;
  earnedIncomeCredit: number;
  totalCredits: number;
  finalTax: number;
  prepaidTax: number;
  refundAmount: number;
  localIncomeTax: number;
  totalRefund: number;
  data: TaxCalculationDetail;
  createdAt: string;
  updatedAt: string;
}
```

**POST /api/calculations**
```typescript
// Request
{
  year: number;
  totalSalary: number;
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
  nationalPension: number;
  publicPension?: number;
  healthInsurance: number;
  employmentInsurance: number;
  housing?: {
    loan?: number;
    interest?: number;
    rent?: number;
  };
  cardUsage?: {
    creditCard: number;
    debitCard: number;
    cashReceipt: number;
    traditionalMarket: number;
    publicTransport: number;
    cultureSports: number;
  };
  pensionSavings?: number;
  retirementPension?: number;
  insurance?: number;
  medicalExpenses?: number;
  educationExpenses?: number;
  donations?: {
    political?: number;
    hometown?: number;
    general?: number;
    religious?: number;
  };
  prepaidTax: number;
}

// Response 201
{
  calculation: TaxCalculationResult;
}
```

**PUT /api/calculations/:id**
```typescript
// Request (partial update)
{
  totalSalary?: number;
  deductions?: {...};
  credits?: {...};
  prepaidTax?: number;
}

// Response 200
{
  calculation: TaxCalculationResult;
}
```

**DELETE /api/calculations/:id**
```typescript
// Response 204
// No content
```

---

#### Admin APIs

**POST /api/admin/income/:year/:month**
```typescript
// Request
{
  grossSalary: number;
  bonus?: number;
  nonTaxableIncome?: number;
  nationalPension: number;
  healthInsurance: number;
  employmentInsurance: number;
  withheldTax: number;
}

// Response 201
{
  income: MonthlyIncomeDTO;
  syncStatus: 'synced' | 'pending';
  calculationUpdated: boolean;
}
```

**POST /api/admin/cards/:year/:month**
```typescript
// Request
{
  creditCard: number;
  debitCard: number;
  cashReceipt: number;
  traditionalMarket: number;
  publicTransport: number;
  cultureSports: number;
  source: 'manual' | 'excel' | 'ocr' | 'api';
}

// Response 201
{
  cardUsage: CardUsageDTO;
  calculatedDeduction: number;
}
```

**POST /api/admin/upload/excel**
```typescript
// Request (multipart/form-data)
{
  file: File;          // .xlsx or .csv
  type: 'income' | 'card' | 'insurance';
  year: number;
  month?: number;
}

// Response 202
{
  uploadId: string;
  status: 'processing';
  estimatedTime: number; // seconds
}
```

**POST /api/admin/upload/image**
```typescript
// Request (multipart/form-data)
{
  file: File;          // .jpg, .png, .pdf
  type: 'salary_slip' | 'receipt' | 'insurance';
  year: number;
  month?: number;
}

// Response 202
{
  uploadId: string;
  status: 'processing';
  ocrJobId: string;
}
```

**GET /api/admin/upload/:uploadId/status**
```typescript
// Response 200
{
  uploadId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  result?: {
    extractedData: Record<string, any>;
    confidence: number;
  };
  error?: string;
}
```

---

#### AI Analysis APIs

**POST /api/ai/analyze**
```typescript
// Request
{
  calculationId: string;
  analysisType?: 'tips' | 'optimization' | 'comparison';
}

// Response 200
{
  analyses: Array<{
    id: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    content: string;
    potentialSavings: number;
    actionItems: string[];
    createdAt: string;
  }>;
  generatedAt: string;
}
```

**GET /api/ai/analyses**
```typescript
// Query params
?unreadOnly=true&priority=high

// Response 200
{
  analyses: Array<AiAnalysisDTO>;
  unreadCount: number;
}
```

**PUT /api/ai/analyses/:id/read**
```typescript
// Request
// No body

// Response 200
{
  analysis: AiAnalysisDTO;
}
```

**GET /api/ai/law-changes**
```typescript
// Query params
?year=2026

// Response 200
{
  changes: Array<{
    id: string;
    year: number;
    title: string;
    summary: string;
    impactLevel: 'high' | 'medium' | 'low';
    affectedCategories: string[];
    sourceUrl: string;
    publishedAt: string;
  }>;
  lastCheckedAt: string;
}
```

---

### 4.2 WebSocket API

#### Connection
```typescript
// Client
const socket = io('wss://api.example.com', {
  auth: {
    token: 'JWT_TOKEN'
  }
});

// Server acknowledge
socket.on('connect', () => {
  console.log('Connected:', socket.id);
});
```

#### Events

**Server → Client: sync**
```typescript
{
  type: 'sync';
  entity: 'calculation' | 'income' | 'card' | 'insurance';
  action: 'create' | 'update' | 'delete';
  data: Record<string, any>;
  timestamp: string;
}
```

**Server → Client: ai_analysis**
```typescript
{
  type: 'ai_analysis';
  priority: 'high' | 'medium' | 'low';
  analysis: {
    id: string;
    title: string;
    content: string;
    potentialSavings: number;
    actionItems: string[];
  };
  timestamp: string;
}
```

**Server → Client: tax_law_change**
```typescript
{
  type: 'tax_law_change';
  change: {
    id: string;
    title: string;
    summary: string;
    impactLevel: 'high' | 'medium' | 'low';
    affectedCategories: string[];
  };
  timestamp: string;
}
```

**Server → Client: calculation_updated**
```typescript
{
  type: 'calculation_updated';
  calculationId: string;
  refundAmount: number;
  changes: {
    previous: number;
    current: number;
    diff: number;
  };
  timestamp: string;
}
```

**Client → Server: subscribe**
```typescript
{
  event: 'subscribe';
  channels: string[]; // ['calculations', 'ai_analyses', 'law_changes']
}
```

---

## 5. AI 서비스 아키텍처

### 5.1 LangChain 구조
```python
# ai_service/main.py

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from langchain.vectorstores import Pinecone
from langchain.embeddings import OpenAIEmbeddings
from langchain.memory import ConversationBufferMemory
import os

app = FastAPI(title="Tax Calculator AI Service")

# Initialize LLM
llm = ChatOpenAI(
    model="gpt-4-turbo-preview",
    temperature=0.2,
    api_key=os.getenv("OPENAI_API_KEY"),
    max_tokens=2000
)

# Initialize embeddings
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-large",
    api_key=os.getenv("OPENAI_API_KEY")
)

# Initialize vector store
vectorstore = Pinecone.from_existing_index(
    index_name="tax-knowledge-base",
    embedding=embeddings
)

# Analysis prompt template
analysis_prompt = ChatPromptTemplate.from_messages([
    ("system", """당신은 한국 연말정산 전문가입니다.
    사용자의 데이터를 분석하여 실질적인 절세 팁을 제공하세요.
    
    분석 기준:
    1. 누락된 공제 항목 확인
    2. 공제 한도 최적화
    3. 세액공제 vs 소득공제 비교
    4. 예상 절세 금액 계산
    
    응답 형식 (JSON Array):
    [
      {{
        "priority": "high|medium|low",
        "title": "20자 이내 제목",
        "content": "100자 이내 설명",
        "potentialSavings": 절세금액(숫자),
        "actionItems": ["실행 방법 1", "실행 방법 2", "실행 방법 3"]
      }}
    ]
    
    우선순위 기준:
    - high: 절세액 5만원 이상
    - medium: 절세액 1~5만원
    - low: 절세액 1만원 미만
    """),
    ("user", """사용자 데이터:
{user_data}

관련 세법 지식:
{tax_knowledge}

위 데이터를 분석하여 최소 3개 이상의 절세 팁을 제공하세요.""")
])

class AnalysisRequest(BaseModel):
    calculationId: str
    userData: dict

class TaxLawSearchRequest(BaseModel):
    query: str
    year: int
    k: int = 5

@app.post("/api/ai/analyze")
async def analyze_tax_data(request: AnalysisRequest, background_tasks: BackgroundTasks):
    """세금 데이터 AI 분석"""
    try:
        # 1. Retrieve relevant tax laws
        query_text = f"""
        연말정산 절세 방법
        총급여: {request.userData.get('totalSalary', 0)}원
        공제항목: {list(request.userData.get('deductions', {}).keys())}
        """
        
        tax_knowledge = vectorstore.similarity_search(
            query_text,
            k=5
        )
        
        tax_knowledge_text = "\\n\\n".join([
            f"[{i+1}] {doc.page_content}"
            for i, doc in enumerate(tax_knowledge)
        ])
        
        # 2. Run LLM analysis
        chain = LLMChain(llm=llm, prompt=analysis_prompt)
        result = await chain.arun(
            user_data=json.dumps(request.userData, ensure_ascii=False, indent=2),
            tax_knowledge=tax_knowledge_text
        )
        
        # 3. Parse result
        analyses = json.loads(result)
        
        # 4. Validate and sort by priority
        validated_analyses = validate_analyses(analyses)
        sorted_analyses = sorted(
            validated_analyses,
            key=lambda x: {'high': 0, 'medium': 1, 'low': 2}[x['priority']]
        )
        
        return {
            "analyses": sorted_analyses,
            "status": "success",
            "generatedAt": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def validate_analyses(analyses: list) -> list:
    """분석 결과 검증"""
    validated = []
    for analysis in analyses:
        if all(key in analysis for key in ['priority', 'title', 'content', 'potentialSavings', 'actionItems']):
            if analysis['priority'] in ['high', 'medium', 'low']:
                if isinstance(analysis['potentialSavings'], (int, float)):
                    validated.append(analysis)
    return validated

@app.post("/api/ai/search-laws")
async def search_tax_laws(request: TaxLawSearchRequest):
    """세법 지식베이스 검색"""
    try:
        docs = vectorstore.similarity_search(
            request.query,
            k=request.k,
            filter={"year": request.year}
        )
        
        return {
            "results": [
                {
                    "content": doc.page_content,
                    "metadata": doc.metadata,
                    "score": doc.metadata.get('score', 0)
                }
                for doc in docs
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 5.2 Vector Database 구성
```python
# ai_service/vectorstore_setup.py

from langchain.document_loaders import PyPDFLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone
from langchain.embeddings import OpenAIEmbeddings
import pinecone
import os

# Initialize Pinecone
pinecone.init(
    api_key=os.getenv("PINECONE_API_KEY"),
    environment=os.getenv("PINECONE_ENVIRONMENT")
)

def create_tax_knowledge_base():
    """세법 문서를 벡터 DB에 저장"""
    
    # 1. Load documents
    documents = []
    
    # 소득세법
    loader = PyPDFLoader("data/소득세법_2025.pdf")
    documents.extend(loader.load())
    
    # 조세특례제한법
    loader = PyPDFLoader("data/조세특례제한법_2025.pdf")
    documents.extend(loader.load())
    
    # 연말정산 가이드
    loader = TextLoader("data/연말정산가이드_2026.txt")
    documents.extend(loader.load())
    
    # 2. Split into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\\n\\n", "\\n", ".", " ", ""]
    )
    
    chunks = text_splitter.split_documents(documents)
    
    # 3. Add metadata
    for i, chunk in enumerate(chunks):
        chunk.metadata.update({
            "chunk_id": i,
            "year": 2025,
            "source": chunk.metadata.get("source", "unknown"),
            "total_chunks": len(chunks)
        })
    
    # 4. Create embeddings and store
    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
    
    vectorstore = Pinecone.from_documents(
        documents=chunks,
        embedding=embeddings,
        index_name="tax-knowledge-base"
    )
    
    print(f"✅ Stored {len(chunks)} chunks in Pinecone")
    
    return vectorstore

def update_law_changes(new_laws: list):
    """새로운 세법 변경사항 추가"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_


        ### 5.3 세법 변경 크롤러 및 AI 분석
```python
# ai_service/scraper.py

from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import asyncio
from datetime import datetime, timedelta
import json

class TaxLawScraper:
    """국세청 및 기획재정부 공지사항 크롤러"""
    
    def __init__(self):
        self.sources = {
            'nts': 'https://www.nts.go.kr/nts/na/ntt/selectNttList.do?mi=2445&bbsId=1092',
            'moef': 'https://www.moef.go.kr/nw/nes/detailNesDtaView.do'
        }
        self.keywords = ['연말정산', '세액공제', '소득공제', '기부금', '신용카드', '의료비', '교육비']
    
    async def scrape_nts(self):
        """국세청 공지사항 크롤링"""
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            await page.goto(self.sources['nts'])
            await page.wait_for_selector('.board-list')
            
            content = await page.content()
            soup = BeautifulSoup(content, 'html.parser')
            
            announcements = []
            for row in soup.select('.board-list tbody tr')[:20]:  # 최근 20개
                try:
                    title_elem = row.select_one('.subject a')
                    if not title_elem:
                        continue
                    
                    title = title_elem.text.strip()
                    link = title_elem.get('href', '')
                    date_elem = row.select_one('.date')
                    date_str = date_elem.text.strip() if date_elem else None
                    
                    # 키워드 필터링
                    if any(keyword in title for keyword in self.keywords):
                        announcements.append({
                            'title': title,
                            'link': f"https://www.nts.go.kr{link}",
                            'date': date_str,
                            'source': '국세청'
                        })
                except Exception as e:
                    continue
            
            await browser.close()
            return announcements
    
    async def fetch_full_content(self, url: str) -> str:
        """공지사항 전체 내용 가져오기"""
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            await page.goto(url)
            await page.wait_for_selector('.board-view', timeout=10000)
            
            content = await page.eval_on_selector(
                '.board-view .content',
                'el => el.textContent'
            )
            
            await browser.close()
            return content.strip()
    
    async def detect_law_changes(self, announcements: list) -> list:
        """AI로 세법 변경사항 감지"""
        changes = []
        
        for announcement in announcements:
            try:
                # 전체 내용 가져오기
                content = await self.fetch_full_content(announcement['link'])
                
                # AI 분석
                analysis = await self.analyze_with_ai(
                    title=announcement['title'],
                    content=content[:2000]  # 처음 2000자만
                )
                
                if analysis['isLawChange']:
                    changes.append({
                        **announcement,
                        **analysis,
                        'analyzedAt': datetime.now().isoformat()
                    })
            except Exception as e:
                print(f"Error analyzing {announcement['title']}: {e}")
                continue
        
        return changes
    
    async def analyze_with_ai(self, title: str, content: str) -> dict:
        """AI로 세법 변경사항 분석"""
        from langchain.chat_models import ChatOpenAI
        from langchain.prompts import ChatPromptTemplate
        
        llm = ChatOpenAI(model="gpt-4-turbo-preview", temperature=0)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", """당신은 한국 세법 전문가입니다.
            공지사항을 분석하여 연말정산에 영향을 미치는 세법 변경사항인지 판단하세요.
            
            응답 형식 (JSON):
            {{
                "isLawChange": true/false,
                "summary": "3줄 이내 핵심 요약",
                "impactLevel": "high/medium/low",
                "affectedCategories": ["deduction", "credit", "rate", "exemption"],
                "effectiveDate": "YYYY-MM-DD 또는 null",
                "estimatedImpact": "예상되는 영향 (선택사항)"
            }}
            
            판단 기준:
            - 공제/세액공제 한도 변경
            - 새로운 공제 항목 추가/삭제
            - 세율 변경
            - 적용 대상 변경
            """),
            ("user", """제목: {title}
            
내용:
{content}

위 공지사항을 분석하세요.""")
        ])
        
        chain = prompt | llm
        result = await chain.ainvoke({
            "title": title,
            "content": content
        })
        
        return json.loads(result.content)

# Scheduler (AWS Lambda)
async def daily_law_check_job():
    """매일 실행되는 세법 변경 체크 작업"""
    scraper = TaxLawScraper()
    
    # 1. 크롤링
    announcements = await scraper.scrape_nts()
    print(f"Found {len(announcements)} relevant announcements")
    
    # 2. AI 분석
    changes = await scraper.detect_law_changes(announcements)
    print(f"Detected {len(changes)} law changes")
    
    # 3. 데이터베이스 저장
    for change in changes:
        await save_to_database(change)
    
    # 4. 사용자 알림
    if changes:
        await notify_users(changes)
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'totalAnnouncements': len(announcements),
            'detectedChanges': len(changes)
        })
    }

async def save_to_database(change: dict):
    """세법 변경사항을 DB에 저장"""
    import psycopg2
    from psycopg2.extras import Json
    
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    
    cur.execute("""
        INSERT INTO tax_law_changes 
        (year, title, summary, source_url, impact_level, affected_categories, published_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (source_url) DO NOTHING
    """, (
        2026,
        change['title'],
        change['summary'],
        change['link'],
        change['impactLevel'],
        Json(change['affectedCategories']),
        change.get('date')
    ))
    
    conn.commit()
    cur.close()
    conn.close()

async def notify_users(changes: list):
    """사용자에게 세법 변경 알림"""
    # WebSocket으로 실시간 알림
    from websocket_server import broadcast_to_all
    
    for change in changes:
        if change['impactLevel'] == 'high':
            await broadcast_to_all({
                'type': 'tax_law_change',
                'change': change
            })
```

---

## 6. OCR 처리 파이프라인

### 6.1 이미지 업로드 및 처리 Flow
```typescript
// lib/ocr/processor.ts

import { Storage } from '@google-cloud/storage'
import { ImageAnnotatorClient } from '@google-cloud/vision'
import { OpenAI } from 'openai'

const storage = new Storage()
const visionClient = new ImageAnnotatorClient()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export interface OCRResult {
  extractedData: Record<string, any>
  confidence: number
  rawText: string
  processedAt: Date
}

export class OCRProcessor {
  /**
   * 급여명세서 OCR 처리
   */
  async processSalarySlip(
    fileBuffer: Buffer,
    year: number,
    month: number
  ): Promise<OCRResult> {
    // 1. Upload to S3
    const s3Key = `ocr-temp/${Date.now()}.jpg`
    await this.uploadToS3(fileBuffer, s3Key)
    
    // 2. Google Vision API OCR
    const rawText = await this.extractText(s3Key)
    
    // 3. Parse with GPT-4
    const parsedData = await this.parseWithAI(rawText, 'salary_slip')
    
    // 4. Validate
    const validated = this.validateSalaryData(parsedData)
    
    // 5. Calculate confidence
    const confidence = this.calculateConfidence(parsedData)
    
    return {
      extractedData: validated,
      confidence,
      rawText,
      processedAt: new Date()
    }
  }
  
  /**
   * Google Vision API로 텍스트 추출
   */
  private async extractText(s3Key: string): Promise<string> {
    const gcsUri = `gs://tax-calculator-uploads/${s3Key}`
    
    const [result] = await visionClient.textDetection(gcsUri)
    const detections = result.textAnnotations
    
    if (!detections || detections.length === 0) {
      throw new Error('No text detected in image')
    }
    
    // 첫 번째 요소가 전체 텍스트
    return detections[0].description || ''
  }
  
  /**
   * GPT-4로 구조화된 데이터 파싱
   */
  private async parseWithAI(
    rawText: string,
    documentType: 'salary_slip' | 'receipt' | 'insurance'
  ): Promise<any> {
    const prompts = {
      salary_slip: `
다음은 급여명세서에서 추출한 텍스트입니다.
정보를 JSON 형식으로 파싱하세요.

텍스트:
${rawText}

응답 형식:
{
  "grossSalary": number,
  "bonus": number,
  "nonTaxableIncome": number,
  "nationalPension": number,
  "healthInsurance": number,
  "employmentInsurance": number,
  "withheldTax": number,
  "confidence": number (0-1)
}

숫자만 추출하고, 단위는 제거하세요.
값을 찾을 수 없으면 0으로 설정하세요.
      `,
      receipt: `
다음은 영수증에서 추출한 텍스트입니다.
정보를 JSON 형식으로 파싱하세요.

텍스트:
${rawText}

응답 형식:
{
  "category": "medical|education|donation",
  "amount": number,
  "vendor": string,
  "date": "YYYY-MM-DD",
  "confidence": number (0-1)
}
      `,
      insurance: `
다음은 보험료 납입 증명서에서 추출한 텍스트입니다.
정보를 JSON 형식으로 파싱하세요.

텍스트:
${rawText}

응답 형식:
{
  "insuranceType": "health|pension|savings",
  "companyName": string,
  "annualAmount": number,
  "year": number,
  "confidence": number (0-1)
}
      `
    }
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: '당신은 한국 급여명세서 파싱 전문가입니다. JSON만 반환하세요.'
        },
        {
          role: 'user',
          content: prompts[documentType]
        }
      ],
      temperature: 0,
      response_format: { type: 'json_object' }
    })
    
    const content = response.choices[0].message.content
    return JSON.parse(content || '{}')
  }
  
  /**
   * 데이터 검증
   */
  private validateSalaryData(data: any): any {
    const validated = { ...data }
    
    // 음수 값 체크
    for (const key in validated) {
      if (typeof validated[key] === 'number' && validated[key] < 0) {
        validated[key] = 0
      }
    }
    
    // 합리성 체크
    if (validated.grossSalary > 50000000) {
      console.warn('Gross salary seems too high, please verify')
    }
    
    if (validated.withheldTax > validated.grossSalary * 0.5) {
      console.warn('Withheld tax seems too high, please verify')
    }
    
    return validated
  }
  
  /**
   * 신뢰도 계산
   */
  private calculateConfidence(data: any): number {
    let score = data.confidence || 0.5
    
    // 필수 필드 존재 여부
    const requiredFields = ['grossSalary', 'nationalPension', 'healthInsurance']
    const presentFields = requiredFields.filter(field => data[field] > 0)
    score *= (presentFields.length / requiredFields.length)
    
    // 값의 합리성
    if (data.grossSalary >= 1000000 && data.grossSalary <= 20000000) {
      score *= 1.2
    }
    
    return Math.min(score, 1.0)
  }
  
  private async uploadToS3(buffer: Buffer, key: string): Promise<void> {
    await storage.bucket('tax-calculator-uploads').file(key).save(buffer)
  }
}

// API Route
// app/api/admin/upload/image/route.ts

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const type = formData.get('type') as string
  const year = parseInt(formData.get('year') as string)
  const month = parseInt(formData.get('month') as string)
  
  if (!file || !type || !year) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }
  
  // Convert File to Buffer
  const buffer = Buffer.from(await file.arrayBuffer())
  
  // Create upload record
  const upload = await prisma.fileUpload.create({
    data: {
      userId: req.user.userId,
      fileType: 'image',
      fileName: file.name,
      fileUrl: '',
      processingStatus: 'processing'
    }
  })
  
  // Process in background
  processOCRInBackground(upload.id, buffer, type, year, month)
  
  return NextResponse.json({
    uploadId: upload.id,
    status: 'processing'
  }, { status: 202 })
}

async function processOCRInBackground(
  uploadId: string,
  buffer: Buffer,
  type: string,
  year: number,
  month: number
) {
  try {
    const processor = new OCRProcessor()
    const result = await processor.processSalarySlip(buffer, year, month)
    
    // Update upload record
    await prisma.fileUpload.update({
      where: { id: uploadId },
      data: {
        processingStatus: 'completed',
        ocrResult: result.extractedData,
        processedAt: new Date()
      }
    })
    
    // Auto-save to monthly income
    await prisma.monthlyIncome.upsert({
      where: {
        userId_year_month: {
          userId: upload.userId,
          year,
          month
        }
      },
      update: result.extractedData,
      create: {
        userId: upload.userId,
        year,
        month,
        ...result.extractedData
      }
    })
    
    // Notify via WebSocket
    wss.sendToUser(upload.userId, {
      type: 'ocr_completed',
      uploadId,
      data: result.extractedData,
      confidence: result.confidence
    })
    
  } catch (error) {
    await prisma.fileUpload.update({
      where: { id: uploadId },
      data: {
        processingStatus: 'failed',
        errorMessage: error.message
      }
    })
  }
}
```

---

## 7. 실시간 동기화 (WebSocket)

### 7.1 WebSocket 서버
```typescript
// websocket/server.ts

import { Server } from 'socket.io'
import { createServer } from 'http'
import { verifyJWT } from '@/lib/auth'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
})

// 사용자별 소켓 연결 관리
const userSockets = new Map<string, string>() // userId -> socketId

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token
    const decoded = await verifyJWT(token)
    socket.data.userId = decoded.userId
    next()
  } catch (error) {
    next(new Error('Authentication error'))
  }
})

io.on('connection', (socket) => {
  const userId = socket.data.userId
  userSockets.set(userId, socket.id)
  
  console.log(`User ${userId} connected`)
  
  socket.on('subscribe', (channels: string[]) => {
    channels.forEach(channel => {
      socket.join(`${userId}:${channel}`)
    })
  })
  
  socket.on('disconnect', () => {
    userSockets.delete(userId)
    console.log(`User ${userId} disconnected`)
  })
})

// Export functions
export function sendToUser(userId: string, message: any) {
  const socketId = userSockets.get(userId)
  if (socketId) {
    io.to(socketId).emit('message', message)
  }
}

export function broadcastToAll(message: any) {
  io.emit('broadcast', message)
}

httpServer.listen(3001, () => {
  console.log('WebSocket server running on port 3001')
})
```

### 7.2 Frontend WebSocket Hook
```typescript
// hooks/useWebSocket.ts

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/store/auth'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const token = useAuthStore(state => state.token)
  const queryClient = useQueryClient()
  
  useEffect(() => {
    if (!token) return
    
    const newSocket = io('ws://localhost:3001', {
      auth: { token }
    })
    
    newSocket.on('connect', () => {
      setIsConnected(true)
      console.log('WebSocket connected')
      
      // Subscribe to channels
      newSocket.emit('subscribe', [
        'calculations',
        'ai_analyses',
        'law_changes'
      ])
    })
    
    newSocket.on('message', (data) => {
      handleMessage(data)
    })
    
    newSocket.on('disconnect', () => {
      setIsConnected(false)
      console.log('WebSocket disconnected')
    })
    
    setSocket(newSocket)
    
    return () => {
      newSocket.close()
    }
  }, [token])
  
  function handleMessage(data: any) {
    switch (data.type) {
      case 'sync':
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: [data.entity] })
        toast.success('데이터가 업데이트되었습니다')
        break
        
      case 'ai_analysis':
        // Show notification
        if (data.priority === 'high') {
          toast.error(data.analysis.title, {
            description: data.analysis.content
          })
        } else {
          toast.info(data.analysis.title)
        }
        queryClient.invalidateQueries({ queryKey: ['ai-analyses'] })
        break
        
      case 'tax_law_change':
        // Show banner
        toast.warning('세법 변경사항 알림', {
          description: data.change.title,
          action: {
            label: '자세히 보기',
            onClick: () => window.open(data.change.sourceUrl)
          }
        })
        break
        
      case 'calculation_updated':
        queryClient.invalidateQueries({ queryKey: ['calculations'] })
        toast.success(`계산이 업데이트되었습니다. 환급액: ${data.refundAmount.toLocaleString()}원`)
        break
        
      case 'ocr_completed':
        toast.success('파일 처리가 완료되었습니다')
        queryClient.invalidateQueries({ queryKey: ['monthly-incomes'] })
        break
    }
  }
  
  return { socket, isConnected }
}
```

---

## 8. 보안

### 8.1 인증 및 인가
```typescript
// lib/auth.ts

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = '7d'
const SALT_ROUNDS = 10

export interface JWTPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export function generateToken(payload: { userId: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export async function authMiddleware(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('No token provided')
  }
  
  const payload = await verifyJWT(token)
  return payload
}
```

### 8.2 데이터 암호화
```typescript
// lib/encryption.ts

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex')

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
}

export function decrypt(encrypted: string): string {
  const [ivHex, authTagHex, encryptedText] = encrypted.split(':')
  
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

// Usage in Prisma middleware
prisma.$use(async (params, next) => {
  // Encrypt before write
  if (params.action === 'create' || params.action === 'update') {
    if (params.model === 'User') {
      if (params.args.data.phone) {
        params.args.data.phone = encrypt(params.args.data.phone)
      }
    }
  }
  
  const result = await next(params)
  
  // Decrypt after read
  if (params.action === 'findUnique' || params.action === 'findMany') {
    if (params.model === 'User') {
      if (Array.isArray(result)) {
        result.forEach(user => {
          if (user.phone) user.phone = decrypt(user.phone)
        })
      } else if (result?.phone) {
        result.phone = decrypt(result.phone)
      }
    }
  }
  
  return result
})
```

### 8.3 Rate Limiting
```typescript
// lib/rateLimit.ts

import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function rateLimit(
  identifier: string,
  limit: number = 100,
  window: number = 60
): Promise<boolean> {
  const key = `rate_limit:${identifier}`
  
  const current = await redis.incr(key)
  
  if (current === 1) {
    await redis.expire(key, window)
  }
  
  return current <= limit
}

// Middleware
export async function rateLimitMiddleware(req: NextRequest) {
  const ip = req.ip || 'unknown'
  const allowed = await rateLimit(ip, 100, 60)
  
  if (!allowed) {
    throw new Error('Too many requests')
  }
}
```

---

## 9. 성능 최적화

### 9.1 Caching Strategy
```typescript
// lib/cache.ts

import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCached<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key)
  return cached ? JSON.parse(cached) : null
}

export async function setCache(
  key: string,
  value: any,
  ttl: number = 3600
): Promise<void> {
  await redis.set(key, JSON.stringify(value), 'EX', ttl)
}

export async function invalidateCache(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}

// Usage in API
export async function GET(req: Request) {
  const { userId, year } = extractParams(req)
  const cacheKey = `calculation:${userId}:${year}`
  
  // Try cache first
  const cached = await getCached(cacheKey)
  if (cached) {
    return NextResponse.json(cached)
  }
  
  // Fetch from database
  const calculation = await prisma.taxCalculation.findUnique({
    where: { userId_year: { userId, year } }
  })
  
  // Set cache
  await setCache(cacheKey, calculation, 3600)
  
  return NextResponse.json(calculation)
}
```

### 9.2 Database Optimization
```sql
-- Indexes for common queries
CREATE INDEX CONCURRENTLY idx_calculations_user_year 
ON tax_calculations(user_id, year);

CREATE INDEX CONCURRENTLY idx_monthly_incomes_user_year_month 
ON monthly_incomes(user_id, year, month);

CREATE INDEX CONCURRENTLY idx_card_usages_user_year 
ON card_usages(user_id, year);

-- Partial index for active users
CREATE INDEX CONCURRENTLY idx_active_users 
ON users(id) 
WHERE last_login > NOW() - INTERVAL '30 days';

-- GIN index for JSON search
CREATE INDEX CONCURRENTLY idx_calculations_data 
ON tax_calculations USING gin(data);

-- Full-text search
CREATE INDEX CONCURRENTLY idx_law_changes_search 
ON tax_law_changes 
USING gin(to_tsvector('korean', title || ' ' || summary));
```

---

## 10. 모니터링 및 로깅

### 10.1 Sentry 설정
```typescript
// sentry.client.config.ts

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies
      delete event.request.headers?.['Authorization']
    }
    
    // Don't send errors in development
    if (process.env.NODE_ENV === 'development') {
      return null
    }
    
    return event
  },
  
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ]
})
```

### 10.2 Custom Logger
```typescript
// lib/logger.ts

import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

export default logger

// Usage
logger.info('Calculation completed', { userId, refundAmount })
logger.error('OCR processing failed', { error, uploadId })
```

---

## 11. 배포 전략

### 11.1 CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run tests
        run: npm run test
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
      
      - name: Build
        run: npm run build
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
      
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment completed!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 11.2 환경 변수
```bash
# .env.production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/taxdb
REDIS_URL=redis://host:6379

# Auth
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key-64-chars

# External APIs
OPENAI_API_KEY=sk-xxx
GOOGLE_VISION_API_KEY=xxx
PINECONE_API_KEY=xxx
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX=tax-knowledge-base

# AWS
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=ap-northeast-2
S3_BUCKET=tax-calculator-uploads

# Monitoring
SENTRY_DSN=xxx
VERCEL_ANALYTICS_ID=xxx

# Frontend
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_WS_URL=wss://ws.example.com
```

---

## 12. 테스트 전략

### 12.1 Unit Tests
```typescript
// __tests__/lib/tax-calculator.test.ts

import { calculateYearEndTax } from '@/lib/tax-calculator'

describe('Tax Calculator', () => {
  it('should calculate correct refund amount', () => {
    const input = {
      year: 2025,
      totalSalary: 56822780,
      hasSpouse: false,
      dependents: { parents: 0, children: 3, siblings: 0, others: 0 },
      additional: { senior: 0, disabled: 0, singleParent: false, womenHead: false },
      nationalPension: 2258520,
      publicPension: 0,
      healthInsurance: 2214340,
      employmentInsurance: 495840,
      prepaidTax: 1394280
    }
    
    const result = calculateYearEndTax(input)
    
    expect(result.refundAmount).toBe(869640)
    expect(result.totalRefund).toBe(956600)
  })
})
```

### 12.2 Integration Tests
```typescript
// __tests__/api/calculations.test.ts

import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/calculations/route'

describe('/api/calculations', () => {
  it('POST should create calculation', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        'Authorization': 'Bearer valid-token'
      },
      body: {
        year: 2025,
        totalSalary: 50000000,
        prepaidTax: 1000000
      }
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(201)
    const data = JSON.parse(res._getData())
    expect(data).toHaveProperty('calculation')
    expect(data.calculation).toHaveProperty('refundAmount')
  })
})
```

### 12.3 E2E Tests
```typescript
// e2e/complete-flow.spec.ts

import { test, expect } from '@playwright/test'

test('complete tax calculation flow', async ({ page }) => {
  // Login
  await page.goto('/login')
  await page.fill('[name=email]', 'test@example.com')
  await page.fill('[name=password]', 'password123')
  await page.click('button[type=submit]')
  
  // Go to calculator
  await page.goto('/calculator')
  
  // Fill in data
  await page.fill('[name=totalSalary]', '50000000')
  await page.selectOption('[name="dependents.children"]', '2')
  await page.fill('[name=nationalPension]', '2000000')
  
  // Calculate
  await page.click('button:has-text("계산하기")')
  
  // Check result
  await expect(page.locator('.refund-amount')).toBeVisible()
  await expect(page.locator('.refund-amount')).toContainText('원')
  
  // Save
  await page.click('button:has-text("저장")')
  await expect(page.locator('.toast')).toContainText('저장되었습니다')
})
```

---

## 13. 용량 계획

### 13.1 예상 트래픽 및 스케일링

| 지표 | 초기 (3개월) | 6개월 | 1년 |
|-----|------------|------|-----|
| DAU | 500 | 2,000 | 5,000 |
| MAU | 2,000 | 10,000 | 25,000 |
| API 요청 | 10,000 | 50,000 | 150,000 |
| AI 분석 요청 | 500 | 2,000 | 5,000 |
| 저장소 (GB) | 10 | 50 | 150 |

### 13.2 인프라 비용 (월간)

| 서비스 | 초기 (3개월) | 6개월 | 1년 |
|-------|------------|------|-----|
| Vercel Pro | $20 | $20 | $20 |
| AWS RDS (PostgreSQL) | $50 | $100 | $200 |
| AWS ElastiCache (Redis) | $30 | $50 | $100 |
| AWS S3 + CloudFront | $10 | $30 | $80 |
| OpenAI API | $50 | $200 | $500 |
| Google Vision API | $20 | $80 | $200 |
| Pinecone | $70 | $70 | $140 |
| 합계 | $250 | $550 | $1,240 |

## 14. 마이그레이션 전략

### 14.1 기존 데이터 마이그레이션

// scripts/migrate-old-data.ts

import { OldDatabase } from './old-db';
import { NewDatabase } from './new-db';

async function migrate() {
  const oldUsers = await OldDatabase.users.findAll();
  
  for (const oldUser of oldUsers) {
    // Transform data
    const newUser = {
      email: oldUser.email,
      name: oldUser.name,
      // Map old fields to new schema
      // ...
    };
    
    await NewDatabase.users.create(newUser);
    
    // Migrate calculations
    const oldCalculations = await OldDatabase.calculations.findByUser(oldUser.id);
    for (const calc of oldCalculations) {
      await NewDatabase.taxCalculations.create(transformCalculation(calc));
    }
  }
  
  console.log('Migration completed');
}

migrate();

## 15. 문서화

### 15.1 API 문서 (Swagger/OpenAPI)

# openapi.yaml

openapi: 3.0.0
info:
  title: Tax Calculator API
  version: 1.0.0

paths:
  /api/calculations:
    post:
      summary: Create new tax calculation
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CalculationInput'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CalculationResult'
````

### 15.2 개발자 가이드

- README.md: 프로젝트 개요, 설치 방법
- CONTRIBUTING.md: 기여 가이드라인
- API.md: API 상세 문서
- ARCHITECTURE.md: 시스템 아키텍처
- DEPLOYMENT.md: 배포 가이드
````