import RotateRightIcon from "@mui/icons-material/RotateRight";

function MoodSurveyLoading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <RotateRightIcon className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          당신의 감정을 분석하고 있어요
        </h3>
      </div>
    </div>
  );
}

export default MoodSurveyLoading;
