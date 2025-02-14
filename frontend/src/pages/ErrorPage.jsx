import Layout from "../components/Layout";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import errorImage from "/images/errorImage.png";

function ErrorPage(title = "404 ERROR", message, customStyle) {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 ">
        <div className="space-y-10">
          <div className="w-40 h-40 mx-auto">
            <img src={errorImage} alt="에러이미지" />
          </div>
          {/* 잘못된 접근했을 때도 이 페이지 사용할 수 있도록 수정 */}
          <h1 className="text-[50px] font-bold text-white">{title}</h1>
          <div className={`space-y-4 text-white ${customStyle}`}>
            {message || (
              <div>
                <p>죄송합니다. 페이지를 찾을 수 없습니다.</p>
                <p>존재하지 않는 주소를 입력하셨거나</p>
                <p>요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.</p>
              </div>
            )}
          </div>
          <Button
            text={"홈으로"}
            type={"DEFAULT"}
            onClick={goHome}
            className="py-3 px-10"
          />
        </div>
      </div>
    </Layout>
  );
}

export default ErrorPage;
