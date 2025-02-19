import useAxiosInstance from "./useAxiosInstance";

// 전체 유저 TOP 5 해시태그 조회 API
// get
const getTopHashtags = async () => {
  const jwt = localStorage.getItem("accessToken");

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .get("/diary/hashtags/top5");

    return response;
  } catch (e) {
    return e.response;
  }
};

export default {
  getTopHashtags,
};
