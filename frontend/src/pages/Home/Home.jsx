import Login from "../Auth/Login";
function Home() {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="pt-[150px] flex flex-col items-center">
          <h1 className="text-2xl font-medium text-white/75 mb-2">별에 별 일</h1>
          <p className="text-sm font-thin text-white/50 ">하늘에 담은 당신의 이야기</p>
        </div>
        <Login/>
      </div>
    );
  }
  
  export default Home