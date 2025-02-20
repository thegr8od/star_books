import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import universeApi from "../../api/useUniverseApi";
import starlineApi from "../../api/useStarlineApi";

// 화면 비율에 따른 레이아웃 계산 상수 수정
const LAYOUT = {
  GRID: {
    COLS: 4,
    ROWS: 3,
    SPACING_X: 12, // 가로 간격
    SPACING_Y: 15, // 세로 간격
  },
  CELL: {
    WIDTH: 10, // 각 셀의 기본 너비
    HEIGHT: 12, // 각 셀의 기본 높이
    LABEL_MARGIN: 1.5, // 레이블과 별자리 사이 간격
  },
};

// 달마다 고정 배치할 좌표 수정
const monthPositions = [
  // 첫 번째 줄 (1-4월)
  { x: -18, y: 14, z: 0 }, // 1월
  { x: -6, y: 14, z: 0 }, // 2월
  { x: 6, y: 14, z: 0 }, // 3월
  { x: 18, y: 14, z: 0 }, // 4월

  // 두 번째 줄 (5-8월)
  { x: -18, y: 0, z: 0 }, // 5월
  { x: -6, y: 0, z: 0 }, // 6월
  { x: 6, y: 0, z: 0 }, // 7월
  { x: 18, y: 0, z: 0 }, // 8월

  // 세 번째 줄 (9-12월)
  { x: -18, y: -14, z: 0 }, // 9월
  { x: -6, y: -14, z: 0 }, // 10월
  { x: 6, y: -14, z: 0 }, // 11월
  { x: 18, y: -14, z: 0 }, // 12월
];

