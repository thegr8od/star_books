import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import universeApi from "../../api/useUniverseApi";
import starlineApi from "../../api/useStarlineApi";

// 달마다 고정 배치할 좌표
const monthPositions = [
  { x: -20, y: 8, z: 0 },    // 1월
  { x: -7,  y: 8, z: 0 },    // 2월
  { x: 7,   y: 8, z: 0 },    // 3월
  { x: 20,  y: 8, z: 0 },    // 4월

  { x: -20, y: -4,  z: 0 },  // 5월
  { x: -7,  y: -4,  z: 0 },  // 6월
  { x: 7,   y: -4,  z: 0 },  // 7월
  { x: 20,  y: -4,  z: 0 },  // 8월

  { x: -20, y: -16, z: 0 },  // 9월
  { x: -7,  y: -16, z: 0 },  // 10월
  { x: 7,   y: -16, z: 0 },  // 11월
  { x: 20,  y: -16, z: 0 },  // 12월
];

function ConstellationDetail() {
  const { year, month } = useParams();
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const labelRendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);

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
        const months = month ? [parseInt(month, 10)] : [1,2,3,4,5,6,7,8,9,10,11,12];
        const monthlyResults = [];

        for (const m of months) {
          const universeResponse = await universeApi.getMonthlyPersonalUniv({ year, month: m });
          const starlineResponse = await starlineApi.getMonthlyStarlineCoords({ year, month: m });

          console.log(`Month ${m} - Universe:`, universeResponse);
          console.log(`Month ${m} - Starline:`, starlineResponse);

          if (universeResponse.status === "C000" && starlineResponse.status === "C000") {
            monthlyResults.push({
              month: m,
              data: universeResponse.data,      // 우주(감정) 데이터
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

      // xcoord, ycoord → 좌표
      const points = monthData.data.map((emotion) => ({
        x: (emotion.xcoord / 10) * 2,
        y: (emotion.ycoord / 10) * 2,
        emotionId: emotion.diaryEmotionId,
      }));

      // 선: startEmotionId, endEmotionId를 points 인덱스로 매핑
      const lines = monthData.starlines
        .map((line) => ({
          start: points.findIndex((p) => p.emotionId === line.startEmotionId),
          end: points.findIndex((p) => p.emotionId === line.endEmotionId),
        }))
        .filter((line) => line.start !== -1 && line.end !== -1);

      return { month: monthData.month, points, lines };
    });
  };

  // (3) Three.js 렌더링
  useEffect(() => {
    if (!mountRef.current || loading) return;

    const processedData = processData();

    // 만약 개별 보기 모드이고, currentIndex가 데이터 범위를 벗어나면 0으로 초기화
    if (!isMaximized && currentIndex >= processedData.length) {
      setCurrentIndex(0);
    }

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 배경 그라데이션
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = 2;
    bgCanvas.height = 512;
    const bgContext = bgCanvas.getContext("2d");
    const gradient = bgContext.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, "#00001B");
    gradient.addColorStop(1, "#000000");
    bgContext.fillStyle = gradient;
    bgContext.fillRect(0, 0, 2, 512);
    scene.background = new THREE.CanvasTexture(bgCanvas);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 80);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls (회전 비활성화, 줌만 가능)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 40;
    controls.maxDistance = 120;
    controls.enableRotate = false;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.8;
    controls.enablePan = false;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 배경 별
    const starsGeometry = new THREE.BufferGeometry();
    const count = 50000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 1000;
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 })
    );
    scene.add(stars);

    // 조명
    scene.add(new THREE.AmbientLight("white", 0.5));
    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);

    // CSS2DRenderer
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0";
    labelRenderer.domElement.style.pointerEvents = "none";
    mountRef.current.appendChild(labelRenderer.domElement);
    labelRendererRef.current = labelRenderer;

    // 별자리 생성 함수
    const createConstellation = (monthData, index) => {
      const group = new THREE.Group();
      const starCluster = new THREE.Group();

      // z 계산(간단히 x,y 거리)
      const calculateZ = (x, y) => {
        const distance = Math.sqrt(x * x + y * y);
        const maxZ = 1.5;
        return (distance / 2) * maxZ;
      };

      // 임의 색상
      const starColors = [
        0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff, 0x44ffff,
        0xffaa44, 0x44ffaa, 0xaa44ff, 0xffff88, 0xff88ff, 0x88ffff,
      ];

      const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
      const pointZValues = {};

      // 각 별 생성
      monthData.points.forEach((point, idx) => {
        const z = calculateZ(point.x, point.y);
        pointZValues[idx] = z;
        const starMaterial = new THREE.MeshBasicMaterial({
          color: starColors[idx % starColors.length],
          emissive: starColors[idx % starColors.length],
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 1,
        });
        const star = new THREE.Mesh(sphereGeometry, starMaterial);
        star.position.set(point.x, point.y, z);
        starCluster.add(star);
      });

      // 선 생성
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.6,
      });
      monthData.lines.forEach((line) => {
        if (monthData.points[line.start] && monthData.points[line.end]) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(
              monthData.points[line.start].x,
              monthData.points[line.start].y,
              pointZValues[line.start]
            ),
            new THREE.Vector3(
              monthData.points[line.end].x,
              monthData.points[line.end].y,
              pointZValues[line.end]
            ),
          ]);
          const constellationLine = new THREE.Line(geometry, lineMaterial.clone());
          starCluster.add(constellationLine);
        }
      });

      // 별자리 중심 계산
      let centerX = 0, centerY = 0, centerZ = 0;
      monthData.points.forEach((point, idx) => {
        centerX += point.x;
        centerY += point.y;
        centerZ += pointZValues[idx] || 0;
      });
      if (monthData.points.length > 0) {
        centerX /= monthData.points.length;
        centerY /= monthData.points.length;
        centerZ /= monthData.points.length;
      }

      // 월 표시
      if (monthData.points.length > 0) {
        const labelDiv = document.createElement("div");
        labelDiv.className = "bg-white/30 text-white px-2 py-1 rounded-full text-sm";
        labelDiv.textContent = `${monthData.month}월`;
        const monthLabel = new CSS2DObject(labelDiv);
        // 별자리 위로 6만큼
        monthLabel.position.set(centerX, centerY + 6, centerZ);
        starCluster.add(monthLabel);
      }

      starCluster.position.set(0, 0, 0);
      group.add(starCluster);

      // 전체 그룹 위치 (monthIndex)
      const monthIndex = monthData.month - 1;
      const { x, y, z } = monthPositions[monthIndex];
      group.position.set(x, y, z);

      return group;
    };

    // 메인 그룹
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // **전체 보기 vs 개별 보기**  
    // 전체 보기: 모든 달 표시  
    // 개별 보기: currentIndex에 해당하는 달만 표시
    const allData = processedData; // 줄여쓰기
    if (isMaximized) {
      // 전체 보기
      allData.forEach((monthData, i) => {
        const constellation = createConstellation(monthData, i);
        mainGroup.add(constellation);
      });
    } else {
      // 개별 보기
      if (allData.length > 0) {
        // currentIndex가 범위 내인지 재확인
        const safeIndex = Math.min(currentIndex, allData.length - 1);
        const constellation = createConstellation(allData[safeIndex], safeIndex);
        mainGroup.add(constellation);
      }
    }

    // 애니메이션 루프
    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      controls.update();

      // 전체 그룹을 살짝 회전
      mainGroup.rotation.y += 0.001;

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
      return animationId;
    };
    const animationId = animate();

    // 리사이즈
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      labelRenderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      mountRef.current?.removeChild(renderer.domElement);
      mountRef.current?.removeChild(labelRenderer.domElement);
      renderer.dispose();
    };
  }, [isMaximized, loading, currentIndex]);

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">로딩 중...</div>;
  }

  if (error) {
    return <div className="w-full h-screen flex items-center justify-center">에러: {error}</div>;
  }

  // 개별 보기에서 이전 달
  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) return universeData.length - 1;
      return prev - 1;
    });
  };

  // 개별 보기에서 다음 달
  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev === universeData.length - 1) return 0;
      return prev + 1;
    });
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <div ref={mountRef} className="w-full h-full" />

      {/* 오른쪽 상단 버튼: 전체 보기 <-> 개별 보기 토글 */}
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

      {/* 개별 보기 모드이면서, 데이터가 2개 이상일 때 이전/다음 버튼 표시 */}
      {!isMaximized && universeData.length > 1 && (
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
