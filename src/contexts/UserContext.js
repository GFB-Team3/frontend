// src/contexts/UserContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { loginAPI, signupAPI, fetchProfileAPI } from "../api/users";

const USER_ID_COOKIE = "user_id";

// 쿠키에서 user_id 읽기
function getUserIdFromCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(^| )" + USER_ID_COOKIE + "=([^;]+)")
  );
  return match ? match[2] : null;
}

// 쿠키에 user_id 저장
function setUserIdCookie(userId) {
  if (typeof document === "undefined") return;
  // 7일 유지
  document.cookie = `${USER_ID_COOKIE}=${userId}; path=/; max-age=${
    60 * 60 * 24 * 7
  }`;
}

// 쿠키 삭제
function clearUserIdCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${USER_ID_COOKIE}=; path=/; max-age=0`;
}

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // { user_id, email, username, created_at } 또는 null

  // 앱 처음 켜졌을 때 쿠키에 user_id 있으면 자동 로그인 시도
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

  // 로그인
  const login = async (email, password) => {
    const res = await loginAPI({ email, password }); // { message, user_id }
    const profile = await fetchProfileAPI(res.user_id); // UserOut
    setUser(profile);
    setUserIdCookie(res.user_id);
  };

  const signup = async (email, username, password) => {
    const profile = await signupAPI({ email, username, password });
    setUser(profile);
    setUserIdCookie(profile.user_id);
  };

  const logout = () => {
    setUser(null);
    clearUserIdCookie();
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, signup, logout }}>
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
