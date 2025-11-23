// src/api/users.js
import { api } from "./client";

// 회원가입
export async function signupAPI(payload) {
  const res = await api.post("/api/users/signup", payload);
  return res.data;
}

// 로그인
export async function loginAPI(payload) {
  const res = await api.post("/api/users/login", payload);
  return res.data;
}

// 프로필 조회
export async function fetchProfileAPI(userId) {
  const res = await api.get(`/api/users/${userId}`);
  return res.data;
}

// 프로필 수정
export async function updateProfileAPI(params) {
  const res = await api.put(`/api/users/${params.user_id}`, {
    username: params.username,
  });
  return res.data;
}

// 내 핀 목록
export async function fetchMyPins(userId) {
  const res = await api.get(`/api/users/${userId}/pins`);
  return res.data;
}

// 내가 좋아요한 핀 목록
export async function fetchLikedPinsAPI(userId) {
  const res = await api.get(`/api/users/${userId}/likes`);
  return res.data;
}
