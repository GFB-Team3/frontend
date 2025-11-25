<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";
import { X, Heart, Share2, MoreHorizontal, Edit, Trash2, Download, Flag, Code, EyeOff, Search as SearchIcon } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";

export function PinModal({ pin, onClose, onEdit, onDelete }) {
    const { user, savedPins, likedPins, savePin, unsavePin, likePin, unlikePin } = useUser();

    // 메뉴를 껐다 켰다 할 스위치
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    // 메뉴 바깥을 클릭하면 닫히게 하기 위한 참조
    const menuRef = useRef(null);

    const isSaved = savedPins.includes(pin.id);
    const isLiked = likedPins.includes(pin.id);
    const isMyPin = user?.id === pin.authorId;

    // 메뉴 바깥 클릭 감지 (메뉴 닫기 기능)
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMoreMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSave = () => {
        if (!user) {
            toast.error("로그인이 필요합니다.");
            return;
        }
        if (isSaved) {
            unsavePin(pin.id);
            toast.success("저장 취소되었습니다.");
        } else {
            savePin(pin.id);
            toast.success("핀이 저장되었습니다!");
        }
    };
=======
// src/components/PinModal.jsx
import { useState, useEffect } from "react";
import { X, Heart, Share2, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";

import { likePinAPI } from "../api/likes";
import {
  createCommentAPI,
  fetchCommentsByPin,
  updateCommentAPI,
  deleteCommentAPI,
} from "../api/comments";
import { deletePinAPI, updatePinAPI } from "../api/pins";

const API_BASE_URL = "http://127.0.0.1:8000";

function buildImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

export function PinModal({ pin, onClose, onDeleted }) {
  const { user } = useUser();
>>>>>>> dev2

  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // 핀 수정 관련
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(pin.title);
  const [editContent, setEditContent] = useState(pin.content);

<<<<<<< HEAD
    // ✨ 이미지 다운로드 기능 (진짜 작동함!)
    const handleDownload = async () => {
        try {
            const response = await fetch(pin.imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `pinterest_download_${pin.id}.jpg`; // 파일명 설정
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("이미지가 다운로드되었습니다.");
            setShowMoreMenu(false);
        } catch (error) {
            console.error(error);
            toast.error("다운로드에 실패했습니다.");
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[32px] max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row cursor-default shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 왼쪽 이미지 영역 */}
                <div className="md:w-1/2 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                        src={pin.imageUrl}
                        alt={pin.title}
                        className="w-full h-full object-contain max-h-[80vh]"
                    />
                </div>

                {/* 오른쪽 정보 영역 */}
                <div className="md:w-1/2 flex flex-col h-full max-h-[90vh]">
                    {/* 상단 버튼들 */}
                    <div className="flex items-center justify-between p-6 sticky top-0 bg-white z-10">
                        <div className="flex gap-2 relative" ref={menuRef}>
                            <button
                                onClick={handleShare}
                                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                                title="공유하기"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>

                            {/* 👇 더보기 버튼 */}
                            <button
                                onClick={() => setShowMoreMenu(!showMoreMenu)}
                                className={`p-3 rounded-full transition-colors ${showMoreMenu ? "bg-gray-100" : "hover:bg-gray-100"}`}
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </button>

                            {/* 👇 여기가 사진처럼 만든 드롭다운 메뉴입니다 */}
                            {showMoreMenu && (
                                <div className="absolute top-14 left-0 bg-white shadow-xl rounded-xl w-64 p-2 border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-100">
                                    <div className="flex flex-col gap-1">
                                        <p className="px-3 py-2 text-xs font-semibold text-gray-500">옵션</p>

                                        <button
                                            onClick={handleDownload}
                                            className="w-full text-left px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-900 flex items-center gap-3 transition-colors"
                                        >
                                            <Download className="w-4 h-4" /> 이미지 다운로드
                                        </button>

                                        <button
                                            onClick={() => toast("유사한 핀을 더 찾아볼게요!")}
                                            className="w-full text-left px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-900 flex items-center gap-3 transition-colors"
                                        >
                                            <SearchIcon className="w-4 h-4" /> 유사한 핀 더 보기
                                        </button>

                                        <button
                                            onClick={() => toast("이런 핀을 덜 보여드릴게요.")}
                                            className="w-full text-left px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-900 flex items-center gap-3 transition-colors"
                                        >
                                            <EyeOff className="w-4 h-4" /> 유사한 핀 덜 보기
                                        </button>

                                        <button
                                            onClick={() => toast("신고가 접수되었습니다.")}
                                            className="w-full text-left px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-900 flex items-center gap-3 transition-colors"
                                        >
                                            <Flag className="w-4 h-4" /> 핀 신고
                                        </button>

                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`<img src="${pin.imageUrl}" />`);
                                                toast.success("임베드 코드가 복사되었습니다!");
                                            }}
                                            className="w-full text-left px-3 py-2.5 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-900 flex items-center gap-3 transition-colors"
                                        >
                                            <Code className="w-4 h-4" /> 핀 임베드 코드 가져오기
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                className={`px-6 py-3 rounded-full transition-colors font-bold text-base ${isSaved
                                        ? "bg-black text-white hover:bg-gray-800"
                                        : "bg-red-600 text-white hover:bg-red-700"
                                    }`}
                            >
                                {isSaved ? "저장됨" : "저장"}
                            </button>
                        </div>
                    </div>
=======
  // 댓글 수정 관련
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const isMyPin = user && user.user_id === pin.user_id;

  // 핀 바뀔 때마다 편집 폼 초기화
  useEffect(() => {
    setEditTitle(pin.title);
    setEditContent(pin.content);
    setIsEditing(false);
    setEditingCommentId(null);
    setEditingContent("");
  }, [pin.pin_id, pin.title, pin.content]);
>>>>>>> dev2

  // 댓글 목록 로딩
  useEffect(() => {
    async function loadComments() {
      try {
        const data = await fetchCommentsByPin(pin.pin_id);
        setComments(data);
      } catch (err) {
        console.error(err);
        toast.error("댓글 목록을 불러오는 중 오류가 발생했습니다.");
      }
    }
    loadComments();
  }, [pin.pin_id]);

<<<<<<< HEAD
                        {/* 작성자 프로필 */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden">
                                    {pin.author ? pin.author[0] : "A"}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{pin.author}</p>
                                    <p className="text-gray-600 text-sm">팔로워 1.2천명</p>
                                </div>
                            </div>
                            <button className="bg-gray-200 px-5 py-3 rounded-full hover:bg-gray-300 transition-colors font-semibold text-sm">
                                팔로우
                            </button>
                        </div>
=======
  // 좋아요
  const handleLike = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    try {
      await likePinAPI(pin.pin_id, user.user_id);
      setIsLiked(true);
      toast.success("좋아요를 눌렀습니다.");
    } catch (err) {
      if (err?.response?.status === 409) {
        setIsLiked(true);
        toast("이미 좋아요 한 핀입니다.");
      } else {
        console.error(err);
        toast.error("좋아요 중 오류가 발생했습니다.");
      }
    }
  };
>>>>>>> dev2

  // 핀 삭제
  const handleDelete = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (!isMyPin) {
      toast.error("내 핀만 삭제할 수 있습니다.");
      return;
    }
    if (!window.confirm("정말 이 핀을 삭제할까요?")) return;

    try {
      await deletePinAPI(pin.pin_id, user.user_id);
      toast.success("핀을 삭제했습니다.");

      onClose();
      onDeleted && onDeleted(pin.pin_id);
    } catch (err) {
      console.error(err);
      toast.error("핀 삭제 중 오류가 발생했습니다.");
    }
  };

  // 핀 수정 저장
  const handleUpdate = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (!isMyPin) {
      toast.error("내 핀만 수정할 수 있습니다.");
      return;
    }

    const titleTrimmed = editTitle.trim();
    const contentTrimmed = editContent.trim();
    if (!titleTrimmed || !contentTrimmed) {
      toast.error("제목과 내용을 모두 입력하세요.");
      return;
    }

    try {
      await updatePinAPI({
        pin_id: pin.pin_id,
        user_id: user.user_id,
        title: titleTrimmed,
        content: contentTrimmed,
      });
      toast.success("핀을 수정했습니다.");

      // 화면에 바로 반영되도록 로컬 객체 갱신
      pin.title = titleTrimmed;
      pin.content = contentTrimmed;
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("핀 수정 중 오류가 발생했습니다.");
    }
  };

  // 공유
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/pins/${pin.pin_id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("링크가 클립보드에 복사되었습니다.");
  };

  // 댓글 등록
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    const trimmed = comment.trim();
    if (!trimmed) return;

    try {
      const newComment = await createCommentAPI({
        pin_id: pin.pin_id,
        user_id: user.user_id,
        content: trimmed,
      });
      setComment("");
      setComments((prev) => [...prev, newComment]);
      toast.success("댓글이 등록되었습니다.");
    } catch (err) {
      console.error(err);
      toast.error("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  // 댓글 수정 시작
  const startEditComment = (c) => {
    setEditingCommentId(c.comment_id);
    setEditingContent(c.content);
  };

  // 댓글 수정 취소
  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  // 댓글 수정 저장
  const handleUpdateComment = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (!editingCommentId) return;

    const trimmed = editingContent.trim();
    if (!trimmed) return;

    try {
      const updated = await updateCommentAPI(
        editingCommentId,
        user.user_id,
        trimmed
      );

      setComments((prev) =>
        prev.map((c) =>
          c.comment_id === updated.comment_id ? updated : c
        )
      );

      cancelEditComment();
      toast.success("댓글이 수정되었습니다.");
    } catch (err) {
      console.error(err);
      toast.error("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId, commentUserId) => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (user.user_id !== commentUserId) {
      toast.error("자기 댓글만 삭제할 수 있습니다.");
      return;
    }

    if (!window.confirm("댓글을 삭제할까요?")) return;

    try {
      await deleteCommentAPI(commentId, user.user_id);
      setComments((prev) =>
        prev.filter((c) => c.comment_id !== commentId)
      );
      toast.success("댓글이 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      toast.error("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[32px] max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row cursor-default shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 왼쪽 이미지 영역 */}
        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center overflow-hidden">
          {pin.image ? (
              <img
                src={buildImageUrl(pin.image)}
                alt={pin.title}
                className="w-full h-full object-contain max-h-[80vh]"
              />
            ) : (
              <div className="text-gray-400 text-sm">이미지 없음</div>
            )}
          </div>

        {/* 오른쪽 정보 영역 */}
        <div className="md:w-1/2 flex flex-col h-full max-h-[90vh]">
          {/* 상단 버튼들 */}
          <div className="flex items-center justify-between p-6 sticky top-0 bg-white z-10">
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                title="공유하기"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => toast("더 보기 메뉴는 준비 중입니다!")}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
<<<<<<< HEAD
=======

            <div className="flex gap-2">
              <button
                onClick={() =>
                  toast("보드에 저장 기능은 추후 구현 예정입니다.")
                }
                className="px-6 py-3 rounded-full transition-colors font-bold text-base bg-red-600 text-white hover:bg-red-700"
              >
                저장
              </button>
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 내용 */}
          <div className="flex-1 overflow-y-auto px-8 pb-8">
            {/* 제목/내용: 편집 모드 vs 보기 모드 */}
            {isEditing ? (
              <>
                <input
                  className="w-full border rounded-xl px-3 py-2 text-lg font-bold mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="w-full border rounded-xl px-3 py-2 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-400 mb-4"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-4 text-gray-900 leading-tight">
                  {pin.title}
                </h1>
                <p className="text-gray-700 mb-6 text-base leading-relaxed">
                  {pin.content}
                </p>
              </>
            )}

            {/* 작성자 (임시: 현재 로그인 유저 기준) */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden">
                  {user ? user.username[0] : "U"}
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    {user ? user.username : "작성자"}
                  </p>
                  <p className="text-gray-600 text-sm">팔로워 1.2천명</p>
                </div>
              </div>
              <button className="bg-gray-200 px-5 py-3 rounded-full hover:bg-gray-300 transition-colors font-semibold text-sm">
                팔로우
              </button>
            </div>

            {/* 댓글 영역 */}
            <div className="border-t pt-8 mt-4">
              <h3 className="font-bold text-xl mb-6">
                댓글 {comments.length}개
              </h3>

              {/* 좋아요 / 수정 / 삭제 */}
              <div className="flex gap-4 mb-6 items-center">
                <button
                  onClick={handleLike}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center gap-2"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isLiked ? "fill-red-600 text-red-600" : "text-gray-600"
                    }`}
                  />
                </button>

                {isMyPin && !isEditing && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}

                {isMyPin && isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditTitle(pin.title);
                        setEditContent(pin.content);
                      }}
                      className="px-4 py-2 rounded-full border text-sm hover:bg-gray-50"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-900"
                    >
                      저장
                    </button>
                  </div>
                )}
              </div>

              {/* 댓글 입력 */}
              <form
                className="flex items-start gap-3 mb-6"
                onSubmit={handleCommentSubmit}
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                  {user ? user.username[0] : "G"}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="댓글 추가..."
                    className="w-full border border-gray-300 rounded-[32px] px-5 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-gray-800 text-white text-sm font-semibold hover:bg-black transition-colors"
                  >
                    등록
                  </button>
                </div>
              </form>

              {/* 댓글 리스트 */}
              <div className="space-y-4">
                {comments.map((c) => {
                  const isMyComment = user && user.user_id === c.user_id;
                  const isEditingThis = editingCommentId === c.comment_id;

                  return (
                    <div key={c.comment_id} className="flex gap-3">
                      <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold">
                        {c.user_id}
                      </div>
                      <div className="flex-1">
                        {isEditingThis ? (
                          <>
                            <input
                              type="text"
                              value={editingContent}
                              onChange={(e) =>
                                setEditingContent(e.target.value)
                              }
                              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                            />
                            <div className="flex gap-2 mt-2 text-xs">
                              <button
                                type="button"
                                onClick={handleUpdateComment}
                                className="px-3 py-1 rounded-full bg-black text-white hover:bg-gray-900"
                              >
                                저장
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditComment}
                                className="px-3 py-1 rounded-full border hover:bg-gray-50"
                              >
                                취소
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-gray-900">
                              {c.content}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-1">
                              {new Date(c.created_at).toLocaleString()}
                            </p>

                            {isMyComment && (
                              <div className="flex gap-3 mt-1 text-[11px] text-gray-500">
                                <button
                                  type="button"
                                  onClick={() => startEditComment(c)}
                                  className="hover:underline"
                                >
                                  수정
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteComment(
                                      c.comment_id,
                                      c.user_id
                                    )
                                  }
                                  className="hover:underline text-red-500"
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                {comments.length === 0 && (
                  <p className="text-sm text-gray-500">
                    아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
                  </p>
                )}
              </div>
            </div>
          </div>
>>>>>>> dev2
        </div>
      </div>
    </div>
  );
}
