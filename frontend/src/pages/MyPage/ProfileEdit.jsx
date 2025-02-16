import { useEffect, useState } from "react";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import Layout from "../../components/Layout";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { useSelector, useDispatch } from "react-redux";
import { updateUserField, setUser } from "../../store/userSlice";
import useMemberApi from "../../api/useMemberApi";

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [imagePreview, setImagePreview] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    emailDomain: "",
    gender: "",
  }); // 콘솔로 찍어보기

  // 초기 데이터 불러오기
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.nickname || "",
        email: user.email ? user.email.split("@")[0] : "",
        emailDomain: user.email ? user.email.split("@")[1] : "",
        gender: user.gender || "",
      });
      setImagePreview(user.profileImagePath);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  // 이미지 업로드 함수
  const handleImageUpload = (file) => {
    updateProfileImage(file)
      .then((response) => {
        dispatch(
          updateUserField({
            field: "profileImagePath",
            value: response.data.profileImagePath,
          })
        );
      })
      .catch((error) => {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다.");
      });
  };

  // 이미지 변경 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      //API 호출
      updateProfileImage(file)
        .then((response) => {
          dispatch(
            updateUserField({
              field: "profileImagePath",
              value: response.data.profileImagePath,
            })
          );
        })
        .catch((error) => {
          console.error("이미지 업로드 실패 : ", error);
          alert("이미지 업로드에 실패했습니다.");
        });
    }
  };

  // 프로필 업데이트 함수
  const handleProfileUpdate = () => {
    const profileData = {
      nickname: formData.name,
      email: formData.email,
      gender: formData.gender,
    };

    updateProfile(profileData)
      .then((response) => {
        if (response.status === 404) {
          alert("프로필 업데이트에 실패했습니다.");
          return;
        }
        dispatch(
          setUser({
            ...user,
            nickname: profileData.nickname,
            email: profileData.email,
            gender: profileData.gender,
          })
        );
        alert("프로필이 성공적으로 업데이트 되었습니다.");
      })
      .catch((error) => {
        console.error("프로필 업데이트 실패 : ", error);
        alert("프로필 업데이트에 실패했습니다.");
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
                  />
                </label>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-[30px] ">
              {/* 이름 */}
              <div className="flex flex-col space-y-[10px]">
                <span>이름(닉네임)</span>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="이름을 입력하세요."
                  className="w-full bg-transparent border-b border-gray-400 focus:outline-none pb-1"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <span>이메일</span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요."
                  className="w-full bg-transparent border-b border-gray-400 focus:outline-none pb-1"
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
                      checked={formData.gender === "male"}
                      onChange={handleInputChange}
                    />
                    <span>남자</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="gender"
                      value="FEMALE"
                      checked={formData.gender === "female"}
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
          <span>현재 비밀번호</span>
          <input
            type="password"
            className="w-full p-1 bg-[#D9D9D9] rounded-md focus:outline-none"
          />
          <span>현재 비밀번호</span>
          <input
            type="w-full password"
            className="w-full p-1 bg-[#D9D9D9] focus:outline-none"
          />
          <span>현재 비밀번호</span>
          <input
            type="password"
            className="w-full p-1 bg-[#D9D9D9] focus:outline-none"
          />
          <div className="flex justify-center gap-7 mt-[10px]">
            <Button
              text="취소"
              type={"PREV"}
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-[30px] py-2"
            />
            <Button
              text="확인"
              type={"DEFAULT"}
              onClick={() => setIsPasswordModalOpen(false)}
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
              onClick={() => setIsWithdrawModalOpen(false)}
              className="px-[30px] py-2"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileEdit;
