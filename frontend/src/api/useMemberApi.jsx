import { jwtDecode } from "jwt-decode";
import useAxiosInstance from "./useAxiosInstance";

// OAuth 로그인 처리 함수
const handleOAuthToken = async (token) => {
  try {
    // JWT 토큰 디코딩
    const decodedToken = jwtDecode(token);
    console.log('Decoded token:', decodedToken);

    // 토큰 저장
    localStorage.setItem("accessToken", token);

    // 토큰에서 사용자 정보 추출하여 바로 반환
    // JSON.parse를 사용하여 문자열 값들을 적절한 타입으로 변환
    const userData = {
      userId: decodedToken.user_id,
      email: decodedToken.email,
      nickname: decodedToken.nickname,
      gender: decodedToken.gender,
      role: decodedToken.role,
      profileImagePath: decodedToken.profile_image_path || null,
      isLogin: true,
      isActive: true,
      snsAccount: true
    };

    // 디버깅을 위한 로그
    console.log('Processed user data:', userData);

    return userData;
  } catch (error) {
    console.error("OAuth 토큰 처리 실패:", error);
    throw error;
  }
};

//로그인
//post
const loginMember = async (member) => {
  try {
    console.log(member);
    const response = await useAxiosInstance.apiClient.post(
      "/member/login",
      member
    );
    console.log(response);

    // 백엔드 응답 헤더에서 accessToken 가져오기
    const accessToken = response.data.data.accessToken;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken); // key 이름 추가
    } else {
      throw new Error("Access token이 응답 헤더에 없음");
    }

    return response.data.data;
  } catch (error) {
    console.log("에러:", error);

    // 서버에서 응답이 온 경우
    if (error.response) {
      return error.response.data;
    }

    // 네트워크 에러 등 다른 에러인 경우
    throw error; // 에러를 상위로 전파
  }
};

//회원가입
//post
const registerMember = async (member) => {
  try {
    console.log("api " + member);
    const response = await useAxiosInstance.apiClient.post("/member", member);
    return response.data;
  } catch (e) {
    //오류 체크
    if (e.response.data.stauts === 404) {
      return e.response.data;
    }
  }
};

//로그아웃
//post
const logoutMember = async () => {
  const jwt = localStorage.getItem("accessToken");
  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .post("/member/logout");
    localStorage.removeItem("accessToken");

    return response.data;
  } catch (e) {
    //오류 체크
    if (e.response.data.stauts == 404) {
      return e.response.data;
    }
  }
};

const getMemberMY = async () => {
  const jwt = localStorage.getItem("accessToken");
  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .get("/member/my");

    return response;
  } catch (e) {
    return e;
  }
};


//refresh token 발급
//post
const refreshToken = async () => {
  try {
    const response = await useAxiosInstance.apiClient.post("/member/refresh");
    // 백엔드 응답 헤더에서 새로운 accessToken 가져오기
    const newToken = response.data.accessToken;

    if (newToken) {
      location.setItem(newToken); // Axios에 Authorization 헤더 설정
      return true;
    } else {
      throw new Error("Access token이 응답 헤더에 없음");
    }
  } catch (e) {
    if (e.response.data.stauts == 404) {
      return e.response.data;
    }
  }
};

//유저 정보 가져오기
//get
const getUserInfo = async () => {
  try {
    const jwt = localStorage.getItem("accessToken");

    const response = await useAxiosInstance
      .authApiClient(jwt)
      .get("/member/detail");
    return response.data;
  } catch (e) {
    //오류 체크
    if (e.response.data.stauts == 404) {
      return e.response.data;
    }
  }
};

//중복 이메일 체크
//get
const checkEmail = async (data) => {
  try {
    const response = await useAxiosInstance.apiClient.get(
      `/member/check-email?email=${data.email}`
    );
    console.log(response);
    return response.data;
  } catch (e) {
    //오류 체크
    if (e.response.data.stauts == 404) {
      return e.response.data;
    }
  }
};

//중복 닉네임 체크
//get
const checkNickname = async (data) => {
  try {
    const response = await useAxiosInstance.apiClient.get(
      `/member/check-nickname?nickname=${data.nickname}`
    );
    return response.data;
  } catch (e) {
    //오류 체크
    if (e.response.data.stauts == 404) {
      return e.response.data;
    }
  }
};

//마이페이지 이미지 업데이트
// post
const updateProfileImage = async (data, email) => {
  const jwt = localStorage.getItem("accessToken");
  const formData = new FormData();
  formData.append("profileImageFile", data);
  formData.append("email", email);
  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .post("/member/profile/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    return response.data;
  } catch (e) {
    //오류 체크
    if (e.response.data.stauts == 404) {
      return e.response.data;
    }
  }
};

// 프로필 이미지 조회
// get
const getProfileImage = async (email) => {
  const jwt = localStorage.getItem("accessToken");
  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .get(`/member/profile/image`, {
        params: {
          email: email,
        },
      });
    return response.data;
  } catch (e) {
    // 오류 체크
    if (e.response.stauts == 404) {
      return e.response.data;
    }
  }
};

//마이페이지 수정
//put
const updateProfile = async (data) => {
  const jwt = localStorage.getItem("accessToken");
  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .put(`/member/profile/text`, data);
    return response.data;
  } catch (e) {
    //오류 체크
    if (e.response.data.stauts == 404) {
      return e.response.data;
    }
  }
};

//비밀번호 리셋 요청 보내기기
const sendVerification = async (param) => {

  try {
    const response = await useAxiosInstance
      .apiClient.post("/member/password/reset-request", param);

    return response
  } catch (e) {
    return e;
  }
}

//비밀번호 변경
//post
const changePassword = async (data) => {
  const jwt = localStorage.getItem("accessToken");
  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .post(`/member/change-password`, data);
    return response.data;
  } catch (e) {
    //오류 체크
    if (e.response.data.status == 404) {
      return e.response.data;
    }
  }
};

//인증번호 확인
const verifyCode = async (param) => {
  try {
    const response = await useAxiosInstance
      .apiClient.post(`/member/password/verify-code`, param);
    return response;
  } catch (e) {
    //오류 체크
    if (e.response.data.status == 404) {
      return e.response.data;
    }
  }
}

//토큰 없이 reset
const resetPassword = async (param) => {
  try {
    const response = await useAxiosInstance
      .apiClient.post(`/member/password/reset`, param);
    return response;
  } catch (e) {
    return e;
  }
}

// 회원 탈퇴
// delete
const withdrawMember = async (email) => {
  const jwt = localStorage.getItem("accessToken");
  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .delete(`/member/withdraw`, {
        params: { email },
      });
    return response.data;
  } catch (e) {
    //오류 체크
    if (e.response.data.status === 404) {
      return e.response.data;
    }
  }
};

export default {
  loginMember,
  registerMember,
  logoutMember,
  getUserInfo,
  checkNickname,
  checkEmail,
  refreshToken,
  updateProfileImage,
  updateProfile,
  getProfileImage,
  changePassword,
  withdrawMember,
  sendVerification,
  verifyCode,
  resetPassword,
  getMemberMY,
  handleOAuthToken
};
