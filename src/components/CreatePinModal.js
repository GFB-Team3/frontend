import { useState } from "react";
import { X, Upload } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";

const categories = [
    "인테리어", "음식", "패션", "자연", "여행", "아트", "건축", "동물", "피트니스",
];

export function CreatePinModal({ onClose, editPin }) {
    const [imageUrl, setImageUrl] = useState(editPin?.imageUrl || "");
    const [title, setTitle] = useState(editPin?.title || "");
    const [description, setDescription] = useState(editPin?.description || "");
    const [category, setCategory] = useState(editPin?.category || "");

    // UserContext에서 기능 가져오기 (없으면 가짜 함수 사용)
    const userContext = useUser();
    const createPin = userContext?.createPin || ((data) => console.log("생성:", data));
    const updatePin = userContext?.updatePin || ((id, data) => console.log("수정:", id, data));

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!imageUrl || !title || !description || !category) {
            toast.error("모든 필드를 입력해주세요.");
            return;
        }

        if (editPin) {
            updatePin(editPin.id, { imageUrl, title, description, category });
            toast.success("핀이 수정되었습니다! (테스트)");
        } else {
            createPin({ imageUrl, title, description, category });
            toast.success("핀이 생성되었습니다! (테스트)");
        }

        onClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[32px] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        {editPin ? "핀 수정" : "핀 만들기"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8">
                    <div className="grid md:grid-cols-2 gap-8">

                        {/* 왼쪽: 이미지 업로드 영역 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">이미지</label>
                            <div className="mt-2">
                                {imageUrl ? (
                                    <div className="relative group">
                                        <img
                                            src={imageUrl}
                                            alt="Preview"
                                            className="w-full h-auto rounded-2xl border shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setImageUrl("")}
                                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <X className="w-5 h-5 text-gray-700" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-gray-400 hover:bg-gray-50 transition-all h-[400px] flex flex-col items-center justify-center bg-gray-50/50">
                                        <div className="bg-gray-200 p-4 rounded-full mb-4">
                                            <Upload className="w-8 h-8 text-gray-600" />
                                        </div>
                                        <p className="mb-2 text-gray-900 font-semibold">이미지 URL을 입력하세요</p>
                                        <p className="text-sm text-gray-500 mb-6 max-w-[200px]">
                                            (실제 파일 업로드 대신 이미지 주소를 넣어주세요)
                                        </p>
                                        <input
                                            type="text"
                                            placeholder="https://..."
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 오른쪽: 정보 입력 영역 */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium text-gray-700">제목</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="핀 제목을 입력하세요"
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-lg font-medium placeholder:font-normal"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium text-gray-700">설명</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="핀에 대한 상세한 설명을 적어주세요"
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-red-500 transition-colors min-h-[120px] resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="category" className="text-sm font-medium text-gray-700">카테고리</label>
                                <div className="relative">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-red-500 transition-colors appearance-none bg-white cursor-pointer"
                                    >
                                        <option value="" disabled>카테고리를 선택하세요</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-full transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                                >
                                    {editPin ? "수정 완료" : "게시하기"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}