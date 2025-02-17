import React from "react";
import { Bar } from "react-chartjs-2";
import GetColor from "../../components/GetColor";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

const EmotionChart = () => {
  const data = {
    labels: ["피곤함", "뿌듯함", "신나는", "불안함", "그저 그럼"],
    datasets: [
      {
        data: [80, 40, 60, 30, 70],
        backgroundColor: [
          GetColor({ x: 2, y: -2 }),
          GetColor({ x: 2, y: 3 }),
          GetColor({ x: -1, y: 3 }),
          GetColor({ x: -1, y: -5 }),
          GetColor({ x: 4, y: -1 }),
        ],
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#fff",
        },
      },
    },
  };

  return (
    <div style={{ height: "300px" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default EmotionChart;
