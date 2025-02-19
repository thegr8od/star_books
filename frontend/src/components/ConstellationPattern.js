// 별자리 패턴을 생성하는 컴포넌트
const createConstellationPattern = (monthData) => {
  // monthData = { points: [], lines: [] }
  const pattern = {
    points: monthData.points.map(point => ({
      x: (point.xCoord / 10) * 2,  // -50~50 범위를 -10~10으로 변환
      y: (point.yCoord / 10) * 2,
      emotionId: point.diaryEmotionId,
      xvalue: point.xvalue,
      yvalue: point.yvalue
    })),
    lines: monthData.lines.map(line => ({
      start: monthData.points.findIndex(p => p.diaryEmotionId === line.startEmotionId),
      end: monthData.points.findIndex(p => p.diaryEmotionId === line.endEmotionId)
    })).filter(line => line.start !== -1 && line.end !== -1)
  };

  return pattern;
};

export default createConstellationPattern; 
