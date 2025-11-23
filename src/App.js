// src/App.js
import { useState, useEffect } from "react";
import Masonry from "react-responsive-masonry";
import { Toaster, toast } from "sonner";

// 우리가 만든 컴포넌트들
import { Header } from "./components/Header";
import { PinCard } from "./components/PinCard";
import { PinModal } from "./components/PinModal";
import { UserProvider, useUser } from "./contexts/UserContext";
import { AuthModal } from "./components/AuthModal";
import { CreatePinModal } from "./components/CreatePinModal";
import { ProfilePage } from "./components/ProfilePage";


// 🔗 백엔드 API 불러오기
import { fetchPins, searchPins } from "./api/pins";

const API_BASE_URL = "http://127.0.0.1:8000";

function buildImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

// 아직 안 만든 건 임시 컴포넌트
const EditProfileModal = ({ onClose }) => (
  <div
    className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
    onClick={onClose}
  >
    <div className="bg-white p-10 rounded">프로필 수정 모달 (준비중)</div>
  </div>
);



const DeleteConfirmDialog = ({ onClose }) => null;

const LandingPage = ({ onLoginClick }) => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4xl font-bold mb-4">Pinterest Clone</h1>
    <button
      onClick={onLoginClick}
      className="bg-red-600 text-white px-6 py-3 rounded-full"
    >
      로그인하고 시작하기
    </button>
  </div>
);

function AppContent() {
  const [selectedPin, setSelectedPin] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const [pins, setPins] = useState([]);

  const { user } = useUser();

  const handlePinDeleted = (deletedId) => {
     setPins((prev) => prev.filter((pin) => pin.pin_id !== deletedId));
    };


  const loadAllPins = async () => {
      try {
        const data = await fetchPins();
        setPins(data);
      } catch (err) {
        console.error(err);
        toast.error("핀 목록을 불러오는 중 오류가 발생했습니다.");
      }
    };

    useEffect(() => {
      loadAllPins();
    }, []);

    // 홈 버튼 클릭 시
    const handleHomeClick = async () => {
      setShowProfile(false);
      setActiveCategory("전체");
      setSearchQuery("");
      await loadAllPins();
    };


  useEffect(() => {
    const loadPins = async () => {
      try {
        const data = await fetchPins(); // GET /pins
        setPins(data);
      } catch (err) {
        console.error(err);
        toast.error("핀 목록을 불러오는 중 오류가 발생했습니다.");
      }
    };
    loadPins();
  }, []);


  useEffect(() => {
    const search = async () => {
      try {
        if (!searchQuery) {
          const data = await fetchPins();
          setPins(data);
        } else {
          const data = await searchPins(searchQuery);
          setPins(data);
        }
      } catch (err) {
        console.error(err);
        toast.error("핀 검색 중 오류가 발생했습니다.");
      }
    };

    search();
  }, [searchQuery]);

  const filteredPins = pins.filter((pin) => {
    const title = (pin.title || "").toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "전체" ||
      (pin.category && pin.category === activeCategory);
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
        onHomeClick={handleHomeClick}
      />

      {showProfile ? (
        <div>
          <button
            onClick={() => setShowProfile(false)}
            className="fixed top-20 left-4 z-30 px-4 py-2 bg-white border rounded-full hover:bg-gray-50 shadow-lg"
          >
            ← 홈으로
          </button>
          <ProfilePage onPinClick={setSelectedPin} />
        </div>
      ) : (
        <main className="container mx-auto px-4 py-6">
          <Masonry columnsCount={3} gutter="16px">
            {filteredPins.map((pin) => (
              <PinCard
                key={pin.pin_id}
                id={pin.pin_id}
                imageUrl={buildImageUrl(pin.image)}
                title={pin.title}
                onClick={() => setSelectedPin(pin)}
              />
            ))}
          </Masonry>
        </main>
      )}

      {/* 상세 모달 */}
      {selectedPin && (
        <PinModal
          pin={selectedPin}
          onClose={() => setSelectedPin(null)}
          onEdit={() => console.log("수정")}
          onDeleted={handlePinDeleted}
        />
      )}


      {/* 로그인 / 회원가입 모달 */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* 핀 생성 모달 (생성 후 목록 리프레시) */}
      {showCreateModal && (
        <CreatePinModal
          onClose={async () => {
            setShowCreateModal(false);
            try {
              const data = await fetchPins();
              setPins(data);
            } catch (err) {
              console.error(err);
            }
          }}
        />
      )}

      {showEditProfileModal && (
        <EditProfileModal onClose={() => setShowEditProfileModal(false)} />
      )}

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
