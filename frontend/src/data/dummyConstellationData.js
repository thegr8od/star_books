export const constellationData = [
  // // 1월 - 원형
  // {
  //   points: Array.from({ length: 8 }, (_, i) => {
  //     const angle = (i / 8) * Math.PI * 2;
  //     return {
  //       x: Math.cos(angle) * 25 + 50,
  //       y: Math.sin(angle) * 25 + 50,
  //       color: i % 3 === 0 ? "red" : i % 3 === 1 ? "yellow" : "white",
  //     };
  //   }),
  //   lines: Array.from({ length: 8 }, (_, i) => {
  //     const currentAngle = (i / 8) * Math.PI * 2;
  //     const nextAngle = (((i + 1) % 8) / 8) * Math.PI * 2;
  //     return {
  //       startX: Math.cos(currentAngle) * 25 + 50,
  //       startY: Math.sin(currentAngle) * 25 + 50,
  //       endX: Math.cos(nextAngle) * 25 + 50,
  //       endY: Math.sin(nextAngle) * 25 + 50,
  //     };
  //   }),
  // },
  // 2월 - 삼각형
  {
    points: [
      { x: 50, y: 25, color: "blue" },
      { x: 28.75, y: 75, color: "red" },
      { x: 71.25, y: 75, color: "yellow" },
      { x: 50, y: 50, color: "white" },
    ],
    lines: [
      { startX: 50, startY: 25, endX: 28.75, endY: 75 },
      { startX: 28.75, startY: 75, endX: 71.25, endY: 75 },
      { startX: 71.25, startY: 75, endX: 50, endY: 25 },
      { startX: 50, startY: 25, endX: 50, endY: 50 },
      { startX: 28.75, startY: 75, endX: 50, endY: 50 },
      { startX: 71.25, startY: 75, endX: 50, endY: 50 },
    ],
  },
  // 3월 - 사각형
  {
    points: [
      { x: 31.25, y: 31.25, color: "yellow" },
      { x: 68.75, y: 31.25, color: "blue" },
      { x: 68.75, y: 68.75, color: "red" },
      { x: 31.25, y: 68.75, color: "white" },
    ],
    lines: [
      { startX: 31.25, startY: 31.25, endX: 68.75, endY: 31.25 },
      { startX: 68.75, startY: 31.25, endX: 68.75, endY: 68.75 },
      { startX: 68.75, startY: 68.75, endX: 31.25, endY: 68.75 },
      { startX: 31.25, startY: 68.75, endX: 31.25, endY: 31.25 },
    ],
  },
  // // 4월 - 별
  // {
  //   points: Array.from({ length: 10 }, (_, i) => {
  //     const angle = (i / 5) * Math.PI;
  //     const radius = i % 2 === 0 ? 25 : 12.5;
  //     return {
  //       x: Math.cos(angle) * radius + 50,
  //       y: Math.sin(angle) * radius + 50,
  //       color:
  //         i % 4 === 0
  //           ? "yellow"
  //           : i % 4 === 1
  //           ? "white"
  //           : i % 4 === 2
  //           ? "blue"
  //           : "red",
  //     };
  //   }),
  //   lines: Array.from({ length: 10 }, (_, i) => {
  //     const currentAngle = (i / 5) * Math.PI;
  //     const nextAngle = (((i + 1) % 10) / 5) * Math.PI;
  //     const currentRadius = i % 2 === 0 ? 25 : 12.5;
  //     const nextRadius = (i + 1) % 2 === 0 ? 25 : 12.5;
  //     return {
  //       startX: Math.cos(currentAngle) * currentRadius + 50,
  //       startY: Math.sin(currentAngle) * currentRadius + 50,
  //       endX: Math.cos(nextAngle) * nextRadius + 50,
  //       endY: Math.sin(nextAngle) * nextRadius + 50,
  //     };
  //   }),
  // },
  // 5월 - 지팡이
  {
    points: [
      { x: 50, y: 25, color: "yellow" },
      { x: 50, y: 50, color: "white" },
      { x: 62.5, y: 25, color: "blue" },
      { x: 50, y: 75, color: "red" },
    ],
    lines: [
      { startX: 50, startY: 25, endX: 50, endY: 50 },
      { startX: 50, startY: 50, endX: 62.5, endY: 25 },
      { startX: 50, startY: 50, endX: 50, endY: 75 },
    ],
  },
  // // 6월 - 육각형
  // {
  //   points: Array.from({ length: 6 }, (_, i) => {
  //     const angle = (i / 6) * Math.PI * 2;
  //     return {
  //       x: Math.cos(angle) * 25 + 50,
  //       y: Math.sin(angle) * 25 + 50,
  //       color: i % 3 === 0 ? "blue" : i % 3 === 1 ? "yellow" : "red",
  //     };
  //   }),
  //   lines: Array.from({ length: 6 }, (_, i) => {
  //     const currentAngle = (i / 6) * Math.PI * 2;
  //     const nextAngle = (((i + 1) % 6) / 6) * Math.PI * 2;
  //     return {
  //       startX: Math.cos(currentAngle) * 25 + 50,
  //       startY: Math.sin(currentAngle) * 25 + 50,
  //       endX: Math.cos(nextAngle) * 25 + 50,
  //       endY: Math.sin(nextAngle) * 25 + 50,
  //     };
  //   }),
  // },
  // // 7월 - 반원
  // {
  //   points: [
  //     ...Array.from({ length: 5 }, (_, i) => {
  //       const angle = (i / 4) * Math.PI;
  //       return {
  //         x: Math.cos(angle) * 25 + 50,
  //         y: Math.sin(angle) * 25 + 50,
  //         color: i % 2 === 0 ? "white" : "blue",
  //       };
  //     }),
  //     { x: 25, y: 50, color: "yellow" },
  //     { x: 75, y: 50, color: "red" },
  //   ],
  //   lines: [
  //     ...Array.from({ length: 4 }, (_, i) => {
  //       const currentAngle = (i / 4) * Math.PI;
  //       const nextAngle = ((i + 1) / 4) * Math.PI;
  //       return {
  //         startX: Math.cos(currentAngle) * 25 + 50,
  //         startY: Math.sin(currentAngle) * 25 + 50,
  //         endX: Math.cos(nextAngle) * 25 + 50,
  //         endY: Math.sin(nextAngle) * 25 + 50,
  //       };
  //     }),
  //     { startX: 25, startY: 50, endX: 75, endY: 50 },
  //   ],
  // },
  // 8월 - 나비넥타이
  {
    points: [
      { x: 25, y: 25, color: "red" },
      { x: 75, y: 25, color: "blue" },
      { x: 50, y: 50, color: "white" },
      { x: 25, y: 75, color: "yellow" },
      { x: 75, y: 75, color: "red" },
    ],
    lines: [
      { startX: 25, startY: 25, endX: 50, endY: 50 },
      { startX: 75, startY: 25, endX: 50, endY: 50 },
      { startX: 50, startY: 50, endX: 25, endY: 75 },
      { startX: 50, startY: 50, endX: 75, endY: 75 },
    ],
  },
  // 9월 - W자
  {
    points: [
      { x: 25, y: 25, color: "blue" },
      { x: 37.5, y: 75, color: "yellow" },
      { x: 50, y: 25, color: "red" },
      { x: 62.5, y: 75, color: "white" },
      { x: 75, y: 25, color: "blue" },
    ],
    lines: [
      { startX: 25, startY: 25, endX: 37.5, endY: 75 },
      { startX: 37.5, startY: 75, endX: 50, endY: 25 },
      { startX: 50, startY: 25, endX: 62.5, endY: 75 },
      { startX: 62.5, startY: 75, endX: 75, endY: 25 },
    ],
  },
  // 10월 - 지그재그
  {
    points: [
      { x: 25, y: 50, color: "white" },
      { x: 37.5, y: 25, color: "red" },
      { x: 50, y: 50, color: "yellow" },
      { x: 62.5, y: 25, color: "blue" },
      { x: 75, y: 50, color: "white" },
    ],
    lines: [
      { startX: 25, startY: 50, endX: 37.5, endY: 25 },
      { startX: 37.5, startY: 25, endX: 50, endY: 50 },
      { startX: 50, startY: 50, endX: 62.5, endY: 25 },
      { startX: 62.5, startY: 25, endX: 75, endY: 50 },
    ],
  },
  // 11월 - 십자가
  {
    points: [
      { x: 50, y: 25, color: "yellow" },
      { x: 50, y: 75, color: "blue" },
      { x: 25, y: 50, color: "red" },
      { x: 75, y: 50, color: "white" },
      { x: 50, y: 50, color: "yellow" },
    ],
    lines: [
      { startX: 50, startY: 25, endX: 50, endY: 50 },
      { startX: 50, startY: 75, endX: 50, endY: 50 },
      { startX: 25, startY: 50, endX: 50, endY: 50 },
      { startX: 75, startY: 50, endX: 50, endY: 50 },
    ],
  },
  //   // 12월 - 오각형
  //   {
  //     points: Array.from({ length: 5 }, (_, i) => {
  //       const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
  //       return {
  //         x: Math.cos(angle) * 25 + 50,
  //         y: Math.sin(angle) * 25 + 50,
  //         color:
  //           i % 4 === 0
  //             ? "red"
  //             : i % 4 === 1
  //             ? "blue"
  //             : i % 4 === 2
  //             ? "yellow"
  //             : "white",
  //       };
  //     }),
  //     lines: Array.from({ length: 5 }, (_, i) => {
  //       const currentAngle = (i / 5) * Math.PI * 2 - Math.PI / 2;
  //       const nextAngle = (((i + 1) % 5) / 5) * Math.PI * 2 - Math.PI / 2;
  //       return {
  //         startX: Math.cos(currentAngle) * 25 + 50,
  //         startY: Math.sin(currentAngle) * 25 + 50,
  //         endX: Math.cos(nextAngle) * 25 + 50,
  //         endY: Math.sin(nextAngle) * 25 + 50,
  //       };
  //     }),
  //   },
];

