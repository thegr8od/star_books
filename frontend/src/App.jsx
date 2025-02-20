import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import ConstellationDetail from "./pages/Constellation/ConstellationDetail";
import DiaryStars from "./pages/Diary/DiaryStars";
import DiaryWrite from "./pages/Diary/DiaryWrite";
import MonthlyDiary from "./pages/Diary/MonthlyDiary";
import MyPage from "./pages/MyPage/MyPage";
import ProfileEdit from "./pages/MyPage/ProfileEdit";
import RadioList from "./pages/Radio/RadioList";
import RadioShow from "./pages/Radio/RadioShow";
import Universe from "./pages/Universe/Universe";
import UniverseAnalysis from "./pages/Universe/UniverseAnalysis";
import ColorTest from "./components/ColorTest";
import Cursor from "./components/Cursor";
import BackgroundStar from "./components/BackgroundStar";
import ErrorPage from "./pages/ErrorPage";
import SocialRedirect from "./pages/Auth/SocialRedirect";
import AiChat from "./pages/AiChat/AiChat";
import DiaryCalendar from "./pages/Diary/DiaryCalendar";
import Diary from "./pages/Diary/Diary";
import ConstellationAi from "./pages/Constellation/ConstellationAi";
import Radio from "./pages/Radio/Radio";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useMemberApi from "./api/useMemberApi";
import { setUser, clearUser } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const response = await useMemberApi.getMemberMY();
          
          if (response?.data?.data) {
            dispatch(
              setUser({
                ...response.data.data,
                isLogin: true,
              })
            );
          } else {
            throw new Error("Invalid response");
          }
        }
      } catch (error) {
        console.error("인증 에러:", error);
        localStorage.removeItem("accessToken");
        dispatch(clearUser());
      }
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <>
      <div className="flex min-h-screen w-screen bg-gradient-to-b from-[#000054] to-[#010121]">
        <BackgroundStar />
        <Routes>
          {/* Auth 관련 */}
          <Route path="" element={<Home />} />
          <Route path="/oauth/redirect" element={<SocialRedirect />} />
          <Route path="signup" element={<SignUp />} />

          <Route element={<PrivateRoute />}>
            {/* MyPage 관련 */}
            <Route path="mypage" element={<MyPage />} />
            <Route path="mypage/edit" element={<ProfileEdit />} />
            {/* Universe 관련 */}
            <Route path="universe" element={<Universe />} />
            <Route path="universe/analysis" element={<UniverseAnalysis />} />
            {/* Radio 관련 */}
            <Route path="radio" element={<Radio />} />
            <Route path="radio/list" element={<RadioList />} />
            <Route path="radio/:id" element={<RadioShow />} />
            {/* Diary 관련 */}
            <Route element={<Diary />}>
              <Route path="diary/calendar" element={<DiaryCalendar />} />
              <Route path="diary/stars" element={<DiaryStars />} />
            </Route>
            {/* 별 보기 추가 */}
            <Route path="diary/monthly" element={<MonthlyDiary />} />
            <Route path="diary/write" element={<DiaryWrite />} />
            <Route path="diary/edit/:id" element={<DiaryWrite />} />
            {/* Constellation 관련 */}
            <Route path="constellation/detail/:year" element={<ConstellationDetail />} />
            <Route path="constellation/ai/gallery" element={<ConstellationAi />} />
            {/* AI 채팅 관련 */}
            <Route path="chat" element={<AiChat />} />
          </Route>

          {/* TEST용 */}
          <Route path="color" element={<ColorTest />} />
          {/* 에러페이지 */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
      <Cursor />
    </>
  );
}

export default App;
