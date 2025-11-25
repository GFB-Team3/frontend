import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";
import { likePinAPI } from "../api/likes";

type PinCardProps = {
  id: number;
  imageUrl?: string | null;
  title: string;
  author: string;
  onClick: () => void;
};

export function PinCard({ id, imageUrl, title, author, onClick }: PinCardProps) {
  const { user } = useUser();

  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // fallback 설정
  const fallbackImage = "/dummy.jpg";
  const displayImageUrl =
    imageUrl && imageUrl.trim() !== "" ? imageUrl : fallbackImage;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (isSaved) {
      setIsSaved(false);
      toast.success("저장 취소되었습니다.");
    } else {
      setIsSaved(true);
      toast.success("핀이 저장되었습니다!");
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (isLiked) {
      toast.message("이미 좋아요한 핀입니다.");
      return;
    }

    try {
      await likePinAPI(id, user.user_id);
      setIsLiked(true);
      toast.success("좋아요!");
    } catch (err) {
      console.error(err);
      toast.error("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      className="group relative cursor-pointer break-inside-avoid mb-4"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={displayImageUrl}
          alt={title}
          className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            // 무한 루프 방지용 체크
            if (!target.src.endsWith(fallbackImage)) {
              target.src = fallbackImage;
            }
          }}
        />

        {/* 이하 기존 코드 그대로... */}
      </div>
      <div className="mt-2 px-2">
        <p className="text-gray-900 font-semibold text-sm truncate">{title}</p>
        <p className="text-gray-600 text-xs">{author}</p>
      </div>
    </div>
  );
}
