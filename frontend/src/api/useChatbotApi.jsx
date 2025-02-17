import useAxiosInstance from "./useAxiosInstance";

const chat = async (data) => {
    const jwt = localStorage.getItem("accessToken");

    try {
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .post(
                '/chat/message',
                data
            );

        return response;
    } catch(e) {
        return e.response;
    }
}

const getHistory = async (data) => {
    const jwt = localStorage.getItem("accessToken");

    try {
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get(
                `/chat/history?email=${data.email}`,
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