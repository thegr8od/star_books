import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { useSelector } from "react-redux";
import GetColor from "./GetColor";

const ParticlePlanetGallery = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const [isMaximized, setIsMaximized] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [diaryEmotions, setDiaryEmotions] = useState([]);
  const [allEmotions, setAllEmotions] = useState([]);
  const user = useSelector((state) => state.user);

  // 감정별 행성 데이터
  const emotionGroups = [
    { emotion: "#기쁜", color: 0x00ffff, particleCount: 50 },
    { emotion: "#행복한", color: 0xffff00, particleCount: 50 },
    { emotion: "#편안한", color: 0x00ff80, particleCount: 50 },
    { emotion: "#지루한", color: 0xff6b6b, particleCount: 50 },
    { emotion: "#지친", color: 0xffa500, particleCount: 50 },
    { emotion: "#슬픈", color: 0xffd700, particleCount: 50 },
    { emotion: "#짜증난", color: 0x40e0d0, particleCount: 50 },
    { emotion: "#화난", color: 0x6495ed, particleCount: 50 },
  ];

  // API 호출 함수 추가
  const fetchEmotions = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken"); // ✅ 로컬스토리지에서 토큰 가져오기
        console.log("Access Token:", accessToken);

        if (!accessToken) {
            console.error("인증 토큰이 없습니다.");
            return;
        }

        const today = new Date().toISOString().split("T")[0];
        console.log("API 요청 URL:", `https://starbooks.site/api/diary/emotion?diaryDate=${today}`);
        console.log("요청 헤더:", {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        });

        const response = await fetch(`https://starbooks.site/api/diary/emotion?diaryDate=${today}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });

        console.log("API 응답 상태:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("응답 에러 내용:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("받아온 데이터:", data);

        if (Array.isArray(data)) {
            setDiaryEmotions(data);
        } else {
            console.error("예상치 못한 데이터 형식:", data);
        }
    } catch (error) {
        console.error("감정 데이터 조회 실패:", error);
        setDiaryEmotions([]);
    }
};


  useEffect(() => {
    fetchEmotions();
  }, []);

  // resize 핸들러 함수
  const handleResize = () => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();

    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 배경 설정
    const bgCanvas = document.createElement("canvas");
    const bgContext = bgCanvas.getContext("2d");
    bgCanvas.width = 2;
    bgCanvas.height = 512;

    const gradient = bgContext.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, "#00001B");
    gradient.addColorStop(1, "#000000");
    bgContext.fillStyle = gradient;
    bgContext.fillRect(0, 0, 2, 512);

    const texture = new THREE.CanvasTexture(bgCanvas);
    scene.background = texture;

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
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    mountRef.current.appendChild(renderer.domElement);

    // 컨트롤 설정
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

    // 더 선명한 별 텍스처 생성
    const circleCanvas = document.createElement('canvas');
    circleCanvas.width = 128;
    circleCanvas.height = 128;
    const circleContext = circleCanvas.getContext('2d');
    
    const centerX = circleCanvas.width / 2;
    const centerY = circleCanvas.height / 2;
    
    // 더 선명한 그라데이션
    const mainGradient = circleContext.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, centerX * 0.7
    );
    mainGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');     // 중심부 완전 불투명
    mainGradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)'); // 더 천천히 페이드
    mainGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
    mainGradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.2)');
    mainGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    // 더 선명한 원형
    circleContext.beginPath();
    circleContext.arc(centerX, centerY, centerX * 0.7, 0, Math.PI * 2);
    circleContext.fillStyle = mainGradient;
    circleContext.fill();

    const circleTexture = new THREE.CanvasTexture(circleCanvas);
    circleTexture.minFilter = THREE.LinearFilter;
    circleTexture.magFilter = THREE.LinearFilter;

    // 파티클 생성 로직 수정
    const createParticles = () => {
      const particles = new THREE.Group();
      
      // 전체 감정 파티클 생성
      diaryEmotions.forEach(emotion => {
        const { xvalue, yvalue } = emotion;
        const color = new THREE.Color(GetColor({ x: xvalue, y: yvalue }));
        
        // 일반 파티클 생성
        const spriteMaterial = new THREE.SpriteMaterial({
          map: circleTexture,
          color: color,
          transparent: true,
          blending: THREE.AdditiveBlending,
          opacity: 0.7,
          depthWrite: false,
        });

        const particle = new THREE.Sprite(spriteMaterial);
        const size = Math.random() * 0.8 + 0.5; // 일반 파티클 크기
        particle.scale.set(size, size, 1);

        // 파티클 위치 설정
        const radius = 30 + Math.random() * 10;
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;

        particle.position.x = radius * Math.sin(theta) * Math.cos(phi);
        particle.position.y = radius * Math.sin(theta) * Math.sin(phi);
        particle.position.z = radius * Math.cos(theta);

        particles.add(particle);

        // 내 감정 파티클은 더 크고 밝게 생성 (각 감정 위치에 추가 파티클)
        const myEmotionMaterial = new THREE.SpriteMaterial({
          map: circleTexture,
          color: color,
          transparent: true,
          blending: THREE.AdditiveBlending,
          opacity: 1.0,
        });

        const myEmotionParticle = new THREE.Sprite(myEmotionMaterial);
        const myEmotionSize = size * 2; // 더 큰 크기
        myEmotionParticle.scale.set(myEmotionSize, myEmotionSize, 1);
        myEmotionParticle.position.copy(particle.position);

        // 빛나는 효과를 위한 PointLight 추가
        const emotionLight = new THREE.PointLight(color, 1, 10);
        emotionLight.position.copy(particle.position);
        particles.add(emotionLight);
        particles.add(myEmotionParticle);
      });

      scene.add(particles);
      return particles;
    };

    const particleGroup = createParticles();

    // 애니메이션
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      particleGroup.rotation.y += 0.001;
      particleGroup.children.forEach(particle => {
        if (particle.isSprite) {
          particle.rotation.y += 0.03;
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // resize 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }

      // 메모리 정리
      particleGroup.children.forEach((particle) => {
        particle.geometry.dispose();
        particle.material.dispose();
      });
      scene.remove(particleGroup);

      renderer.dispose();

      // ref 초기화
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
    };
  }, [isMaximized, currentIndex, diaryEmotions]);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? emotionGroups.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === emotionGroups.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <div ref={mountRef} className="w-full h-full" />

      {!isMaximized && (
        <>
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

          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/30 px-3 py-1 rounded-full text-white">
            {emotionGroups[currentIndex].emotion}
          </div>
        </>
      )}

      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center text-white">
        <h1 className="text-2xl font-bold mb-2">우리의 우주</h1>
        <p className="text-sm opacity-80">
          "오늘, 당신의 마음은 어떤 별에 머무르고 있나요?"
        </p>
      </div>
    </div>
  );
};

export default ParticlePlanetGallery;
