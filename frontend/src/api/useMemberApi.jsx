import useAxiosInstance from "./useAxiosInstance";

//로그인
const loginMember = async (member) => {
    try{
        const response = await useAxiosInstance.apiClient.post(
            "/member/login",
            member,
        );

        // 백엔드 응답 헤더에서 accessToken 가져오기
        const accessToken = response.headers["authorization"];

        if (accessToken) {
            localStorage.setItem(accessToken); // Axios에 Authorization 헤더 설정
        } else {
            throw new Error("Access token이 응답 헤더에 없음");
        }

        return response.data;
    } catch(e) {
        //오류 체크
        if(e.respose.data.stauts == 404){
            return e.response.data;
        }
    }
};

//회원가입
const registerMember = async (member) => {
    try{
        console.log("api " + member);
        const response = await useAxiosInstance.apiClient.post(
            "/member",
            member,
        );
        return response;
    } catch(e) {
        //오류 체크
        if(e.respose.data.stauts == 404){
            return e.response.data;
        }
    }
};

//로그아웃
const logoutMember = async () => {
    try{
        const jwt = localStorage.getItem("accessToken");

        const response = await useAxiosInstance
            .authApiClient(jwt)
            .post("/member/logout");
        localStorage.removeItem("accessToken");

        return response.data;
    } catch(e) {
        //오류 체크
        if(e.respose.data.stauts == 404){
            return e.response.data;
        }
    }
};

//refresh token 발급
// const refreshToken = async () => {
//     try{
//         const response = await useAxiosInstance.apiClient.post(
//                 "/refresh",
//         );
//         // 백엔드 응답 헤더에서 새로운 accessToken 가져오기
//         const newToken = response.headers["authorization"];

//         if (newToken) {
//             setAuthHeader(newToken); // Axios에 Authorization 헤더 설정
//         } else {
//             throw new Error("Access token이 응답 헤더에 없음");
//         }

//     } catch(e) {
//         if(e.respose.data.stauts == 404){
//             return e.response.data;
//         }
//     }
// };

//유저 정보 가져오기
const getUserInfo = async () => {
    try{
        const jwt = localStorage.getItem("accessToken");

        const response = await useAxiosInstance
            .authApiClient(jwt)
            .get("/member/detail");
        return response.data;
    } catch(e) {
        //오류 체크
        if(e.respose.data.stauts == 404){
            return e.response.data;
        }
    }
};

//프로필 이미지 업로드
const uploadProfileImage = async () => {
    try{
        const jwt = localStorage.getItem("accessToken");

        const response = await useAxiosInstance
            .authApiClient(jwt)
            .post("/member/logout");
        return response.data;
    } catch(e) {
        //오류 체크
        if(e.respose.data.stauts == 404){
            return e.response.data;
        }
    }
};

//중복 이메일 체크
const checkEmail = async (email) => {
    try{
        const response = await useAxiosInstance.post(
            "/member/check-email",
            email,
        );
        return response.data;
    } catch(e) {
        //오류 체크
        if(e.respose.data.stauts == 404){
            return e.response.data;
        }
    }
};

//중복 닉네임 체크
const checkNickname = async (nicknmae) => {
    try{
        const response = await useAxiosInstance.post(
            "",
            nicknmae,
        );
        return response.data;
    } catch(e) {
        //오류 체크
        if(e.respose.data.stauts == 404){
            return e.response.data;
        }
    }
}

//마이페이지 수정
const updateProfile = async () => {
    try{

    } catch(e) {

    }
};

//유저 탈퇴
// const withdrawUser = async () => {
//     try{

//     } catch(e) {

//     }
// };

export default {
    loginMember,
    registerMember,
    logoutMember,
    getUserInfo,
    // refreshToken,
    uploadProfileImage,
    updateProfile,
    // withdrawUser
};