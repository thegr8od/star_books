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
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 유효성 검사 메시지
  const [validationMessages, setValidationMessages] = useState({
    email: "",
    name: "",
    birthDate: "",
    gender: "",
    password: "",
    passwordConfirm: "",
  });

  // 비밀번호 규칙 함수
  const passwordRules = (password) => {
    if (!password) return "";

    const isLengthValid = password.length >= 8 && password.length <= 15;
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-z]/.test(password);

    return !isLengthValid || !hasSpecialChar || !hasNumber || !hasLetter ? "8~15자, 숫자/영문(소문자)/특수문자(!@#$%^&*)를 모두 조합하여 입력해주세요." : "";
  };

  // 비밀번호 유효성 검사 메시지 핸들러
  const handlePasswordValidation = (password, confirmPassword, checkRules) => {
    setValidationMessages((prev) => ({
      ...prev,
      password: checkRules ? passwordRules(password) : prev.password,
      passwordConfirm: confirmPassword && password !== confirmPassword ? "비밀번호가 일치하지 않습니다." : "",
    }));
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "passwordConfirm") {
      setPasswordConfirm(value);
      handlePasswordValidation(formData.password, value, false); // 비밀번호 입력 시 비밀번호 확인 검증
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (name === "password") {
        handlePasswordValidation(value, passwordConfirm, true); // 비밀번호 입력 시 비밀번호 확인 재검증 & 비밀번호 검증
      }
    }
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
              <Button text="확인" type="DEFAULT" className="w-14 h-8" />
            </div>
            {validationMessages.email && <p>{validationMessages.email}</p>}
          </div>

          {/* 이름 */}
          <div className="space-y-2">
            <label>이름</label>
            <div className="flex items-center space-x-2">
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="이름을 입력해 주세요" className="flex-1" />
              <Button text="확인" type="DEFAULT" className="w-14 h-8" />
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
            <input type="password" name="passwordConfirm" value={passwordConfirm} onChange={handleInputChange} placeholder="비밀번호를 입력해 주세요" className="w-full" />
            {validationMessages.passwordConfirm && <p>{validationMessages.passwordConfirm}</p>}
          </div>

          {/* 제출 버튼 */}
          <Button text="확인" type="DEFAULT" className="w-full h-10" />
        </form>
      </div>
    </Layout>
  );
};

export default Signup;
