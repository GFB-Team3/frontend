<<<<<<< HEAD
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
=======
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import {
  fetchMyPins,
  fetchLikedPinsAPI,
  updateProfileAPI,
} from "../api/users";
import { toast } from "sonner";
import { PinCard } from "./PinCard";

export function ProfilePage({ onPinClick }) {
  const { user, setUser } = useUser();

  const [activeTab, setActiveTab] = useState("profile"); // profile | myPins | liked
  const [myPins, setMyPins] = useState([]);
  const [likedPins, setLikedPins] = useState([]);
  const [editName, setEditName] = useState(user?.username || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // 내 핀 & 좋아요 핀 로딩
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const [mine, liked] = await Promise.all([
          fetchMyPins(user.user_id),
          fetchLikedPinsAPI(user.user_id),
        ]);
        setMyPins(mine);
        setLikedPins(liked);
      } catch (err) {
        console.error(err);
        toast.error("프로필 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    load();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-16 text-xl">
        로그인 후 프로필을 확인할 수 있습니다.
      </div>
    );
  }

  // 프로필 저장
  const handleSaveProfile = async () => {
    const trimmed = editName.trim();
    if (!trimmed) {
      toast.error("이름을 입력하세요.");
      return;
    }

    try {
      setSavingProfile(true);
      const updated = await updateProfileAPI({
        user_id: user.user_id,
        username: trimmed,
      });
      setUser(updated);
      toast.success("프로필이 수정되었습니다.");
    } catch (err) {
      console.error(err);
      toast.error("프로필 수정 중 오류가 발생했습니다.");
    } finally {
      setSavingProfile(false);
    }
  };

  const renderContent = () => {
    if (activeTab === "profile") {
      return (
        <div className="mt-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">프로필 정보</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
              {user.username[0]}
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-lg">
                {user.username}
              </p>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              이름 변경
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="새 이름을 입력하세요"
            />
            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="mt-2 px-4 py-2 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
            >
              {savingProfile ? "저장 중..." : "프로필 저장"}
            </button>
          </div>
        </div>
      );
    }

    if (activeTab === "myPins") {
      if (!myPins.length) {
        return (
          <p className="mt-8 text-gray-500">
            아직 작성한 핀이 없습니다. 첫 핀을 만들어보세요!
          </p>
        );
      }

      return (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {myPins.map((p) => (
            <PinCard
              key={p.pin_id}
              id={p.pin_id}
              imageUrl={p.image}
              title={p.title}
              author={user.username}
              onClick={() => onPinClick(p)}
            />
          ))}
        </div>
      );
    }

    if (activeTab === "liked") {
      if (!likedPins.length) {
        return (
          <p className="mt-8 text-gray-500">
            아직 즐겨찾기한 핀이 없습니다.
          </p>
        );
      }

      return (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {likedPins.map((p) => (
            <PinCard
              key={p.pin_id}
              id={p.pin_id}
              imageUrl={p.image}
              title={p.title}
              author={p.user?.username || "작성자"}
              onClick={() => onPinClick(p)}
            />
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 상단 프로필 헤더 */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold mb-4">
          {user.username[0]}
        </div>
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-gray-500 text-sm mt-1">{user.email}</p>
      </div>

      {/* 탭 */}
      <div className="flex justify-center gap-4 border-b pb-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 ${
            activeTab === "profile"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          프로필
        </button>
        <button
          onClick={() => setActiveTab("myPins")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 ${
            activeTab === "myPins"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          작성한 핀
        </button>
        <button
          onClick={() => setActiveTab("liked")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 ${
            activeTab === "liked"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          즐겨찾기한 핀
        </button>
      </div>

      {/* 탭 내용 */}
      {renderContent()}
    </div>
  );
}
>>>>>>> dev2
