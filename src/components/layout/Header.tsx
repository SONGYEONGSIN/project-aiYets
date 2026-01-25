'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleLogout = () => {
        signOut({ callbackUrl: '/' });
    };

    const renderAuthButton = () => {
        if (!isClient) {
            return (
                <Link href="/login" className="btn-retro bg-primary text-black px-5 py-2 text-sm">
                    로그인
                </Link>
            );
        }

        if (status === 'loading') {
            return (
                <div className="px-5 py-2 text-sm bg-gray-200 border-2 border-black rounded-lg animate-pulse">
                    ...
                </div>
            );
        }

        if (session) {
            return (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black rounded-lg">
                        {session.user?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={session.user.image}
                                alt="프로필"
                                className="w-6 h-6 rounded-full border border-black"
                            />
                        ) : (
                            <User className="w-4 h-4" />
                        )}
                        <span className="font-medium text-sm max-w-[80px] truncate">
                            {session.user?.name || session.user?.email?.split('@')[0]}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn-retro bg-black text-white px-3 py-1.5 text-sm flex items-center gap-1"
                    >
                        <LogOut className="w-3 h-3" />
                    </button>
                </div>
            );
        }

        return (
            <Link href="/login" className="btn-retro bg-primary text-black px-5 py-2 text-sm">
                로그인
            </Link>
        );
    };

    const renderMobileAuthButton = () => {
        if (!isClient) {
            return (
                <Link
                    href="/login"
                    className="block mx-4 my-2 btn-retro bg-primary text-black px-6 py-3 text-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    로그인
                </Link>
            );
        }

        if (status === 'loading') {
            return (
                <div className="block mx-4 my-2 px-6 py-3 text-lg text-center bg-gray-200 border-2 border-black rounded-lg">
                    ...
                </div>
            );
        }

        if (session) {
            return (
                <div className="mx-4 my-2 space-y-2">
                    <div className="px-4 py-3 bg-white border-2 border-black rounded-lg flex items-center gap-2">
                        {session.user?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={session.user.image}
                                alt="프로필"
                                className="w-8 h-8 rounded-full border-2 border-black"
                            />
                        ) : (
                            <User className="w-6 h-6" />
                        )}
                        <span className="font-semibold">
                            {session.user?.name || session.user?.email}
                        </span>
                    </div>
                    <button
                        onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                        }}
                        className="w-full btn-retro bg-black text-white px-6 py-3 text-lg flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-5 h-5" />
                        로그아웃
                    </button>
                </div>
            );
        }

        return (
            <Link
                href="/login"
                className="block mx-4 my-2 btn-retro bg-primary text-black px-6 py-3 text-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
            >
                로그인
            </Link>
        );
    };

    return (
        <header className="bg-white border-b-2 border-black sticky top-0 z-50">
            <div className="container max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <Image
                            src="/logo.png"
                            alt="연말정산이AI"
                            width={36}
                            height={36}
                            className="rounded-lg"
                        />
                        <span className="font-head text-lg">연말정산이</span>
                        <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-2 py-0.5 text-sm font-black rounded shadow-brutal-sm">AI</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                        >
                            대시보드
                        </Link>
                        <Link
                            href="/calculator"
                            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                        >
                            계산기
                        </Link>
                        <Link
                            href="/admin"
                            className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                        >
                            관리자
                        </Link>
                        <div className="ml-2">
                            {renderAuthButton()}
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 border-2 border-black rounded-lg bg-white hover:bg-muted transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="md:hidden py-4 border-t-2 border-black space-y-1">
                        <Link
                            href="/dashboard"
                            className="block px-4 py-3 text-lg font-medium rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            대시보드
                        </Link>
                        <Link
                            href="/calculator"
                            className="block px-4 py-3 text-lg font-medium rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            계산기
                        </Link>
                        <Link
                            href="/admin"
                            className="block px-4 py-3 text-lg font-medium rounded-lg hover:bg-muted transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            관리자
                        </Link>
                        {renderMobileAuthButton()}
                    </nav>
                )}
            </div>
        </header>
    );
}
