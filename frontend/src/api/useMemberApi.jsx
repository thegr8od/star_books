import useAxiosInstance from "./useAxiosInstance";

//로그인
//post
const loginMember = async (member) => {
  try {
    const response = await useAxiosInstance.apiClient.post(
      "/member/login",
      member
    );

    // 백엔드 응답 헤더에서 accessToken 가져오기
    const accessToken = response.data.accessToken;

    if (accessToken) {
      localStorage.setItem(accessToken); // Axios에 Authorization 헤더 설정
    } else {
      throw new Error("Access token이 응답 헤더에 없음");
    }

    return response.data;
  } catch (e) {
    //오류 체크
    if (e.respose.data.stauts == 404) {
      return e.response.data;
    }
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
    if (e.respose.data.stauts === 404) {
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
    if (e.respose.data.stauts == 404) {
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
      locaiton.setItem(newToken); // Axios에 Authorization 헤더 설정
      return true;
    } else {
      throw new Error("Access token이 응답 헤더에 없음");
    }
  } catch (e) {
    if (e.respose.data.stauts == 404) {
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
    if (e.respose.data.stauts == 404) {
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
    if (e.respose.data.stauts == 404) {
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
    if (e.respose.data.stauts == 404) {
      return e.response.data;
    }
  }
};

//마이페이지 이미지 업데이트
// post
const updateProfileImage = async (data) => {
  const jwt = localStorage.get("accessToken");
  const formData = new FormData();
  formData.append("file", data);

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .post(`/member/profile/image`, formData);
    return response.data;
  } catch (e) {
    //오류 체크
    if (e.respose.data.stauts == 404) {
      return e.response.data;
    }
  }
};

//마이페이지 수정
//put
const updateProfile = async (data) => {
  const jwt = localStorage.get("accessToken");
  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .put(`/member/profile/text`, data);
    return response.data;
  } catch (e) {
    //오류 체크
    if (e.respose.data.stauts == 404) {
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
  // refreshToken,
  updateProfileImage,
  updateProfile,
};
