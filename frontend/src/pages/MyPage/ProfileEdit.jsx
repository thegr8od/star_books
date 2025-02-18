import { useEffect, useState } from "react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { useSelector, useDispatch } from "react-redux";
import { updateUserField, setUser } from "../../store/userSlice";
import useMemberApi from "../../api/useMemberApi";
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
  });

  // 비밀번호 변경 관련
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  ////// 프로필 변경 //////
  // 닉네임 유효성 검사 상태
  const [validationStatus, setValidationStatus] = useState({
    isValid: true,
    isChecked: true,
  });

  // 에러 메시지 상태
  const [error, setError] = useState("");

  // 닉네임 유효성 검사를 위한 정규식
  const NICKNAME_REGEX = /^[A-Za-z0-9가-힣]+$/;

  // 에러 메시지
  const ERROR_MESSAGES = {
    nickname: {
      format: "영문, 한글, 숫자를 사용하여 20자 이내로 입력해 주세요",
      check: "닉네임 중복 확인이 필요합니다.",
    },
    serverError: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  };

  // 초기 데이터 불러오기
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.nickname || "",
        email: user.email || "",
        gender: user.gender || "",
      });
      setImagePreview(user.profileImagePath || null);
    }
  }, [user]);

  // 닉네임 입력값 검증
  const validateNickname = (value) => {
    if (!NICKNAME_REGEX.test(value) || value.length > 20) {
      setError(ERROR_MESSAGES.nickname.format);
      return false;
    }
    if (!validationStatus.isValid) {
      setError(ERROR_MESSAGES.nickname.check);
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setValidationStatus({ isValid: false, isChecked: false });
      setError("");
    }
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  // 닉네임 중복 확인
  const handleNicknameValidation = async () => {
    if (!NICKNAME_REGEX.test(formData.name) || formData.name.length > 20) {
      setError(ERROR_MESSAGES.nickname.format);
      return;
    }

    try {
      const response = await useMemberApi.checkNickname({
        nickname: formData.name,
      });
      if (response?.status === "C000") {
        setValidationStatus({ isValid: true, isChecked: true });
        setError("");
      } else if (response?.status === "U012") {
        setError(response.message);
      } else {
        setError(ERROR_MESSAGES.serverError);
      }
    } catch (error) {
      setError(ERROR_MESSAGES.serverError);
    }
  };

  // 이미지 변경 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    // const reader = new FileReader();

    // reader.onloadend = () => {
    //   const previewUrl = reader.result;
    //   setImagePreview(previewUrl);

    useMemberApi
      .updateProfileImage(file, user.email)
      .then(() => useMemberApi.getProfileImage(user.email))
      .then((response) => {
        if (response?.status === "C000") {
          const newImageUrl = response.data;
          console.log("New image URL:", newImageUrl); // 디버깅용
          setImagePreview(newImageUrl);
          dispatch(
            updateUserField({
              field: "profileImagePath",
              value: newImageUrl,
            })
          );
        } else {
          throw new Error("이미지 업로드 실패");
        }
      })
      .catch((error) => {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다.");
        setImagePreview(user.profileImagePath);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  // 프로필 업데이트 함수
  const handleProfileUpdate = () => {
    // 닉네임이 변경되었고 중복 확인이 되지 않은 경우
    if (
      formData.name !== user.nickname &&
      (!validationStatus.isChecked || !validationStatus.isValid)
    ) {
      alert("닉네임 중복 확인이 필요합니다.");
      return;
    }

    const profileData = {
      nickname: formData.name,
      email: formData.email,
      gender: formData.gender,
    };

    useMemberApi
      .updateProfile(profileData)
      .then((response) => {
        dispatch(
          setUser({
            ...user,
            nickname: profileData.nickname,
            gender: profileData.gender,
          })
        );
        alert("프로필이 성공적으로 업데이트되었습니다.");
      })
      .catch((error) => {
        console.error("프로필 업데이트 실패 : ", error);
        alert("프로필 업데이트에 실패했습니다.");
      });
  };

  /////// 비밀번호 ///////
  // 비밀번호 유효성 검사를 위한 정규식
  const PASSWORD_REGEX =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

  // 비밀번호 입력 처리
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 입력 시 해당 필드의 에러 메시지 초기화
    setPasswordErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // 비밀번호 유효성 검사
  const validatePassword = () => {
    let isValid = true;
    const newErrors = {};

    if (!passwordData.oldPassword) {
      newErrors.oldPassword = "현재 비밀번호를 입력해주세요.";
      isValid = false;
    }

    if (!PASSWORD_REGEX.test(passwordData.newPassword)) {
      newErrors.newPassword =
        "비밀번호는 8-20자의 영문, 숫자, 특수문자를 포함해야 합니다.";
      isValid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "새 비밀번호가 일치하지 않습니다.";
      isValid = false;
    }

    setPasswordErrors(newErrors);
    return isValid;
  };

  // 비밀번호 변경 제출
  const handlePasswordSubmit = async () => {
    if (!validatePassword()) return;

    try {
      const response = await useMemberApi.changePassword({
        email: user.email,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (response?.status === "C000") {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsPasswordModalOpen(false);
      } else if (response?.status === 404) {
        setPasswordErrors((prev) => ({
          ...prev,
          oldPassword: "현재 비밀번호가 일치하지 않습니다.",
        }));
      } else {
        alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  // 회원탈퇴
  const handleWithdraw = () => {
    useMemberApi
      .withdrawMember(user.email)
      .then((response) => {
        console.log(response);

        if (response?.status === "C000") {
          alert("회원 탈퇴가 완료되었습니다.");
          localStorage.removeItem("accessToken");
          dispatch(setUser(null));
          navigate("/");
        } else {
          alert("회원 탈퇴 처리 중 오류가 발생했습니다.");
        }
      })
      .catch((error) => {
        console.error("회원 탈퇴 오류 :", error);
        alert("회원 탈퇴 처리 중 오류가 발생했습니다.");
      });
  };

  return (
    <>
      <Layout>
        <div className="text-white">
          <div className="flex flex-col items-center space-y-[30px] w-full h-full">
            {/* 이미지 */}
            <div className="relative">
              <div className="flex flex-col items-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="프로필 이미지"
                    className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full bg-[#8993c7] flex justify-center items-center">
                    <PersonOutlineOutlinedIcon
                      sx={{
                        fontSize: {
                          xs: 50, // 모바일
                          md: 65, // 태블릿
                          lg: 80, // 데스크탑
                        },
                      }}
                      className="text-white"
                    />
                  </div>
                )}
                {/* 이미지 업로드 버튼 */}
                <label className="absolute bottom-0 right-0 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex justify-center items-center">
                    <CameraAltOutlinedIcon
                      sx={{
                        fontSize: 16, // 모바일: 16px
                      }}
                      className="text-gray-700"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-[30px] ">
              {/* 이름(닉네임) */}
              <div className="flex flex-col space-y-[10px]">
                <span>이름(닉네임)</span>
                <div className="flex space-x-2">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="이름을 입력하세요."
                    className="flex-1 bg-transparent border-b border-gray-400 focus:outline-none pb-1"
                  />
                  <button
                    onClick={handleNicknameValidation}
                    className="px-4 py-1 bg-[#8993c7] hover:bg-[#7580bb] rounded-md text-sm"
                  >
                    확인
                  </button>
                </div>
                {error && <p className="text-xs text-red-500/90">{error}</p>}
              </div>

              <div className="flex flex-col space-y-2">
                <span>이메일</span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full bg-transparent border-b border-gray-400 focus:outline-none pb-1 opacity-70"
                />
              </div>

              {/* 성별 */}
              <div className="flex flex-col space-y-[10px]">
                <span>성별</span>
                <div className="flex space-x-8">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="gender"
                      value="MALE"
                      checked={formData.gender === "MALE"}
                      onChange={handleInputChange}
                    />
                    <span>남자</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="gender"
                      value="FEMALE"
                      checked={formData.gender === "FEMALE"}
                      onChange={handleInputChange}
                    />
                    <span>여자</span>
                  </div>
                </div>
              </div>
              {/* 버튼 */}
              <div className="flex flex-col items-center w-full gap-[30px]">
                <div className="w-full">
                  <Button
                    text={"비밀번호 변경"}
                    type={"DEFAULT"}
                    className="w-full px-8 py-2"
                    onClick={() => setIsPasswordModalOpen(true)}
                  />
                </div>
                <div className="w-full">
                  <Button
                    text={"변경사항 저장"}
                    type={"DEFAULT"}
                    className="w-full px-8 py-2"
                    onClick={handleProfileUpdate}
                  />
                </div>
                <div className="w-full">
                  <button
                    className="w-full px-6 pb-2 text-white opacity-80"
                    onClick={() => setIsWithdrawModalOpen(true)}
                  >
                    <span className=" border-b">회원탈퇴</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      {/* 비밀번호 변경 모달 */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title={"비밀번호 변경"}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span>현재 비밀번호</span>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              className="w-full p-1 bg-[#D9D9D9] rounded-md focus:outline-none"
            />
            {passwordErrors.oldPassword && (
              <p className="text-xs text-red-500">
                {passwordErrors.oldPassword}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span>새 비밀번호</span>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-1 bg-[#D9D9D9] rounded-md focus:outline-none"
            />
            {passwordErrors.newPassword && (
              <p className="text-xs text-red-500">
                {passwordErrors.newPassword}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span>새 비밀번호 확인</span>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-1 bg-[#D9D9D9] rounded-md focus:outline-none"
            />
            {passwordErrors.confirmPassword && (
              <p className="text-xs text-red-500">
                {passwordErrors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex justify-center gap-7 mt-[10px]">
            <Button
              text="취소"
              type={"PREV"}
              onClick={() => {
                setIsPasswordModalOpen(false);
                setPasswordData({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
                setPasswordErrors({});
              }}
              className="px-[30px] py-2"
            />
            <Button
              text="확인"
              type={"DEFAULT"}
              onClick={handlePasswordSubmit}
              className="px-[30px] py-2"
            />
          </div>
        </div>
      </Modal>
      {/* 회원탈퇴 모달 */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title={"회원 탈퇴"}
      >
        <div className="flex flex-col px-8 py-12">
          <p className="text-center text-[15px] mb-10">
            회원 탈퇴 시, 계정은 삭제되며
            <br />
            복구되지 않습니다.
            <br />
            <br />
            정말로 탈퇴하시겠습니까?
          </p>
          <div className="flex justify-center gap-3">
            <Button
              text="취소"
              type={"PREV"}
              onClick={() => setIsWithdrawModalOpen(false)}
              className="px-[30px] py-2"
            />
            <Button
              text="확인"
              type={"DEFAULT"}
              onClick={handleWithdraw}
              className="px-[30px] py-2"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileEdit;
