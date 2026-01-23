import Link from 'next/link';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white border-t-4 border-black mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h4 className="text-xl font-bold mb-4">AI 연말정산 계산기</h4>
                        <p className="text-gray-400">
                            AI가 도와주는 똑똑한 연말정산, 최대 환급액을 찾아드립니다.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-bold mb-4">바로가기</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/dashboard" className="text-gray-400 hover:text-[#F7CB15] font-semibold transition-colors">
                                    대시보드
                                </Link>
                            </li>
                            <li>
                                <Link href="/calculator" className="text-gray-400 hover:text-[#F7CB15] font-semibold transition-colors">
                                    계산기
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin" className="text-gray-400 hover:text-[#F7CB15] font-semibold transition-colors">
                                    관리자
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-xl font-bold mb-4">자료</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://www.nts.go.kr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-[#00D9FF] font-semibold transition-colors"
                                >
                                    국세청
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.koreatax.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-[#00D9FF] font-semibold transition-colors"
                                >
                                    한국납세자연맹
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xl font-bold mb-4">문의</h4>
                        <p className="text-gray-400 font-semibold">
                            이메일: support@ai-tax.com
                        </p>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 font-semibold">
                    <p>© {currentYear} AI 연말정산 계산기. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
