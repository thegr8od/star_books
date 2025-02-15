import { use } from "react";
import useAxiosInstance from "./useAxiosInstance";

const chat = async (email, message, persona) => {
    const jwt = localStorage.getItem("accessToken");

    try {
        const response = await useAxiosInstance
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

const getHistory = async (email) => {
    const jwt = localStorage.getItem("accessToken");

    try {
        const response = await useAxiosInstance
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