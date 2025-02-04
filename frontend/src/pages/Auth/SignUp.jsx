import { useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import Button from "../../components/Button";

const Signup = () => {
  // 폼 입력 데이터
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    birthDate: "",
    gender: "",
    password: "",
  });

  // 비밀번호 확인
  const [confirmPassword, setConfirmPassword] = useState("");

  // 이메일&이름 중복 확인
  const [isChecking, setIsChecking] = useState({
    email: false,
    name: false,
    password: false,
  });

  // 유효성 검사 메시지
  const [validationMessages, setValidationMessages] = useState({
    email: "",
    name: "",
    birthDate: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  // 필드 이름 변환
  const fieldNames = {
    email: "이메일",
    name: "이름",
    birthDate: "생년월일",
    gender: "성별",
    password: "비밀번호",
    confirmPassword: "비밀번호 확인",
  };

  // 비밀번호 규칙 함수
  const validatePassword = (password) => {
    if (!password) return "";

    const isLengthValid = password.length >= 8 && password.length <= 15;
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-z]/.test(password);

    return !isLengthValid || !hasSpecialChar || !hasNumber || !hasLetter ? "8~15자, 숫자/영문(소문자)/특수문자(!@#$%^&*)를 모두 조합하여 입력해주세요." : "";
  };

  // 비밀번호 유효성 메시지 핸들러
  const handlePasswordValidation = (password, confirmPassword, checkRules) => {
    setValidationMessages((prev) => ({
      ...prev,
      password: checkRules ? validatePassword(password) : prev.password,
      confirmPassword: confirmPassword && password !== confirmPassword ? "비밀번호가 일치하지 않습니다." : "",
    }));
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValidationMessages((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "email" || name === "name") {
      setIsChecking((prev) => ({
        ...prev,
        [name]: false,
      }));
    }

    if (name === "confirmPassword") {
      setConfirmPassword(value);
      handlePasswordValidation(formData.password, value, false);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      handlePasswordValidation(value, confirmPassword, true);
    }
  };

  // 중복 체크 핸들러
  const handleDuplicateCheck = async (field) => {
    if (isChecking[field]) return;

    if (!formData[field]) {
      setValidationMessages((prev) => ({
        ...prev,
        [field]: `${fieldNames[field]} 을(를) 입력해주세요.`,
      }));
      return;
    }

    try {
      const response = await axios.get("/api/member", {
        params: {
          [field]: formData[field],
        },
      });

      setIsChecking((prev) => ({
        ...prev,
        [field]: !response.data,
      }));

      setValidationMessages((prev) => ({
        ...prev,
        [field]: response.data ? `이미 사용 중인 ${fieldNames[field]}입니다.` : `사용 가능한 ${fieldNames[field]}입니다.`,
      }));
    } catch (error) {
      setValidationMessages((prev) => ({
        ...prev,
        [field]: "확인 중 오류가 발생했습니다.",
      }));
    }
  };

  // 폼 제출 시 빈 값 체크 함수
  const validateForm = () => {
    const newMessages = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newMessages[field] = `${fieldNames[field]} 을(를) 입력해주세요.`;
        isValid = false;
      }
    });
    if (!confirmPassword) {
      newMessages.confirmPassword = "비밀번호 을(를) 입력해주세요.";
      isValid = false;
    }

    setValidationMessages((prev) => ({
      ...prev,
      ...newMessages,
    }));

    return isValid;
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    // 필수값 확인
    if (!validateForm()) {
      return;
    }

    // 이메일, 이름, 비밀번호 확인 
    if (!isChecking.email || !isChecking.name || !isChecking.password) {
      setValidationMessages((prev) => ({
        ...prev,
        email: !isChecking.email ? "중복 확인이 필요합니다." : prev.email,
        name: !isChecking.name ? "중복 확인이 필요합니다." : prev.name,
        password: !isChecking.password ? "비밀번호 확인이 필요합니다." : prev.password,
      }));
      return;
    }

    // 회원가입 axios
  };

  return (
    <Layout>
      <div
        className={`
      text-xs text-white/75

      [&_label]:text-sm [&_label]:text-white/70 

      [&_input]:h-9 [&_input]:rounded-md [&_input]:px-3
      [&_input]:bg-white/20 [&_input]:placeholder:text-white/30

      [&_p]:text-xs [&_p]:text-red-500/90
      `}
      >
        <h1 className="my-6 text-2xl font-medium text-center">별에별일</h1>

        <form className="space-y-5 py-6">
          {/* 이메일 */}
          <div className="space-y-2">
            <label>이메일</label>
            <div className="flex items-center space-x-2">
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="이메일을 입력해 주세요" className="flex-1" />
              <button type="button" onClick={() => handleDuplicateCheck("email")} className="w-14 h-8 rounded-2xl text-white bg-[#8993c7] hover:bg-[#7580bb]">
                확인
              </button>
            </div>
            {validationMessages.email && <p>{validationMessages.email}</p>}
          </div>

          {/* 이름 */}
          <div className="space-y-2">
            <label>이름</label>
            <div className="flex items-center space-x-2">
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="이름을 입력해 주세요" className="flex-1" />
              <button type="button" onClick={() => handleDuplicateCheck("name")} className="w-14 h-8 rounded-2xl text-white bg-[#8993c7] hover:bg-[#7580bb]">
                확인
              </button>
            </div>
            {validationMessages.name && <p>{validationMessages.name}</p>}
          </div>

          {/* 생년월일 */}
          <div className="space-y-2">
            <label>생년월일</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full" />
            {validationMessages.birthDate && <p>{validationMessages.birthDate}</p>}
          </div>

          {/* 성별 */}
          <div className="space-y-2">
            <label>성별</label>
            <div className="flex space-x-8">
              <label className="flex items-center">
                <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleInputChange} className="mr-2 text-blue-500" />
                <span>남성</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleInputChange} className="mr-2 text-blue-500" />
                <span>여성</span>
              </label>
            </div>
            {validationMessages.gender && <p>{validationMessages.gender}</p>}
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <label>비밀번호</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="비밀번호를 입력해 주세요" className="w-full" />
            {validationMessages.password && <p>{validationMessages.password}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div className="space-y-2">
            <label>비밀번호 확인</label>
            <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleInputChange} placeholder="비밀번호를 입력해 주세요" className="w-full" />
            {validationMessages.confirmPassword && <p>{validationMessages.confirmPassword}</p>}
          </div>

          {/* 제출 버튼 */}
          <button type="submit" onClick={handleSubmit} className="w-full h-10 rounded-2xl text-white bg-[#8993c7] hover:bg-[#7580bb]">
            확인
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Signup;
