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
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">P</span>
                        </div>
                        <span className="hidden md:block font-bold text-red-600 text-lg">Pinterest</span>
                    </div>

                    <nav className="hidden md:flex gap-2">
                        <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-full bg-black text-white font-semibold">홈</button>
                        <button className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors font-semibold">탐색</button>
                        {user && (
                            <button onClick={onCreateClick} className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 font-semibold">
                                <Plus className="w-4 h-4" /> 만들기
                            </button>
                        )}
                    </nav>

                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="검색"
                            onChange={(e) => onSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-200 transition-colors"
                        />
                    </div>

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
                                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-