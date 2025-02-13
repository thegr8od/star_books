// import { apiClient, setAuthHeader, removeAuthHeader } from "./apiClient";

// apiClient.interceptors.response.use(
//     response => response, 
//     async error => {
//         if (error.response && error.response.status === 401) {
//             try {
//                 const refreshResponse = await apiClient.post("/member/refresh");

//                 // 응답 헤더에서 새 accessToken 가져오기
//                 const newAccessToken = refreshResponse.headers["authorization"]; 

//                 if (newAccessToken) {
//                     setAuthHeader(newAccessToken); // Axios에 Authorization 헤더 설정
//                     error.config.headers["Authorization"] = newAccessToken;
//                     return apiClient.request(error.config); // 요청 다시 실행
//                 } else {
//                     throw new Error("Access token이 응답 헤더에 없음");
//                 }
//             } catch (refreshError) {
//                 console.error("토큰 갱신 실패:", refreshError);
//                 removeAuthHeader(); // Authorization 헤더 제거
//                 return Promise.reject(refreshError);
//             }
//         }
//         return Promise.reject(error);
//     }
// );
