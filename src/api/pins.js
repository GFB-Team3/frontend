// src/api/pins.js
import { api } from "./client";

// 핀 생성
export async function createPinAPI(params) {
  const formData = new FormData();

  formData.append("user_id", String(params.user_id));
  formData.append("title", params.title);
  formData.append("content", params.content);

  if (params.image) {
    formData.append("image", params.image);
  }

  const res = await api.post("/api/pins", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

// 핀 수정
export async function updatePinAPI(params) {
  const formData = new FormData();

  formData.append("user_id", String(params.user_id));

  if (params.title !== undefined) {
    formData.append("title", params.title);
  }
  if (params.content !== undefined) {
    formData.append("content", params.content);
  }
  if (params.image) {
    formData.append("image", params.image);
  }

  const res = await api.put(`/api/pins/${params.pin_id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

// 핀 삭제
export async function deletePinAPI(pinId, userId) {
  await api.delete(`/api/pins/${pinId}`, {
    data: { user_id: userId },
  });
}

// 전체 핀 목록
export async function fetchPins() {
  const res = await api.get("/api/pins/");
  return res.data;
}


// 핀 상세 조회
export async function fetchPinDetail(pinId) {
  const res = await api.get(`/api/pins/${pinId}`);
  return res.data;
}

// 핀 검색
export async function searchPins(search) {
  const res = await api.get("/api/pins/search", {
    params: { search },
  });
  return res.data;
}
