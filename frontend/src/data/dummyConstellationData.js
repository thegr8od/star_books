// 12개월치 별자리 데이터 // 데이터 받는 방식이 바뀌어야 함.
// 점과 색깔 + 선 (연도별) : axios요청받기
// month 부분 index +1 로 계산하지 말고, month를 받은걸 써야 함
// 선데이터, 점 데이터 사용하는거로 바꾸기

export const constellationData = [
  // 1월 - 원형
  {
    points: Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      return { x: Math.cos(angle) * 2, y: Math.sin(angle) * 2 };
    }),
    lines: Array.from({ length: 8 }, (_, i) => ({
      start: i,
      end: (i + 1) % 8
    }))
  },
  // 2월 - 삼각형
  {
    points: [
      { x: 0, y: 2 },
      { x: -1.7, y: -1 },
      { x: 1.7, y: -1 },
      { x: 0, y: 0 }
    ],
    lines: [
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 2, end: 0 },
      { start: 0, end: 3 },
      { start: 1, end: 3 },
      { start: 2, end: 3 }
    ]
  },
  // 3월 - 사각형
  {
    points: [
      { x: -1.5, y: 1.5 },
      { x: 1.5, y: 1.5 },
      { x: 1.5, y: -1.5 },
      { x: -1.5, y: -1.5 }
    ],
    lines: [
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 2, end: 3 },
      { start: 3, end: 0 }
    ]
  },
  // 4월 - 별
  {
    points: Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 5) * Math.PI;
      const radius = i % 2 === 0 ? 2 : 1;
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    }),
    lines: Array.from({ length: 10 }, (_, i) => ({
      start: i,
      end: (i + 1) % 10
    }))
  },
  // 5월 - 지팡이
  {
    points: [
      { x: 0, y: 2 },
      { x: 0, y: 0 },
      { x: 1, y: 2 },
      { x: 0, y: -2 }
    ],
    lines: [
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 1, end: 3 }
    ]
  },
  // 6월 - 육각형
  {
    points: Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      return { x: Math.cos(angle) * 2, y: Math.sin(angle) * 2 };
    }),
    lines: Array.from({ length: 6 }, (_, i) => ({
      start: i,
      end: (i + 1) % 6
    }))
  },
  // 7월 - 반원
  {
    points: [
      ...Array.from({ length: 5 }, (_, i) => {
        const angle = (i / 4) * Math.PI;
        return { x: Math.cos(angle) * 2, y: Math.sin(angle) * 2 };
      }),
      { x: -2, y: 0 },
      { x: 2, y: 0 }
    ],
    lines: [
      ...Array.from({ length: 4 }, (_, i) => ({
        start: i,
        end: i + 1
      })),
      { start: 5, end: 6 }
    ]
  },
  // 8월 - 나비넥타이
  {
    points: [
      { x: -2, y: 2 },
      { x: 2, y: 2 },
      { x: 0, y: 0 },
      { x: -2, y: -2 },
      { x: 2, y: -2 }
    ],
    lines: [
      { start: 0, end: 2 },
      { start: 1, end: 2 },
      { start: 2, end: 3 },
      { start: 2, end: 4 }
    ]
  },
  // 9월 - W자
  {
    points: [
      { x: -2, y: 2 },
      { x: -1, y: -1 },
      { x: 0, y: 2 },
      { x: 1, y: -1 },
      { x: 2, y: 2 }
    ],
    lines: [
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 2, end: 3 },
      { start: 3, end: 4 }
    ]
  },
  // 10월 - 지그재그
  {
    points: [
      { x: -2, y: 0 },
      { x: -1, y: 2 },
      { x: 0, y: 0 },
      { x: 1, y: 2 },
      { x: 2, y: 0 }
    ],
    lines: [
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 2, end: 3 },
      { start: 3, end: 4 }
    ]
  },
  // 11월 - 십자가
  {
    points: [
      { x: 0, y: 2 },
      { x: 0, y: -2 },
      { x: -2, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 0 }
    ],
    lines: [
      { start: 0, end: 4 },
      { start: 1, end: 4 },
      { start: 2, end: 4 },
      { start: 3, end: 4 }
    ]
  },
  // 12월 - 오각형
  {
    points: Array.from({ length: 5 }, (_, i) => {
      const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      return { x: Math.cos(angle) * 2, y: Math.sin(angle) * 2 };
    }),
    lines: Array.from({ length: 5 }, (_, i) => ({
      start: i,
      end: (i + 1) % 5
    }))
  }
];

