import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import { yearlyConstellationData } from "../../data/dummyConstellationData";

function ConstellationDetail() {
  // URL 파라미터에서 연도 정보 추출
  const { year } = useParams();

  // Three.js 관련 ref들
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const labelRendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);

  // UI 상태 관리
  const [isMaximized, setIsMaximized] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 현재 연도의 별자리 데이터 로드 (없으면 2024년 데이터 사용)
  const yearData =
    yearlyConstellationData[year] || yearlyConstellationData["2024"];
  const totalConstellations = yearData.constellationData.length;

  useEffect(() => {
    if (!mountRef.current) return;

    // ===== Scene 초기화 =====
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 그라데이션 배경 생성
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
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    scene.background = texture;

    // ===== 카메라 설정 =====
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, isMaximized ? 0 : 0, isMaximized ? 40 : 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // ===== 렌더러 설정 =====
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ===== 카메라 컨트롤 설정 =====
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // ===== 배경 별 생성 =====
    const starsGeometry = new THREE.BufferGeometry();
    const count = 50000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 1000;
    }
    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: "yellow",
      transparent: true,
      opacity: 0.6,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // ===== 조명 설정 =====
    const ambientLight = new THREE.AmbientLight("white", 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);

    // ===== 2D 레이블 렌더러 설정 =====
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0";
    labelRenderer.domElement.style.pointerEvents = "none";
    mountRef.current.appendChild(labelRenderer.domElement);
    labelRendererRef.current = labelRenderer;

    // ===== 별자리 생성 함수 =====
    const createConstellation = (index) => {
      const group = new THREE.Group();
      const pattern = yearData.constellationData[index];

      // 0-100 범위의 좌표를 -2~2 범위로 변환하는 함수
      const convertCoordinate = (value) => {
        return ((value - 50) / 25) * 2;
      };

      // z축 위치 계산 (입체감을 위해)
      const calculateZ = (x, y) => {
        const distanceFromCenter = Math.sqrt(x * x + y * y);
        const maxDistance = 2;
        const maxZ = 1.5;
        return (distanceFromCenter / maxDistance) * maxZ;
      };

      const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
      const pointZValues = {};
      const stars = [];
      const lines = [];

      // 별들 생성
      pattern.points.forEach((point, idx) => {
        const convertedX = convertCoordinate(point.x);
        const convertedY = convertCoordinate(point.y);
        const z = calculateZ(convertedX, convertedY);
        pointZValues[idx] = z;

        const starMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(point.color),
          emissive: new THREE.Color(point.color),
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0,
        });

        const star = new THREE.Mesh(sphereGeometry, starMaterial);
        star.position.set(convertedX, convertedY, z);
        star.userData = {
          originalScale: star.scale.clone(),
          pulseTime: Math.random() * Math.PI * 2,
        };
        stars.push(star);
        group.add(star);
      });

      // 별자리 선 생성
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0,
      });

      pattern.lines.forEach((line) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(
            convertCoordinate(line.startX),
            convertCoordinate(line.startY),
            calculateZ(
              convertCoordinate(line.startX),
              convertCoordinate(line.startY)
            )
          ),
          new THREE.Vector3(
            convertCoordinate(line.endX),
            convertCoordinate(line.endY),
            calculateZ(
              convertCoordinate(line.endX),
              convertCoordinate(line.endY)
            )
          ),
        ]);

        const constellationLine = new THREE.Line(
          geometry,
          lineMaterial.clone()
        );
        lines.push(constellationLine);
        group.add(constellationLine);
      });

      // 월 표시 레이블 생성
      const labelDiv = document.createElement("div");
      labelDiv.className =
        "bg-white/30 text-white px-2 py-0.5 rounded-full text-[8px]";
      labelDiv.textContent = `${index + 1}월`;
      const label = new CSS2DObject(labelDiv);
      label.position.set(0, 3.5, 0);
      group.add(label);

      // 페이드인 및 펄스 애니메이션
      let startTime = null;
      const animate = (time) => {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;

        stars.forEach((star, index) => {
          const delay = index * 100;
          if (elapsed > delay) {
            const fadeProgress = Math.min((elapsed - delay) / 500, 1);
            star.material.opacity = fadeProgress;

            const pulseAmount = 0.2;
            const pulse =
              Math.sin(elapsed * 0.002 + star.userData.pulseTime) *
                pulseAmount +
              1;
            star.scale.set(
              star.userData.originalScale.x * pulse,
              star.userData.originalScale.y * pulse,
              star.userData.originalScale.z * pulse
            );
          }
        });

        lines.forEach((line, index) => {
          const delay = stars.length * 100 + index * 50;
          if (elapsed > delay) {
            const fadeProgress = Math.min((elapsed - delay) / 300, 1);
            line.material.opacity = fadeProgress * 0.6;
          }
        });

        if (elapsed < (stars.length + lines.length) * 100 + 1000) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
      return group;
    };

    // ===== 메인 별자리 그룹 생성 =====
    const mainGroup = new THREE.Group();

    if (isMaximized) {
      // 전체 보기 모드
      const cols = 4;
      const rows = Math.ceil(totalConstellations / cols);
      const spacing = 6;
      const verticalSpacing = 10;

      // 연도 레이블 생성
      const yearLabelDiv = document.createElement("div");
      yearLabelDiv.className =
        "bg-white/30 text-white px-3 py-1 rounded-full text-sm";
      yearLabelDiv.textContent = year;
      const yearLabel = new CSS2DObject(yearLabelDiv);
      yearLabel.position.set(0, (rows * verticalSpacing) / 2 + 4, 0);
      mainGroup.add(yearLabel);

      // 격자 형태로 별자리 배치
      for (let i = 0; i < totalConstellations; i++) {
        const constellation = createConstellation(i);
        const row = Math.floor(i / cols);
        const col = i % cols;

        constellation.position.x = (col - (cols - 1) / 2) * spacing;
        constellation.position.y = -(row - (rows - 1) / 2) * verticalSpacing;

        mainGroup.add(constellation);
      }
    } else {
      // 개별 보기 모드
      const constellation = createConstellation(currentIndex);
      mainGroup.add(constellation);
    }

    scene.add(mainGroup);

    // ===== 애니메이션 루프 =====
    const animate = () => {
      const animationId = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      mainGroup.children.forEach((constellation) => {
        constellation.rotation.y += 0.005;
      });

      stars.rotation.y += 0.0001;

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
      return animationId;
    };

    const animationId = animate();

    // ===== 윈도우 리사이즈 핸들러 =====
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;

      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
      labelRenderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };

    window.addEventListener("resize", handleResize);

    // ===== 클린업 =====
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      mountRef.current?.removeChild(renderer.domElement);
      mountRef.current?.removeChild(labelRenderer.domElement);
      renderer.dispose();
    };
  }, [isMaximized, currentIndex, year, totalConstellations]);

  // ===== 이전/다음 별자리 핸들러 =====
  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? totalConstellations - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === totalConstellations - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <div ref={mountRef} className="w-full h-full" />

      {/* 최대화/최소화 버튼 */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setIsMaximized((prev) => !prev)}
          className="bg-white/10 p-2 rounded-full hover:bg-white/50 transition-colors"
        >
          {isMaximized ? (
            <Minimize2 className="text-white w-5 h-5" />
          ) : (
            <Maximize2 className="text-white w-5 h-5" />
          )}
        </button>
      </div>

      {/* 이전/다음 버튼 (최소화 모드에서만 표시) */}
      {!isMaximized && (
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
      )}
    </div>
  );
}

export default ConstellationDetail;