// yearlyConstellationData는 동일하게 유지
export const yearlyConstellationData = {
  2024: {
    constellationData: [
      constellationData[0], // 1월 - 원형
      constellationData[1], // 2월 - 삼각형
      constellationData[2], // 3월 - 사각형
      constellationData[3], // 4월 - 별
      constellationData[4], // 5월 - 지팡이
      constellationData[5], // 6월 - 육각형
      constellationData[6], // 7월 - 반원
      //   constellationData[7], // 8월 - 나비넥타이
      //   constellationData[8], // 9월 - W자
      //   constellationData[9], // 10월 - 지그재그
      //   constellationData[10], // 11월 - 십자가
      //   constellationData[11], // 12월 - 오각형
    ],
  },
  2023: {
    constellationData: [
      constellationData[0], // 1월 - 원형
      constellationData[2], // 3월 - 사각형
      constellationData[4], // 5월 - 지팡이
      constellationData[6], // 7월 - 반원
      // constellationData[8], // 9월 - W자
    ],
  },
  2022: {
    constellationData: [
      constellationData[1], // 2월 - 삼각형
      constellationData[3], // 4월 - 별
      constellationData[5], // 6월 - 육각형
      // constellationData[7], // 8월 - 나비넥타이
      // constellationData[9], // 10월 - 지그재그
      // constellationData[11], // 12월 - 오각형
    ],
  },
};
