import { createContext, useContext, useState, useEffect } from "react";
import { loginAPI, signupAPI, fetchProfileAPI } from "../api/users";

const USER_ID_COOKIE = "user_id";

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

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // 👇 [복구] 핀 데이터를 다시 프론트엔드에서 관리 (백엔드 에러 방지)
  const [myPins, setMyPins] = useState([]);
  const [savedPins, setSavedPins] = useState([]);
  const [likedPins, setLikedPins] = useState([]);

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

  // [로그인은 진짜 백엔드 사용]
  const login = async (email, password) => {
    const res = await loginAPI({ email, password });
    const profile = await fetchProfileAPI(res.user_id);
    setUser(profile);
    setUserIdCookie(res.user_id);
    return true;
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
    setMyPins([]);
    setSavedPins([]);
    setLikedPins([]);
  };

  // [복구] 핀 기능들은 다시 화면상에서만 작동하게 변경 (404 에러 방지)
  const savePin = (id) => setSavedPins((prev) => [...prev, id]);
  const unsavePin = (id) => setSavedPins((prev) => prev.filter((pinId) => pinId !== id));
  const likePin = (id) => setLikedPins((prev) => [...prev, id]);
  const unlikePin = (id) => setLikedPins((prev) => prev.filter((pinId) => pinId !== id));

  const createPin = (pinData) => {
    // 백엔드 안 보내고 내 화면에만 추가
    const newPin = { ...pinData, id: Date.now(), author: user?.username || "나" };
    setMyPins(prev => [newPin, ...prev]);
    return Promise.resolve(true);
  };

  const deletePin = (id) => setMyPins(prev => prev.filter(pin => pin.id !== id));

  // 가짜 함수들 (에러 방지용)
  const getAllPins = async () => [];
  const searchPins = async () => [];

  return (
    <UserContext.Provider value={{
      user, setUser, login, signup, logout,
      myPins, savedPins, likedPins,
      savePin, unsavePin, likePin, unlikePin,
      createPin, deletePin, getAllPins, searchPins
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