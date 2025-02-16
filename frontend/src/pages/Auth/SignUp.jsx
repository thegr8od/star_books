import { useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import useMemberApi from "../../api/useMemberApi";

const Signup = () => {
  const navigate = useNavigate();
  
  // 입력 필드 상태
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 유효성 검사 메시지
  const [emailError, setEmailError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

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
    if (!birthDate) {
      setBirthDateError("생년월일을 입력해주세요.");
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
  const handleSubmit = async () => {
    if(!validateForm()){
      return;
    }
    
    const member = {
      email,
      password,
      nickname,
      gender,
    };

    try {
      console.log(member);

      const response = await useMemberApi.registerMember(member);

      if(response.status === "C000") {
        console.log("회원가입 완료료");
        alert(response.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        alert(response.message);
      }
    } catch(e) {
      alert(e.message);
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
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsEmailChecked(false);
                }}
                onBlur={(e) => {
                  setEmailError(e.target.value ? "" : "이메일을 입력해주세요");
                }}
                placeholder="이메일을 입력해 주세요"
                className="flex-1"
              />
              <button type="button" onClick={handleEmailCheck} className="w-14 h-8 rounded-2xl text-white bg-[#8993c7] hover:bg-[#7580bb]">
                확인
              </button>
            </div>
            {emailError && <p>{emailError}</p>}
          </div>

          {/* 이름 */}
          <div className="space-y-2">
            <label>이름</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="name"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setIsNameChecked(false);
                }}
                onBlur={(e) => {
                  setNicknameError(e.target.value ? "" : "이름을 입력해주세요");
                }}
                placeholder="이름을 입력해 주세요"
                className="flex-1"
              />
              <button type="button" onClick={handleNameCheck} className="w-14 h-8 rounded-2xl text-white bg-[#8993c7] hover:bg-[#7580bb]">
                확인
              </button>
            </div>
            {nicknameError && <p>{nicknameError}</p>}
          </div>

          {/* 생년월일 */}
          <div className="space-y-2">
            <label>생년월일</label>
            <input
              type="date"
              name="birthDate"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                setBirthDateError("");
              }}
              onBlur={(e) => {
                setBirthDateError(e.target.value ? "" : "생년월일을 입력해주세요");
              }}
              className="w-full"
            />
            {birthDateError && <p>{birthDateError}</p>}
          </div>
          
          {/* 성별 */}
          <div className="space-y-2">
            <label>성별</label>
            <div className="flex space-x-8">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="MALE"
                  checked={gender === "MALE"}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setGenderError("");
                  }}
                  className="mr-2 text-blue-500"
                />
                <span>남성</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  checked={gender === "FEMALE"}
                  onChange={(e) => {
                    setGender(e.target.value);
                    setGenderError("");
                  }}
                  className="mr-2 text-blue-500"
                />
                <span>여성</span>
              </label>
            </div>
            {genderError && <p>{genderError}</p>}
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onBlur={(e) => {
                validatePassword(e.target.value);
              }}
              placeholder="비밀번호를 입력해 주세요"
              className="w-full"
            />
            {passwordError && <p>{passwordError}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div className="space-y-2">
            <label>비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              onBlur={(e) => {
                setConfirmPasswordError(e.target.value ? validateConfirmPassword(e.target.value) : "비밀번호를 입력해주세요");
              }}
              placeholder="비밀번호를 입력해 주세요"
              className="w-full"
            />
            {confirmPasswordError && <p>{confirmPasswordError}</p>}
          </div>

          {/* 제출 버튼 */}
          <button type="button" onClick={handleSubmit} className="w-full h-10 rounded-2xl text-white bg-[#8993c7] hover:bg-[#7580bb]">
            확인
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Signup;
