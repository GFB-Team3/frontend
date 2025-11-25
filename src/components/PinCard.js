import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";

export function PinCard({ id, imageUrl, title, author, onClick }) {
  const { user, savedPins, likedPins, savePin, unsavePin, likePin, unlikePin } = useUser();

  // 백엔드 로직과 동일하게 (좋아요, 저장 상태 확인)
  // (user?.id 가 없을 수도 있으니 안전하게 처리)
  const isSaved = savedPins && savedPins.includes(id);
  const isLiked = likedPins && likedPins.includes(id);

  // 이미지 엑박 방지 (fallback)
  const displayImageUrl = imageUrl && imageUrl.trim() !== "" ? imageUrl : "https://via.placeholder.com/300?text=No+Image";

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
        {/* 이미지 */}
        <img
          src={displayImageUrl}
          alt={title}
          className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Error"; }}
        />

        {/* 호버 시 나타나는 오버레이 */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
          <div className="flex justify-end gap-2">
            <button
              onClick={handleLike}
              className={`rounded-full p-2 hover:bg-gray-100 transition-colors ${isLiked ? "bg-red-100 text-red-600" : "bg-white text-gray-800"
                }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-red-600" : ""}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(`https://pinterest.com/pin/${id}`);
                toast.success("링크 복사 완료!");
              }}
              className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-800" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-white overflow-hidden w-2/3">
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