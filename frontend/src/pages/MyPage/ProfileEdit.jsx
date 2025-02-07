import { useState } from "react";
import defaultImage from "../.././assets/default-profile.png";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

const ProfileEdit = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    emailDomain: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
<<<<<<< HEAD
    <div className="">
      <h1>마이페이지 수정</h1>
      <div className="">
        {imagePreview ? (
          <img src={imagePreview} alt="프로필 이미지" />
        ) : (
          <img src={defaultImage} alt="기본 프로필" />
        )}
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
      </div>
      <span>이름(닉네임)</span>
      <div className="input-group">
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="이름을 입력하세요."
        />
      </div>
      <span>이메일</span>
      <div className="email-group">
        <input
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <span>@</span>
        <select onChange={handleInputChange}>
          <option value="선택">선택</option>
          <option value="gmail">gmail.com</option>
          <option value="naver">naver.com</option>
          <option value="daum">daum.net</option>
          <option value="nate">nate.com</option>
        </select>
      </div>
=======
    <>
      <div className="text-white">
        <div className="flex flex-col items-center space-y-[30px] w-full h-full">
          {/* 이미지 */}
          <div className="relative">
            <div className="flex flex-col items-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="프로필 이미지"
                  className="w-80 h-80"
                />
              ) : (
                <img
                  src={defaultImage}
                  alt="기본 프로필"
                  className="w-40 h-40"
                />
              )}
              {/* 이미지 업로드 버튼 */}
              <label className="absolute bottom-0 right-0 cursor-pointer">
                <img src="/public/icons/camera2.png" alt="수정버튼" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
>>>>>>> 392a5c4c963736d963d27fc2adde31bd409827f1

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

            {/* 이메일 */}
            <div className="flex flex-col space-y-[10px]">
              <span>이메일</span>
              <div className="flex w-full items-center space-x-2">
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-[45%] bg-transparent border-b border-gray-400 pb-1 focus:outline-none"
                />
                <span className="flex-[1]">@</span>
                <select
                  onChange={handleInputChange}
                  className="w-[45%] bg-transparent border-b border-gray-400 pb-1"
                >
                  <option value="선택" className="text-black">
                    선택
                  </option>
                  <option value="gmail" className="text-black">
                    gmail.com
                  </option>
                  <option value="naver" className="text-black">
                    naver.com
                  </option>
                  <option value="daum" className="text-black">
                    daum.net
                  </option>
                  <option value="nate" className="text-black">
                    nate.com
                  </option>
                </select>
              </div>
            </div>

            {/* 생년월일 */}
            <div className="flex flex-col space-y-[10px]">
              <span>생년월일</span>
              <div className="flex space-x-[5px]">
                <input
                  name="birthYear"
                  value={formData.birthYear}
                  onChange={handleInputChange}
                  className="w-1/3 bg-transparent border-b border-gray-400 pb-1 text-center"
                />
                <p>.</p>
                <input
                  name="birthMonth"
                  value={formData.birthMonth}
                  onChange={handleInputChange}
                  className="w-1/3 bg-transparent border-b border-gray-400 pb-1 text-center"
                />
                <p>.</p>
                <input
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleInputChange}
                  className="w-1/3 bg-transparent border-b border-gray-400 pb-1 text-center"
                />
              </div>
            </div>

            {/* 성별 */}
            <div className="flex flex-col space-y-[10px]">
              <span>성별</span>
              <div className="flex space-x-8">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleInputChange}
                  />
                  <span>남자</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
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
