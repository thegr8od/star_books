import { useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import useMemberApi from "../../api/useMemberApi";
import { setUser } from "../../store/userSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// 최상단에 PasswordInput 컴포넌트 정의
const PasswordInput = ({ name, value, placeholder, showPassword, toggleVisibility, onChange, onBlur }) => (
  <div className="relative flex items-center w-full">
    <input type={showPassword ? "text" : "password"} name={name} value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} className="h-9 rounded-md px-3 bg-white/20 placeholder:text-white/30 placeholder:text-xs text-sm w-full pr-10" />
    <span onClick={() => toggleVisibility(name)} className="absolute right-3 text-white/75 cursor-pointer hover:text-white/90">
      {showPassword ? <Visibility sx={{ fontSize: 18 }} /> : <VisibilityOff sx={{ fontSize: 18 }} />}
    </span>
  </div>
);

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ====================================== 상태 관리 ======================================
  // 입력 필드 상태
  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  // 유효성 검사 메시지 상태
  const [errors, setErrors] = useState({
    email: "",
    nickname: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  // 중복 검사 상태
  const [validationStatus, setValidationStatus] = useState({
    email: { isValid: false, isChecked: false },
    nickname: { isValid: false, isChecked: false },
  });

  // 비밀번호 보기 상태 추가
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  // ====================================== 상태 관련 상수화 ======================================
  // 입력 필드 라벨
  const FIELD_LABELS = {
    email: "이메일",
    nickname: "닉네임",
    gender: "성별",
    password: "비밀번호",
    confirmPassword: "비밀번호",
  };

  // 에러 메시지
  const ERROR_MESSAGES = {
    required: (fieldName) => `${fieldName}을(를) 입력해 주세요`,
    email: { format: "올바른 이메일 형식이 아닙니다", check: "이메일 중복 확인이 필요합니다." },
    nickname: { format: "영문, 한글, 숫자를 사용하여 20자 이내로 입력해 주세요", check: "닉네임 중복 확인이 필요합니다." },
    password: {
      format: "8~15자, 숫자/영문(소문자)/특수문자(!@#$%^&)를 조합하여 입력해주세요.",
      match: "비밀번호가 일치하지 않습니다",
    },
    serverError: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  };

  // 형식 검증을 위한 정규식
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const NICKNAME_REGEX = /^[A-Za-z0-9가-힣]+$/;
  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&])[^\s]{8,15}$/;

  // ====================================== 상태 관련 함수 ======================================
  // 실시간 형식 검증 함수 수정
  const validateFormatRealTime = (name, value) => {
    let error = "";

    if (!value) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
      return;
    }

    // 필드별 유효성 검사
    switch (name) {
      // 이메일
      case "email":
        if (!EMAIL_REGEX.test(value)) {
          error = ERROR_MESSAGES.email.format;
        } else if (!validationStatus[name].isValid) {
          error = ERROR_MESSAGES.email.check;
        }
        break;
      // 닉네임
      case "nickname":
        if (!NICKNAME_REGEX.test(value) || value.length > 20) {
          error = ERROR_MESSAGES.nickname.format;
        } else if (!validationStatus[name].isValid) {
          error = ERROR_MESSAGES.nickname.check;
        }
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // 중복 확인 핸들러 수정
  const handleValidation = async (type) => {
    const value = formData[type];

    // 값이 없거나 형식이 맞지 않으면 중복 확인하지 않음
    if (!value || errors[type] === ERROR_MESSAGES[type].format) return;

    // API 호출
    let response;
    try {
      if (type === "email") {
        response = await useMemberApi.checkEmail({ email: value });
      } else if (type === "nickname") {
        response = await useMemberApi.checkNickname({ nickname: value });
      }

      if (response?.status === "C000") {
        setValidationStatus((prev) => ({
          ...prev,
          [type]: { isValid: true, isChecked: true },
        }));
        setErrors((prev) => ({
          ...prev,
          [type]: "",
        }));
      } else {
        setValidationStatus((prev) => ({
          ...prev,
          [type]: { isValid: false, isChecked: true },
        }));
        setErrors((prev) => ({
          ...prev,
          [type]: response?.message || ERROR_MESSAGES.serverError,
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [type]: ERROR_MESSAGES.serverError,
      }));
    }
  };

  // ====================================== 상태 관련 핸들러 ======================================
  // 입력값 변경 핸들러 수정
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 이메일이나 닉네임이 변경될 때만 실시간 형식 검증
    if (name === "email" || name === "nickname") {
      setValidationStatus((prev) => ({
        ...prev,
        [name]: {
          isValid: false, // 중복확인 상태 초기화
          isChecked: false, // 검증 상태도 초기화
        },
      }));
      validateFormatRealTime(name, value);
    }
  };

  // blur 이벤트 핸들러
  const handleBlur = (e) => {
    const { name, value } = e.target;

    // 비밀번호 관련 필드 검증
    if (name === "password" || name === "confirmPassword") {
      let error = "";
      if (!value) {
        error = ERROR_MESSAGES.required(FIELD_LABELS[name]);
      } else if (name === "password" && !PASSWORD_REGEX.test(value)) {
        error = ERROR_MESSAGES.password.format;
      } else if (name === "confirmPassword" && value !== formData.password) {
        error = ERROR_MESSAGES.password.match;
      }

      setErrors((prev) => ({
        ...prev,
        [name]: error,
        // 비밀번호가 변경되면 비밀번호 확인도 재검증
        ...(name === "password" &&
          formData.confirmPassword && {
            confirmPassword: value !== formData.confirmPassword ? ERROR_MESSAGES.password.match : "",
          }),
      }));
    }
    // 성별 필드 검증
    else if (name === "gender") {
      setErrors((prev) => ({
        ...prev,
        [name]: !value ? ERROR_MESSAGES.required(FIELD_LABELS[name]) : "",
      }));
    }
    // 이메일과 닉네임은 실시간 검증 사용
    else {
      validateFormatRealTime(name, value);
    }
  };

  // 제출 핸들러 수정
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 모든 필드 검증
    const newErrors = {};

    // 필수 입력 검사
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = ERROR_MESSAGES.required(FIELD_LABELS[field]);
      }
    });

    // 이메일/닉네임 중복확인 검사
    if (!validationStatus.email.isValid) {
      newErrors.email = ERROR_MESSAGES.email.check;
    }
    if (!validationStatus.nickname.isValid) {
      newErrors.nickname = ERROR_MESSAGES.nickname.check;
    }

    // 비밀번호 형식 검사
    if (!PASSWORD_REGEX.test(formData.password)) {
      newErrors.password = ERROR_MESSAGES.password.format;
    }

    // 비밀번호 확인 일치 검사
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.password.match;
    }

    // 에러가 있으면 업데이트하고 제출하지 않음
    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));
      return;
    }

    // API 요청 및 처리
    try {
      const { confirmPassword, ...requestData } = formData;
      const response = await useMemberApi.registerMember(requestData);

      if (response.status === "C000") {
        alert(response.message);
        // 회원가입 후 로그인
        const loginResponse = await useMemberApi.loginMember({
          email: formData.email,
          password: formData.password,
        });
        dispatch(setUser({ ...loginResponse.user, isLogin: true }));
        navigate("/");
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert(ERROR_MESSAGES.serverError);
    }
  };

  // 비밀번호 보기 토글 핸들러
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // 공통 스타일 정의
  const styles = {
    input: "h-9 rounded-md px-3 bg-white/20 placeholder:text-white/30 placeholder:text-xs text-sm",
    button: "h-9 text-sm bg-[#8993c7] hover:bg-[#7580bb]",
    label: "text-sm",
    errorText: "text-xs text-red-500/90",
    fieldWrapper: "space-y-2",
    inputWrapper: "relative flex items-center w-full",
    validCheck: "absolute right-3 text-green-500",
    eyeIcon: "absolute right-3 text-white/75 cursor-pointer hover:text-white/90",
    checkButton: "text-xs w-12",
    inputContainer: "flex-1 min-w-0",
  };

  return (
    <Layout>
      <form className="flex flex-col h-full items-center justify-center text-white/75 max-w-[400px] mx-auto w-full px-4">
        <h1 className="my-6 text-2xl font-medium">회원가입</h1>

        <div className="flex-1 w-full space-y-6">
          {/* 이메일 */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>이메일 (필수)</label>
            <div className="flex items-center space-x-2">
              <div className={`${styles.inputWrapper} ${styles.inputContainer}`}>
                <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="이메일을 입력해 주세요" className={`${styles.input} w-full pr-8`} />
                {validationStatus.email.isValid && <span className={styles.validCheck}>✓</span>}
              </div>
              <button type="button" onClick={() => handleValidation("email")} disabled={!formData.email || errors.email === ERROR_MESSAGES.email.format} className={`${styles.button} ${styles.checkButton} px-2 rounded-md whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed`}>
                확인
              </button>
            </div>
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>

          {/* 닉네임 */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>닉네임 (필수)</label>
            <div className="flex items-center space-x-2">
              <div className={`${styles.inputWrapper} ${styles.inputContainer}`}>
                <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} onBlur={handleBlur} placeholder="닉네임을 입력해 주세요" className={`${styles.input} w-full pr-8`} />
                {validationStatus.nickname.isValid && <span className={styles.validCheck}>✓</span>}
              </div>
              <button
                type="button"
                onClick={() => handleValidation("nickname")}
                disabled={!formData.nickname || errors.nickname === ERROR_MESSAGES.nickname.format}
                className={`${styles.button} ${styles.checkButton} px-2 rounded-md whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                확인
              </button>
            </div>
            {errors.nickname && <p className={styles.errorText}>{errors.nickname}</p>}
          </div>

          {/* 성별 */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>성별 (필수)</label>
            <div className="flex space-x-8">
              <label className="flex items-center text-sm">
                <input type="radio" name="gender" value="MALE" checked={formData.gender === "MALE"} onChange={handleChange} onClick={handleBlur} className="mr-2 h-9" />
                <span>남성</span>
              </label>
              <label className="flex items-center text-sm">
                <input type="radio" name="gender" value="FEMALE" checked={formData.gender === "FEMALE"} onChange={handleChange} onClick={handleBlur} className="mr-2 h-9" />
                <span>여성</span>
              </label>
            </div>
            {errors.gender && <p className={styles.errorText}>{errors.gender}</p>}
          </div>

          {/* 비밀번호 */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>비밀번호 (필수)</label>
            <PasswordInput name="password" value={formData.password} placeholder="비밀번호를 입력해 주세요" showPassword={showPassword.password} toggleVisibility={togglePasswordVisibility} onChange={handleChange} onBlur={handleBlur} />
            {errors.password && <p className={styles.errorText}>{errors.password}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>비밀번호 확인 (필수)</label>
            <PasswordInput name="confirmPassword" value={formData.confirmPassword} placeholder="비밀번호를 입력해주세요" showPassword={showPassword.confirmPassword} toggleVisibility={togglePasswordVisibility} onChange={handleChange} onBlur={handleBlur} />
            {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* 제출 버튼 */}
        <button type="button" onClick={handleSubmit} className={`${styles.button} w-full my-4 rounded-full`}>
          가입하기
        </button>
      </form>
    </Layout>
  );
};

export default Signup;
