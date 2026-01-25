import { NextResponse } from 'next/server';

// 뉴스 아이템 타입
interface NewsItem {
    title: string;
    link: string;
    source: string;
    pubDate: string;
    description?: string;
}

// 캐시 저장소 (메모리 캐시)
let cachedNews: NewsItem[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4시간 (밀리초)

// XML에서 텍스트 추출 헬퍼 함수
function extractText(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[(.+?)\\]\\]></${tag}>|<${tag}[^>]*>([^<]*)</${tag}>`, 'i');
    const match = xml.match(regex);
    return match ? (match[1] || match[2] || '').trim() : '';
}

// HTML 엔티티 디코딩
function decodeHtmlEntities(text: string): string {
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'");
}

// 상대적 시간 계산
function getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR');
}

// Google News RSS에서 뉴스 가져오기
async function fetchNewsFromRSS(): Promise<NewsItem[]> {
    try {
        // Google News RSS - 연말정산 검색
        const query = encodeURIComponent('연말정산 2026');
        const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=ko&gl=KR&ceid=KR:ko`;

        const response = await fetch(rssUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            next: { revalidate: 14400 } // 4시간 캐시
        });

        if (!response.ok) {
            throw new Error(`RSS fetch failed: ${response.status}`);
        }

        const xml = await response.text();

        // XML 파싱 (간단한 정규식 사용)
        const items: NewsItem[] = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
        let match;

        while ((match = itemRegex.exec(xml)) !== null && items.length < 12) {
            const itemXml = match[1];
            const title = decodeHtmlEntities(extractText(itemXml, 'title'));
            const link = extractText(itemXml, 'link');
            const pubDate = extractText(itemXml, 'pubDate');
            const source = extractText(itemXml, 'source') || '뉴스';

            if (title && link) {
                items.push({
                    title,
                    link,
                    source,
                    pubDate: getRelativeTime(pubDate),
                });
            }
        }

        return items;
    } catch (error) {
        console.error('뉴스 가져오기 실패:', error);
        return [];
    }
}

// 기본 뉴스 데이터 (API 실패 시 폴백)
function getDefaultNews(): NewsItem[] {
    return [
        {
            title: '2026년 결혼세액공제 신설, 최대 50만원 혜택',
            link: '#',
            source: '국세청',
            pubDate: '최근',
            description: '2026년 혼인신고자는 세액공제 혜택을 받을 수 있습니다.'
        },
        {
            title: '주택청약저축 공제한도 300만원으로 상향',
            link: '#',
            source: '기획재정부',
            pubDate: '최근',
            description: '주택마련저축 소득공제 한도가 증가했습니다.'
        },
        {
            title: 'ISA 만기 후 연금계좌 전환 시 추가 세액공제',
            link: '#',
            source: '금융위원회',
            pubDate: '최근',
            description: 'ISA 계좌 전환 시 세제 혜택이 추가됩니다.'
        },
        {
            title: '신용카드 소득공제율 변경 안내',
            link: '#',
            source: '국세청',
            pubDate: '최근',
            description: '2026년 카드 사용 공제율이 조정되었습니다.'
        },
        {
            title: '자녀 세액공제 연령 기준 변경',
            link: '#',
            source: '기획재정부',
            pubDate: '최근',
            description: '자녀 세액공제 대상 연령이 확대되었습니다.'
        },
        {
            title: '월세 세액공제 한도 확대',
            link: '#',
            source: '국토교통부',
            pubDate: '최근',
            description: '무주택 세대주 월세 공제 한도가 증가했습니다.'
        },
        {
            title: '의료비 공제 적용 범위 확대',
            link: '#',
            source: '복지부',
            pubDate: '최근',
            description: '미용 목적 시술비도 의료비 공제 가능.'
        },
        {
            title: '기부금 세액공제율 상향 조정',
            link: '#',
            source: '국세청',
            pubDate: '최근',
            description: '법정기부금 공제율이 상향 조정되었습니다.'
        },
        {
            title: '연금저축 납입한도 900만원으로 유지',
            link: '#',
            source: '금융위원회',
            pubDate: '최근',
            description: 'IRP 포함 연금저축 세액공제 한도 안내.'
        },
        {
            title: '교육비 공제 대학생 자녀 한도 유지',
            link: '#',
            source: '교육부',
            pubDate: '최근',
            description: '대학생 자녀 교육비 공제 연 900만원 한도.'
        },
        {
            title: '중소기업 취업자 소득세 감면 연장',
            link: '#',
            source: '중소벤처기업부',
            pubDate: '최근',
            description: '청년 중소기업 취업자 소득세 90% 감면 혜택 연장.'
        },
        {
            title: '신용카드 소득공제 한도 유지',
            link: '#',
            source: '국세청',
            pubDate: '최근',
            description: '총급여 7천만원 이하 300만원, 초과 시 250만원 한도.'
        }
    ];
}

export async function GET() {
    try {
        const now = Date.now();

        // 캐시가 유효한지 확인
        if (cachedNews && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
            return NextResponse.json({
                success: true,
                news: cachedNews,
                cached: true,
                lastUpdated: new Date(cacheTimestamp).toISOString(),
                nextUpdate: new Date(cacheTimestamp + CACHE_DURATION).toISOString(),
            });
        }

        // 새 뉴스 가져오기
        let news = await fetchNewsFromRSS();

        // 뉴스가 없으면 기본 데이터 사용
        if (news.length === 0) {
            news = getDefaultNews();
        }

        // 캐시 업데이트
        cachedNews = news;
        cacheTimestamp = now;

        return NextResponse.json({
            success: true,
            news,
            cached: false,
            lastUpdated: new Date(now).toISOString(),
            nextUpdate: new Date(now + CACHE_DURATION).toISOString(),
        });
    } catch (error) {
        console.error('News API error:', error);

        // 에러 시 기본 뉴스 반환
        return NextResponse.json({
            success: true,
            news: getDefaultNews(),
            cached: false,
            error: 'Using default news due to fetch error',
        });
    }
}
