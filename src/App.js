import { useState, useEffect, useRef } from "react";
import Masonry from "react-responsive-masonry";
import { Toaster } from "sonner";

// 컴포넌트 불러오기
import { Header } from "./components/Header";
import { PinCard } from "./components/PinCard";
import { PinModal } from "./components/PinModal";
import { CreatePinModal } from "./components/CreatePinModal";
import { AuthModal } from "./components/AuthModal";
import { LandingPage } from "./components/LandingPage";
import { UserProvider, useUser } from "./contexts/UserContext";

// 아직 안 만든 건 임시 컴포넌트
const EditProfileModal = ({ onClose }) => <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center" onClick={onClose}><div className="bg-white p-10 rounded">프로필 수정 모달 (준비중)</div></div>;
const ProfilePage = ({ onPinClick }) => <div className="text-center py-10 text-2xl font-bold">여기는 프로필 페이지입니다</div>;
const DeleteConfirmDialog = ({ onClose }) => null;

// 기본 목 데이터 (무한 스크롤용)
const baseMockPins = [
  { id: 1, imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80", title: "모던 인테리어", description: "심플하고 세련된 거실", author: "인테리어 스튜디오", category: "인테리어" },
  { id: 2, imageUrl: "https://images.unsplash.com/photo-1532980400857-e8d9d275d858?auto=format&fit=crop&w=800&q=80", title: "푸드 스타일링", description: "맛있는 음식 사진", author: "푸드 포토그래퍼", category: "음식" },
  { id: 3, imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80", title: "패션 트렌드", description: "올해의 패션", author: "스타일리스트", category: "패션" },
  { id: 4, imageUrl: "https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?auto=format&fit=crop&w=800&q=80", title: "자연 풍경", description: "힐링되는 자연", author: "여행 작가", category: "자연" },
  { id: 5, imageUrl: "https://images.unsplash.com/photo-1542372147193-a7aca54189cd?auto=format&fit=crop&w=800&q=80", title: "커피 타임", description: "감성 카페", author: "바리스타", category: "음식" },
  { id: 6, imageUrl: "https://images.unsplash.com/photo-1713117222958-d6a389aade3f?auto=format&fit=crop&w=800&q=80", title: "추상 아트", description: "영감을 주는 그림", author: "아티스트", category: "아트" },
  { id: 7, imageUrl: "https://images.unsplash.com/photo-1549791084-5f78368b208b?auto=format&fit=crop&w=800&q=80", title: "미니멀 건축", description: "공간의 미학", author: "건축가", category: "건축" },
  { id: 8, imageUrl: "https://images.unsplash.com/photo-1663043501785-05d17c625253?auto=format&fit=crop&w=800&q=80", title: "귀여운 강아지", description: "반려동물 사진", author: "펫 작가", category: "동물" },
  { id: 9, imageUrl: "https://images.unsplash.com/photo-1618688862225-ac941a9da58f?auto=format&fit=crop&w=800&q=80", title: "홈 트레이닝", description: "건강한 습관", author: "트레이너", category: "피트니스" },
];

function AppContent() {
  const [selectedPin, setSelectedPin] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const [displayedPins, setDisplayedPins] = useState([]);
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);

  const { user, myPins } = useUser();

  const generateMorePins = (pageNum) => {
    const startId = (pageNum - 1) * baseMockPins.length;
    return baseMockPins.map((pin, index) => ({
      ...pin,
      id: startId + index + 1000 + Math.random(),
      title: `${pin.title} (${pageNum})`,
    }));
  };

  useEffect(() => {
    setDisplayedPins([...baseMockPins]);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (page > 1) {
      const newPins = generateMorePins(page);
      setDisplayedPins((prev) => [...prev, ...newPins]);
    }
  }, [page]);

  const allPins = [...myPins, ...displayedPins];

  const filteredPins = allPins.filter((pin) => {
    const matchesSearch = pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "전체" || pin.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLoginClick = () => {
    setAuthModalMode("login");
    setShowAuthModal(true);
  };

  const handleSignUpClick = () => {
    setAuthModalMode("signup");
    setShowAuthModal(true);
  };

  if (!user) {
    return (
      <>
        <LandingPage
          onLoginClick={handleLoginClick}
          onSignUpClick={handleSignUpClick}
        />
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            initialMode={authModalMode}
          />
        )}
        <Toaster />
      </>
    );
  }

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
          <ProfilePage allPins={allPins} onPinClick={setSelectedPin} />
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
          <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </main>
      )}

      {selectedPin && (
        <PinModal
          pin={selectedPin}
          onClose={() => setSelectedPin(null)}
          onEdit={() => console.log("수정")}
          onDelete={() => console.log("삭제")}
        />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} initialMode={authModalMode} />}
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