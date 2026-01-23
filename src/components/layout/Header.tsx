'use client';

import Link from 'next/link';
import { Calculator, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white border-b-4 border-black sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-2xl font-black hover:opacity-80 transition-opacity"
                    >
                        <div className="bg-[#FF6B35] p-2 border-brutal shadow-brutal-sm">
                            <Calculator className="w-6 h-6" />
                        </div>
                        AI 연말정산
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2">
                        <Link
                            href="/dashboard"
                            className="px-6 py-2 text-lg font-bold hover:bg-[#F5F5F5] transition-colors"
                        >
                            대시보드
                        </Link>
                        <Link
                            href="/calculator"
                            className="px-6 py-2 text-lg font-bold hover:bg-[#F5F5F5] transition-colors"
                        >
                            계산기
                        </Link>
                        <Link
                            href="/admin"
                            className="px-6 py-2 text-lg font-bold hover:bg-[#F5F5F5] transition-colors"
                        >
                            관리자
                        </Link>
                        <Link
                            href="/login"
                            className="ml-4 px-6 py-2 text-lg font-bold bg-black text-white border-brutal shadow-brutal-sm hover-brutal"
                        >
                            로그인
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 border-brutal shadow-brutal-sm bg-white hover-brutal"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="md:hidden mt-4 pt-4 border-t-4 border-black space-y-2">
                        <Link
                            href="/dashboard"
                            className="block px-4 py-3 text-lg font-bold hover:bg-[#F5F5F5] transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            대시보드
                        </Link>
                        <Link
                            href="/calculator"
                            className="block px-4 py-3 text-lg font-bold hover:bg-[#F5F5F5] transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            계산기
                        </Link>
                        <Link
                            href="/admin"
                            className="block px-4 py-3 text-lg font-bold hover:bg-[#F5F5F5] transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            관리자
                        </Link>
                        <Link
                            href="/login"
                            className="block mx-4 my-2 px-6 py-3 text-lg font-bold text-center bg-black text-white border-brutal shadow-brutal-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            로그인
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
