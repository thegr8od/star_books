import useAxiosInstance from "./useAxiosInstance";

//다이러리 생성
//post
const createEmptyDiary = async () => {
  const jwt = localStorage.getItem("accessToken");

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .post("/diary/create");
    return response.data;
  } catch (e) {
    return e.response.status;
  }
};

/**
 * 해쉬태그 생성 및 강정 분석
 * diary
 * post
 */
const addHashtagsAndAnalyzeEmotion = async (diaryId, data) => {
  const jwt = localStorage.getItem("accessToken");

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .post(`/diary/${diaryId}/hashtag`, data);
    return response.data;
  } catch (e) {
    return e.response.status;
  }
};

//다이어리 내용 입력
//post
const addDiaryContent = async (diaryId, data) => {
  const jwt = localStorage.getItem("accessToken");

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .post(`/diary/${diaryId}/content`, data);
    return response.data;
  } catch (e) {
    return e.response.status;
  }
};

// 이미지 업로드
//post
const uploadImage = async (file) => {
  const jwt = localStorage.getItem("accessToken");

  // FormData 객체 생성
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .post("/diary/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    return response.data;
  } catch (e) {
    if (e.response.status === 400) {
      throw new Error(e.response.data.error);
    } else if (e.response.status === 500) {
      throw new Error("서버 오류가 발생했습니다.");
    }
    return e.response.status;
  }
};

//다이어리 수정
//put
const updateContent = async (diaryId, data) => {
  const jwt = localStorage.getItem("accessToken");

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .put(`/diary/${diaryId}/content`, data);
    return response.data;
  } catch (e) {
    return e.response.status;
  }
};

//다이어리 조회
//get
const getDiary = async (diaryId) => {
  const jwt = localStorage.getItem("accessToken");

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .get(`/diary/${diaryId}`);
    return response.data;
  } catch (e) {
    return e.response.status;
  }
};

//다이어리 삭제
//delete
const deleteDiary = async (diaryId) => {
  const jwt = localStorage.getItem("accessToken");

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .delete(`/diary/${diaryId}`);

    return response.data;
  } catch (e) {
    return e.response;
  }
};

//연도별 다이어리 조회
//get
const getDiariesByYear = async (data) => {
  const jwt = localStorage.getItem("accessToken");

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .get(`/diary/year/${data.targetYear}`);

    return response.data;
  } catch (e) {
    return e.response;
  }
};

//해당연도의 해당 달의 diary 데이터 받기
//get
const getDiariesByMonth = async (data) => {
  const jwt = localStorage.getItem("accessToken");

  try {
    const response = await useAxiosInstance
      .authApiClient(jwt)
      .get(`/diary/year/${data.targetYear}/month/${data.targetMonth}`);

    return response.data;
  } catch (e) {
    return e.response;
  }
};

export default {
  createEmptyDiary,
  addHashtagsAndAnalyzeEmotion,
  addDiaryContent,
  uploadImage,
  updateContent,
  getDiary,
  deleteDiary,
  getDiariesByYear,
  getDiariesByMonth,
};