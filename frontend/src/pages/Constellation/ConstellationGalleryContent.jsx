import { useContext } from "react";
import { ConstellationContext } from "./Constellation";

function ConstellationGalleryContent() {
  const { galleryData } = useContext(ConstellationContext);

  // Convert line data to points and connections
  const getPointsAndConnections = (lineData) => {
    if (!lineData || lineData.length === 0)
      return { points: [], connections: [] };

    const pointsMap = new Map();
    const connections = [];
    let pointId = 1;

    lineData.forEach((line) => {
      // Add start point if not exists
      if (!pointsMap.has(`${line.start.x},${line.start.y}`)) {
        pointsMap.set(`${line.start.x},${line.start.y}`, {
          id: pointId++,
          x: line.start.x,
          y: line.start.y,
        });
      }
      // Add end point if not exists
      if (!pointsMap.has(`${line.end.x},${line.end.y}`)) {
        pointsMap.set(`${line.end.x},${line.end.y}`, {
          id: pointId++,
          x: line.end.x,
          y: line.end.y,
        });
      }

      // Add connection
      const startPoint = pointsMap.get(`${line.start.x},${line.start.y}`);
      const endPoint = pointsMap.get(`${line.end.x},${line.end.y}`);
      connections.push([startPoint.id, endPoint.id]);
    });

    return {
      points: Array.from(pointsMap.values()),
      connections: connections,
    };
  };

  const width = 400;
  const height = 400;

  // Scale functions to map coordinates to SVG space (-10,10 to 0,400)
  const scaleX = (x) => (x + 10) * (width / 20);
  const scaleY = (y) => (10 - y) * (height / 20);

  // Get points and connections for the constellation
  const { points, connections } =
    galleryData && galleryData[0]?.xy
      ? getPointsAndConnections(galleryData[0].xy)
      : { points: [], connections: [] };

  if (!points.length) return null;

  return (
    <div className="text-center mt-4">
      <svg
        width={width}
        height={height}
        className="bg-gray-900 rounded-xl border border-gray-700"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Draw connections (lines) */}
        {connections.map(([fromId, toId], index) => {
          const from = points.find((point) => point.id === fromId);
          const to = points.find((point) => point.id === toId);
          return (
            <line
              key={`line-${index}`}
              x1={scaleX(from.x)}
              y1={scaleY(from.y)}
              x2={scaleX(to.x)}
              y2={scaleY(to.y)}
              stroke="#4F46E5"
              strokeWidth="2"
              strokeOpacity="0.6"
            />
          );
        })}

        {/* Draw points (stars) */}
        {points.map((point) => (
          <circle
            key={`point-${point.id}`}
            cx={scaleX(point.x)}
            cy={scaleY(point.y)}
            r="4"
            fill="#FFFFFF"
            className="animate-pulse"
          />
        ))}
      </svg>
    </div>
  );
}

export default ConstellationGalleryContent;
