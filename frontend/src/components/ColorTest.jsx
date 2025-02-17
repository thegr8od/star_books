import ColorGrid from "./ColorGrid";
import GetColor from "./GetColor";
import data from ".././data/xyData.jsx"
import DIARY_XY from ".././data/diaryxydata.jsx"

function ColorTest() {
  // data에서 x, y 값을 사용하여 색상 가져오기
  const color1 = GetColor({ x: data.x, y: data.y });
  
  
  // DIARY_XY의 각 항목에 대한 색상을 미리 계산 (2-방식2)
  // const colors = DIARY_XY.map(item => 
  //   GetColor({ x: item.x, y: item.y })
  // );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">컬러테스트!</h2>
      <ColorGrid />
      
      <h3 className="text-md font-medium mt-6 mb-4">x,y값에 따른 color 불러오기 테스트!</h3>
      
      {/* 1. DATA를 X,Y값만 가져올 때 색깔 받는 법  */}
      <div className="grid grid-cols-11 gap-0.5 mt-4">
        <p 
          style={{ color: color1 }}
          className="p-2"
        >
          색깔입니다.
        </p>
      </div>
      
      {/* 2. Diary데이터와 같이 다량의 X,Y값을 가져올 때: 텍스트, 도형 */}
      {/* 방식1: GetColor를 return 밖에서 실행/ 방식2: GetColor를 return 안에서 실행  */}


      {/* 2. Diary데이터와 같이 다량의 X,Y값을 가져올 때 색깔 텍스트로 받는 법 (방식1) */}
      <div className="grid grid-cols-11 gap-0.5">
        {DIARY_XY.map((item) => (
          <p 
            key={item.id}
            style={{ color: GetColor({x:item.x, y:item.y}) }}
            className="p-2"
          >
            색깔입니다.
          </p>
        ))}
      </div>

      {/* Diary데이터와 같이 다량의 X,Y값을 가져올 때 색깔을 텍스트로로 받는 법 (방식2)
      
      <div className="grid grid-cols-11 gap-0.5">
        {colors.map((color, index) => (
          <p 
            key={DIARY_XY[index].id}
            style={{ color: color }}
            className="p-2"
          >
            색깔입니다.
          </p>
        ))}
      </div> */}

 {/* 2. Diary데이터와 같이 다량의 X,Y값을 가져올 때 색깔을을 동그라미 모양으로 받는 법 (방식1) */}
<div className="grid grid-cols-11 gap-0.5">
        {DIARY_XY.map((item) => (
        <div 
          key={item.id}
          className="flex items-center justify-center p-2">
          <div 
            className={`w-8 h-8 rounded-full`}
            style={{ backgroundColor: GetColor({x:item.x, y:item.y}) }}
          />
    </div>
  ))}
</div>

 {/* 2. Diary데이터와 같이 다량의 X,Y값을 가져올 때 색깔을을 동그라미 모양으로 받는 법 (방식2) */}
      {/* <div className="grid grid-cols-11 gap-0.5">
        {colors.map((color, index) => (
        <div 
          key={DIARY_XY[index].id}
          className="flex items-center justify-center p-2">
          <div 
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: color }}
          />
    </div>
  ))}
</div> */}

    </div>

    
  );
  
}



export default ColorTest;