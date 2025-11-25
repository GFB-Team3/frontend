import { useState, useEffect } from "react";
import { Lightbulb, Pin, Sparkles } from "lucide-react";

export function LandingPage({ onLoginClick, onSignUpClick }) {
    // 배경에 깔아둘 이미지들 (아까 쓰던 목 데이터 활용)
    const heroImages = [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1532980400857-e8d9d275d858?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?auto=format&fit=crop&w=400&q=80",
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* 1. 상단 헤더 */}
            <header className="fixed top-0 w-full bg-white z-50 h-20 flex items-center justify-between px-4 md:px-8 shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 text-red-600 font-bold text-xl cursor-pointer">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white">P</div>
                        Pinterest
                    </div>
                    <nav className="hidden md:flex gap-6 font-semibold text-gray-900">
                        <a href="#" className="hover:underline">소개</a>
                        <a href="#" className="hover:underline">비즈니스</a>
                        <a href="#" className="hover:underline">블로그</a>
                    </nav>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onLoginClick}
                        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-bold"
                    >
                        로그인
                    </button>
                    <button
                        onClick={onSignUpClick}
                        className="px-4 py-2 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-colors font-bold"
                    >
                        가입하기
                    </button>
                </div>
            </header>

            {/* 2. 히어로 섹션 (사진들이 보이는 메인 영역) */}
            <div className="mt-20 w-full relative overflow-hidden h-[500px] md:h-[600px] flex flex-col items-center justify-center">
                {/* 배경 이미지 그리드 (흐릿하게 처리) */}
                <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50 pointer-events-none">
                    {heroImages.map((img, i) => (
                        <div key={i} className="flex flex-col gap-4 animate-scroll">
                            <img src={img} className="rounded-2xl w-full h-60 object-cover mb-4" alt="" />
                            <img src={heroImages[(i + 1) % 4]} className="rounded-2xl w-full h-60 object-cover mb-4" alt="" />
                            <img src={heroImages[(i + 2) % 4]} className="rounded-2xl w-full h-60 object-cover mb-4" alt="" />
                        </div>
                    ))}
                </div>
                {/* 그라데이션 오버레이 (글씨 잘 보이게) */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>

                {/* 메인 텍스트 */}
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        맛있는 레시피를 탐색해보세요
                    </h1>
                    <div className="flex justify-center gap-2 dots">
                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    </div>
                    <button
                        onClick={onSignUpClick}
                        className="mt-10 px-8 py-4 bg-red-600 text-white rounded-full text-lg font-bold hover:bg-red-700 transition-transform transform hover:scale-105"
                    >
                        무료로 가입하기
                    </button>
                </div>
            </div>

            {/* 3. 노란색 기능 소개 섹션 (사진 3번) */}
            <div className="bg-[#fffd92] py-20 px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">

                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-6 text-white">
                            <Lightbulb className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-red-900 mb-3">아이디어 발견</h3>
                        <p className="text-red-900/80 text-lg">
                            수백만 개의 아이디어 중에서 나에게 딱 맞는 것을 찾아보세요
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-400 rounded-full flex items-center justify-center mb-6 text-white">
                            <Pin className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-red-900 mb-3">저장 및 정리</h3>
                        <p className="text-red-900/80 text-lg">
                            마음에 드는 핀을 저장하고 나만의 컬렉션을 만들어보세요
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mb-6 text-white">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-red-900 mb-3">실천하기</h3>
                        <p className="text-red-900/80 text-lg">
                            저장한 아이디어를 현실로 만들어보세요
                        </p>
                    </div>

                </div>
            </div>

            {/* 4. 하단 가입 유도 섹션 (사진 1번) */}
            <div className="bg-white py-20 text-center relative">
                <div className="max-w-2xl mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">지금 시작해보세요</h2>
                    <p className="text-xl text-gray-600 mb-10">
                        무료로 가입하고 나만의 아이디어를 발견하고 저장하세요
                    </p>
                    <button
                        onClick={onSignUpClick}
                        className="px-8 py-4 bg-red-600 text-white rounded-full text-lg font-bold hover:bg-red-700 transition-colors"
                    >
                        무료로 가입하기
                    </button>
                </div>

                {/* 하단 링크들 */}
                <div className="mt-20 border-t pt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-gray-900">
                    <a href="#">Pinterest 정보</a>
                    <a href="#">블로그</a>
                    <a href="#">비즈니스</a>
                    <a href="#">개발자</a>
                    <a href="#">채용</a>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                    © 2025 Pinterest
                </div>
            </div>
        </div>
    );
}