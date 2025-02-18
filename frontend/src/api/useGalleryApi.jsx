import useAxiosInstance from "./useAxiosInstance";

// AI가 생성한 별자리 데이터 저장
const generateConstellation = async (file) => {
  const jwt = localStorage.getItem("accessToken");

  if (!jwt) {
    throw new Error("로그인이 필요합니다");
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await useAxiosInstance
      .authApiClient(jwt)
      .post("/constellation/generate-lines", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

    if (response.data) {
      return response.data;
    } else {
      throw new Error("별자리 생성에 실패했습니다");
    }
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    }
    console.error("별자리 생성 실패:", error);
    throw error;
  }
};

// 유저가 직접 별자리 데이터를 업로드
const uploadUserConstellation = async (lines) => {
  const jwt = localStorage.getItem("accessToken");

  if (!jwt) {
    throw new Error("로그인이 필요합니다");
  }

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .post("/constellation/user-upload", { lines });

    // 응답 구조 확인 및 처리
    if (response.data && response.data.status === "SUCCESS") {
      return response.data;
    } else {
      throw new Error(response.data?.message || "별자리 저장에 실패했습니다");
    }
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    }
    console.error("유저 별자리 업로드 실패:", error);
    throw error.response?.data?.message
      ? new Error(error.response.data.message)
      : error;
  }
};

// 유저의 별자리 목록 조회
const getUserConstellations = async () => {
  const jwt = localStorage.getItem("accessToken");

  if (!jwt) {
    throw new Error("로그인이 필요합니다");
  }

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .get("/constellation/user");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken"); // 토큰 제거
      throw new Error("로그인이 만료되었습니다. 다시 로그인해주세요.");
    }
    console.error("별자리 목록 조회 실패:", error);
    throw error;
  }
};

// 특정 별자리의 선 데이터 조회
const getConstellationLines = async (constellationId) => {
  const jwt = localStorage.getItem("accessToken");

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .get(`/constellation/${constellationId}/lines`);
    return response.data;
  } catch (error) {
    console.error("별자리 선 데이터 조회 실패:", error);
    throw error;
  }
};

// 별자리 데이터 수정
const updateConstellation = async (constellationId, lines) => {
  const jwt = localStorage.getItem("accessToken");

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .put(`/constellation/${constellationId}/update`, lines);
    return response.data;
  } catch (error) {
    console.error("별자리 수정 실패:", error);
    throw error;
  }
};

// 별자리 삭제
const deleteConstellation = async (constellationId) => {
  const jwt = localStorage.getItem("accessToken");

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .delete(`/constellation/${constellationId}`);
    return response.data;
  } catch (error) {
    console.error("별자리 삭제 실패:", error);
    throw error;
  }
};

export default {
  generateConstellation,
  uploadUserConstellation,
  getUserConstellations,
  getConstellationLines,
  updateConstellation,
  deleteConstellation,
};