// 각 별의 색상 좌표 데이터
export const colorData = [
  // 1월 - 8개의 점
  Array.from({ length: 8 }, (_, i) => ({ x: i + 1, y: i + 1 })),
  
  // 2월 - 4개의 점
  Array.from({ length: 4 }, (_, i) => ({ x: i + 2, y: i + 2 })),
  
  // 3월 - 4개의 점
  Array.from({ length: 4 }, (_, i) => ({ x: i + 3, y: i + 3 })),
  
  // 4월 - 10개의 점
  Array.from({ length: 10 }, (_, i) => ({ x: i + 1, y: i + 1 })),
  
  // 5월 - 4개의 점
  Array.from({ length: 4 }, (_, i) => ({ x: i + 4, y: i + 4 })),
  
  // 6월 - 6개의 점
  Array.from({ length: 6 }, (_, i) => ({ x: i + 5, y: i + 5 })),
  
  // 7월 - 7개의 점
  Array.from({ length: 7 }, (_, i) => ({ x: i + 6, y: i + 6 })),
  
  // 8월 - 5개의 점
  Array.from({ length: 5 }, (_, i) => ({ x: i + 7, y: i + 7 })),
  
  // 9월 - 5개의 점
  Array.from({ length: 5 }, (_, i) => ({ x: i + 8, y: i + 8 })),
  
  // 10월 - 5개의 점
  Array.from({ length: 5 }, (_, i) => ({ x: i + 9, y: i + 9 })),
  
  // 11월 - 5개의 점
  Array.from({ length: 5 }, (_, i) => ({ x: i + 10, y: i + 10 })),
  
  // 12월 - 5개의 점
  Array.from({ length: 5 }, (_, i) => ({ x: i + 11, y: i + 11 }))
];

// 연도별 별자리 데이터
export const yearlyConstellationData = {
  2024: {
    constellationData: [
      // 1월부터 12월까지 모든 데이터
      constellationData[0],  // 1월 - 원형
      constellationData[1],  // 2월 - 삼각형
      constellationData[2],  // 3월 - 사각형
      constellationData[3],  // 4월 - 별
      constellationData[4],  // 5월 - 지팡이
      constellationData[5],  // 6월 - 육각형
      constellationData[6],  // 7월 - 반원
      constellationData[7],  // 8월 - 나비넥타이
      constellationData[8],  // 9월 - W자
      constellationData[9],  // 10월 - 지그재그
      constellationData[10], // 11월 - 십자가
      constellationData[11]  // 12월 - 오각형
    ],
    colorData: [
      // 1월부터 12월까지 모든 색상 데이터
      colorData[0],  // 1월
      colorData[1],  // 2월
      colorData[2],  // 3월
      colorData[3],  // 4월
      colorData[4],  // 5월
      colorData[5],  // 6월
      colorData[6],  // 7월
      colorData[7],  // 8월
      colorData[8],  // 9월
      colorData[9],  // 10월
      colorData[10], // 11월
      colorData[11]  // 12월
    ]
  },
  2023: {
    constellationData: [
      // 1월 - 원형 (1월)
      constellationData[0],
      // 3월 - 사각형 (3월)
      constellationData[2],
      // 5월 - 지팡이 (5월)
      constellationData[4],
      // 7월 - 반원 (7월)
      constellationData[6],
      // 9월 - W자 (9월)
      constellationData[8]
    ],
    colorData: [
      // 해당하는 월의 색상 데이터
      colorData[0],
      colorData[2],
      colorData[4],
      colorData[6],
      colorData[8]
    ]
  },
  2022: {
    constellationData: [
      // 2월 - 삼각형 (2월)
      constellationData[1],
      // 4월 - 별 (4월)
      constellationData[3],
      // 6월 - 육각형 (6월)
      constellationData[5],
      // 8월 - 나비넥타이 (8월)
      constellationData[7],
      // 10월 - 지그재그 (10월)
      constellationData[9],
      // 12월 - 오각형 (12월)
      constellationData[11]
    ],
    colorData: [
      // 해당하는 월의 색상 데이터
      colorData[1],
      colorData[3],
      colorData[5],
      colorData[7],
      colorData[9],
      colorData[11]
    ]
  }
}; 