import useAxiosInstance from "./useAxiosInstance";

//월별 나만의 우주 조회
const getMonthlyPersonalUniv = async (year, month) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get(`/universe/monthly/${year}/${month}`);
        return response.data; 
    } catch(e) {
        return e.response;
    }
};

//연도별 나만의 우주 조회
const getYearlyPersonalUniv = async (year) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get(`/universe/yearly/${year}`);
        return response.data; 
    } catch(e) {
        return e.response;
    }
};

// 특정 나만의 우주 조회
const getPersonalUniv = async (universeId) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get(`/universe/${universeId}`);
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