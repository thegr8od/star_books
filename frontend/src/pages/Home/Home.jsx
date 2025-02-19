import { useEffect } from "react";
import { useSelector } from "react-redux";
import HomeBackground from "./HomeBackground";
import LoginHome from "./LoginHome";
import LoadingSpinner from "../../components/LoadingSpinner";

const Home = () => {
  const user = useSelector((state) => state.user);

  // 디버깅을 위한 로그
  useEffect(() => {
    console.log("Current user state:", user);
  }, [user]);

  // 로딩 상태 확인
  if (user === undefined) {
    return <LoadingSpinner />;
  }

  // user 객체가 존재하고 isLogin이 true인 경우에만 LoginHome 표시
  return (
    <>
      {user && user.isLogin === true ? <LoginHome /> : <HomeBackground />}
    </>
  );
};

export default Home;

