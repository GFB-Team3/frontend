import { useState, useEffect, useRef } from "react";
import Masonry from "react-responsive-masonry";
import { Toaster, toast } from "sonner";


// 우리가 만든 컴포넌트들 불러오기 (여기가 중요!)
import { Header } from "./components/Header";
import { PinCard } from "./components/PinCard";
import { PinModal } from "./components/PinModal"; // <--- 이제 진짜 파일을 불러옵니다!
import { UserProvider, useUser } from "./contexts/UserContext";

// 기존 import 아래에 추가
import { AuthModal } from "./components/AuthModal";
import { CreatePinModal } from "./components/CreatePinModal";
// 아직 안 만든 건 임시로 가짜 컴포넌트 사용 (계속 바꿀 예정) 
const EditProfileModal = ({ onClose }) => <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center" onClick={onClose}><div className="bg-white p-10 rounded">프로필 수정 모달 (준비중)</div></div>;
const ProfilePage = ({ onPinClick }) => <div className="text-center py-10 text-2xl font-bold">여기는 프로필 페이지입니다</div>;
const DeleteConfirmDialog = ({ onClose }) => null;
const LandingPage = ({ onLoginClick }) => <div className="flex flex-col items-center justify-center h-screen"><h1 className="text-4xl font-bold mb-4">Pinterest Clone</h1><button onClick={onLoginClick} className="bg-red-600 text-white px-6 py-3 rounded-full">로그인하고 시작하기</button></div>;

// 기본 목 데이터
const baseMockPins = [
  { id: 1, imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80", title: "모던 인테리어", description: "심플하고 세련된 거실 인테리어 아이디어입니다. 화이트 톤의 가구와 식물이 조화를 이룹니다.", author: "인테리어 스튜디오", category: "인테리어" },
  { id: 2, imageUrl: "https://images.unsplash.com/photo-1532980400857-e8d9d275d858?auto=format&fit=crop&w=800&q=80", title: "푸드 스타일링", description: "맛있어 보이는 음식 사진 촬영 팁을 공유합니다. 조명과 배치가 중요해요.", author: "푸드 포토그래퍼", category: "음식" },
  { id: 3, imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80", title: "패션", description: "올해의 트렌드 패션 아이템을 소개합니다.", author: "스타일리스트", category: "패션" },
  { id: 4, imageUrl: "https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?auto=format&fit=crop&w=800&q=80", title: "자연", description: "마음이 편안해지는 자연 풍경 사진 모음.", author: "여행 작가", category: "자연" },
  { id: 5, imageUrl: "https://images.unsplash.com/photo-1542372147193-a7aca54189cd?auto=format&fit=crop&w=800&q=80", title: "커피 타임", description: "감성적인 카페 분위기를 느껴보세요.", author: "바리스타", category: "음식" },
  { id: 6, imageUrl: "https://images.unsplash.com/photo-1713117222958-d6a389aade3f?auto=format&fit=crop&w=800&q=80", title: "아트 갤러리", description: "창의적인 영감을 주는 예술 작품들.", author: "아티스트", category: "아트" },
];

function AppContent() {
  const [selectedPin, setSelectedPin] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [displayedPins, setDisplayedPins] = useState([]);
  const { user, myPins } = useUser();

  useEffect(() => {
    setDisplayedPins([...baseMockPins]);
  }, []);

  const allPins = [...myPins, ...displayedPins];

  const filteredPins = allPins.filter((pin) => {
    const matchesSearch = pin.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "전체" || pin.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLoginClick = () => setShowAuthModal(true);

  return (
    <div className="min-h-screen bg-white">
      <Header
        onSearch={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onProfileClick={() => setShowProfile(true)}
        onLoginClick={handleLoginClick}
        onCreateClick={() => setShowCreateModal(true)}
      />

      {showProfile ? (
        <div>
          <button
            onClick={() => setShowProfile(false)}
            className="fixed top-20 left-4 z-30 px-4 py-2 bg-white border rounded-full hover:bg-gray-50 shadow-lg"
          >
            ← 홈으로
          </button>
          <ProfilePage />
        </div>
      ) : (
        <main className="container mx-auto px-4 py-6">
          <Masonry columnsCount={3} gutter="16px">
            {filteredPins.map((pin) => (
              <PinCard
                key={pin.id}
                {...pin}
                onClick={() => setSelectedPin(pin)}
              />
            ))}
          </Masonry>
        </main>
      )}

      {/* 여기가 중요! 이제 진짜 PinModal을 사용합니다 */}
      {selectedPin && (
        <PinModal
          pin={selectedPin}
          onClose={() => setSelectedPin(null)}
          // 내 핀일 때만 수정/삭제 버튼이 보이게 하려면 아래 함수가 필요하지만 지금은 일단 비워둡니다.
          onEdit={() => console.log("수정")}
          onDelete={() => console.log("삭제")}
        />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showCreateModal && <CreatePinModal onClose={() => setShowCreateModal(false)} />}
      {showEditProfileModal && <EditProfileModal onClose={() => setShowEditProfileModal(false)} />}

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}