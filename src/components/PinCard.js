import { Heart, Share2 } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";

export function PinCard({ id, imageUrl, title, author, onClick }) {
    const { user, savedPins, likedPins, savePin, unsavePin, likePin, unlikePin } = useUser();

    const isSaved = savedPins.includes(id);
    const isLiked = likedPins.includes(id);

    const handleSave = (e) => {
        e.stopPropagation();
        if (!user) {
            toast.error("로그인이 필요합니다.");
            return;
        }
        if (isSaved) {
            unsavePin(id);
            toast.success("저장 취소되었습니다.");
        } else {
            savePin(id);
            toast.success("핀이 저장되었습니다!");
        }
    };

    const handleLike = (e) => {
        e.stopPropagation();
        if (!user) {
            toast.error("로그인이 필요합니다.");
            return;
        }
        if (isLiked) {
            unlikePin(id);
        } else {
            likePin(id);
        }
    };

    return (
        <div
            className="group relative cursor-pointer break-inside-avoid mb-4"
            onClick={onClick}
        >
            <div className="relative overflow-hidden rounded-2xl">
                {/* ImageWithFallback 대신 일반 img 태그 사용 */}
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />

                {/* 호버 시 나타나는 오버레이 */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={handleLike}
                            className={`rounded-full p-2 hover:bg-gray-100 transition-colors ${isLiked ? "bg-red-100" : "bg-white"
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? "fill-red-600 text-red-600" : "text-gray-800"}`} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toast("공유 기능은 아직 준비 중입니다!");
                            }}
                            className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                        >
                            <Share2 className="w-5 h-5 text-gray-800" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-white overflow-hidden">
                            <p className="truncate font-medium text-sm">{title}</p>
                        </div>
                        <button
                            onClick={handleSave}
                            className={`px-4 py-2 rounded-full transition-colors text-sm font-bold ${isSaved
                                    ? "bg-black text-white hover:bg-gray-900"
                                    : "bg-red-600 text-white hover:bg-red-700"
                                }`}
                        >
                            {isSaved ? "저장됨" : "저장"}
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-2 px-2">
                <p className="text-gray-900 font-semibold text-sm truncate">{title}</p>
                <p className="text-gray-600 text-xs">{author}</p>
            </div>
        </div>
    );
}