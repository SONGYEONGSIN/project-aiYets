import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t-2 border-black">
            <div className="container max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Image
                                src="/logo.png"
                                alt="연말정산이AI"
                                width={32}
                                height={32}
                                className="rounded-lg"
                            />
                            <span className="font-head text-base">연말정산이</span>
                            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-1.5 py-0.5 text-xs font-black rounded">AI</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            AI가 도와주는 똑똑한<br />
                            연말정산 시뮬레이터
                        </p>
                        <div className="flex gap-2">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 border-2 border-black rounded-lg hover:bg-muted transition-colors"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 border-2 border-black rounded-lg hover:bg-muted transition-colors"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-head text-sm mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    대시보드
                                </Link>
                            </li>
                            <li>
                                <Link href="/calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    계산기
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    관리자
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-head text-sm mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://www.nts.go.kr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    국세청
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.koreatax.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    한국납세자연맹
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:ysong2526@gmail.com"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    이메일 문의
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-head text-sm mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    이용약관
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    개인정보처리방침
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} 연말정산이AI. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Made with ❤️ by <span className="font-semibold">연말정산이AI</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
