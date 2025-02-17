import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HomeOutlined, PersonOutlined, EditCalendarOutlined, PublicOutlined, AutoAwesomeOutlined, LeaderboardOutlined, PodcastsOutlined, ForumOutlined, LogoutOutlined, Menu as MenuIcon, ArrowBackIos, Close, AccountCircle } from "@mui/icons-material";
import useMemberApi from "../api/useMemberApi";
import { selectUserNickname, selectUserProfileImage } from "../store/userSlice";

// 네비게이션 아이템 상수
const NAV_ITEMS = [
  { label: "홈", path: "/", icon: <HomeOutlined /> },
  { label: "마이페이지", path: "/mypage", icon: <PersonOutlined /> },
  { label: "일기", path: "/diary/calendar", icon: <EditCalendarOutlined /> },
  { label: "나의 우주", path: "/diary/stars", icon: <AutoAwesomeOutlined /> },
  { label: "우리의 우주", path: "/universe", icon: <PublicOutlined /> },
  { label: "감정 통계", path: "/universe/analysis", icon: <LeaderboardOutlined /> },
  { label: "라디오", path: "/radio/list", icon: <PodcastsOutlined /> },
  { label: "AI대화", path: "/chat", icon: <ForumOutlined /> },
];

// 헤더 컴포넌트
const Header = ({ title = "", setShowMenu }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center h-10 text-white/70">
      {/* 뒤로가기 버튼 */}
      <button onClick={() => navigate(-1)}>
        <ArrowBackIos fontSize="small" />
      </button>
      {/* 제목(선택) */}
      <p className="text-lg">{title}</p>
      {/* 메뉴 버튼 */}
      <button onClick={() => setShowMenu(true)}>
        <MenuIcon />
      </button>
    </div>
  );
};

// 프로필 컴포넌트
const ProfileSection = () => {
  const profileImage = useSelector(selectUserProfileImage);
  const nickname = useSelector(selectUserNickname);

  return (
    <div className="pt-8 pb-6 px-6 bg-[#f5f5f5]">
      <div className="flex items-center gap-4">
        {/* 프로필이미지 */}
        {profileImage ? (
          <img src={profileImage} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#8993c7] text-white">
            <AccountCircle fontSize="large" />
          </div>
        )}
        {/* 닉네임 */}
        <p className="font-medium text-black">{nickname}</p>
      </div>
    </div>
  );
};

// 메뉴 아이템 컴포넌트
const MenuItem = ({ item, onClick }) => {
  return (
    // 네비게이션 아이템 상수로 관리 (링크주소, 아이콘, 라벨명)
    <Link to={item.path} className="flex items-center gap-3 p-3 text-gray-700 rounded-full hover:bg-[#8993c7] hover:text-white transition-colors" onClick={onClick}>
      <span className="flex items-center justify-center">{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );
};

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await useMemberApi.logoutMember();
    console.log(response);
    if (response.status === "J001") {
      console.log("로그아웃 성공");
      navigate("/");
    } else {
      console.log("로그아웃 실패");
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full text-gray-700 rounded-full hover:bg-[#8993c7] hover:text-white transition-colors">
      <span className="flex items-center justify-center">
        <LogoutOutlined />
      </span>
      <span>로그아웃</span>
    </button>
  );
};

// [메인] 네비게이션 컴포넌트
const Nav = ({ profileImage = null }) => {
  const title = "";
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav>
      {/* MenuBar */}
      <Header title={title} setShowMenu={setShowMenu} />

      {/* Menu panel */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/40 z-20" onClick={() => setShowMenu(false)}>
          <div className="absolute top-0 right-0 z-30 w-64 lg:w-96 h-full flex flex-col bg-white" onClick={(e) => e.stopPropagation()}>
            {/* 닫기 버튼 */}
            <button onClick={() => setShowMenu(false)} className="absolute top-4 right-4 rounded-full text-gray-600">
              <Close />
            </button>

            {/* 프로필 */}
            <ProfileSection />

            {/* 메뉴 아이템 */}
            <ul className="p-2 flex-1">
              {NAV_ITEMS.map((item, index) => (
                <li key={index}>
                  <MenuItem item={item} onClick={() => setShowMenu(false)} />
                </li>
              ))}
            </ul>

            {/* 로그아웃 */}
            <div onClick={() => setShowMenu(false)} className="p-2 border-t">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
