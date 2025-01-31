import './App.css'
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom'; //상위 메뉴 누르면 먼저 보일 하위 페이지지 설정
import Layout from './components/Layout';
import { Home, Login, SignUp } from './pages/Auth';
import { ConstellationCreate, ConstellationDetail, ConstellationGallery } from './pages/Constellation';
import { DiaryCalendar, DiaryEdit, DiaryStars, DiaryWrite, MonthlyDiary } from './pages/Diary';
import { MyPage, ProfileEdit } from './pages/MyPage';
import { RadioList, RadioShow } from './pages/Radio';
import { Universe, UniverseAnalysis } from './pages/Universe';

function App() {

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-[#000054] to-[#010121]">
      <Routes>
      <Route path="/starbooks" element={<Layout />}>
        {/* Auth 관련 */}
        <Route path="" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />

        {/* MyPage 관련 */}
        <Route path="mypage">
          <Route path=":id" element={<MyPage />} />
          <Route path=":id/edit" element={<ProfileEdit />} />
        </Route>

        {/* Universe 관련 */}
        <Route path="universe">
          <Route index element={<Universe />} />
          <Route path="analysis" element={<UniverseAnalysis />} />
        </Route>

        {/* Radio 관련 */}
        <Route path="radio">
          <Route path=":id" element={<RadioShow />} />
          <Route path="list" element={<RadioList />} />
        </Route>

        {/* Diary 관련 */}
        <Route path="diary">
          <Route index element={<Navigate to="calendar" />}/>
          <Route path="write" element={<DiaryWrite />} />
          <Route path="edit/:id" element={<DiaryEdit />} />
          <Route path="calendar" element={<DiaryCalendar />} />
          <Route path="monthly/:month" element={<MonthlyDiary />} />\
          <Route path="stars" element={<DiaryStars />} />  {/* 별 보기 추가 */}
        </Route>

        {/* Constellation 관련 */}
        <Route path="constellation">
          <Route path="create" element={<ConstellationCreate />} />
          <Route path="gallery/:year" element={<ConstellationGallery />} />
          <Route path="gallery/:year/detail" element={<ConstellationDetail />} />
        </Route>
      </Route>
    </Routes>
    </div>

  )
}

export default App
