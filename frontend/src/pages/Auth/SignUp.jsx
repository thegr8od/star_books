import { useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import useMemberApi from "../../api/useMemberApi";

const Signup = () => {
  const navigate = useNavigate();

  // 입력 필드 상태
  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  // 유효성 검사 메시지
  const [errors, setErrors] = useState({
    email: "",
    nickname: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 중복 체크 상태
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isNameChecked, setIsNameChecked] = useState(false);
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);

  // 비밀번호확인 검사
  const validateConfirmPassword = (confirmPassword) => {
    return password !== confirmPassword ? "비밀번호가 일치하지 않습니다." : "";
  };

  // 비밀번호 검사
  const validatePassword = (password) => {
    const isLengthValid = password.length >= 8 && password.length <= 15;
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-z]/.test(password);
    setPasswordError(!isLengthValid || !hasSpecialChar || !hasNumber || !hasLetter ? "8~15자, 숫자/영문(소문자)/특수문자(!@#$%^&*)를 모두 조합하여 입력해주세요." : "");
    confirmPassword && setConfirmPasswordError(validateConfirmPassword(confirmPassword));
  };

  // 이메일 중복 체크 핸들러
  const handleEmailCheck = async () => {
    if (isEmailChecked) return;

    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.get("/api/member/email", {
        params: { email },
      });

      console.log(response.data);
      setIsEmailChecked(!response.data);
      setEmailError(response.data ? "이미 사용 중인 이메일입니다." : "사용 가능한 이메일입니다.");
    } catch (error) {
      setEmailError("확인 중 오류가 발생했습니다.");
    }
  };

  // 이름 중복 체크 핸들러
  const handleNameCheck = async () => {
    if (isNameChecked) return;

    if (!nickname) {
      setNicknameError("이름을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.get("/api/member/name", {
        params: { email },
      });

      console.log(response.data);
      setIsEmailChecked(!response.data);
      setEmailError(response.data ? "이미 사용 중인 이름입니다." : "사용 가능한 이름입니다.");
    } catch (error) {
      setEmailError("확인 중 오류가 발생했습니다.");
    }

    // axios
    try {
      const response = await axios.get("/api/member/name", {
        params: { name },
      });

      setIsNameChecked(!response.data);
      setNicknameError(response.data ? "이미 사용 중인 이름입니다." : "사용 가능한 이름입니다.");
    } catch (error) {
      setNicknameError("확인 중 오류가 발생했습니다.");
    }
  };

  // 폼 제출 시 빈 값 체크 함수
  const validateForm = () => {
    let isValid = true;

    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      isValid = false;
    }
    if (!nickname) {
      setNicknameError("이름을 입력해주세요.");
      isValid = false;
    }
    if (!gender) {
      setGenderError("성별을 선택해주세요.");
      isValid = false;
    }
    if (!password) {
      setPasswordError("8~15자, 숫자/영문(소문자)/특수문자(!@#$%^&*)를 모두 조합하여 입력해주세요.");
      isValid = false;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("비밀번호를 입력해주세요.");
      isValid = false;
    }

    return isValid;
  };

  // 폼 제출 핸들러
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) {
  //     return;
  //   }

  //   // axios
  //   try {
  //     const response = await axios.post("/api/member", {
  //       email,
  //       name,
  //       gender,
  //       password,
  //     });
  //     console.log("회원가입 성공:", response.data);
  //     navigate("/login");
  //   } catch (error) {
  //     if (error.response?.data) {
  //       alert("회원가입 중 오류가 발생했습니다.");
  //     } else {
  //       alert("서버와의 통신 중 오류가 발생했습니다.");
  //     }
  //     console.error("회원가입 실패:", error);
  //   }
  // };
  const handleSubmit = async () => {
    // if(!validateForm()){
    //   return;
    // }

    const member = {
      email,
      password,
      nickname,
      gender,
    };

    try {
      console.log(member);

      const response = await useMemberApi.registerMember(member);

      if (response.status === "C000") {
        console.log(response.message);
        alert(response.message);
      } else {
        alert(response.message);
      }
    } catch (e) {
      alert(e.message);
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
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일을 입력해 주세요" className={`${styles.input} flex-1`} />
              <button type="button" onClick={handleEmailCheck} className={`${styles.button} px-2 rounded-md`}>
                확인
              </button>
            </div>
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>

          {/* 닉네임 */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>이름</label>
            <div className="flex items-center space-x-2">
              <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} placeholder="이름을 입력해 주세요" className={`${styles.input} flex-1`} />
              <button type="button" onClick={handleNameCheck} className={`${styles.button} px-2 rounded-md`}>
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
                <input type="radio" name="gender" value="MALE" checked={formData.gender === "MALE"} onChange={handleChange} className="mr-2 h-9" />
                <span>남성</span>
              </label>
              <label className="flex items-center text-sm">
                <input type="radio" name="gender" value="FEMALE" checked={formData.gender === "FEMALE"} onChange={handleChange} className="mr-2 h-9" />
                <span>여성</span>
              </label>
            </div>
            {errors.gender && <p className={styles.errorText}>{errors.gender}</p>}
          </div>

          {/* 비밀번호 */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>비밀번호</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호를 입력해 주세요" className={`${styles.input} w-full`} />
            {errors.password && <p className={styles.errorText}>{errors.password}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>비밀번호 확인</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="비밀번호를 입력해주세요" className={`${styles.input} w-full`} />
            {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* 제출 버튼 */}
        <button type="button" onClick={handleSubmit} className={`${styles.button} w-full my-3 rounded-full`}>
          확인
        </button>
      </form>
    </Layout>
  );
};

export default Signup;
