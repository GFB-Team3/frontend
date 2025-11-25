import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "../contexts/UserContext";
import { createPinAPI } from "../api/pins";

export function CreatePinModal({ onClose, onCreated }) {
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const safeClose = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("로그인 후에 핀을 만들 수 있습니다.");
      return;
    }
    if (!title || !content) {
      toast.error("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const newPin = await createPinAPI({
        user_id: user.user_id,
        title,
        content,
        image: imageFile,
      });

      toast.success("핀을 생성했습니다!");
      if (typeof onCreated === "function") {
        onCreated(newPin);
      }
      safeClose();
    } catch (err) {
      console.error(err);
      toast.error("핀 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={safeClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">새 핀 만들기</h2>
          <button
            onClick={safeClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="핀 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="핀 내용을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              이미지 (선택)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                setImageFile(file);
              }}
              className="w-full text-sm"
            />
            {imageFile && (
              <p className="mt-1 text-xs text-gray-500">
                선택된 파일: {imageFile.name}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={safeClose}
              className="px-4 py-2 text-sm rounded-full border hover:bg-gray-50"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "저장 중..." : "핀 저장하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
