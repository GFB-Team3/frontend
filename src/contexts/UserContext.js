import { createContext, useContext, useState, useEffect } from "react";
// 백엔드 개발자가 만들어둔 API 함수들 불러오기
// (혹시 에러나면 src/api/users.js 파일이 있는지 확인해보세요!)
import { loginAPI, signupAPI, fetchProfileAPI } from "../api/users";

const USER_ID_COOKIE = "user_id";

// --- [쿠키 관련 함수들: 백엔드 개발자 코드 그대로 유지] ---
function getUserIdFromCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + USER_ID_COOKIE + "=([^;]+)"));
  return match ? match[2] : null;
}

function setUserIdCookie(userId) {
  if (typeof document === "undefined") return;
  document.cookie = `${USER_ID_COOKIE}=${userId}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

function clearUserIdCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${USER_ID_COOKIE}=; path=/; max-age=0`;
}
// ----------------------------------------------------

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // 👇 님의 UI가 깨지지 않도록 핀 관련 상태들 부활시킴!
  // (나중에 백엔드 핀 API가 나오면 거기로 연결하면 됩니다)
  const [myPins, setMyPins] = useState([]);
  const [savedPins, setSavedPins] = useState([]);
  const [likedPins, setLikedPins] = useState([]);

  // 앱 켜질 때 자동 로그인 체크
  useEffect(() => {
    const init = async () => {
      try {
        const userIdStr = getUserIdFromCookie();
        if (!userIdStr) return;
        const userId = Number(userIdStr);
        if (!userId) return;

        const profile = await fetchProfileAPI(userId);
        setUser(profile);
      } catch (err) {
        console.error("자동 로그인 실패:", err);
        clearUserIdCookie();
      }
    };
    init();
  }, []);

  // --- [진짜 로그인/회원가입 기능] ---
  const login = async (email, password) => {
    // 1. 백엔드로 로그인 요청
    const res = await loginAPI({ email, password });
    // 2. 받아온 ID로 프로필 정보 요청
    const profile = await fetchProfileAPI(res.user_id);
    // 3. 내 앱에 유저 정보 저장
    setUser(profile);
    setUserIdCookie(res.user_id);
    return true; // 성공 신호 보냄
  };

  const signup = async (email, username, password) => {
    const profile = await signupAPI({ email, username, password });
    setUser(profile);
    setUserIdCookie(profile.user_id);
    return true;
  };

  const logout = () => {
    setUser(null);
    clearUserIdCookie();
    // 로그아웃 하면 핀 목록도 초기화하는 게 좋음
    setMyPins([]);
    setSavedPins([]);
    setLikedPins([]);
  };

  // --- [핀 관련 가짜 함수들 (UI 에러 방지용)] ---
  // 나중에 백엔드 API가 나오면 여기를 진짜 API 호출로 바꾸면 됩니다.
  const savePin = (id) => setSavedPins((prev) => [...prev, id]);
  const unsavePin = (id) => setSavedPins((prev) => prev.filter((pinId) => pinId !== id));
  const likePin = (id) => setLikedPins((prev) => [...prev, id]);
  const unlikePin = (id) => setLikedPins((prev) => prev.filter((pinId) => pinId !== id));
  const createPin = (pinData) => {
    console.log("핀 생성(아직 서버 안보냄):", pinData);
    // 임시로 내 핀 목록에 추가해서 화면에 보이게 함
    setMyPins(prev => [...prev, { ...pinData, id: Date.now(), author: user.username || user.email }]);
  };
  const updatePin = (id, data) => console.log("핀 수정:", id, data);
  const deletePin = (id) => console.log("핀 삭제:", id);


  return (
    <UserContext.Provider value={{
      user, setUser, login, signup, logout,
      // 👇 핀 관련 값들도 같이 내려보내줘야 함
      myPins, savedPins, likedPins,
      savePin, unsavePin, likePin, unlikePin,
      createPin, updatePin, deletePin
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser는 반드시 <UserProvider> 안에서 사용해야 합니다.");
  }
  return ctx;
}