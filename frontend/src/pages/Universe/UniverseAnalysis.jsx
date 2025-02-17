import React from "react";
import ReactApexChart from "react-apexcharts";
import Layout from "../../components/Layout";
import UniverseAnalysisStatsChart from "./UniverseAnalysisStatsChart";
import GetColor from "../../components/GetColor";

const UniverseAnalysis = () => {
  const emotionData = [
    { label: "피곤한", value: 34.6, color: GetColor({ x: 3, y: -1 }) },
    { label: "신나는", value: 26.6, color: GetColor({ x: -4, y: 2 }) },
    { label: "답답한", value: 20.5, color: GetColor({ x: 4, y: 1 }) },
    { label: "즐거운", value: 18.3, color: GetColor({ x: 0, y: 3 }) },
  ];

  const options = {
    chart: {
      type: "pie",
      background: "transparent",
      fontFamily: "NotoSansKR-Medium",
      height: 380,
    },
    labels: emotionData.map((item) => item.label),
    colors: emotionData.map((item) => item.color),
    legend: {
      show: true,
      fontSize: "18px",
      fontFamily: "NotoSansKR-Medium",
      formatter: function (seriesName, opts) {
        return `<span style="padding-left: 9px;">${
          emotionData[opts.seriesIndex].value
        }%</span>`;
      },
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.config.labels[opts.seriesIndex];
      },
      textAnchor: "middle",
      style: {
        colors: ["#FFFFFF"],
        fontFamily: "NotoSansKR-Medium",
        fontSize: "25px",
      },
      background: {
        enabled: false,
      },
      dropShadow: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        customScale: 1,
        offsetX: 0,
        offsetY: 0,
        expandOnClick: false,
        dataLabels: {
          offset: -30,
          minAngleToShowLabel: 0,
        },
      },
    },
    states: {
      hover: {
        filter: { type: "none" },
      },
      active: {
        filter: { type: "none" },
      },
    },
    theme: {
      mode: "dark",
    },
    stroke: {
      show: true,
      colors: ["#FFFFFF"],
      width: 1,
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 380,
          },
          plotOptions: {
            pie: {
              customScale: 1, // [변경] 1024px 이하에서는 1로 설정
            },
          },
          legend: {
            fontSize: "16px",
          },
          dataLabels: {
            style: {
              fontSize: "25px",
            },
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              customScale: 0.9, // [변경] 768px 이하에서는 0.9로 설정
            },
          },
          legend: {
            fontSize: "14px",
          },
          dataLabels: {
            style: {
              fontSize: "24px",
            },
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 280,
          },
          plotOptions: {
            pie: {
              customScale: 0.8, // [변경] 480px 이하에서는 0.8로 설정
            },
          },
          legend: {
            fontSize: "12px",
          },
          dataLabels: {
            style: {
              fontSize: "18px",
            },
          },
        },
      },
    ],
  };

  const series = emotionData.map((item) => item.value);

  return (
    <Layout>
      <div className="pt-8 space-y-5">
        <div>
          <div className="flex flex-col gap-2">
            <div className="text-white text-xl md:text-2xl items-start font-bold">
              실시간 감정 통계
            </div>
            <div className="text-gray-300 text-sm md:text-md justify-start">
              오늘의 감정 흐름을 한눈에 확인해보세요.
            </div>
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto mt-[20px]">
              <ReactApexChart
                options={options}
                series={series}
                type="pie"
                height={350}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-8">
          <div className="text-white text-xl md:text-2xl items-start font-bold">
            연간 감정 통계
          </div>
          <div className="text-gray-300 text-sm md:text-md justify-start">
            올해의 감정 흐름을 한눈에 확인하세요!
          </div>
          <UniverseAnalysisStatsChart />
        </div>
      </div>
    </Layout>
  );
};

export default UniverseAnalysis;
