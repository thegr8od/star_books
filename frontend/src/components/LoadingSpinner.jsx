import Lottie from "lottie-react";
import starLoadingAnimation from "../assets/animations/starLoading.json"; // JSON 파일 저장 위치

const LoadingSpinner = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: starLoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-32 h-32">
        <Lottie options={defaultOptions} height={128} width={128} />
      </div>
    </div>
  );
};

export default LoadingSpinner;
