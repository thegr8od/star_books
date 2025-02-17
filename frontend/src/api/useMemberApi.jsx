import useAxiosInstance from "./useAxiosInstance";

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
      .post(`/member/profile/image`, formData);
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
    if (e.response.data.stauts == 404) {
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
};
