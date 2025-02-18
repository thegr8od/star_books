import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import { Plus, X, ZoomIn, ZoomOut } from "lucide-react";
import ConstellationCreateModal from "../../components/Modal/ConstellationCreateModal";
import useGalleryApi from "../../api/useGalleryApi";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

function ConstellationAi() {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const labelRendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [constellations, setConstellations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // 별자리 오브젝트 생성 함수를 컴포넌트 내부로 이동
  const createConstellationObject = (constellation) => {
    const group = new THREE.Group();

    // 선 그리기 - 더 부드럽고 은은하게
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });

    // 별 그리기 - 크기 조정
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      transparent: true,
      opacity: 0.8,
      map: generateStarTexture(),
      blending: THREE.AdditiveBlending,
    });

    // 빛나는 효과를 위한 색상
    const glowColors = ["#FFE4B5", "#FFD700", "#FFA500"].map(
      (color) => new THREE.Color(color)
    );

    if (constellation.lines) {
      constellation.lines.forEach((line) => {
        const startX = (line.startX - 50) / 2;
        const startY = -((line.startY - 50) / 2);
        const endX = (line.endX - 50) / 2;
        const endY = -((line.endY - 50) / 2);

        // 선 사이의 은은한 빛 효과
        const glowGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const glowCount = Math.floor(Math.random() * 3) + 2; // 2-4개의 빛나는 점

        for (let i = 0; i < glowCount; i++) {
          const t = i / (glowCount - 1);
          const x = startX + (endX - startX) * t;
          const y = startY + (endY - startY) * t;
          const z = Math.random() * 2 - 1;

          const glowMaterial = new THREE.MeshBasicMaterial({
            color: glowColors[Math.floor(Math.random() * glowColors.length)],
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
          });

          const glow = new THREE.Mesh(glowGeometry, glowMaterial);
          glow.position.set(x, y, z);
          glow.userData = {
            initialOpacity: 0.3,
            pulseSpeed: Math.random() * 0.002 + 0.001,
            time: Math.random() * Math.PI * 2,
          };
          group.add(glow);
        }

        // 선 그리기
        const geometry = new THREE.BufferGeometry();
        const linePoints = [
          new THREE.Vector3(startX, startY, 0),
          new THREE.Vector3(endX, endY, 0),
        ];
        geometry.setFromPoints(linePoints);
        const lineObject = new THREE.Line(geometry, material);
        group.add(lineObject);

        // 별 그리기
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array([
          startX,
          startY,
          0,
          endX,
          endY,
          0,
        ]);
        starGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(starPositions, 3)
        );
        const stars = new THREE.Points(starGeometry, starMaterial);
        group.add(stars);
      });
    }

    return group;
  };

  // 별 텍스처 생성 함수
  const generateStarTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    return new THREE.CanvasTexture(canvas);
  };

  // 별자리 목록 가져오기
  const fetchConstellations = async () => {
    try {
      const response = await useGalleryApi.getUserConstellations();
      console.log("받아온 별자리 데이터:", response); // 데이터 확인용 로그

      if (response && response.data) {
        setConstellations(response.data);

        // 3D 오브젝트 업데이트
        if (sceneRef.current) {
          updateConstellations(response.data);
        }
      }
    } catch (error) {
      console.error("별자리 목록 조회 실패:", error);
      if (error.message.includes("로그인")) {
        alert(error.message);
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 3D 오브젝트 업데이트 함수
  const updateConstellations = (data) => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;

    // 기존 별자리 제거
    const existingGroup = scene.getObjectByName("constellationGroup");
    if (existingGroup) {
      scene.remove(existingGroup);
    }

    // 새로운 별자리 그룹 생성
    const constellationGroup = new THREE.Group();
    constellationGroup.name = "constellationGroup";

    // 구 형태로 배치하기 위한 설정
    const radius = 200; // 구의 반지름
    const phi = Math.PI * (3 - Math.sqrt(5)); // 황금각

    data.forEach((constellation, index) => {
      const constellationObject = createConstellationObject(constellation);

      // 구면 좌표계 계산
      const y = 1 - (index / (data.length - 1)) * 2; // -1에서 1 사이의 값
      const radiusAtY = Math.sqrt(1 - y * y); // 현재 y 위치에서의 반지름

      const theta = phi * index; // 황금각을 이용한 회전

      // 직교 좌표계로 변환
      const x = Math.cos(theta) * radiusAtY * radius;
      const z = Math.sin(theta) * radiusAtY * radius;
      const yPos = y * radius;

      // 위치 설정
      constellationObject.position.set(x, yPos, z);

      // 중심을 향하도록 회전
      constellationObject.lookAt(new THREE.Vector3(0, 0, 0));

      // 개별 회전을 위한 초기 각도 설정
      constellationObject.userData = {
        rotationSpeed: Math.random() * 0.02 + 0.01,
        originalPosition: new THREE.Vector3(x, yPos, z),
        gridPosition: calculateGridPosition(index, data.length),
      };

      constellationGroup.add(constellationObject);
    });

    scene.add(constellationGroup);

    // 렌더러 업데이트 강제
    if (rendererRef.current && cameraRef.current) {
      rendererRef.current.render(scene, cameraRef.current);
    }
  };

  // 격자 위치 계산 함수 추가
  const calculateGridPosition = (index, total) => {
    const cols = Math.ceil(Math.sqrt(total));
    const spacing = 50;

    const col = index % cols;
    const row = Math.floor(index / cols);

    return new THREE.Vector3(
      (col - cols / 2) * spacing,
      (row - Math.floor(total / cols) / 2) * spacing,
      0
    );
  };

  // 카메라 거리에 따른 배치 전환 함수 추가
  const updatePositionsBasedOnZoom = () => {
    if (!sceneRef.current || !controlsRef.current) return;

    const distance = controlsRef.current.getDistance();
    const threshold = 300; // 전환 기준점
    const constellationGroup =
      sceneRef.current.getObjectByName("constellationGroup");

    if (!constellationGroup) return;

    constellationGroup.children.forEach((object) => {
      if (!object.userData.originalPosition || !object.userData.gridPosition)
        return;

      // 거리에 따른 보간
      const t = Math.smoothstep(200, threshold, distance);
      const newPosition = new THREE.Vector3();

      newPosition.lerpVectors(
        object.userData.gridPosition,
        object.userData.originalPosition,
        t
      );

      object.position.copy(newPosition);

      // 거리에 따라 중심을 향하도록 회전
      if (t > 0.5) {
        object.lookAt(new THREE.Vector3(0, 0, 0));
      } else {
        object.rotation.set(0, 0, 0);
      }
    });
  };

  // Math.smoothstep 함수 추가
  Math.smoothstep = (min, max, value) => {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  };

  // animateCamera 함수 추가
  const animateCamera = (
    targetPosition,
    duration,
    easeType = "easeOutCubic"
  ) => {
    const startPosition = controlsRef.current.getDistance();
    const startTime = Date.now();

    const easing = {
      easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
      easeOutElastic: (t) => {
        const p = 0.3;
        return (
          Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1
        );
      },
    };

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = easing[easeType](progress);
      const newPosition =
        startPosition + (targetPosition - startPosition) * easeProgress;
      controlsRef.current.dollyTo(newPosition, false);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  // 줌 상태를 위한 함수 추가
  const handleZoomIn = () => {
    if (!controlsRef.current) return;
    const targetDistance = 150; // 가까운 거리
    animateCamera(targetDistance, 1000, "easeOutCubic");
  };

  const handleZoomOut = () => {
    if (!controlsRef.current) return;
    const targetDistance = 500; // 먼 거리
    animateCamera(targetDistance, 1000, "easeOutCubic");
  };

  // Three.js 렌더링 useEffect 수정
  useEffect(() => {
    if (!mountRef.current || isLoading) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 500); // 초기 거리를 500으로 설정
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
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.8;
    controls.minDistance = 100; // 최소 줌인 거리
    controls.maxDistance = 600; // 최대 줌아웃 거리
    controls.maxPolarAngle = Math.PI;
    controls.minPolarAngle = 0;
    controls.enablePan = true;
    controls.panSpeed = 0.8;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    // 마우스 상태 추적
    let isDragging = false;
    let previousMousePosition = {
      x: 0,
      y: 0,
    };

    // 마우스 이벤트 핸들러 수정
    const handleMouseDown = (event) => {
      if (controlsRef.current) {
        isDragging = true;
        controlsRef.current.autoRotate = false; // 드래그 시작시 자동 회전 비활성화
        previousMousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
      }
    };

    const handleMouseMove = (event) => {
      if (!isDragging || !controlsRef.current || !cameraRef.current) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
      };

      // 드래그 거리 계산
      const dragDistance = Math.sqrt(
        deltaMove.x * deltaMove.x + deltaMove.y * deltaMove.y
      );

      if (dragDistance > 0) {
        // 궤도 회전
        const camera = cameraRef.current;
        const target = controlsRef.current.target;

        // 현재 카메라 위치에서 타겟까지의 벡터
        const offset = new THREE.Vector3().subVectors(camera.position, target);

        // 수평 회전
        const theta = -deltaMove.x * 0.002;
        const rotationMatrix = new THREE.Matrix4().makeRotationY(theta);
        offset.applyMatrix4(rotationMatrix);

        // 수직 회전
        const phi = -deltaMove.y * 0.002;
        const rightVector = new THREE.Vector3()
          .crossVectors(camera.up, offset)
          .normalize();
        const verticalRotation = new THREE.Matrix4().makeRotationAxis(
          rightVector,
          phi
        );
        offset.applyMatrix4(verticalRotation);

        // 카메라 위치 업데이트
        camera.position.copy(target).add(offset);
        camera.lookAt(target);

        // 드래그 속도에 따른 줌 조정
        const zoomFactor = Math.min(dragDistance / 100, 0.1);
        const currentDistance = controlsRef.current.getDistance();
        const newDistance = currentDistance * (1 - zoomFactor);

        if (
          newDistance > controls.minDistance &&
          newDistance < controls.maxDistance
        ) {
          controlsRef.current.dollyTo(newDistance, true);
        }
      }

      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handleMouseUp = () => {
      if (controlsRef.current) {
        isDragging = false;

        // 일정 시간 후 자동 회전 재개
        setTimeout(() => {
          if (controlsRef.current) {
            controlsRef.current.autoRotate = true;
          }
        }, 1500);

        // 부드러운 줌아웃
        const currentDistance = controlsRef.current.getDistance();
        if (currentDistance < controls.maxDistance * 0.5) {
          const targetDistance = Math.min(
            currentDistance * 1.3,
            controls.maxDistance
          );
          animateCamera(targetDistance, 1000, "easeOutCubic");
        }
      }
    };

    const handleWheel = (event) => {
      if (!controlsRef.current) return;

      const zoomSpeed = 0.1;
      const delta = -Math.sign(event.deltaY);
      const currentDistance = controlsRef.current.getDistance();
      const newDistance = currentDistance * (1 - delta * zoomSpeed);

      if (
        newDistance > controls.minDistance &&
        newDistance < controls.maxDistance
      ) {
        controlsRef.current.dollyTo(newDistance, true);
      }
    };

    // 이벤트 리스너 추가
    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);
    renderer.domElement.addEventListener("mouseleave", handleMouseUp);
    renderer.domElement.addEventListener("wheel", handleWheel);

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
    scene.background = texture;

    // 별자리 그룹 생성
    const constellationGroup = new THREE.Group();

    // 별자리 데이터가 있을 때만 처리
    if (constellations.length > 0) {
      updateConstellations(constellations);
    }

    // 배경 별들
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
    mountRef.current.appendChild(labelRenderer.domElement);
    labelRendererRef.current = labelRenderer;

    // 애니메이션
    const animate = () => {
      const animationId = requestAnimationFrame(animate);

      const constellationGroup =
        sceneRef.current?.getObjectByName("constellationGroup");
      if (constellationGroup) {
        // 빛나는 효과 업데이트
        constellationGroup.traverse((child) => {
          if (child.isMesh && child.userData.pulseSpeed) {
            child.userData.time += child.userData.pulseSpeed;
            child.material.opacity =
              child.userData.initialOpacity +
              Math.sin(child.userData.time) * 0.15;
          }
        });
      }

      // 배경 별들 천천히 회전
      stars.rotation.y += 0.0001;

      // 줌 레벨에 따른 위치 업데이트
      updatePositionsBasedOnZoom();

      if (controlsRef.current) {
        controlsRef.current.update();
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
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseup", handleMouseUp);
      renderer.domElement.removeEventListener("mouseleave", handleMouseUp);
      renderer.domElement.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(animationId);
      mountRef.current?.removeChild(renderer.domElement);
      mountRef.current?.removeChild(labelRenderer.domElement);
      renderer.dispose();
    };
  }, [constellations, isLoading]);

  // 컴포넌트 최상단에 useEffect 추가
  useEffect(() => {
    fetchConstellations();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative w-full h-screen bg-black">
      {/* 상단 버튼 그룹 수정 */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="bg-white/30 p-2 rounded-full hover:bg-white/40 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* 줌 아웃 버튼 */}
        <button
          onClick={handleZoomOut}
          className="bg-white/30 p-2 rounded-full hover:bg-white/40 transition-colors"
          title="전체 보기"
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </button>

        {/* 줌 인 버튼 */}
        <button
          onClick={handleZoomIn}
          className="bg-white/30 p-2 rounded-full hover:bg-white/40 transition-colors"
          title="자세히 보기"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>

        {/* AI 별자리 만들기 버튼 */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white/30 p-2 rounded-full hover:bg-white/40 transition-colors"
          title="AI 별자리 만들기"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      <div ref={mountRef} className="w-full h-full" />

      {/* AI 별자리 생성 모달 */}
      <ConstellationCreateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchConstellations();
        }}
        constellationData={{
          color: ["#FFD700", "#FFA500", "#FF4500"],
          count: 5,
        }}
      />
    </div>
  );
}

export default ConstellationAi;
