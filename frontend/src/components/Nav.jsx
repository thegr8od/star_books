import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HomeOutlined, PersonOutlined, EditCalendarOutlined, PublicOutlined, AutoAwesomeOutlined, LeaderboardOutlined, PodcastsOutlined, ForumOutlined, LogoutOutlined, Menu as MenuIcon, ArrowBackIos, Close, AccountCircle } from "@mui/icons-material";

// 네비게이션 아이템 상수
const NAV_ITEMS = [
  { label: "홈", path: "", icon: <HomeOutlined /> },
  { label: "마이페이지", path: "", icon: <PersonOutlined /> },
  { label: "일기", path: "", icon: <EditCalendarOutlined /> },
  { label: "나의 우주", path: "", icon: <AutoAwesomeOutlined /> },
  { label: "우리의 우주", path: "", icon: <PublicOutlined /> },
  { label: "감정 통계", path: "", icon: <LeaderboardOutlined /> },
  { label: "라디오", path: "", icon: <PodcastsOutlined /> },
  { label: "AI대화", path: "", icon: <ForumOutlined /> },
];

// 헤더 컴포넌트
const Header = ({ title = "", setShowMenu }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center h-10 text-white/70">
      <button onClick={() => navigate(-1)}>
        <ArrowBackIos fontSize="small" />
      </button>
      <p className="text-lg">{title}</p>
      <button onClick={() => setShowMenu(true)}>
        <MenuIcon />
      </button>
    </div>
  );
};

// 프로필 이미지 컴포넌트
const ProfileImage = ({ profileImage }) => {
  if (profileImage) {
    return <img src={profileImage} alt="Profile" className="w-12 h-12 rounded-full object-cover" />;
  }

  return (
    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#8993c7] text-white">
      <AccountCircle fontSize="large" />
    </div>
  );
};

// 프로필 섹션 컴포넌트
const ProfileSection = ({ profileImage, nickname }) => {
  // const { profileImage, nickname } = useSelector((state) => state.user);

  return (
    <div className="pt-8 pb-6 px-6 bg-[#f5f5f5]">
      <div className="flex items-center gap-4">
        <ProfileImage profileImage={profileImage} />
        <p className="font-medium text-black">{nickname}</p>
      </div>
    </div>
  );
};

// 메뉴 아이템 컴포넌트
const MenuItem = ({ item, onClick }) => {
  return (
    <Link to={item.path} className="flex items-center gap-3 p-3 text-gray-700 rounded-full hover:bg-[#8993c7] hover:text-white transition-colors" onClick={onClick}>
      <span className="flex items-center justify-center">{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );
};

// [메인] 네비게이션 컴포넌트
const Nav = ({ title = "", profileImage = null }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav>
      <Header title={title} setShowMenu={setShowMenu} />

      {showMenu && (
        <div className="fixed inset-0 bg-black/40 z-20" onClick={() => setShowMenu(false)}>
          <div className="absolute top-0 right-0 z-30 w-64 lg:w-1/3 h-full flex flex-col bg-white" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowMenu(false)} className="absolute top-4 right-4 rounded-full text-gray-600">
              <Close />
            </button>

            <ProfileSection profileImage={profileImage} nickname="Sophie Rose" />

            <ul className="p-2 flex-1">
              {NAV_ITEMS.map((item, index) => (
                <li key={index}>
                  <MenuItem item={item} onClick={() => setShowMenu(false)} />
                </li>
              ))}
            </ul>

            <div className="p-2 border-t">
              <MenuItem
                item={{
                  label: "로그아웃",
                  path: "/logout",
                  icon: <LogoutOutlined />,
                }}
                onClick={() => setShowMenu(false)}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
