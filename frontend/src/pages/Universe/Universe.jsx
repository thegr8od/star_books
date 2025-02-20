import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSelector } from "react-redux";
import useUniverseApi from "../../api/useUniverseApi";
import axios from "axios";

const ParticlePlanetGallery = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const particleGroupRef = useRef(null);
  const navigate = useNavigate();

  // 마우스가 현재 사용자 감정 파티클 위에 있는지 관리
  const [hovering, setHovering] = useState(false);
  const hoveredParticleRef = useRef(null);

  const [isMaximized, setIsMaximized] = useState(true);
  // 현재 선택된 날짜 (YYYY-MM-DD 형식; 기본값은 오늘)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [diaryEmotions, setDiaryEmotions] = useState([]);
  const user = useSelector((state) => state.user);

  // 토큰에서 user_id 추출
  const token = localStorage.getItem("accessToken");
  let tokenUserId = null;
  if (token) {
    try {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      tokenUserId = tokenPayload.user_id;
      console.log("토큰에서 추출한 유저 ID:", tokenUserId);
    } catch (error) {
      console.error("토큰 디코딩 오류:", error);
    }
  } else {
    console.log("토큰이 존재하지 않습니다.");
  }

  // Colors 매핑 (제공해주신 매핑 그대로)
  const Colors = {
    "-5,5": "#cc0002",
    "-4,5": "#d31002",
    "-3,5": "#d92305",
    "-2,5": "#de3c07",
    "-1,5": "#e05808",
    "0,5": "#e17509",
    "1,5": "#e08d08",
    "2,5": "#dea507",
    "3,5": "#d9b805",
    "4,5": "#d3c203",
    "5,5": "#d3c203",

    "-5,4": "#a30219",
    "-4,4": "#db0608",
    "-3,4": "#e11a09",
    "-2,4": "#e6370b",
    "-1,4": "#ea560d",
    "0,4": "#eb7a0d",
    "1,4": "#ea9d0d",
    "2,4": "#e6b90b",
    "3,4": "#e1cb09",
    "4,4": "#dbd906",
    "5,4": "#bdd303",

    "-5,3": "#ab053a",
    "-4,3": "#b60829",
    "-3,3": "#e90c0d",
    "-2,3": "#ee2910",
    "-1,3": "#ee5417",
    "0,3": "#ed831a",
    "1,3": "#eeab17",
    "2,3": "#eed010",
    "3,3": "#e9e70c",
    "4,3": "#c4e109",
    "5,3": "#a6d905",

    "-5,2": "#b1075f",
    "-4,2": "#bd0b54",
    "-3,2": "#c81040",
    "-2,2": "#ed1d1e",
    "-1,2": "#eb4f27",
    "0,2": "#ea882b",
    "1,2": "#ebc127",
    "2,2": "#edec1d",
    "3,2": "#c4ee10",
    "4,2": "#a2e60b",
    "5,2": "#88de07",

    "-5,1": "#b5088c",
    "-4,1": "#c10d8b",
    "-3,1": "#cd1382",
    "-2,1": "#d81967",
    "-1,1": "#e93537",
    "0,1": "#e8913c",
    "1,1": "#e9e835",
    "2,1": "#aeeb27",
    "3,1": "#8dee17",
    "4,1": "#75ea0d",
    "5,1": "#67e008",

    "-5,0": "#b508b6",
    "-4,0": "#c20ec3",
    "-3,0": "#cc14cf",
    "-2,0": "#d81ada",
    "-1,0": "#de27df",
    "0,0": "#9a9790",
    "1,0": "#66e83c",
    "2,0": "#59ea2b",
    "3,0": "#4bed1a",
    "4,0": "#44eb0d",
    "5,0": "#3de109",

    "-5,-1": "#8808b4",
    "-4,-1": "#870dc1",
    "-3,-1": "#7f13cd",
    "-2,-1": "#6619d8",
    "-1,-1": "#1f1fdf",
    "0,-1": "#2dadda",
    "1,-1": "#24da81",
    "2,-1": "#27eb4d",
    "3,-1": "#17ee24",
    "4,-1": "#0eea0d",
    "5,-1": "#0ee80d",

    "-5,-2": "#5c07b1",
    "-4,-2": "#530bbd",
    "-3,-2": "#3e10c8",
    "-2,-2": "#1515d1",
    "-1,-2": "#1d53d3",
    "0,-2": "#1fa6d6",
    "1,-2": "#1dd3b1",
    "2,-2": "#18cd74",
    "3,-2": "#10ee58",
    "4,-2": "#0be635",
    "5,-2": "#07de20",

    "-5,-3": "#3805ab",
    "-4,-3": "#2808b6",
    "-3,-3": "#0d0cc0",
    "-2,-3": "#1232c5",
    "-1,-3": "#1663ca",
    "0,-3": "#179ecc",
    "1,-3": "#16cac1",
    "2,-3": "#12c590",
    "3,-3": "#0ebe66",
    "4,-3": "#09e159",
    "5,-3": "#05d940",

    "-5,-4": "#1902a3",
    "-4,-4": "#0605ad",
    "-3,-4": "#0a1fb5",
    "-2,-4": "#0d42bb",
    "-1,-4": "#0f69bf",
    "0,-4": "#1093c1",
    "1,-4": "#0fbabf",
    "2,-4": "#0dbb9a",
    "3,-4": "#0ab578",
    "4,-4": "#06ac5b",
    "5,-4": "#03d355",

    "-5,-5": "#010099",
    "-4,-5": "#0311a2",
    "-3,-5": "#052caa",
    "-2,-5": "#0848b0",
    "-1,-5": "#0967b3",
    "0,-5": "#0a8ab5",
    "1,-5": "#09a8b3",
    "2,-5": "#08b09e",
    "3,-5": "#05aa81",
    "4,-5": "#03a264",
    "5,-5": "#00994e",
  };

  // 소수점 좌표를 반올림하여 Colors 객체에서 HEX 색상 반환
  const getColor = ({ x, y }) => {
    const roundedX = Math.round(x);
    const roundedY = Math.round(y);
    const key = `${roundedX},${roundedY}`;
    return Colors[key] || "#9a9790";
  };

  // API 호출: 선택된 날짜에 따라 URL에 쿼리스트링을 붙여 요청
  const fetchEmotions = async () => {
    try {

      const response = await useUniverseApi.getDiaryEmotion(selectedDate);
      // const accessToken = localStorage.getItem("accessToken");
      // console.log("Access Token:", accessToken);
      // if (!accessToken) {
      //   console.error("인증 토큰이 없습니다.");
      //   return;
      // }
      // const url = `https://starbooks.site/api/diary/emotion?diaryDate=${selectedDate}`;
      // console.log("API 요청 URL:", url);
      // const response = await axios.get(url, {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //     "Content-Type": "application/json",
      //   },
      // });
      console.log("서버 응답:", response.data);
      // 응답 데이터에 대해 tokenUserId와 비교하여 isCurrentUser 플래그 추가
      setDiaryEmotions(
        response.data.map((emotion) => ({
          ...emotion,
          isCurrentUser: emotion.userId === tokenUserId,
        }))
      );
    } catch (error) {
      console.error("감정 데이터 조회 실패:", error);
      setDiaryEmotions([]);
    }
  };

  // 선택된 날짜가 변경될 때마다 감정 데이터를 다시 요청
  useEffect(() => {
    fetchEmotions();
  }, [selectedDate]);

  // (디버그용) 현재 사용자 감정 로그 출력
  useEffect(() => {
    diaryEmotions
      .filter((e) => e.isCurrentUser)
      .forEach((e) => {
        const hexColor = getColor({ x: e.xvalue, y: e.yvalue });
        console.log(
          `현재 사용자 감정: ${JSON.stringify(e)} 매칭 색상: ${hexColor}`
        );
      });
  }, [diaryEmotions]);

  // 창 크기 변경 핸들러
  const handleResize = () => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  };

  // Three.js 씬 초기화 및 파티클 생성
  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 배경 그라데이션 설정
    const bgCanvas = document.createElement("canvas");
    const bgContext = bgCanvas.getContext("2d");
    bgCanvas.width = 2;
    bgCanvas.height = 512;
    const gradient = bgContext.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, "#00001B");
    gradient.addColorStop(1, "#000000");
    bgContext.fillStyle = gradient;
    bgContext.fillRect(0, 0, 2, 512);
    scene.background = new THREE.CanvasTexture(bgCanvas);

    // 카메라 설정
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = isMaximized ? 100 : 20;
    camera.position.y = isMaximized ? 50 : 5;

    // 렌더러 설정
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    mountRef.current.appendChild(renderer.domElement);

    // OrbitControls 설정
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 200;
    controls.minDistance = 10;

    // 조명 설정
    const ambientLight = new THREE.AmbientLight("white", 1.0);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight("white", 2.0);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);
    const pointLight = new THREE.PointLight(0xffffff, 1.0);
    pointLight.position.set(-10, 10, 10);
    scene.add(pointLight);

    // 원형 텍스처 (별 모양) 생성
    const circleCanvas = document.createElement("canvas");
    circleCanvas.width = 256;
    circleCanvas.height = 256;
    const circleContext = circleCanvas.getContext("2d");
    const centerX = circleCanvas.width / 2;
    const centerY = circleCanvas.height / 2;
    // 중심부 밝은 영역
    const coreGradient = circleContext.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      centerX * 0.3
    );
    coreGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    coreGradient.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
    coreGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    // 외부 글로우 효과
    const outerGradient = circleContext.createRadialGradient(
      centerX,
      centerY,
      centerX * 0.3,
      centerX,
      centerY,
      centerX
    );
    outerGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
    outerGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
    outerGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    circleContext.beginPath();
    circleContext.arc(centerX, centerY, centerX, 0, Math.PI * 2);
    circleContext.fillStyle = outerGradient;
    circleContext.fill();
    circleContext.beginPath();
    circleContext.arc(centerX, centerY, centerX * 0.3, 0, Math.PI * 2);
    circleContext.fillStyle = coreGradient;
    circleContext.fill();
    const circleTexture = new THREE.CanvasTexture(circleCanvas);
    circleTexture.minFilter = THREE.LinearFilter;
    circleTexture.magFilter = THREE.LinearFilter;

    // 파티클 생성 (diaryEmotions 배열에 따라)
    const createParticles = () => {
      const particles = new THREE.Group();
      diaryEmotions.forEach((emotion) => {
        const { xvalue, yvalue, isCurrentUser } = emotion;
        // Colors 매핑을 통해 HEX 색상 얻기
        const hexColor = getColor({ x: xvalue, y: yvalue });
        const color = new THREE.Color(hexColor);

        // 기본 파티클 생성
        const spriteMaterial = new THREE.SpriteMaterial({
          map: circleTexture,
          color: color,
          transparent: true,
          blending: THREE.AdditiveBlending,
          opacity: 0.8,
          depthWrite: false,
        });
        const particle = new THREE.Sprite(spriteMaterial);
        const size = (Math.random() * 2.0 + 1.0) * 2;
        particle.scale.set(size, size, 1);

        // 파티클 위치 (랜덤 분포)
        const radius = 30 + Math.random() * 10;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        particle.position.x = radius * Math.sin(theta) * Math.cos(phi);
        particle.position.y = radius * Math.sin(theta) * Math.sin(phi);
        particle.position.z = radius * Math.cos(theta);
        particles.add(particle);

        // 현재 사용자 감정인 경우 별도 파티클 생성 및 빛 효과 적용
        if (isCurrentUser) {
          console.log("현재 사용자 감정:", emotion, "매칭 색상:", hexColor);
          const myEmotionMaterial = new THREE.SpriteMaterial({
            map: circleTexture,
            color: color,
            transparent: true,
            blending: THREE.AdditiveBlending,
            opacity: 1.0,
          });
          const myEmotionParticle = new THREE.Sprite(myEmotionMaterial);
          myEmotionParticle.scale.set(size * 2, size * 2, 1);
          myEmotionParticle.position.copy(particle.position);
          myEmotionParticle.userData.sparkle = true;
          myEmotionParticle.userData.originalPosition = myEmotionParticle.position.clone();

          // 추가 빛 효과
          const emotionLight = new THREE.PointLight(color, 2, 15);
          emotionLight.position.copy(particle.position);
          particles.add(emotionLight);
          particles.add(myEmotionParticle);
        }
      });
      scene.add(particles);
      return particles;
    };

    const particleGroup = createParticles();
    particleGroupRef.current = particleGroup;

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;
      particleGroup.rotation.y += 0.001;
      particleGroup.children.forEach((child) => {
        if (child.isSprite) {
          child.rotation.y += 0.02;
          if (child.userData.sparkle) {
            child.material.opacity = 0.8 + 0.2 * Math.abs(Math.sin(time * 3));
          }
        }
      });

      if (hoveredParticleRef.current) {
        const origPos = hoveredParticleRef.current.userData.originalPosition;
        hoveredParticleRef.current.position.copy(
          origPos.clone().add(new THREE.Vector3(0, Math.sin(time * 3) * 0.5, 0))
        );
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    window.addEventListener("resize", handleResize);

    // 마우스 포인터 이벤트 처리 (현재 사용자 감정 파티클 위에서 효과)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const handlePointerMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(particleGroup.children, true);
      let found = false;
      for (let intersect of intersects) {
        if (intersect.object.userData && intersect.object.userData.sparkle) {
          setHovering(true);
          hoveredParticleRef.current = intersect.object;
          found = true;
          break;
        }
      }
      if (!found) {
        setHovering(false);
        hoveredParticleRef.current = null;
      }
    };
    mountRef.current.addEventListener("pointermove", handlePointerMove);

    return () => {
      // 🎯 mountRef.current가 존재할 때만 이벤트 제거
      if (mountRef.current) {
        mountRef.current.removeEventListener("pointermove", handlePointerMove);
      }

      // 🎯 window 이벤트 리스너도 제거
      window.removeEventListener("resize", handleResize);
      // mountRef.current.removeEventListener("pointermove", handlePointerMove);
      // 🎯 애니메이션 프레임 중지
      cancelAnimationFrame(animationFrameId);

      // 🎯 렌더러가 존재하면 정리
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      // 🎯 씬에서 파티클 제거 (null 체크 추가)
      if (sceneRef.current && particleGroupRef.current) {
        particleGroupRef.current.children.forEach((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
        sceneRef.current.remove(particleGroupRef.current);
      }

      // 🎯 DOM에서 렌더러 제거
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // particleGroup.children.forEach((child) => {
      //   if (child.geometry) child.geometry.dispose();
      //   if (child.material) child.material.dispose();
      // });

      // scene.remove(particleGroup);
      // renderer.dispose();
      // 🎯 메모리 해제
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
    };
  }, [isMaximized, diaryEmotions]);

  // 좌측 버튼: 이전 날로 이동
  const handlePrevious = () => {
    setSelectedDate((prevDate) => {
      const date = new Date(prevDate);
      date.setDate(date.getDate() - 1);
      return date.toISOString().split("T")[0];
    });
  };

  // 우측 버튼: 다음 날로 이동
  const handleNext = () => {
    setSelectedDate((prevDate) => {
      const date = new Date(prevDate);
      date.setDate(date.getDate() + 1);
      return date.toISOString().split("T")[0];
    });
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-4 right-4 flex gap-2 flex-col">
        <button
            onClick={() => navigate("/")}
            className="bg-white/10 p-2 rounded-full hover:bg-white/50 transition-colors"
          >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
      {/* UI 메시지 오버레이 */}
      <div
        className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded shadow-lg text-lg transition-opacity duration-500 ${
          hovering ? "opacity-100" : "opacity-0"
        }`}
      >
        당신의 감정이 우리의 은하를 빛내고 있습니다
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center text-white">
        <h1 className="text-2xl font-bold mb-2">우리의 우주</h1>
        <p className="text-sm opacity-80">
          "오늘, 당신의 마음은 어떤 별에 머무르고 있나요?"
        </p>
        <p className="mt-2 text-sm">날짜: {selectedDate}</p>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={handlePrevious}
          className="bg-white/30 p-2 rounded-full hover:bg-white/40 transition-colors"
        >
          <ChevronLeft className="text-white w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="bg-white/30 p-2 rounded-full hover:bg-white/40 transition-colors"
        >
          <ChevronRight className="text-white w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ParticlePlanetGallery;
