import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Plus, X, ZoomIn, ZoomOut } from "lucide-react";
import ConstellationCreateModal from "../../components/Modal/ConstellationCreateModal";
import useGalleryApi from "../../api/useGalleryApi";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import Tooltip from "../../components/Tooltip";
import Alert from "../../components/Alert";

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
  const [showTooltips, setShowTooltips] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const navigate = useNavigate();

  // 별자리 오브젝트 생성 함수를 컴포넌트 내부로 이동
  const createConstellationObject = (constellation) => {
    const group = new THREE.Group();

    // 별자리 크기 조정을 위한 스케일 팩터
    const scale = 1.5; // 크기를 1.5배로 증가

    // 선 그리기 - 더 밝고 선명하게
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8, // 불투명도 증가
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    // 별 그리기 - 크기와 밝기 증가
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2, // 별 크기 증가
      transparent: true,
      opacity: 1.0, // 완전 불투명
      map: generateStarTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });

    // 빛나는 효과를 위한 색상
    const glowColors = ["#FFE4B5", "#FFD700", "#FFA500"].map(
      (color) => new THREE.Color(color)
    );

    if (constellation.lines) {
      constellation.lines.forEach((line) => {
        // 좌표 변환 시 스케일 적용
        const startX = ((line.startX - 50) / 2) * scale;
        const startY = -((line.startY - 50) / 2) * scale;
        const endX = ((line.endX - 50) / 2) * scale;
        const endY = -((line.endY - 50) / 2) * scale;

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

  // 피보나치 구면 배치를 위한 함수 추가
  const getFibonacciSpherePosition = (index, total, radius) => {
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.PI * (1 + Math.sqrt(5)) * index;

    return {
      x: radius * Math.cos(theta) * Math.sin(phi),
      y: radius * Math.sin(theta) * Math.sin(phi),
      z: radius * Math.cos(phi),
    };
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
    const radius = 400; // 반지름 증가
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

      // 각 별자리 객체에 렌더링 설정
      constellationObject.traverse((child) => {
        if (child.material) {
          child.material = child.material.clone();
          child.material.transparent = true;
          child.material.depthWrite = false;
          child.material.depthTest = false;
          child.material.blending = THREE.AdditiveBlending;
          child.renderOrder = data.length - index; // 렌더링 순서를 인덱스 기반으로 설정
        }
      });

      // 구면 좌표계 위치 계산
      const spherePos = getFibonacciSpherePosition(index, data.length, radius);
      const spherePosition = new THREE.Vector3(
        spherePos.x,
        spherePos.y + radius * 0.2, // y값을 약간 올려서 바닥과 거리를 둠
        spherePos.z
      );

      // 격자 위치 계산 (기존 코드 유지)
      const col = index % cols;
      const row = Math.floor(index / cols);
      const baseX = (col - (cols - 1) / 2) * cellWidth;
      const baseY = Math.abs((row - (rows - 1) / 2) * cellHeight);
      const offsetX = (Math.random() - 0.5) * (cellWidth * 0.6);
      const offsetY = Math.random() * (cellHeight * 0.3);
      const distanceFromCenter = Math.sqrt(
        Math.pow(baseX / screenWidth, 2) + Math.pow(baseY / screenHeight, 2)
      );
      const z = (1 - Math.min(distanceFromCenter, 1)) * depthRange;
      const randomPosition = new THREE.Vector3(
        baseX + offsetX,
        baseY + offsetY,
        z
      );

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
      y: 170,
      z: 1040, // 1030에서 1040으로 수정하여 더 뒤로 이동
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

  // 배경 별들 생성을 위한 함수 분리
  const createBackgroundStars = useCallback(() => {
    const starsGeometry = new THREE.BufferGeometry();
    const count = 5000; // 10000에서 5000으로 감소
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
      color: "white",
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    return new THREE.Points(starsGeometry, starsMaterial);
  }, []);

  // 애니메이션 함수 최적화
  const animate = useCallback(() => {
    const animationId = requestAnimationFrame(animate);

    const constellationGroup =
      sceneRef.current?.getObjectByName("constellationGroup");
    if (constellationGroup) {
      // 빛나는 효과 업데이트를 requestAnimationFrame 외부로 이동
      constellationGroup.traverse((child) => {
        if (child.isMesh && child.userData.pulseSpeed) {
          child.userData.time += child.userData.pulseSpeed;
          child.material.opacity =
            child.userData.initialOpacity +
            Math.sin(child.userData.time) * 0.15;
        }
      });

      // 자체 회전도 필요한 경우만 수행
      constellationGroup.children.forEach((constellation) => {
        if (constellation.userData.selfRotating) {
          constellation.rotation.y += constellation.userData.rotationSpeed;
        }
      });
    }

    // Controls 업데이트
    if (controlsRef.current) {
      controlsRef.current.update();
    }

    if (rendererRef.current && cameraRef.current && sceneRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      labelRendererRef.current?.render(sceneRef.current, cameraRef.current);
    }

    return animationId;
  }, []);

  // Three.js 렌더링 useEffect 수정
  useEffect(() => {
    if (!mountRef.current || isLoading) return;

    // Scene 설정
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.set(0, 100, 1200);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer 설정
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 성능을 위해 픽셀 비율 제한
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
    controls.zoomSpeed = 1.5;
    controls.minDistance = 200;
    controls.maxDistance = 2000;
    controls.maxPolarAngle = Math.PI;
    controls.minPolarAngle = 0;
    controls.enablePan = true;
    controls.panSpeed = 0.8;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enabled = true;
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
        // autoRotate 비활성화 제거
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

        const right = new THREE.Vector3();
        camera.getWorldDirection(right);
        right.cross(camera.up).normalize();
        camera.position.addScaledVector(right, -deltaMove.x * moveSpeed);
        controlsRef.current.target.addScaledVector(
          right,
          -deltaMove.x * moveSpeed
        );

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
        // setTimeout 제거
      }
    };

    const handleMouseWheel = (event) => {
      // GSAP 애니메이션 대신 OrbitControls의 기본 줌 기능 사용
      // 이벤트를 가로채지 않고 OrbitControls가 처리하도록 함
      return true;
    };

    // 우클릭 메뉴 방지
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    // 터치 이벤트도 동일한 방식으로 처리
    const handleTouchStart = (event) => {
      if (event.touches.length === 1 && controlsRef.current) {
        isDragging = true;
        controlsRef.current.autoRotate = false;
        previousMousePosition = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (event) => {
      if (isDragging && controlsRef.current && cameraRef.current) {
        const deltaMove = {
          x: event.touches[0].clientX - previousMousePosition.x,
          y: event.touches[0].clientY - previousMousePosition.y,
        };

        if (event.touches.length === 1) {
          // 터치 드래그: 시점 회전
          controlsRef.current.rotateLeft(deltaMove.x * 0.002);
          controlsRef.current.rotateUp(deltaMove.y * 0.002);
        } else if (event.touches.length === 2) {
          // 터치 드래그: 이동
          const camera = cameraRef.current;
          const distance = camera.position.distanceTo(
            controlsRef.current.target
          );
          const moveSpeed = distance * 0.001;

          const right = new THREE.Vector3();
          camera.getWorldDirection(right);
          right.cross(camera.up).normalize();
          camera.position.addScaledVector(right, -deltaMove.x * moveSpeed);
          controlsRef.current.target.addScaledVector(
            right,
            -deltaMove.x * moveSpeed
          );

          camera.position.addScaledVector(camera.up, -deltaMove.y * moveSpeed);
          controlsRef.current.target.addScaledVector(
            camera.up,
            -deltaMove.y * moveSpeed
          );
        }

        previousMousePosition = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }
    };

    const handleTouchEnd = () => {
      if (controlsRef.current) {
        isDragging = false;
        // setTimeout 제거
      }
    };

    // 이벤트 리스너 추가
    renderer.domElement.addEventListener("contextmenu", handleContextMenu);
    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);
    renderer.domElement.addEventListener("mouseleave", handleMouseUp);

    // 이벤트 리스너에 touchend 추가
    renderer.domElement.addEventListener("touchstart", handleTouchStart);
    renderer.domElement.addEventListener("touchmove", handleTouchMove);
    renderer.domElement.addEventListener("touchend", handleTouchEnd);

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

    // 배경 별들 추가 (정적)
    const stars = createBackgroundStars();
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

    // 애니메이션 시작
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
      renderer.domElement.removeEventListener("contextmenu", handleContextMenu);
      renderer.domElement.removeEventListener("touchstart", handleTouchStart);
      renderer.domElement.removeEventListener("touchmove", handleTouchMove);
      renderer.domElement.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationId);
      mountRef.current?.removeChild(renderer.domElement);
      mountRef.current?.removeChild(labelRenderer.domElement);
      renderer.dispose();
    };
  }, [constellations, isLoading, createBackgroundStars, animate]);

  // 컴포넌트 최상단에 useEffect 추가
  useEffect(() => {
    fetchConstellations();
  }, []);

  // 별자리 위치 계산을 위한 새로운 함수
  const calculateNonOverlappingPosition = (index, totalCount) => {
    const minDistance = 50; // 최소 거리
    const attempts = 50; // 최대 시도 횟수

    for (let i = 0; i < attempts; i++) {
      const pos = getFibonacciPosition(index);

      // 다른 별자리들과의 거리 확인
      let isOverlapping = false;
      for (let j = 0; j < index; j++) {
        const otherPos = getFibonacciPosition(j);
        const distance = Math.sqrt(
          Math.pow(pos.x - otherPos.x, 2) + Math.pow(pos.y - otherPos.y, 2)
        );

        if (distance < minDistance) {
          isOverlapping = true;
          break;
        }
      }

      if (!isOverlapping) {
        return pos;
      }
    }

    // 기본 위치 반환
    return getFibonacciPosition(index);
  };

  // 기존 createConstellationObject 함수 내부에서 위치 계산 시 사용
  const getConstellationPosition = (index, total) => {
    return calculateNonOverlappingPosition(index, total);
  };

  // 모달 닫기 함수 수정
  const handleModalClose = (status) => {
    setIsModalOpen(false);
    if (status === "C000") {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 2000);
      fetchConstellations();
    }
  };

  useEffect(() => {
    // 초기 접속 시 3초 후 툴팁 숨기기
    const timer = setTimeout(() => {
      setShowTooltips(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative w-full h-screen bg-black">
      {/* 상단 버튼 그룹 수정 */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* 뒤로가기 버튼 */}
        <div className="relative flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/30 p-2 rounded-full hover:bg-white/40 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* 줌 아웃 버튼 */}
        <div className="relative flex items-center">
          <button
            onClick={handleZoomOut}
            className="bg-white/30 p-2 rounded-full hover:bg-white/40 transition-colors"
            title="전체 보기"
          >
            <ZoomOut className="w-5 h-5 text-white" />
          </button>
          <Tooltip show={showTooltips} text="별자리를 멀리서 볼 수 있어요" />
        </div>

        {/* 줌 인 버튼 */}
        <div className="relative flex items-center">
          <button
            onClick={handleZoomIn}
            className="bg-white/30 p-2 rounded-full hover:bg-white/40 transition-colors"
            title="자세히 보기"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </button>
          <Tooltip show={showTooltips} text="별자리를 크게 볼 수 있어요" />
        </div>

        {/* AI 별자리 만들기 버튼 */}
        <div className="relative flex items-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white/30 p-2 rounded-full hover:bg-white/40 transition-colors"
            title="AI 별자리 만들기"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
          <Tooltip show={showTooltips} text="사진을 별자리로 바꿔요" />
        </div>
      </div>

      <div ref={mountRef} className="w-full h-full" />

      {/* AI 별자리 생성 모달 */}
      <ConstellationCreateModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        constellationData={{
          color: ["#FFD700", "#FFA500", "#FF4500"],
          count: 5,
        }}
      />

      <Alert
        show={showSuccessAlert}
        message="소중한 추억이 우주에 저장됐어요!"
      />
    </div>
  );
}

export default ConstellationAi;
