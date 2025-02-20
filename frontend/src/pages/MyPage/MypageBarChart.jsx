import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import GetColor from "../../components/GetColor";
import useAnalysisApi from "../../api/useAnalysisApi";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

const defaultChartData = {
  labels: ["피곤함", "뿌듯함", "신나는", "불안함", "그저 그럼"],
  datasets: [
    {
      data: [0, 0, 0, 0, 0],
      backgroundColor: Array(5)
        .fill()
        .map(() => GetColor({ x: 0, y: 0 })),
      borderRadius: 4,
      borderSkipped: false,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { display: false },
      ticks: { display: false },
      border: { display: false },
    },
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: "#fff" },
    },
  },
};

const EmotionChart = () => {
  const [chartData, setChartData] = useState(defaultChartData);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    useAnalysisApi
      .getMyHashtagStats()
      .then((response) => {
        if (response?.status === 200 && response.data?.length > 0) {
          const top5Data = response.data
            .sort((a, b) => b.usageCount - a.usageCount)
            .slice(0, 5);

          setHasData(true);
          setChartData({
            labels: top5Data.map((item) => item.hashtagType),
            datasets: [
              {
                data: top5Data.map((item) => item.usageCount),
                backgroundColor: top5Data.map((item) =>
                  GetColor(item.xvalue, item.yvalue)
                ),
                borderRadius: 4,
                borderSkipped: false,
              },
            ],
          });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch hashtag stats:", error);
      });
  }, []);

  return (
    <div className="relative h-[300px]">
      <Bar data={chartData} options={chartOptions} />
      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-navy-800 px-8 py-4 rounded-lg shadow-lg border border-navy-600 text-center max-w-[280px]">
            <p className="text-lg font-semibold mb-2 text-white">
              내 감정 통계가 없어요
            </p>
            <p className="text-sm text-navy-300">
              감정 일기를 작성하고 나의 감정을
              <br />
              분석해보세요!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionChart;
