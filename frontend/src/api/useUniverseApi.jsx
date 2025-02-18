import useAxiosInstance from "./useAxiosInstance";

//월별 나만의 우주 조회
//get
const getMonthlyPersonalUniv = async (data) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get(`/universe/monthly/${data.year}/${data.month}`);
        return response.data; 
    } catch(e) {
        return e.response;
    }
};

//연도별 나만의 우주 조회
//get
const getYearlyPersonalUniv = async (data) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get(`/universe/yearly/${data.year}`);
        return response.data; 
    } catch(e) {
        return e.response;
    }
};

// 특정 나만의 우주 조회
//get
const getPersonalUniv = async (data) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get(`/universe/${data.universeId}`);
        return response.data; 
    } catch(e) {
        return e.response;
    }
};

// 별 위치 업데이트
// post
const updatePersonalUniv = async (data) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .post(`/universe/bulk`, data);
        return response.data; 
    } catch(e) {
        return e.response;
    }
};

export default{
    getMonthlyPersonalUniv,
    getYearlyPersonalUniv,
    getPersonalUniv,
};