import { use } from "react";
import useAxiosInstance from "./useAxiosInstance";

const chat = (email, message, persona) => {
    const jwt = localStorage.getItem("accessToken");

    try {
        const response = useAxiosInstance
            .authApiClient(jwt)
            .post(
                '/chat/message',
                {   
                    email,
                    message,
                    persona
                }
            );

        return response;
    } catch(e) {
        return e.response;
    }
}

const getHistory = (email) => {
    const jwt = localStorage.getItem("accessToken");

    try {
        const response = useAxiosInstance
            .authApiClient(jwt)
            .get(
                `/chat/history?email=${email}`,
            );

        return response;
    } catch(e) {
        return e.response;
    }
}

export default {
    chat,
    getHistory
};