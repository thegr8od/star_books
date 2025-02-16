import axios from "axios";
import { API_URL, CONTENT_TYPE_JSON } from "../constants/constants";

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": CONTENT_TYPE_JSON,
        
    },
});

const authApiClient = (token) => 
    axios.create({
        baseURL: API_URL,
        withCredentials: true,
        headers: {
          "Content-Type": CONTENT_TYPE_JSON,
          Authorization: `Bearer ${token}`,
        },
});

export default { apiClient, authApiClient };