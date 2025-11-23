import { api } from "./client";

// 댓글 등록
export async function createCommentAPI(params) {
  const res = await api.post(`/api/pins/${params.pin_id}/comments`, {
    user_id: params.user_id,
    content: params.content,
  });
  return res.data;
}

// 댓글 수정
export async function updateCommentAPI(commentId, userId, content) {
  const res = await api.put(`/api/pins/comments/${commentId}`, {
    user_id: userId,
    content: content,
  });
  return res.data;
}

// 댓글 삭제
export async function deleteCommentAPI(commentId, userId) {
  await api.delete(`/api/pins/comments/${commentId}`, {
    data: { user_id: userId },
  });
}

// 댓글 조회
export async function fetchCommentsByPin(pinId) {
  const res = await api.get(`/api/pins/${pinId}/comments`);
  return res.data;
}
