import { useState } from "react";
import defaultImage from "../.././assets/default-profile.png";

const ProfileEdit = () => {
  const [imagePreview, setImagePreview] = useState(null);
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

      <span>생년월일</span>
      <div className="birth-group">
        <input
          name="birthYear"
          value={formData.birthYear}
          onChange={handleInputChange}
        />
        <input
          name="birthMonth"
          value={formData.birthMonth}
          onChange={handleInputChange}
        />
        <input
          name="birthDay"
          value={formData.birthDay}
          onChange={handleInputChange}
        />
      </div>

      <span>성별</span>
      <div className="gender-group">
        <div>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={formData.gender === "male"}
            onChange={handleInputChange}
          />
          남자
        </div>
        <div>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={formData.gender === "female"}
            onChange={handleInputChange}
          />
          여자
        </div>
      </div>
      <button>비밀번호 변경</button>
      <button>변경사항 저장</button>
      <button>회원탈퇴</button>
    </div> // container
  );
};

export default ProfileEdit;
