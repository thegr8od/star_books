import Colors from './Colors';

export default function GetColor( x, y ) {
  // x와 y 좌표를 키 형식으로 변환
  const key = `${x},${y}`;
  
  // ColorMap에서 해당 좌표의 색상을 직접 조회
  return Colors[key] || '#E5E7EB'; // 색상이 없는 경우 기본 색상 반환
}

// function GetColor({ x, y }) {
//     const found = Colors.find(item => item.x_value === x && item.y_value === y);
//     return found ? found.color : "black";
//  }

// export default GetColor
// // 
// //사용법:
// //<GetColor coordinates={{ x: 3, y: 5 }} />
