import useAxiosInstance from "./useAxiosInstance";

//월별 나만의 우주 조회
const getMonthlyPersonalUniv = (year, month) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = useAxiosInstance
            .authApiClient(jwt)
            .get(`/universe/monthly/${year}/${month}`);
        return response.data; 
    } catch(e) {
        return e.response;
    }
}

//연도별 나만의 우주 조회
const getYearlyPersonalUniv = (year) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = useAxiosInstance
            .authApiClient(jwt)
            .get(`/universe/yearly/${year}`);
        return response.data; 
    } catch(e) {
        return e.response;
    }
}

// 특정 나만의 우주 조회
const getPersonalUniv = (universeId) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = useAxiosInstance
            .authApiClient(jwt)
            .get(`/universe/${universeId}`);
        return response.data; 
    } catch(e) {
        return e.response;
    }
}

export default{
    getMonthlyPersonalUniv,
    getYearlyPersonalUniv,
    getPersonalUniv,
}