import Colors from './Colors';  // ColorMap.jsx import

export default function ColorGrid() {
  function createColorGrid() {
    const grid = Array(11).fill().map(() => Array(11).fill(null));
    
    // x: -5 to 5, y: -5 to 5 범위를 순회
    for (let y = 5; y >= -5; y--) {
      for (let x = -5; x <= 5; x++) {
        const key = `${x},${y}`;
        // ColorMap에서 해당 좌표의 색상을 가져옴
        const color = Colors[key];
        
        // grid 배열의 인덱스로 변환
        // x: -5~5 → 0~10
        // y: 5~-5 → 0~10
        const gridX = x + 5;
        const gridY = Math.abs(y - 5);
        
        grid[gridY][gridX] = color;
      }
    }
    return grid;
  }

  const grid = createColorGrid();

  return (
    <div className="p-4">
      <div className="grid grid-cols-11 gap-0.5">
        {grid.map((row, i) => 
          row.map((color, j) => (
            <div
              key={`${i}-${j}`}
              className="w-10 h-10"
              style={{ backgroundColor: color || '#E5E7EB' }}
            />
          ))
        )}
      </div>
    </div>
  );
}