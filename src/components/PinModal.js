import { useState, useEffect, useRef } from "react";
import { X, Heart, Share2, MoreHorizontal, Edit, Trash2, Download, Flag, Code, EyeOff, Search as SearchIcon } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";

export function PinModal({ pin, onClose, onEdit, onDelete }) {
    const { user, savedPins, likedPins, savePin, unsavePin, likePin, unlikePin } = useUser();

    // 메뉴를 껐다 켰다 할 스위치
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    // 메뉴 바깥을 클릭하면 닫히게 하기 위한 참조
    const menuRef = useRef(null);

    const isSaved = savedPins.includes(pin.id);
    const isLiked = likedPins.includes(pin.id);
    const isMyPin = user?.id === pin.authorId;

    // 메뉴 바깥 클릭 감지 (메뉴 닫기 기능)
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMoreMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSave = () => {
        if (!user) {
            toast.error("로그인이 필요합니다.");
            return;
        }
        if (isSaved) {
            unsavePin(pin.id);
            toast.success("저장 취소되었습니다.");
        } else {
            savePin(pin.id);
            toast.success("핀이 저장되었습니다!");
        }
    };

    const handleLike = () => {
        if (!user) {
            toast.error("로그인이 필요합니다.");
            return;
        }
        if (isLiked) {
            unlikePin(pin.id);
        } else {
            likePin(pin.id);
        }
    };

    const handleShare = () => {
        const shareUrl = `https://pinterest.com/pin/${pin.id}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success("링크가 복사되었습니다!");
    };

    // ✨ 이미지 다운로드 기능 (진짜 작동함!)
    const handleDownload = async () => {
        try {
            const response = await fetch(pin.imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `pinterest_download_${pin.id}.jpg`; // 파일명 설정
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("이미지가 다운로드되었습니다.");
            setShowMoreMenu(false);
        } catch (error) {
            console.error(error);
            toast.error("다운로드에 실패했습니다.");
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[32px] max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row cursor-default shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 왼쪽 이미지 영역 */}
                <div className="md:w-1/2 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                        src={pin.imageUrl}
                        alt={pin.title}
                        className="w-full h-full object-contain max-h-[80vh]"
                    />
                </div>

                {/* 오른쪽 정보 영역 */}
                <div className="md:w-1/2 flex flex-col h-full max-h-[90vh]">
                    {/* 상단 버튼들 */}
                    <div className="flex items-center justify-between p-6 sticky top-0 bg-white z-10">
                        <div className="flex gap-2 relative" ref={menuRef}>
                            <button
                                onClick={handleShare}
                                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                                title="공유하기"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>

                            {/* 👇 더보기 버튼 */}
                            <button
                                onClick={() => setShowMoreMenu(!showMoreMenu)}
                                className={`p-3 rounded-full transition-colors ${showMoreMenu ? "bg-gray-100" : "hover:bg-gray-100"}`}
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </button>

                            {/* 👇 여기가 사진처럼 만든 드롭다운 메뉴입니다 */}
                            {showMoreMenu && (
                                <div className="absolute top-14 left-0 bg-white shadow-xl rounded-xl w-64 p-2 border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-100">
                                    <div className="flex flex-col gap-1">
                                        <p className="px-3 py-2 text-xs font-semibold text-gray-500">옵션</p>

                                        <button
                                            onClick={handleDownload}
                                            className="w-full text-left px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-900 flex items-center gap-3 transition-colors"
                                        >
                                            <Download className="w-4 h-4" /> 이미지 다운로드
                                        </button>

                                        <button
                                            onClick={() => toast("유사한 핀을 더 찾아볼게요!")}
                                            className="w-full text-left px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-900 flex items-center gap-3 transition-colors"
                                        >
                                            <SearchIcon className="w-4 h-4" /> 유사한 핀 더 보기
                                        </button>

                                        <button
                                            onClick={() => toast("이런 핀을 덜 보여드릴게요.")}
                                            className="w-full text-left px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-900 flex items-center gap-3 transition-colors"
                                        >
                                            <EyeOff className="w-4 h-4" /> 유사한 핀 덜 보기
                                        </button>

                                        <button
                                            onClick={() => toast("신고가 접수되었습니다.")}
                                            className="w-full text-left px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-900 flex items-center gap-3 transition-colors"
                                        >
                                            <Flag className="w-4 h-4" /> 핀 신고
                                        </button>

                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`<img src="${pin.imageUrl}" />`);
                                                toast.success("임베드 코드가 복사되었습니다!");
                                            }}
                                            className="w-full text-left px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-900 flex items-center gap-3 transition-colors"
                                        >
                                            <Code className="w-4 h-4" /> 핀 임베드 코드 가져오기
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                className={`px-6 py-3 rounded-full transition-colors font-bold text-base ${isSaved
                                        ? "bg-black text-white hover:bg-gray-800"
                                        : "bg-red-600 text-white hover:bg-red-700"
                                    }`}
                            >
                                {isSaved ? "저장됨" : "저장"}
                            </button>
                        </div>
                    </div>

                    {/* 스크롤 되는 내용 영역 */}
                    <div className="flex-1 overflow-y-auto px-8 pb-8">
                        <h1 className="text-4xl font-bold mb-4 text-gray-900 leading-tight">{pin.title}</h1>
                        <p className="text-gray-700 mb-6 text-base leading-relaxed">{pin.description}</p>

                        {/* 작성자 프로필 */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden">
                                    {pin.author ? pin.author[0] : "A"}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{pin.author}</p>
                                    <p className="text-gray-600 text-sm">팔로워 1.2천명</p>
                                </div>
                            </div>
                            <button className="bg-gray-200 px-5 py-3 rounded-full hover:bg-gray-300 transition-colors font-semibold text-sm">
                                팔로우
                            </button>
                        </div>

                        {/* 댓글 영역 */}
                        <div className="border-t pt-8 mt-4">
                            <h3 className="font-bold text-xl mb-6">댓글 0개</h3>

                            {/* 좋아요/수정/삭제 버튼 (내 핀일 경우) */}
                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={handleLike}
                                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center gap-2"
                                >
                                    <Heart className={`w-6 h-6 ${isLiked ? "fill-red-600 text-red-600" : "text-gray-600"}`} />
                                </button>
                                {isMyPin && (
                                    <>
                                        <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full"><Edit className="w-5 h-5" /></button>
                                        <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full text-red-600"><Trash2 className="w-5 h-5" /></button>
                                    </>
                                )}
                            </div>

                            {/* 댓글 입력창 */}
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                                    {user ? user.name[0] : "G"}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="댓글 추가..."
                                        className="w-full border border-gray-300 rounded-[32px] px-5 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}