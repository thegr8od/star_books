import useAxiosInstance from "./useAxiosInstance";

// 특정 연도의 별자리 선 조회
// get
const getYearlyStarlineCoords = async (data) => {
  const jwt = localStorage.getItem("accessToken");

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .get(`/starline/yearly/${data.year}`);

    return response.data;
  } catch (e) {
    return e.response;
  }
};

//특정 연도/월/의 변자리 선 좌표 조회
// get
const getMonthlyStarlineCoords = async (data) => {
  const jwt = localStorage.getItem("accessToken");

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .get(`/starline/monthly/${data.year}/${data.month}`);

    return response.data;
  } catch (e) {
    return e.response;
  }
};

//특정 월의 데이터에서 새로운 데이터 추가
//get
const updateStarlineCoords = async (data) => {
  const jwt = localStorage.getItem("accessToken");

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .get(`/starline/update/${data.year}/${data.month}`, data);

    return response.data;
  } catch (e) {
    return e.response;
  }
};

export default {
  getYearlyStarlineCoords,
  getMonthlyStarlineCoords,
  updateStarlineCoords,
};
