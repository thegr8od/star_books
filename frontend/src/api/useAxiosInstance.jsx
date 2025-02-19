import axios from "axios";
import { API_URL, CONTENT_TYPE_JSON } from "../constants/constants";

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": CONTENT_TYPE_JSON,
        
    },
});

const authApiClient = (token) => {
    const instance = axios.create({
        baseURL: API_URL,
        withCredentials: true,
        headers: {
          "Content-Type": CONTENT_TYPE_JSON,
          Authorization: `Bearer ${token}`,
        },
    });

    instance.interceptors.response.use(
        response => response,
        async error => {
          const originalRequest = error.config;
          console.log(originalRequest)
    
          if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
    
            if (originalRequest.url !== "/member/refresh") { 
              // refresh API는 자체 요청
              try {
                const refreshInstance = axios.create({
                  baseURL: API_URL,
                  withCredentials: true, // 쿠키 포함
                });
                const refreshResponse = await refreshInstance.post("/member/refresh");
    
                console.log("Refresh Response:", refreshResponse.data);

                const newAccessToken = refreshResponse.data.data.accessToken;
                console.log(refreshResponse);
                localStorage.setItem('accessToken', newAccessToken);
    
                return instance(originalRequest); // 요청 재시도
              } catch (refreshError) {
                console.error("Refresh token 재발급 실패:", refreshError);
                return Promise.reject(refreshError);
              }
            }
          }
    
          return Promise.reject(error);
        }
    );

    return instance;
}

export default { apiClient, authApiClient };