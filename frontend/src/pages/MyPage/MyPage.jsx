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

  // 수정 페이지로 이동
  const handleEditClick = () => {
    navigate("/mypage/edit");
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

          {/* 내 감정 통계 */}
          <div className="mt-10">
            <h1 className="text-xl font-bold mb-6">내 감정 통계</h1>
            <MypageBarChart />
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Mypage;
