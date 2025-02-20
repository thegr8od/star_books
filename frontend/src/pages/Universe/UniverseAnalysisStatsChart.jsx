import React, { useState, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import GetColor from "../../components/GetColor";

const UniverseAnalysisStatsChart = () => {
  const [selectedEmotion, setSelectedEmotion] = useState("슬픔");
  const scrollContainerRef = useRef(null);

  const emotions = {
    슬픈: { color: "#5c07b1" },
    기쁜: { color: "#e9e70c" },
    졸린: { color: "#1fa6d6" },
    화난: { color: "#b60829" },
    설레는: { color: "#dbd906" },
    불안: { color: "#e90c0d" },
    답답한: { color: "#e90c0d"},
    평온: { color: "#0eea0d" },
  };

  const chartOptions = {
    chart: {
      type: "line",
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: [emotions[selectedEmotion].color],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: Array.from({ length: 12 }, (_, i) => i),
      title: { text: "월", style: { color: "#ffffff" } },
      labels: { style: { colors: "#ffffff" } },
    },
    yaxis: {
      min: 0,
      max: 7,
      title: { text: "감정 강도", style: { color: "#ffffff" } },
      labels: { style: { colors: "#ffffff" } },
    },
    markers: {
      size: 4,
      hover: { size: 8 },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    tooltip: {
      enabled: false,
    },
  };

  const emotionData = {
    기쁜: [5, 3, 7, 2, 6, 1, 4, 5, 6, 4, 3, 5],
    설레는: [3, 5, 6, 4, 3, 5, 4, 2, 5, 6, 4, 3],
    평온: [6, 5, 4, 3, 5, 6, 4, 3, 4, 5, 6, 4],
    슬픈: [7, 2, 6, 4, 7, 0, 2, 3, 5, 7, 2, 4],
    졸린 : [6, 4, 5, 3, 5, 2, 3, 4, 7, 5, 1, 6],
    불안: [5, 4, 3, 5, 6, 4, 2, 5, 3, 4, 6, 5],
    답답한: [4, 3, 5, 6, 4, 3, 5, 4, 6, 5, 3, 4],
    화난: [4, 6, 3, 5, 4, 2, 5, 6, 4, 3, 5, 4],
  };

  const series = [
    {
      name: selectedEmotion,
      data: emotionData[selectedEmotion],
    },
  ];

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      const scrollPosition =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <div className="relative w-full mb-6 flex items-center">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-xl hover:bg-gray-100"
        >
          <ArrowBackIosNewOutlinedIcon className="w-6 h-6" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto px-12 mx-auto scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {Object.keys(emotions).map((emotion) => (
            <button
              key={emotion}
              onClick={() => setSelectedEmotion(emotion)}
              className={`px-6 py-2 rounded-full whitespace-nowrap ${
                selectedEmotion === emotion
                  ? "bg-[#8993c7] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-colors`}
            >
              #{emotion}
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-2xl hover:bg-gray-100"
        >
          <ArrowForwardIosOutlinedIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full h-96">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="line"
          height={400}
        />
      </div>
    </div>
  );
};

export default UniverseAnalysisStatsChart;
