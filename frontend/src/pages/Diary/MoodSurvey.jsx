import { useState } from "react";
import RadioButton from "../../components/RadioButton";

const MoodSurvey = () => {
  const moods = ["매우 좋음", "좋음", "보통", "좋지 않음", "매우 좋지 않음"];
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex justify-center mb-[20px]">
          <div className="flex flex-col gap-[40px] rounded-full bg-gray-200 p-[10px] border">
            {moods.map((mood, index) => (
              <RadioButton
                key={index}
                label={mood}
                selected={selectedIndex === index}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>
        </div>

        <button className="rounded-2xl bg-indigo-300 px-8 py-2 text-white mt-4 w-[110px]">
          다음
        </button>
      </div>
    </>
  );
};

export default MoodSurvey;
