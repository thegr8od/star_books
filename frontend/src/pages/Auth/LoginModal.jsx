import { useState } from "react";
import axios from "axios";

const LoginModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 인증번호 입력, 3: 새 비밀번호 입력
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendVerification = async () => {
    try {
      const response = await axios.post("/api/member/password/reset-request", {
        email,
      });
      if (response.data.statusCode === 200) {
        setMessage("인증번호가 이메일로 전송되었습니다.");
        setStep(2);
      }
    } catch (error) {
      console.error("이메일 전송 에러:", error);
      setError("이메일 전송에 실패했습니다.");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post("/api/member/password/verify-code", {
        email,
        verificationCode,
      });
      if (response.data.statusCode === 200) {
        setMessage("인증이 완료되었습니다.");
        setStep(3);
      }
    } catch (error) {
      console.error("인증번호 확인 에러:", error);
      setError("잘못된 인증번호입니다.");
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("/api/member/password/reset", {
        email,
        verificationCode,
        newPassword,
      });
      if (response.data.statusCode === 200) {
        setMessage("비밀번호가 성공적으로 변경되었습니다.");
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("비밀번호 변경 에러:", error);
      setError("비밀번호 변경에 실패했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl text-white mb-6 text-center">비밀번호 찾기</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-2 bg-green-500/20 border border-green-500/50 rounded text-green-200 text-sm">
            {message}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                className="w-full p-2 bg-white/5 border border-white/20 rounded text-white"
              />
            </div>
            <button
              onClick={handleSendVerification}
              className="w-full py-2 bg-white/20 text-white rounded hover:bg-white/30"
            >
              인증번호 받기
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증번호를 입력하세요"
                className="w-full p-2 bg-white/5 border border-white/20 rounded text-white"
              />
            </div>
            <button
              onClick={handleVerifyCode}
              className="w-full py-2 bg-white/20 text-white rounded hover:bg-white/30"
            >
              인증번호 확인
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호"
                className="w-full p-2 bg-white/5 border border-white/20 rounded text-white mb-2"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호 확인"
                className="w-full p-2 bg-white/5 border border-white/20 rounded text-white"
              />
            </div>
            <button
              onClick={handlePasswordReset}
              className="w-full py-2 bg-white/20 text-white rounded hover:bg-white/30"
            >
              비밀번호 변경
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
