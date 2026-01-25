'use client';

import { useState, useEffect } from 'react';
import { Newspaper, X, RefreshCw, ExternalLink, ChevronUp, Clock } from 'lucide-react';

interface NewsItem {
    title: string;
    link: string;
    source: string;
    pubDate: string;
}

export default function FloatingNewsWidget() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [newsLoading, setNewsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const fetchNews = async () => {
        setNewsLoading(true);
        try {
            const response = await fetch('/api/news');
            const data = await response.json();
            if (data.success) {
                setNews(data.news);
                setLastUpdated(data.lastUpdated);
            }
        } catch (error) {
            console.error('뉴스 가져오기 실패:', error);
        } finally {
            setNewsLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <>
            {/* Backdrop when expanded */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/60 z-40"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            {/* Floating Widget - Neobrutalism Style */}
            <div className={`fixed z-50 transition-all duration-300 ${isExpanded
                    ? 'inset-x-4 md:inset-x-16 lg:inset-x-32 top-1/2 -translate-y-1/2'
                    : 'bottom-6 right-6 left-6 md:left-auto md:w-[420px]'
                }`}>
                {isExpanded ? (
                    /* Expanded View - Neobrutalism Panel */
                    <div className="bg-white border-4 border-black shadow-brutal-lg overflow-hidden flex flex-col max-h-[85vh]">
                        {/* Header */}
                        <div className="bg-[#F7CB15] border-b-4 border-black px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-black p-2">
                                        <Newspaper className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black">📰 연말정산 뉴스</h2>
                                        <p className="text-sm font-bold text-black/60">실시간 세금 관련 소식</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); fetchNews(); }}
                                        disabled={newsLoading}
                                        className="bg-white p-2 border-2 border-black shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
                                    >
                                        <RefreshCw className={`w-5 h-5 ${newsLoading ? 'animate-spin' : ''}`} />
                                    </button>
                                    <button
                                        onClick={() => setIsExpanded(false)}
                                        className="bg-[#FF6B35] p-2 border-2 border-black shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* News Grid */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            {newsLoading ? (
                                <div className="grid md:grid-cols-2 gap-3">
                                    {[...Array(12)].map((_, i) => (
                                        <div key={i} className="bg-white border-3 border-black p-3 animate-pulse">
                                            <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-100 w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {news.map((item, index) => (
                                        <a
                                            key={index}
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group bg-white border-2 border-black p-3 shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl font-black text-[#F7CB15] leading-none" style={{ WebkitTextStroke: '1px black' }}>
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm leading-tight group-hover:text-[#FF6B35] transition-colors line-clamp-2">
                                                        {item.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="text-xs font-bold text-white bg-black px-2 py-0.5">
                                                            {item.source}
                                                        </span>
                                                        <span className="text-xs font-semibold text-gray-500">{item.pubDate}</span>
                                                    </div>
                                                </div>
                                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#FF6B35] flex-shrink-0 transition-colors" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-white border-t-4 border-black px-6 py-3">
                            <div className="flex items-center justify-between text-sm font-bold">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    {lastUpdated && (
                                        <span>
                                            {new Date(lastUpdated).toLocaleString('ko-KR', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })} 업데이트
                                        </span>
                                    )}
                                </div>
                                <span className="text-gray-400">4시간마다 자동 갱신</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Collapsed View - Neobrutalism Compact Bar */
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="w-full group bg-[#F7CB15] border-4 border-black shadow-brutal hover:shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all overflow-hidden"
                    >
                        <div className="px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-black p-2">
                                    <Newspaper className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-base">📰 연말정산 뉴스</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-black text-white text-xs font-black px-3 py-1">
                                    {news.length}개
                                </span>
                                <ChevronUp className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
                            </div>
                        </div>

                        {/* Scrolling Ticker - Infinite Loop */}
                        {news.length > 0 && !newsLoading && (
                            <div className="bg-black px-4 py-2 overflow-hidden">
                                <div className="flex">
                                    {/* First copy */}
                                    <div className="animate-news-ticker flex-shrink-0 flex">
                                        {news.slice(0, 5).map((item, index) => (
                                            <span key={`a-${index}`} className="inline-flex items-center text-sm text-white whitespace-nowrap mr-8">
                                                <span className="text-[#F7CB15] font-black mr-2">●</span>
                                                <span className="font-semibold">{item.title}</span>
                                            </span>
                                        ))}
                                    </div>
                                    {/* Second copy for seamless loop */}
                                    <div className="animate-news-ticker flex-shrink-0 flex">
                                        {news.slice(0, 5).map((item, index) => (
                                            <span key={`b-${index}`} className="inline-flex items-center text-sm text-white whitespace-nowrap mr-8">
                                                <span className="text-[#F7CB15] font-black mr-2">●</span>
                                                <span className="font-semibold">{item.title}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </button>
                )}
            </div>
        </>
    );
}
