import useAxiosInstance from "./useAxiosInstance";

//기존 역할 확인 API
//post
const getRole = async (data) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .post(
                "/radio/endBroadcast",
                data
            )
        return response;
    } catch(e) {
        return e.response;
    }
}

//LiveKit 토큰 생성 API
//post
const createToken = async (data) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .post(
                "/radio/endBroadcast",
                data
            )
        return response;
    } catch(e) {
        return e.response;
    }
}

//방송종료 API
//post
const closeBroadcast = async (data) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .post(
                "/radio/endBroadcast",
                data
            )
        return response;
    } catch(e) {
        return e.response;
    }
}


//방송상태
//get
const getBroadcastStatus = async (roomName) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get(
                `/radio/broadcastStatus?roomName=${roomName}`,
            )
        return response;
    } catch(e) {
        return e.response;
    }
}

//방송리스트
//get
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
//post
const updateParticipants = async (data) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .post(
                "/radio/updateParticipants",
                data
            )
        return response;
    } catch(e) {
        return e.response;
    }
}

//reaction 생성
//get
const getReactions = async (roomName) => {
    const jwt = localStorage.getItem("accessToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get(
                `/radio/reactions?roomName=${roomName}`
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