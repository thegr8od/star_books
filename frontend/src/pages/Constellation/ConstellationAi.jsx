import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Plus, X, ZoomIn, ZoomOut } from "lucide-react";
import ConstellationCreateModal from "../../components/Modal/ConstellationCreateModal";
import useGalleryApi from "../../api/useGalleryApi";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

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
  const [isDetailView, setIsDetailView] = useState(false);

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

    // 구면 배치를 위한 설정
    const radius = 300; // 구의 반지름 증가
    const phi = Math.PI * (3 - Math.sqrt(5));

    // 화면 영역 설정
    const screenWidth = 600; // 좌우 범위 확대
    const screenHeight = 400; // 상하 범위 확대
    const depthRange = 200; // 깊이 범위 축소하여 더 평면적으로

    // 그리드 설정
    const cols = Math.ceil(Math.sqrt(data.length));
    const rows = Math.ceil(data.length / cols);
    const cellWidth = screenWidth / cols;
    const cellHeight = screenHeight / rows;

    data.forEach((constellation, index) => {
      const constellationObject = createConstellationObject(constellation);

      // 그리드 위치 계산
      const col = index % cols;
      const row = Math.floor(index / cols);

      // 기본 위치 계산 (그리드 중심)
      const baseX = (col - (cols - 1) / 2) * cellWidth;
      const baseY = (row - (rows - 1) / 2) * cellHeight;

      // 랜덤 오프셋 추가 (그리드 셀 내에서만)
      const offsetX = (Math.random() - 0.5) * (cellWidth * 0.6);
      const offsetY = (Math.random() - 0.5) * (cellHeight * 0.6);

      // 중앙에서의 거리에 따른 Z값 계산
      const distanceFromCenter = Math.sqrt(
        Math.pow(baseX / screenWidth, 2) + Math.pow(baseY / screenHeight, 2)
      );

      // 중앙에 가까울수록 앞으로 나오게
      const z = (1 - Math.min(distanceFromCenter, 1)) * depthRange;

      const randomPosition = new THREE.Vector3(
        baseX + offsetX,
        baseY + offsetY,
        z
      );

      // 구면 좌표계 위치도 더 균일하게 분포
      const spherePosition = new THREE.Vector3();
      const phi = Math.acos(-1 + (2 * row) / rows);
      const theta = (2 * Math.PI * col) / cols;

      spherePosition.x = radius * Math.sin(phi) * Math.cos(theta);
      spherePosition.y = radius * Math.cos(phi);
      spherePosition.z = radius * Math.sin(phi) * Math.sin(theta);

      // 초기 위치 설정
      constellationObject.position.copy(spherePosition);
      constellationObject.lookAt(new THREE.Vector3(0, 0, 0));

      // 위치 정보 저장
      constellationObject.userData = {
        id: constellation.id,
        spherePosition: spherePosition.clone(),
        randomPosition: randomPosition.clone(),
        sphereRotation: new THREE.Euler().copy(constellationObject.rotation),
      };

      constellationGroup.add(constellationObject);
    });

    scene.add(constellationGroup);

    // 렌더러 업데이트 강제
    if (rendererRef.current && cameraRef.current) {
      rendererRef.current.render(scene, cameraRef.current);
    }
  };

  // 별자리 배치 전환 함수 추가
  const transitionConstellations = (type, duration = 2000) => {
    const constellationGroup =
      sceneRef.current?.getObjectByName("constellationGroup");
    if (!constellationGroup) return;

    constellationGroup.children.forEach((object) => {
      object.userData.isClickable = type === "random";

      const targetPosition =
        type === "sphere"
          ? object.userData.spherePosition
          : object.userData.randomPosition;

      const targetRotation =
        type === "sphere"
          ? object.userData.sphereRotation
          : new THREE.Euler(0, 0, 0);

      // GSAP를 사용한 부드러운 전환
      gsap.to(object.position, {
        duration: duration / 1000,
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        ease: "power2.inOut",
      });

      gsap.to(object.rotation, {
        duration: duration / 1000,
        x: targetRotation.x,
        y: targetRotation.y,
        z: targetRotation.z,
        ease: "power2.inOut",
        onComplete: () => {
          // 격자 배치에서만 자체 회전 시작
          if (type === "random") {
            object.userData.selfRotating = true;
            // 각 별자리마다 약간 다른 회전 속도 부여
            object.userData.rotationSpeed = 0.002 + Math.random() * 0.002;
          } else {
            object.userData.selfRotating = false;
          }
        },
      });
    });
  };

  // handleZoomIn 함수 수정
  const handleZoomIn = () => {
    if (!controlsRef.current || !cameraRef.current) return;
    setIsDetailView(true);
    transitionConstellations("random");

    // 카메라 위치 조정
    gsap.to(cameraRef.current.position, {
      duration: 2,
      x: 0,
      y: 150, // 약간 위에서 내려다보는 각도 유지
      z: 600,
      ease: "power2.inOut",
    });

    controlsRef.current.autoRotate = false;
  };

  // handleZoomOut 함수 수정
  const handleZoomOut = () => {
    if (!controlsRef.current || !cameraRef.current) return;
    setIsDetailView(false);

    // 카메라 이동을 먼저 시작
    gsap.to(cameraRef.current.position, {
      duration: 1,
      x: 0,
      y: 100,
      z: 1000, // 카메라를 더 멀리 이동
      ease: "power2.inOut",
      onComplete: () => {
        // 카메라가 충분히 멀어진 후 별자리 전환 시작
        transitionConstellations("sphere", 2000);
        setTimeout(() => {
          controlsRef.current.autoRotate = true;
        }, 2000);
      },
    });
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
    camera.position.set(0, 100, 1000); // 초기 거리를 더 멀리 설정
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
    controls.dampingFactor = 0.1;
    controls.screenSpacePanning = false;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = false;
    controls.minDistance = 600; // 최소 거리 증가
    controls.maxDistance = 2000; // 최대 거리 증가
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

      if (event.buttons === 1) {
        // 좌클릭 드래그: 시점 회전
        controlsRef.current.rotateLeft(deltaMove.x * 0.002);
        controlsRef.current.rotateUp(deltaMove.y * 0.002);
      } else if (event.buttons === 2) {
        // 우클릭 드래그: 이동
        const camera = cameraRef.current;
        const distance = camera.position.distanceTo(controlsRef.current.target);
        const moveSpeed = distance * 0.001;

        // 카메라 좌우 이동
        const right = new THREE.Vector3();
        camera.getWorldDirection(right);
        right.cross(camera.up).normalize();
        camera.position.addScaledVector(right, -deltaMove.x * moveSpeed);
        controlsRef.current.target.addScaledVector(
          right,
          -deltaMove.x * moveSpeed
        );

        // 카메라 상하 이동
        camera.position.addScaledVector(camera.up, -deltaMove.y * moveSpeed);
        controlsRef.current.target.addScaledVector(
          camera.up,
          -deltaMove.y * moveSpeed
        );
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
      }
    };

    const handleMouseWheel = (event) => {
      if (!controlsRef.current || !cameraRef.current) return;

      event.preventDefault();

      const zoomSpeed = 0.1; // 속도 조정
      const delta = -Math.sign(event.deltaY);

      // 현재 카메라 방향으로 이동
      const forward = new THREE.Vector3();
      cameraRef.current.getWorldDirection(forward);

      // 이동 거리 계산 (거리에 비례하여 속도 조정)
      const currentDistance = cameraRef.current.position.length();
      const moveDistance =
        delta * zoomSpeed * Math.max(currentDistance * 0.1, 10);

      // 최소/최대 거리 체크
      const newDistance = currentDistance - moveDistance;
      if (
        newDistance > controls.minDistance &&
        newDistance < controls.maxDistance
      ) {
        cameraRef.current.position.addScaledVector(forward, moveDistance);
        controlsRef.current.target.addScaledVector(forward, moveDistance * 0.5);
      }
    };

    // 우클릭 메뉴 방지
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    // 이벤트 리스너 추가
    renderer.domElement.addEventListener("contextmenu", handleContextMenu);
    renderer.domElement.addEventListener("wheel", handleMouseWheel, {
      passive: false,
    });
    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);
    renderer.domElement.addEventListener("mouseleave", handleMouseUp);

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

        // 각 별자리의 자체 회전 업데이트
        constellationGroup.children.forEach((constellation) => {
          if (constellation.userData.selfRotating) {
            constellation.rotation.y += constellation.userData.rotationSpeed;
          }
        });
      }

      // 배경 별들 천천히 회전
      stars.rotation.y += 0.0001;

      // Controls 업데이트
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
      renderer.domElement.removeEventListener("wheel", handleMouseWheel);
      renderer.domElement.removeEventListener("contextmenu", handleContextMenu);
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
