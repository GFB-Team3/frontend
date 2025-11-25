import { useState, useEffect, useRef } from "react";
import Masonry from "react-responsive-masonry";
import { Toaster, toast } from "sonner";

// 컴포넌트 불러오기
import { Header } from "./components/Header";
import { PinCard } from "./components/PinCard";
import { PinModal } from "./components/PinModal";
import { CreatePinModal } from "./components/CreatePinModal";
import { AuthModal } from "./components/AuthModal";
import { LandingPage } from "./components/LandingPage";
import { UserProvider, useUser } from "./contexts/UserContext";

// 프로필 페이지 안전하게 불러오기
let ProfilePage = () => <div>로딩 실패</div>;
try { ProfilePage = require("./components/ProfilePage").ProfilePage; } catch (e) { }

// 🔥 [복구] 가짜 데이터 다시 부활!
const baseMockPins = [
  { id: 1, imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80", title: "모던 리빙룸", description: "화이트 톤의 깔끔한 인테리어", author: "Studio A" },
  { id: 2, imageUrl: "https://images.unsplash.com/photo-1532980400857-e8d9d275d858?auto=format&fit=crop&w=800&q=80", title: "럭셔리 디저트", description: "달콤한 오후의 휴식", author: "Foodie" },
  { id: 3, imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80", title: "스트릿 패션", description: "2025 S/S 트렌드", author: "Vogue" },
  { id: 4, imageUrl: "https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?auto=format&fit=crop&w=800&q=80", title: "숲속의 집", description: "자연과 함께하는 삶", author: "Nature" },
  { id: 5, imageUrl: "https://images.unsplash.com/photo-1542372147193-a7aca54189cd?auto=format&fit=crop&w=800&q=80", title: "카페 라떼", description: "따뜻한 커피 한 잔", author: "Barista" },
  { id: 6, imageUrl: "https://images.unsplash.com/photo-1713117222958-d6a389aade3f?auto=format&fit=crop&w=800&q=80", title: "추상화", description: "현대 미술 작품", author: "Artist" },
  { id: 7, imageUrl: "https://images.unsplash.com/photo-1549791084-5f78368b208b?auto=format&fit=crop&w=800&q=80", title: "미니멀 건축", description: "곡선의 미학", author: "Arch" },
  { id: 8, imageUrl: "https://images.unsplash.com/photo-1663043501785-05d17c625253?auto=format&fit=crop&w=800&q=80", title: "골든 리트리버", description: "사랑스러운 반려견", author: "PetLover" },
  { id: 9, imageUrl: "https://images.unsplash.com/photo-1618688862225-ac941a9da58f?auto=format&fit=crop&w=800&q=80", title: "홈 트레이닝", description: "건강한 하루 루틴", author: "Gym" },
  { id: 10, imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80", title: "이탈리아 여행", description: "친퀘테레의 풍경", author: "Traveler" },
  { id: 11, imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80", title: "필름 카메라", description: "아날로그 감성", author: "Photo" },
  { id: 12, imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", title: "포트레이트", description: "인물 사진 촬영 팁", author: "Studio B" },
  { id: 13, imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", title: "여름 바다", description: "휴양지의 추억", author: "Ocean" },
  { id: 14, imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", title: "데이터 시각화", description: "인포그래픽 디자인", author: "Tech" },
  { id: 15, imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", title: "모던 키친", description: "요리하고 싶은 주방", author: "Home" },
  { id: 16, imageUrl: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80", title: "플레이팅", description: "음식을 돋보이게", author: "Chef" },
  { id: 17, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80", title: "나이키 신발", description: "한정판 스니커즈", author: "ShoeMaster" },
  { id: 18, imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", title: "자연의 신비", description: "안개 낀 숲", author: "Wild" },
  { id: 19, imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80", title: "모닝 커피", description: "하루의 시작", author: "Morning" },
  { id: 20, imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80", title: "그래픽 아트", description: "화려한 색감", author: "Designer" },
];

function AppContent() {
  const [selectedPin, setSelectedPin] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // 복구: 무한 스크롤용 상태들
  const [displayedPins, setDisplayedPins] = useState([]);
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);

  const { user, myPins } = useUser();

  // 핀 공장 (무한 스크롤)
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

  // 무한 스크롤 감지
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

  // 페이지 바뀔 때 핀 추가
  useEffect(() => {
    if (page > 1) {
      const newPins = generateMorePins(page);
      setDisplayedPins((prev) => [...prev, ...newPins]);
    }
  }, [page]);

  // 전체 핀 = 내 핀 + 가짜 데이터
  const allPins = [...(myPins || []), ...displayedPins];

  const filteredPins = allPins.filter((pin) => {
    const matchesSearch = pin.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleLoginClick = () => { setAuthModalMode("login"); setShowAuthModal(true); };
  const handleSignUpClick = () => { setAuthModalMode("signup"); setShowAuthModal(true); };

  if (!user) {
    return (
      <>
        <LandingPage onLoginClick={handleLoginClick} onSignUpClick={handleSignUpClick} />
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} initialMode={authModalMode} />}
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        onSearch={setSearchQuery}
        onProfileClick={() => setShowProfile(true)}
        onLoginClick={handleLoginClick}
        onCreateClick={() => setShowCreateModal(true)}
      />

      {showProfile ? (
        <div>
          <button onClick={() => setShowProfile(false)} className="fixed top-20 left-4 z-30 px-4 py-2 bg-white border rounded-full hover:bg-gray-50 shadow-lg">← 홈으로</button>
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

      {selectedPin && <PinModal pin={selectedPin} onClose={() => setSelectedPin(null)} />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} initialMode={authModalMode} />}
      {showCreateModal && <CreatePinModal onClose={() => setShowCreateModal(false)} />}

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