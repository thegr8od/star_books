import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import Layout from "../../components/Layout";
import MypageBarChart from "./MypageBarChart";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Mypage() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("월");

  // 수정 페이지로 이동
  const handleEditClick = () => {
    navigate("/mypage/edit");
  };

  const handleMyUniverseClick = () => {
    navigate("/diary/calendar");
  };

  const handleGalleryClick = () => {
    navigate("/constellation/gallery");
  };

  // 통계 그래프 기간 선택
  const handlePeriodClick = (period) => {
    setSelectedPeriod(period);
  };
  return (
    <>
      <Layout>
        <div className="text-white mt-10">
          {/* 프로필 */}
          <div className="border-b-[1px] border-gray-500 pb-8">
            <div className="flex items-center gap-6">
              {/* 프로필 이미지 */}
              <div className="">
                {user.profileImagePath ? (
                  <img
                    src={user.profileImagePath}
                    alt="프로필"
                    className="w-20 h-20 md:w-24 md:h-24 lg:w-30 lg:h-30 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 lg:w-30 lg:h-30 rounded-full bg-[#8993c7] flex justify-center items-center">
                    <PersonOutlineOutlinedIcon
                      sx={{
                        fontSize: {
                          xs: 55, // 모바일
                          md: 60, // 태블릿
                          lg: 65, // 데스크탑
                        },
                      }}
                      className="text-white"
                    />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold">{user.nickname}</h1>
                  <div
                    className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-gray-200 flex justify-center items-center opacity-70 cursor-pointer hover:opacity-100 transition-opacity"
                    onClick={handleEditClick}
                  >
                    <CreateOutlinedIcon
                      className="text-gray-700"
                      sx={{
                        fontSize: {
                          xs: 15, // 모바일
                          md: 22, // 태블릿
                          lg: 26, // 데스크탑
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 나의 글 */}
          <div className="mt-12">
            <h1 className="text-xl font-bold mb-6">나의 글</h1>
            <div className="bg-white bg-opacity-70 hover:bg-opacity-90 rounded-xl shadow-lg px-6 py-12 border border-white/70">
              <div className="flex justify-between items-center">
                <div
                  className="text-center flex-1"
                  onClick={handleMyUniverseClick}
                >
                  <p className="text-4xl font-bold text-black mb-4">10</p>
                  <p className="text-sm text-gray-600">나의 우주</p>
                </div>
                <div className="w-px h-20 bg-gray-300"></div>
                <div
                  className="text-center flex-1"
                  onClick={handleGalleryClick}
                >
                  <p className="text-4xl font-bold text-black mb-4">1</p>
                  <p className="text-sm text-gray-600">나의 별자리</p>
                </div>
              </div>
            </div>
          </div>

          {/* 내 감정 통계 */}
          <hr className="mt-12 border-gray-500" />
          <div className="mt-12">
            <h1 className="text-xl font-bold mb-6">내 감정 통계</h1>
            <div className="flex gap-2 justify-end mb-3">
              {["월", "년", "전체"].map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodClick(period)}
                  className={`px-1 py-1 transition-colors ${
                    selectedPeriod === period
                      ? "text-white font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
            <MypageBarChart />
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Mypage;
