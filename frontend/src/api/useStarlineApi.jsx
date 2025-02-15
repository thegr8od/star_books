import useAxiosInstance from "./useAxiosInstance";

// 특정 연도의 별자리 선 조회
const getYearlyStarlineCoords = (year) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = useAxiosInstance
            .authApiClient(jwt)
            .get(
                `/starline/yearly/${year}`
            );

        return response.data;
    } catch(e) {
        return e.response;
    }
}

//특정 연도/월/의 변자리 선 좌표 조회
const getMonthlyStarlineCoords = () => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = useAxiosInstance
            .authApiClient(jwt)
            .get(
                `/starline/yearly/${year}/${month}`
            );

        return response.data;
    } catch(e) {
        return e.response;
    }    
}

//특정 월의 데이터에서 새로운 데이터 추가
const updateStarlineCoords = (data) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = useAxiosInstance
            .authApiClient(jwt)
            .get(
                `/starline/update/${year}/${month}`,
                data
            );

        return response.data;
    } catch(e) {
        return e.response;
    }  
}

export default {
    getYearlyStarlineCoords,
    getMonthlyStarlineCoords,
    updateStarlineCoords,
};