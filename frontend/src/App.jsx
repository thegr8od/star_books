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

function App() {
  const noLayout = location.pathname === "/" || location.pathname === "/universe" || location.pathname.startsWith("/constellation/detail/"); // 홈 페이지 여부 확인
  return (
    <>
      <div className={noLayout ? "" : "flex min-h-screen bg-gradient-to-b from-[#000054] to-[#010121]"}>
        {!noLayout && <BackgroundStar />}
        <Routes>
          {/* Auth 관련 */}
          <Route path="" element={<Home />} />
          <Route path="/oauth/redirect" element={<SocialRedirect />} />
          <Route path="signup" element={<SignUp />} />
          {/* MyPage 관련 */}
          <Route path="mypage" element={<MyPage />} />
          <Route path="mypage/edit" element={<ProfileEdit />} />
          {/* Universe 관련 */}
          <Route path="universe" element={<Universe />} />
          <Route path="universe/analysis" element={<UniverseAnalysis />} />
          {/* Radio 관련 */}
          <Route path="radio/list" element={<RadioList />} />
          <Route path="radio/:id" element={<RadioShow />} />
          {/* Diary 관련 */}
          <Route element={<Diary />}>
            <Route path="diary/calendar" element={<DiaryCalendar />} />
            <Route path="diary/stars" element={<DiaryStars />} />
          </Route>
          {/* 별 보기 추가 */}
          <Route path="diary/monthly/:year/:month" element={<MonthlyDiary />} />
          <Route path="diary/write" element={<DiaryWrite />} />
          <Route path="diary/edit/:id" element={<DiaryWrite />} />
          {/* Constellation 관련 */}
          <Route path="constellation/detail/:year" element={<ConstellationDetail />} />
          {/* AI 채팅 관련 */}
          <Route path="chat" element={<AiChat />} />
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
