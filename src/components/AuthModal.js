import { useState } from "react";
import { X } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { signupAPI } from "../api/users";
import { toast } from "sonner";

export function AuthModal({ onClose, initialMode = "login" }) {
    const [mode, setMode] = useState(initialMode);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const { login } = useUser();

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        if (mode === "login") {
          await login(email, password);
          toast.success("로그인 성공!");
        } else {
          await signupAPI({
            email,
            username: name,
            password,
          });

          await login(email, password);
          toast.success("회원가입 + 로그인 완료!");
        }

        onClose();
      } catch (error) {
        console.error(error);
        toast.error("오류가 발생했습니다.");
      }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[32px] max-w-md w-full p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">P</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <h2 className="text-center mb-3 text-3xl font-bold text-gray-900">
                    {mode === "login" ? "Pinterest에 로그인" : "Pinterest 가입하기"}
                </h2>
                <p className="text-center text-gray-600 mb-8">
                    {mode === "login"
                        ? "계속해서 새로운 아이디어를 찾아보세요."
                        : "새로운 아이디어를 발견할 준비가 되셨나요?"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "signup" && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">이름</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="이름을 입력하세요"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-red-600 focus:ring-0 transition-colors"
                            />
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 ml-1">이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일을 입력하세요"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-red-600 focus:ring-0 transition-colors"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 ml-1">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-red-600 focus:ring-0 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition-all transform hover:scale-[1.02] mt-4"
                    >
                        {mode === "login" ? "로그인" : "계속하기"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setMode(mode === "login" ? "signup" : "login")}
                        className="text-sm font-semibold text-gray-600 hover:text-gray-900 hover:underline transition-colors"
                    >
                        {mode === "login"
                            ? "아직 계정이 없으신가요? 가입하기"
                            : "이미 계정이 있으신가요? 로그인"}
                    </button>
                </div>
            </div>
        </div>
    );
}