function ConstellationDetail() {
  const { year, month } = useParams();
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const labelRendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const constellationLinesRef = useRef([]); // 별자리 선들을 저장할 ref 추가
  const backgroundStarsRef = useRef(null); // 배경 별들을 저장할 ref 추가

  // month 파라미터가 없으면 전체 보기(true), 있으면 개별 보기(false)
  const [isMaximized, setIsMaximized] = useState(!month);

  // 개별 보기 모드에서 "현재 달"을 가리킬 인덱스 (processedData에서의 인덱스)
  const [currentIndex, setCurrentIndex] = useState(0);

  const [universeData, setUniverseData] = useState([]); // API에서 받아온 달별 데이터
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // (1) API에서 월별 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // month가 있으면 해당 월만, 없으면 1~12월
        const months = month
          ? [parseInt(month, 10)]
          : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const monthlyResults = [];

        for (const m of months) {
          const universeResponse = await universeApi.getMonthlyPersonalUniv({
            year,
            month: m,
          });
          const starlineResponse = await starlineApi.getMonthlyStarlineCoords({
            year,
            month: m,
          });

          console.log(`Month ${m} - Universe:`, universeResponse);
          console.log(`Month ${m} - Starline:`, starlineResponse);

          if (
            universeResponse.status === "C000" &&
            starlineResponse.status === "C000"
          ) {
            monthlyResults.push({
              month: m,
              data: universeResponse.data, // 우주(감정) 데이터
              starlines: starlineResponse.data, // 별자리 선 데이터
            });
          } else {
            monthlyResults.push({
              month: m,
              data: null,
              starlines: null,
            });
          }
        }

        setUniverseData(monthlyResults);
        setLoading(false);
      } catch (err) {
        console.error("데이터 가져오기 실패:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month]);

  // (2) API 응답 데이터를 Three.js에서 쓸 형식으로 변환
  const processData = () => {
    // month 기준 오름차순 정렬
    const sorted = universeData.sort((a, b) => a.month - b.month);

    return sorted.map((monthData) => {
      if (!monthData.data || !monthData.starlines) {
        return { month: monthData.month, points: [], lines: [] };
      }

      // xcoord, ycoord를 선의 좌표와 동일한 방식으로 저장
      const points = monthData.data.map((emotion) => ({
        x: emotion.xcoord, // 변환하지 않고 원본 값 그대로 저장
        y: emotion.ycoord, // 변환하지 않고 원본 값 그대로 저장
        emotionId: emotion.diaryEmotionId,
        color: emotion.color || 0xffffff,
      }));

      // 선: startEmotionId, endEmotionId를 points 인덱스로 매핑
      const lines = monthData.starlines.map((line) => ({
        startX:
          monthData.data.find((e) => e.diaryEmotionId === line.startEmotionId)
            ?.xcoord || 0,
        startY:
          monthData.data.find((e) => e.diaryEmotionId === line.startEmotionId)
            ?.ycoord || 0,
        endX:
          monthData.data.find((e) => e.diaryEmotionId === line.endEmotionId)
            ?.xcoord || 0,
        endY:
          monthData.data.find((e) => e.diaryEmotionId === line.endEmotionId)
            ?.ycoord || 0,
      }));

      return { month: monthData.month, points, lines };
    });
  };

  // 별자리 생성 함수 내부 수정
  const createConstellation = (monthData) => {
    const group = new THREE.Group();
    const starCluster = new THREE.Group();

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
    const constellationLines = [];

    // 각 별 생성
    monthData.points.forEach((point, idx) => {
      // 선의 좌표와 동일한 방식으로 변환
      const convertedX = convertCoordinate(point.x);
      const convertedY = convertCoordinate(point.y);
      const z = calculateZ(
        convertCoordinate(point.x),
        convertCoordinate(point.y)
      );
      pointZValues[idx] = z;

      const starMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(point.color || 0xffffff),
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
      starCluster.add(star);
    });

    // 선 생성
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x888888,
      transparent: true,
      opacity: 0,
    });

    monthData.lines.forEach((line) => {
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
          calculateZ(convertCoordinate(line.endX), convertCoordinate(line.endY))
        ),
      ]);

      const constellationLine = new THREE.Line(geometry, lineMaterial.clone());
      constellationLines.push(constellationLine);
      constellationLinesRef.current.push(constellationLine);
      starCluster.add(constellationLine);
    });

    // 월 표시 레이블 생성
    const monthIndex = monthData.month - 1;
    const position = monthPositions[monthIndex];

    const labelDiv = document.createElement("div");
    labelDiv.className =
      "bg-white/30 text-white px-2 py-0.5 rounded-full text-[8px]";
    labelDiv.textContent = `${monthData.month}월`;
    const monthLabel = new CSS2DObject(labelDiv);
    monthLabel.position.set(0, 3.5, 0);
    group.add(monthLabel);

    // 별자리 위치 설정
    group.position.set(
      position.x,
      position.y - LAYOUT.CELL.LABEL_MARGIN,
      position.z
    );

    group.add(starCluster);

    // 페이드인 및 펄스 애니메이션
    let startTime = null;
    const animateConstellation = (time) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;

      stars.forEach((star, index) => {
        const delay = index * 100;
        if (elapsed > delay) {
          const fadeProgress = Math.min((elapsed - delay) / 500, 1);
          star.material.opacity = fadeProgress;

          const pulseAmount = 0.2;
          const pulse =
            Math.sin(elapsed * 0.002 + star.userData.pulseTime) * pulseAmount +
            1;
          star.scale.set(
            star.userData.originalScale.x * pulse,
            star.userData.originalScale.y * pulse,
            star.userData.originalScale.z * pulse
          );
        }
      });

      constellationLines.forEach((line, index) => {
        const delay = stars.length * 100 + index * 50;
        if (elapsed > delay) {
          const fadeProgress = Math.min((elapsed - delay) / 300, 1);
          line.material.opacity = fadeProgress * 0.6;
        }
      });

      if (elapsed < (stars.length + constellationLines.length) * 100 + 1000) {
        requestAnimationFrame(animateConstellation);
      }
    };

    requestAnimationFrame(animateConstellation);
    return { group };
  };

  // 개별 보기 모드일 때 카메라 위치 계산 함수 수정
  const calculateCameraPosition = (monthData) => {
    const monthIndex = monthData.month - 1;
    const position = monthPositions[monthIndex];

    return {
      x: position.x,
      y: position.y,
      z: 20, // 더 가까운 거리로 수정
    };
  };

  // (3) Three.js 렌더링
  useEffect(() => {
    if (!mountRef.current || loading) return;

    const processedData = processData();

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 배경 그라데이션
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

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    if (isMaximized) {
      // 전체 보기 모드
      camera.position.set(0, 0, 40);
      camera.lookAt(0, 0, 0);
    } else {
      // 개별 보기 모드
      const safeIndex = Math.min(currentIndex, processedData.length - 1);
      const monthData = processedData[safeIndex];
      const position = monthPositions[monthData.month - 1];
      camera.position.set(position.x, position.y, 10);
      camera.lookAt(position.x, position.y, 0);
    }

    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    // 크기 설정
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );

    // 픽셀 비율 설정
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

    // DOM에 추가
    mountRef.current.appendChild(renderer.domElement);

    // ref에 저장
    rendererRef.current = renderer;

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

    // 메인 그룹과 레이블 그룹 생성
    const mainGroup = new THREE.Group();
    const labelGroup = new THREE.Group();

    // 그룹들을 scene에 추가
    scene.add(mainGroup);
    scene.add(labelGroup);

    const allData = processedData;
    if (isMaximized) {
      // 전체 보기
      const cols = LAYOUT.GRID.COLS;
      const rows = Math.ceil(allData.length / cols);
      const spacing = LAYOUT.GRID.SPACING_X;
      const verticalSpacing = LAYOUT.GRID.SPACING_Y;

      // 연도 레이블 생성
      const yearLabelDiv = document.createElement("div");
      yearLabelDiv.className =
        "bg-white/30 text-white px-3 py-1 rounded-full text-sm";
      yearLabelDiv.textContent = year;
      const yearLabel = new CSS2DObject(yearLabelDiv);
      yearLabel.position.set(0, (rows * verticalSpacing) / 2 + 4, 0);
      mainGroup.add(yearLabel);

      // 격자 형태로 별자리 배치
      allData.forEach((monthData, i) => {
        const { group } = createConstellation(monthData);
        const row = Math.floor(i / cols);
        const col = i % cols;

        group.position.x = (col - (cols - 1) / 2) * spacing;
        group.position.y = -(row - (rows - 1) / 2) * verticalSpacing;

        mainGroup.add(group);
      });
    } else {
      // 개별 보기
      if (allData.length > 0) {
        const safeIndex = Math.min(currentIndex, allData.length - 1);
        const { group } = createConstellation(allData[safeIndex]);
        mainGroup.add(group);

        // 카메라가 별자리 중심을 바라보도록 설정
        const cameraPos = calculateCameraPosition(allData[safeIndex]);
        camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
        camera.lookAt(cameraPos.x, cameraPos.y, 0);
      }
    }

    // OrbitControls 설정
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // 배경 별 생성
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
    backgroundStarsRef.current = stars; // ref에 저장

    // ===== 조명 설정 =====
    const ambientLight = new THREE.AmbientLight("white", 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);

    // 애니메이션 루프 수정
    const animate = () => {
      const animationId = requestAnimationFrame(animate);

      // OrbitControls 업데이트
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // 별자리 그룹 회전
      mainGroup.children.forEach((constellation) => {
        constellation.rotation.y += 0.005;
      });

      // 배경 별들 회전
      if (backgroundStarsRef.current) {
        backgroundStarsRef.current.rotation.y += 0.0001;
      }

      // 렌더링
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

    return () => {
      // ===== 클린업 =====
      // 이벤트 리스너 제거
      window.removeEventListener("resize", handleResize);

      // 애니메이션 정지
      cancelAnimationFrame(animationId);

      // DOM 요소 제거
      mountRef.current?.removeChild(renderer.domElement);
      mountRef.current?.removeChild(labelRenderer.domElement);

      // 리소스 해제
      renderer.dispose();

      // ref 초기화
      constellationLinesRef.current = [];
      backgroundStarsRef.current = null;
    };
  }, [isMaximized, loading, currentIndex]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        에러: {error}
      </div>
    );
  }

  // ===== 이전/다음 별자리 핸들러 =====
  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) return universeData.length - 1;
      return prev - 1;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev === universeData.length - 1) return 0;
      return prev + 1;
    });
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
