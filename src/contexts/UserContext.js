import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
    // 처음엔 로그인 안 된 상태(null)로 시작
    const [user, setUser] = useState(null);

    const [savedPins, setSavedPins] = useState([]);
    const [likedPins, setLikedPins] = useState([]);
    const [myPins, setMyPins] = useState([]);

    // ✅ 진짜 로그인 기능: 버튼 누르면 user 정보를 채워넣음!
    const login = async (email, password) => {
        // 실제 서버가 없으니 가짜로 성공 처리
        console.log("로그인 처리 중...");
        setUser({
            id: "user-1",
            name: "내이름",
            email: email,
            avatar: "P" // 프로필 이미지 이니셜
        });
    };

    // ✅ 진짜 회원가입 기능
    const signup = async (name, email, password) => {
        setUser({
            id: "user-1",
            name: name,
            email: email,
            avatar: name[0]
        });
    };

    const logout = () => {
        setUser(null); // user를 다시 비워서 로그아웃 처리
    };

    // 핀 저장/좋아요/생성 기능들
    const savePin = (id) => setSavedPins((prev) => [...prev, id]);
    const unsavePin = (id) => setSavedPins((prev) => prev.filter((pinId) => pinId !== id));
    const likePin = (id) => setLikedPins((prev) => [...prev, id]);
    const unlikePin = (id) => setLikedPins((prev) => prev.filter((pinId) => pinId !== id));

    // 핀 만들기 (내 핀 목록에 추가)
    const createPin = (newPinData) => {
        const newPin = {
            ...newPinData,
            id: Date.now(), // 임시 ID 생성
            author: user.name,
            authorId: user.id,
        };
        setMyPins((prev) => [newPin, ...prev]);
    };

    const updatePin = (id, updatedData) => {
        setMyPins(prev => prev.map(pin => pin.id === id ? { ...pin, ...updatedData } : pin));
    };

    const deletePin = (id) => {
        setMyPins((prev) => prev.filter((pin) => pin.id !== id));
    };

    return (
        <UserContext.Provider
            value={{
                user,
                savedPins,
                likedPins,
                myPins,
                login,   // 이제 밖에서 이 함수를 쓸 수 있음
                signup,  // 얘도
                logout,
                savePin,
                unsavePin,
                likePin,
                unlikePin,
                createPin,
                updatePin,
                deletePin
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    return useContext(UserContext);
};