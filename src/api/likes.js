// src/api/likes.js
import { api } from "./client";

// 좋아요 등록
export async function likePinAPI(pinId, userId) {
  const res = await api.post(`/api/pins/${pinId}/likes`, {
    user_id: userId
  });
  return res.data;
}
