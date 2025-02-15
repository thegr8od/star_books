import useAxiosInstance from "./useAxiosInstance";

//기존 역할 확인 API
const getRole = async (roomName, participantName) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .post(
                "/radio/endBroadcast",
                {participantName, roomName}
            )
        return response;
    } catch(e) {
        return e.response;
    }
}

//LiveKit 토큰 생성 API
const createToken = async (roomName, participantName) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .post(
                "/radio/endBroadcast",
                {participantName, roomName}
            )
        return response;
    } catch(e) {
        return e.response;
    }
}

//방송종료 API
const closeBroadcast = async (roomName, participantName) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .post(
                "/radio/endBroadcast",
                {participantName, roomName}
            )
        return response;
    } catch(e) {
        return e.response;
    }
}


//방송상태
const getBroadcastStatus = async (roomName) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get(
                "/radio/broadcastStatus",
            )
        return response;
    } catch(e) {
        return e.response;
    }
}

//방송리스트
const getLiveBroadcasts = async () => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get(
                "/radio/list",
            )
        return response;
    } catch(e) {
        return e.response;
    }
}

//참가자 수 업데이트
const updateParticipants = async (roomName, action) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .post(
                "/radio/updateParticipants",
                {roomName, action},
            )
        return response;
    } catch(e) {
        return e.response;
    }
}

//reaction 생성
const getReactions = async (roomName) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get(
                "/radio/reactions",
                {roomName}
            )
        return response;
    } catch(e) {
        return e.response;
    }
}

export default{
    getRole,
    createToken,
    closeBroadcast,
    getBroadcastStatus,
    getLiveBroadcasts,
    updateParticipants,
    getReactions,
};