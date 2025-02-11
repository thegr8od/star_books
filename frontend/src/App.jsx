import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import ConstellationDetail from "./pages/Constellation/ConstellationDetail";
import Diary from "./pages/Diary/Diary";
import DiaryEdit from "./pages/Diary/DiaryEdit";
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

function App() {
  const isHome = location.pathname === "/"; // 홈 페이지 여부 확인
  return (
    <>
      <div
        className={
          isHome
            ? ""
            : "min-h-screen w-screen bg-gradient-to-b from-[#000054] to-[#010121] p-4"
        }
      >
        {!isHome && <BackgroundStar />}
        <Routes>
          {/* Auth 관련 */}
          <Route path="" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          {/* MyPage 관련 */}
          <Route path="mypage/:id" element={<MyPage />} />
          <Route path="mypage/:id/edit" element={<ProfileEdit />} />
          {/* Universe 관련 */}
          <Route path="universe" element={<Universe />} />
          <Route path="universe/analysis" element={<UniverseAnalysis />} />
          {/* Radio 관련 */}
          <Route path="radio/:id" element={<RadioShow />} />
          <Route path="radio/list" element={<RadioList />} />
          {/* Diary 관련 */}
          <Route path="diary/write" element={<DiaryWrite />} />
          <Route path="diary/edit/:id" element={<DiaryEdit />} />
          <Route path="diary/calendar" element={<Diary />} />
          <Route path="diary/monthly/:month" element={<MonthlyDiary />} />\
          <Route path="diary/stars" element={<DiaryStars />} />{" "}
          {/* 별 보기 추가 */}
          {/* Constellation 관련 */}
          <Route
            path="constellation/detail/:year"
            element={<ConstellationDetail />}
          />
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
