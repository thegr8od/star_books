import { useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import useMemberApi from "../../api/useMemberApi";
import { setUser } from "../../store/userSlice";

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
  // 유효성 검사 함수
  const validateField = (name, value, formData = {}) => {
    let error = "";

    // 필수 입력 검사
    if (!value) {
      if (name === "password" && formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      }
      return ERROR_MESSAGES.required(FIELD_LABELS[name]);
    }

    // 필드별 유효성 검사
    switch (name) {
      // 이메일
      case "email":
        if (!EMAIL_REGEX.test(value)) {
          error = ERROR_MESSAGES.email.format;
        } else {
          // 유효성 검사 통과
          setValidationStatus((prev) => ({
            ...prev,
            email: {
              ...prev.email,
              isChecked: true,
            },
          }));
          // 중복 확인 여부
          if (!validationStatus.email.isValid) {
            error = ERROR_MESSAGES.email.check;
          }
        }
        break;
      // 닉네임
      case "nickname":
        if (!NICKNAME_REGEX.test(value) || value.length > 20) {
          error = ERROR_MESSAGES.nickname.format;
        } else {
          // 유효성 검사 통과
          setValidationStatus((prev) => ({
            ...prev,
            nickname: {
              ...prev.nickname,
              isChecked: true,
            },
          }));
          // 중복 확인 여부
          if (!validationStatus.nickname.isValid) {
            error = ERROR_MESSAGES.nickname.check;
          }
        }
        break;
      // 비밀번호
      case "password":
        if (!PASSWORD_REGEX.test(value)) {
          error = ERROR_MESSAGES.password.format;
        }
        // 비밀번호 확인 일치 여부
        if (formData.confirmPassword) {
          if (value !== formData.confirmPassword) {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: ERROR_MESSAGES.password.match,
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              confirmPassword: "",
            }));
          }
        }
        break;
      // 비밀번호 확인
      case "confirmPassword":
        if (formData.password && value !== formData.password) {
          error = ERROR_MESSAGES.password.match;
        }
        break;
    }

    return error;
  };

  // ====================================== 상태 관련 핸들러 ======================================
  // 입력값 변경 핸들러 - 유효성 검사 없이 값만 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 이메일이나 닉네임이 변경되면 검증 상태 초기화
    if (name === "email" || name === "nickname") {
      setValidationStatus((prev) => ({
        ...prev,
        [name]: { isValid: false, isChecked: false },
      }));
    }
  };

  // blur 이벤트 핸들러 - 유효성 검사
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value, formData);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // 중복 확인 핸들러 (axios 요청)
  const handleValidation = async (type) => {
    // 유효성 검사를 통과하지 않았거나 이미 중복 확인이 완료된 경우
    if (!validationStatus[type].isChecked || validationStatus[type].isValid) {
      return;
    }

    // axios 요청
    const requestData = { [type]: formData[type] };
    let response;
    if (type === "email") {
      response = await useMemberApi.checkEmail(requestData);
    } else if (type === "nickname") {
      response = await useMemberApi.checkNickname(requestData);
    }
    console.log(response);
    if (response?.status === "C000") {
      console.log(`${FIELD_LABELS[type]} 중복 확인 성공`);
      // 중복 검사 결과 업데이트
      setValidationStatus((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          isValid: true,
        },
      }));
      setErrors((prev) => ({
        ...prev,
        [type]: "",
      }));
    } else if (response?.status === "U011" || response?.status === "U012") {
      // 유효성 검사 결과에 따라 에러 메시지 업데이트
      setErrors((prev) => ({
        ...prev,
        [type]: response.message,
      }));
    } else {
      console.log(`${FIELD_LABELS[type]} 중복 확인 실패`);
      setErrors((prev) => ({
        ...prev,
        [type]: ERROR_MESSAGES.serverError,
      }));
    }
  };

  // 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 모든 필드 유효성 검사
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field], formData);
      if (error) {
        newErrors[field] = error;
      }
    });

    // 에러가 있으면 업데이트하고 제출하지 않음
    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));
      return;
    }

    // axios 요청
    const { confirmPassword, ...requestData } = formData;
    const response = await useMemberApi.registerMember(requestData);
    console.log(response);
    if (response.status === "C000") {
      console.log("회원가입 성공");
      alert(response.message);
      // 회원가입 후 로그인
      const response1 = await useMemberApi.loginMember({
        email: formData.email,
        password: formData.password,
      });
      console.log(response1)
      dispatch(setUser({ ...response1.user, isLogin: true }));
      navigate("/");
    } else {
      console.log("회원가입 실패");
      alert(response.message);
    }
  };

  // 공통 스타일 정의
  const styles = {
    input: "h-9 rounded-md px-3 bg-white/20 placeholder:text-white/30 placeholder:text-xs text-sm",
    button: "h-9 text-sm bg-[#8993c7] hover:bg-[#7580bb]",
    label: "text-sm",
    errorText: "text-xs text-red-500/90",
    fieldWrapper: "space-y-2",
  };
  return (
    <Layout>
      <form className="flex flex-col h-full items-center justify-center text-white/75">
        <h1 className="my-6 text-2xl font-medium">별에별일</h1>

        <div className="flex-1 w-full space-y-6">
          {/* 이메일 */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>이메일</label>
            <div className="flex items-center space-x-2">
              <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="이메일을 입력해 주세요" className={`${styles.input} flex-1`} />
              <button type="button" onClick={() => handleValidation("email")} className={`${styles.button} px-2 rounded-md`}>
                확인
              </button>
            </div>
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>

          {/* 닉네임 */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>닉네임</label>
            <div className="flex items-center space-x-2">
              <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} onBlur={handleBlur} placeholder="닉네임을 입력해 주세요" className={`${styles.input} flex-1`} />
              <button type="button" onClick={() => handleValidation("nickname")} className={`${styles.button} px-2 rounded-md`}>
                확인
              </button>
            </div>
            {errors.nickname && <p className={styles.errorText}>{errors.nickname}</p>}
          </div>

          {/* 성별 */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>성별</label>
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
            <label className={styles.label}>비밀번호</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} placeholder="비밀번호를 입력해 주세요" className={`${styles.input} w-full`} />
            {errors.password && <p className={styles.errorText}>{errors.password}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>비밀번호 확인</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} placeholder="비밀번호를 입력해주세요" className={`${styles.input} w-full`} />
            {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* 제출 버튼 */}
        <button type="button" onClick={handleSubmit} className={`${styles.button} w-full my-4 rounded-full`}>
          확인
        </button>
      </form>
    </Layout>
  );
};

export default Signup;
