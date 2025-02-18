import React, { useState } from "react";
import Layout from "../../components/Layout";
import RadioList from "./RadioList";
import RadioShow from "./RadioShow";

const Radio = () => {
  const [showList, setShowList] = useState(true);

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] p-4">
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setShowList(true)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${showList ? "bg-[#7580bb] text-white" : "text-[#7580bb] hover:bg-[#7580bb]/10"}`}
          >
            라디오 목록
          </button>
          <button
            onClick={() => setShowList(false)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${!showList ? "bg-[#7580bb] text-white" : "text-[#7580bb] hover:bg-[#7580bb]/10"}`}
          >
            라디오 쇼
          </button>
        </div>

        <div className="h-[calc(100vh-8rem)] overflow-y-auto">{showList ? <RadioList /> : <RadioShow />}</div>
      </div>
    </Layout>
  );
};

export default Radio;
