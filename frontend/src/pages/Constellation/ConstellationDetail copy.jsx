import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import GetColor from "../../components/GetColor";
import universeApi from "../../api/useUniverseApi";
import starlineApi from "../../api/useStarlineApi";

function ConstellationDetail() {
  const { year } = useParams();
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const labelRendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);

  const [isMaximized, setIsMaximized] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [universeData, setUniverseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        // 월별 데이터 순차적 처리
        const monthlyResults = [];

        // 각 월별로 순차적으로 데이터 처리
        for (const month of months) {
          // 유니버스 데이터 요청
          const universeResponse = await universeApi.getMonthlyPersonalUniv({
            year,
            month,
          });
          console.log(universeResponse);
          console.log(universeResponse.status);

          // 별자리 선 데이터 요청
          const starlineResponse = await starlineApi.getMonthlyStarlineCoords({
            year,
            month,
          });
          console.log(starlineResponse);
          console.log(starlineResponse.status);

          if (
            universeResponse.status === "success" &&
            starlineResponse.status === "success"
          ) {
            monthlyResults.push({
              month,
              universeData: universeResponse.data,
              starlineData: starlineResponse.data,
            });
          } else {
            monthlyResults.push({
              month,
              universeData: null,
              starlineData: null,
            });
          }
        }

        // 월별 데이터 정리
        const processedData = [];

        // 각 월의 데이터를 정리된 형태로 저장
        for (const monthResult of monthlyResults) {
          const monthlyData = {
            month: monthResult.month,
            data: monthResult.universeData, // 유니버스(감정) 데이터
            starlines: monthResult.starlineData, // 별자리 선 데이터
          };
          processedData.push(monthlyData);
        }

        // 유니버스 데이터 저장 (전체 월 데이터)
        setUniverseData(processedData);
        setLoading(false);
      } catch (err) {
        console.error("데이터 가져오기 실패:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  // 데이터 처리 로직
  const processData = () => {
    return universeData.map((monthData) => {
      if (!monthData.data || !monthData.starlines) {
        return {
          month: monthData.month,
          points: [],
          lines: [],
        };
      }

      const emotions = monthData.data;

      return {
        month: monthData.month,
        points: emotions.map((emotion) => ({
          x: (emotion.xCoord / 10) * 2,
          y: (emotion.yCoord / 10) * 2,
          emotionId: emotion.diaryEmotionId,
          xvalue: emotion.xvalue,
          yvalue: emotion.yvalue,
        })),
        lines: monthData.starlines
          .map((line) => ({
            start: emotions.findIndex(
              (e) => e.diaryEmotionId === line.startEmotionId
            ),
            end: emotions.findIndex(
              (e) => e.diaryEmotionId === line.endEmotionId
            ),
          }))
          .filter((line) => line.start !== -1 && line.end !== -1),
      };
    });
  };

  // Three.js 렌더링
  useEffect(() => {
    if (!mountRef.current || loading) return;

    const constellationData = processData();
    const totalConstellations = constellationData.length;

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
    camera.position.set(0, isMaximized ? 0 : 0, isMaximized ? 40 : 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // 배경 별
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
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
      })
    );
    scene.add(stars);

    // 조명
    const ambientLight = new THREE.AmbientLight("white", 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);

    // CSS2DRenderer
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

    // 별자리 생성 함수
    const createConstellation = (monthData) => {
      const group = new THREE.Group();

      const calculateZ = (x, y) => {
        const distanceFromCenter = Math.sqrt(x * x + y * y);
        const maxDistance = 2;
        const maxZ = 1.5;
        return (distanceFromCenter / maxDistance) * maxZ;
      };

      // 별 색상 배열 추가
      const starColors = [
        0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff, 0x44ffff, 0xffaa44,
        0x44ffaa, 0xaa44ff, 0xffff88, 0xff88ff, 0x88ffff,
      ];

      const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
      const pointZValues = {};
      const starsArr = [];

      // 별 생성 부분 수정
      monthData.points.forEach((point, idx) => {
        const z = calculateZ(point.x, point.y);
        pointZValues[idx] = z;

        // GetColor 대신 미리 정의된 색상 사용
        const starMaterial = new THREE.MeshBasicMaterial({
          color: starColors[idx % starColors.length],
          emissive: starColors[idx % starColors.length],
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 1,
        });

        const star = new THREE.Mesh(sphereGeometry, starMaterial);
        star.position.set(point.x, point.y, z);
        star.userData = {
          originalScale: star.scale.clone(),
          pulseTime: Math.random() * Math.PI * 2,
        };
        starsArr.push(star);
        group.add(star);
      });

      // 선 생성 부분 수정
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.6, // 투명도 증가
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
          const constellationLine = new THREE.Line(
            geometry,
            lineMaterial.clone()
          );
          group.add(constellationLine);
        }
      });

      // 월 표시 레이블
      const labelDiv = document.createElement("div");
      labelDiv.className =
        "bg-white/30 text-white px-2 py-0.5 rounded-full text-sm";
      labelDiv.textContent = `${monthData.month}월`;
      const label = new CSS2DObject(labelDiv);
      label.position.set(0, 3.5, 0);
      group.add(label);

      return group;
    };

    // 메인 그룹
    const mainGroup = new THREE.Group();

    if (isMaximized) {
      // 전체 보기
      const cols = 4;
      const rows = Math.ceil(totalConstellations / cols);
      const spacing = 6;
      const verticalSpacing = 10;

      // 연도 레이블
      const yearLabelDiv = document.createElement("div");
      yearLabelDiv.className =
        "bg-white/30 text-white px-3 py-1 rounded-full text-sm";
      yearLabelDiv.textContent = year;
      const yearLabel = new CSS2DObject(yearLabelDiv);
      yearLabel.position.set(0, (rows * verticalSpacing) / 2 + 4, 0);
      mainGroup.add(yearLabel);

      // 각 월별 별자리 생성 및 배치
      constellationData.forEach((monthData, i) => {
        const constellation = createConstellation(monthData);
        const row = Math.floor(i / cols);
        const col = i % cols;
        constellation.position.x = (col - (cols - 1) / 2) * spacing;
        constellation.position.y = -(row - (rows - 1) / 2) * verticalSpacing;
        mainGroup.add(constellation);
      });
    } else {
      // 개별 보기
      const constellation = createConstellation(
        constellationData[currentIndex]
      );
      mainGroup.add(constellation);
    }

    scene.add(mainGroup);

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();

      // mainGroup 회전
      mainGroup.children.forEach((constellation) => {
        constellation.rotation.y += 0.005;
      });

      // 배경 별 회전
      if (stars) {
        // stars가 정의되어 있는지 확인
        stars.rotation.y += 0.0001;
      }

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
      return animationId;
    };
    const animationId = animate();

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
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      mountRef.current?.removeChild(renderer.domElement);
      mountRef.current?.removeChild(labelRenderer.domElement);
      renderer.dispose();
    };
  }, [isMaximized, currentIndex, loading]);

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

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? universeData.length - 1 : prev - 1
    );
  };
  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === universeData.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <div ref={mountRef} className="w-full h-full" />

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

      {!isMaximized && universeData.length > 0 && (
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
