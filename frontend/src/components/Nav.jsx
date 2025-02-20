import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { HomeOutlined, PersonOutlined, EditCalendarOutlined, PublicOutlined, AutoAwesomeOutlined, LeaderboardOutlined, ForumOutlined, LogoutOutlined, Menu as MenuIcon, ArrowBackIos, Close, AccountCircle, InsightsOutlined } from "@mui/icons-material";
import useMemberApi from "../api/useMemberApi";
import { selectUserNickname, selectUserProfileImage, clearUser } from "../store/userSlice";

// 네비게이션 아이템 상수
const NAV_ITEMS = [
  { label: "홈", path: "/", icon: <HomeOutlined /> },
  { label: "마이페이지", path: "/mypage", icon: <PersonOutlined /> },
  { label: "일기", path: "/diary/calendar", icon: <EditCalendarOutlined /> },
  { label: "나의 우주", path: "/diary/stars", icon: <AutoAwesomeOutlined /> },
  { label: "우리의 우주", path: "/universe", icon: <PublicOutlined /> },
  {
    label: "감정 통계",
    path: "/universe/analysis",
    icon: <LeaderboardOutlined />,
  },
  { label: "AI 채팅", path: "/chat", icon: <ForumOutlined /> },
  {
    label: "AI 별자리",
    path: "/constellation/ai/gallery",
    icon: <InsightsOutlined />,
  },
];

// 헤더 컴포넌트
const Header = ({
  title = "",
  setShowMenu,
  backButton,
  noShow,
  showLeft = true, // 왼쪽 버튼 표시 여부
  showRight = true, // 오른쪽 버튼 표시 여부
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center h-10 text-white/70">
      {/* 왼쪽 버튼 (뒤로가기) */}
      {showLeft &&
        (backButton ? (
          <button onClick={() => navigate(-1)}>
            <ArrowBackIos fontSize="small" />
          </button>
        ) : noShow ? null : (
          <button onClick={() => navigate("/")}>
            <ArrowBackIos fontSize="small" />
          </button>
        ))}
      {!showLeft && <div className="w-6" />} {/* 왼쪽 여백 유지 */}
      {/* 제목 */}
      <p className="text-lg">{title}</p>
      {/* 오른쪽 버튼 (메뉴) */}
      {showRight ? (
        <button onClick={() => setShowMenu(true)}>
          <MenuIcon />
        </button>
      ) : (
        <div className="w-6" /> /* 오른쪽 여백 유지 */
      )}
    </div>
  );
};

// 프로필 컴포넌트
const ProfileSection = () => {
  const profileImage = useSelector(selectUserProfileImage);
  const nickname = useSelector(selectUserNickname);

  return (
    <div className="pt-10 pb-9 px-6 bg-gradient-to-br from-[#1a237e] to-[#534bae]">
      <div className="flex items-center gap-4">
        {/* 프로필이미지 */}
        {profileImage ? (
          <div className="size-14 rounded-full p-[2px] bg-gradient-to-r from-purple-400 to-pink-300">
            <img src={profileImage} alt="Profile" className="size-full rounded-full object-cover" />
          </div>
        ) : (
          <div className="size-14 rounded-full flex items-center justify-center bg-[#8993c7] text-white">
            <AccountCircle fontSize="large" />
          </div>
        )}
        {/* 닉네임 - 텍스트 색상 변경 */}
        <p className="font-medium text-white/90">{nickname}</p>
      </div>
    </div>
  );
};

// 메뉴 아이템 컴포넌트
const MenuItem = ({ item, onClick }) => {
  return (
    <Link to={item.path} className="flex items-center gap-3 p-3 text-gray-700 rounded-2xl hover:bg-gradient-to-r from-[#1a237e]/10 to-[#534bae]/10 hover:text-[#1a237e] transition-all duration-300" onClick={onClick}>
      <span className="flex items-center justify-center">{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );
};

const LogoutButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const response = await useMemberApi.logoutMember();
    console.log(response);
    console.log("로그아웃 성공");
    dispatch(clearUser());
    navigate("/");
  };

  return (
    <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full text-gray-700 rounded-2xl hover:bg-gradient-to-r from-[#1a237e]/10 to-[#534bae]/10 hover:text-[#1a237e] transition-all duration-300">
      <span className="flex items-center justify-center">
        <LogoutOutlined />
      </span>
      <span>로그아웃</span>
    </button>
  );
};

// [메인] 네비게이션 컴포넌트
const Nav = ({ backButton, noShow, showLeft = true, showRight = true }) => {
  const title = "";
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav>
      {/* MenuBar */}
      <Header title={title} setShowMenu={setShowMenu} backButton={backButton} noShow={noShow} showLeft={showLeft} showRight={showRight} />

      {/* Menu panel */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/30 z-20" onClick={() => setShowMenu(false)}>
          <div className="absolute top-0 right-0 z-30 w-64 lg:w-96 h-full flex flex-col bg-gradient-to-br from-white to-gray-50 shadow-2xl animate-slideIn" onClick={(e) => e.stopPropagation()}>
            {/* 닫기 버튼 */}
            <button onClick={() => setShowMenu(false)} className="absolute top-4 right-4 p-1.5 rounded-full text-white bg-[#1a237e]/80 hover:bg-[#1a237e] transition-colors z-10">
              <Close />
            </button>

            {/* 프로필 */}
            <div className="relative">
              <ProfileSection />
              {/* 프로필 섹션 아래 그라데이션 효과 */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent"></div>
            </div>

            {/* 메뉴 아이템 */}
            <ul className="p-3 flex-1 space-y-1 bg-white">
              {NAV_ITEMS.map((item, index) => (
                <li key={index}>
                  <MenuItem item={item} onClick={() => setShowMenu(false)} />
                </li>
              ))}
            </ul>

            {/* 로그아웃 */}
            <div onClick={() => setShowMenu(false)} className="p-3 border-t-2 border-gray-300 bg-white">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
