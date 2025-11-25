import { Search, Bell, MessageCircle, Plus } from "lucide-react";
import { useUser } from "../contexts/UserContext";

export function Header({ onSearch, onProfileClick, onLoginClick, onCreateClick }) {
    const { user, logout } = useUser();

    return (
        <header className="sticky top-0 bg-white z-40 p-4 shadow-sm">
            <div className="flex items-center gap-4">
                {/* 로고 */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">P</span>
                    </div>
                    <span className="hidden md:block font-bold text-red-600 text-lg">Pinterest</span>
                </div>

                {/* 네비게이션 (탐색 버튼 삭제됨) */}
                <nav className="hidden md:flex gap-2">
                    <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-full bg-black text-white font-semibold">홈</button>

                    {/* 👇 탐색 버튼 있던 자리 삭제함 */}

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
                            <div
                                onClick={onProfileClick}
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 border border-transparent hover:border-gray-400 transition-all"
                                title="프로필 보기"
                            >
                                <span className="font-bold text-gray-700">
                                    {user.username ? user.username[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : "U")}
                                </span>
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
        </header>
    );
}