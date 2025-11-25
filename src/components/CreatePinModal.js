import { useState } from "react";
import { X, Upload } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";

export function CreatePinModal({ onClose, editPin }) {
  const [imageUrl, setImageUrl] = useState(editPin?.imageUrl || "");
  const [title, setTitle] = useState(editPin?.title || "");
  const [description, setDescription] = useState(editPin?.description || "");
  const [category, setCategory] = useState(editPin?.category || "");

  const { createPin } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!imageUrl || !title || !description || !category) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }

    // 백엔드 API 호출 없이 Context의 함수만 실행
    createPin({ imageUrl, title, description, category });
    toast.success("핀이 생성되었습니다!");
    onClose();
  };

  // (나머지 JSX 부분은 그대로 유지되거나, 이전 코드와 동일하게 넣으시면 됩니다)
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-[32px] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">{editPin ? "핀 수정" : "핀 만들기"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6 text-gray-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">이미지</label>
              <div className="mt-2">
                {imageUrl ? (
                  <div className="relative group">
                    <img src={imageUrl} alt="Preview" className="w-full h-auto rounded-2xl border shadow-sm" />
                    <button type="button" onClick={() => setImageUrl("")} className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"><X className="w-5 h-5 text-gray-700" /></button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center h-[400px] flex flex-col items-center justify-center bg-gray-50/50">
                    <div className="bg-gray-200 p-4 rounded-full mb-4"><Upload className="w-8 h-8 text-gray-600" /></div>
                    <p className="mb-2 text-gray-900 font-semibold">이미지 URL을 입력하세요</p>
                    <input type="text" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-full text-sm" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">제목</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="핀 제목" className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-lg font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">설명</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="설명" className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl min-h-[120px]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">카테고리</label>
                <div className="relative">
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl appearance-none bg-white cursor-pointer">
                    <option value="" disabled>선택하세요</option>
                    <option value="인테리어">인테리어</option>
                    <option value="음식">음식</option>
                    <option value="패션">패션</option>
                  </select>
                </div>
              </div>
              <div className="pt-8">
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-full transition-all">게시하기</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}