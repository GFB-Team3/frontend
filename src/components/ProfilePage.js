import { useState } from "react";
import Masonry from "react-responsive-masonry";
import { Settings, Share2, Plus } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { PinCard } from "./PinCard";

export function ProfilePage({ allPins, onPinClick }) {
    const { user, myPins, savedPins, likedPins } = useUser();
    const [activeTab, setActiveTab] = useState("saved"); // 기본값: 저장됨(사진처럼)

    // 1. 내가 만든 핀 (Context에 있는 myPins)
    const createdPins = myPins;

    // 2. 내가 저장/좋아요한 핀 (전체 핀 중에서 ID로 찾기)
    // (savedPins와 likedPins에 포함된 ID를 가진 핀만 골라냅니다)
    const savedOrLikedPins = allPins.filter(
        (pin) => savedPins.includes(pin.id) || likedPins.includes(pin.id)
    );

    // 현재 탭에 따라 보여줄 핀 결정
    const displayedPins = activeTab === "created" ? createdPins : savedOrLikedPins;

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-white pt-4">
            {/* 1. 프로필 헤더 영역 */}
            <div className="flex flex-col items-center gap-2 mb-8">
                {/* 프로필 이미지 */}
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600 mb-2 border hover:bg-gray-300 transition-colors cursor-pointer">
                    {user?.name?.[0] || "나"}
                </div>

                {/* 이름 및 아이디 */}
                <h1 className="text-3xl font-bold">{user?.name || "사용자"}</h1>
                <p className="text-gray-500 text-sm">@{user?.email?.split("@")[0] || "user_id"}</p>
                <p className="text-gray-500 text-sm font-medium">팔로잉 0명</p>

                {/* 버튼들 (공유, 수정) */}
                <div className="flex gap-2 mt-4">
                    <button className="px-4 py-3 bg-gray-200 rounded-full font-bold hover:bg-gray-300 transition-colors text-sm">
                        프로필 공유
                    </button>
                    <button className="px-4 py-3 bg-gray-200 rounded-full font-bold hover:bg-gray-300 transition-colors text-sm">
                        프로필 수정
                    </button>
                </div>
            </div>

            {/* 2. 탭 메뉴 (생성됨 / 저장됨) */}
            <div className="flex gap-8 mb-6 text-sm font-semibold">
                <button
                    onClick={() => setActiveTab("created")}
                    className={`pb-2 border-b-2 transition-colors ${activeTab === "created"
                            ? "border-black text-black"
                            : "border-transparent text-gray-600 hover:bg-gray-100 rounded-md px-2"
                        }`}
                >
                    생성됨
                </button>
                <button
                    onClick={() => setActiveTab("saved")}
                    className={`pb-2 border-b-2 transition-colors ${activeTab === "saved"
                            ? "border-black text-black"
                            : "border-transparent text-gray-600 hover:bg-gray-100 rounded-md px-2"
                        }`}
                >
                    저장됨
                </button>
            </div>

            {/* 3. 필터 및 추가 버튼 영역 (사진 참고) */}
            <div className="w-full max-w-[1200px] px-4 flex justify-between items-center mb-6">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Settings className="w-6 h-6 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Plus className="w-6 h-6 text-gray-600" />
                </button>
            </div>

            {/* 4. 핀 리스트 영역 */}
            <div className="w-full max-w-[1600px] px-4 pb-20">
                {displayedPins.length > 0 ? (
                    <Masonry columnsCount={5} gutter="16px">
                        {displayedPins.map((pin) => (
                            <PinCard
                                key={pin.id}
                                {...pin}
                                onClick={() => onPinClick(pin)}
                            />
                        ))}
                    </Masonry>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        {activeTab === "created"
                            ? "아직 생성한 핀이 없습니다."
                            : "아직 좋아요하거나 저장한 핀이 없습니다."}
                    </div>
                )}
            </div>
        </div>
    );
}