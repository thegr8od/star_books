import useAxiosInstance from "./useAxiosInstance";

//다이러리 생성
const createEmptyDiary = async () => {
    const jwt = localStorage.getItem("accesToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .post(
                "/diary/create"
            );
        return response;
    } catch (e) {
        return e.response.status;
    }
}

/**
 * 해쉬태그 생성 및 강정 분석
 * diary
 */
const addHashtagsAndAnalyzeEmotion = async (diaryId, hashtag) => {
    const jwt = localStorage.getItem("accesToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .post(
                `/diary/${diaryId}/hashtag`,
                { "hashtags": hashtag }
            );
        return response;
    } catch (e) {
        return e.response.status;
    }
}

//다이어리 내용 입력
const addDiaryContent = async (diaryId, title, content, img) => {
    const jwt = localStorage.getItem("accesToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .post(
                `/diary/${diaryId}/content`,
                {
                    title,
                    content,
                    "imageUrls":img
                }
            );
        return response;
    } catch (e) {
        return e.response.status;
    }
}

//다이어리 수정
const updateContent = async (diaryId, title, content, img) => {
    const jwt = localStorage.getItem("accesToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .put(
                `/diary/${diaryId}/content`,
                {
                    title,
                    content,
                    "imageUrls":img
                }
            );
        return response;
    } catch (e) {
        return e.response.status;
    }
}

//다이어리 조회
const getDiary = async (diaryId) => {
    const jwt = localStorage.getItem("accesToken");

    try{
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get(
                `/diary/${diaryId}`
            );
        return response;
    } catch (e) {
        return e.response.status;
    }
}

//다이어리 삭제
const deleteDiary = async (diaryId) => {
    const jwt = localStorage.getItem("accesToken");

    try {
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .delete(
                `/diary/${diaryId}`
            );

        return response;
    } catch(e) {
        return e.response;
    }
}

//연도별 다이어리 조회
const getDiariesDyYear = async (targetYear) => {
    const jwt = localStorage.getItem("accesToken");

    try {
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get(
                `/diary/year/${targetYear}`
            );

        return response;
    } catch(e) {
        return e.response;
    }
}

const getDiariesByMonth = async (targetYear, targeMonth) => {
    const jwt = localStorage.getItem("accesToken");

    try {
        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get(
                `/diary/year/${targetYear}/month/${targeMonth}`
            );

        return response;
    } catch(e) {
        return e.response;
    }
}

export default {
    createEmptyDiary,
    addHashtagsAndAnalyzeEmotion,
    addDiaryContent,
    updateContent,
    getDiary,
    deleteDiary,
    getDiariesDyYear,
    getDiariesByMonth,
}