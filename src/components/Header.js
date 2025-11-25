import { Search, Bell, MessageCircle, Plus } from "lucide-react";
import { useUser } from "../contexts/UserContext";

const categories = [
    "전체", "인테리어", "음식", "패션", "자연",
    "여행", "아트", "건축", "동물", "피트니스",
];

export function Header({ onSearch, activeCategory, onCategoryChange, onProfileClick, onLoginClick, onCreateClick }) {
    const { user, logout } = useUser();

    return (
        <header className="sticky top-0 bg-white z-40 border-b">
            <div className="px-4 py-3">
                <div className="flex items-center gap-4">
                    {/* 로고 (클릭시 새로고침 = 홈 이동 효과) */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">P</span>
                        </div>
                        <span className="hidden md:block font-bold text-red-600 text-lg">Pinterest</span>
                    </div>

                    {/* 네비게이션 */}
                    <nav className="hidden md:flex gap-2">
                        <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-full bg-black text-white font-semibold">홈</button>
                        <button className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors font-semibold">탐색</button>
                        {user && (
                            <button onClick={onCreateClick} className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 font-semibold">
                                <Plus className="w-4 h-4" /> 만들기
                            </button>
                        )}
                    </nav>

                    {/* 검색창 */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="검색"
                            onChange={(e) => onSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-200 transition-colors"
                        />
                    </div>

                    {/* 우측 아이콘 및 프로필 */}
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Bell className="w-6 h-6 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <MessageCircle className="w-6 h-6 text-gray-500" />
                        </button>

                        {user ? (
                            <div className="flex items-center gap-2 ml-2">
                                {/* 👇 여기가 중요! 프로필 클릭시 onProfileClick 실행 */}
                                <div
                                    onClick={onProfileClick}
                                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 border border-transparent hover:border-gray-400 transition-all"
                                    title="프로필 보기"
                                >
                                    <span className="font-bold text-gray-700">{user.name?.[0] || "U"}</span>
                                </div>
                                <button onClick={logout} className="text-xs text-gray-500 hover:text-red-600 hover:underline ml-1">
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-bold"
                            >
                                로그인
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 카테고리 리스트 */}
            <div className="px-4 pb-3 overflow-x-auto no-scrollbar">
                <div className="flex gap-2 min-w-max">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => onCategoryChange(category)}
                            className={`px-4 py-2 rounded-full transition-colors font-medium ${activeCategory === category
                                    ? "bg-black text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
}