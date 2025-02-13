import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";

const ParticlePlanetGallery = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const [isMaximized, setIsMaximized] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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

    // 파티클 그룹 생성
    const particleGroups = emotionGroups.map((group, groupIndex) => {
      const particles = new THREE.Group();

      for (let i = 0; i < group.particleCount; i++) {
        const size = Math.random() * 1.1 + 0.1;
        const isLarge = Math.random() < 0.1;
        const finalSize = isLarge ? size * 2 : size;
        const geometry = new THREE.SphereGeometry(finalSize, 16, 16);

        const material = new THREE.MeshPhongMaterial({
          color: group.color,
          shininess: 100,
          transparent: true,
          opacity: Math.random() * 0.3 + 0.7,
          emissive: group.color,
          emissiveIntensity: 0.5,
        });

        const particle = new THREE.Mesh(geometry, material);

        if (isMaximized) {
          const radius = 30 + Math.random() * 10;
          const phi = Math.random() * Math.PI * 2;
          const theta = Math.random() * Math.PI;
          const groupOffset = (groupIndex / emotionGroups.length) * Math.PI * 2;

          particle.position.x =
            radius * Math.sin(theta) * Math.cos(phi + groupOffset);
          particle.position.y =
            radius * Math.sin(theta) * Math.sin(phi + groupOffset);
          particle.position.z = radius * Math.cos(theta);
        } else {
          if (groupIndex === currentIndex) {
            const radius = 10;
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;

            particle.position.x = radius * Math.sin(theta) * Math.cos(phi);
            particle.position.y = radius * Math.sin(theta) * Math.sin(phi);
            particle.position.z = radius * Math.cos(theta);
          } else {
            particle.position.y = -1000;
          }
        }

        const glowMaterial = new THREE.SpriteMaterial({
          map: new THREE.TextureLoader().load("/glow.png"),
          color: group.color,
          transparent: true,
          blending: THREE.AdditiveBlending,
          opacity: 0.8,
        });
        const glow = new THREE.Sprite(glowMaterial);
        glow.scale.set(finalSize * 6, finalSize * 6, 1);
        particle.add(glow);

        particles.add(particle);
      }

      scene.add(particles);
      return particles;
    });

    // 배경 별 생성
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.15,
      transparent: true,
      opacity: 1.0,
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // 애니메이션
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      particleGroups.forEach((group, index) => {
        if (isMaximized || index === currentIndex) {
          group.rotation.y += 0.001;
          group.children.forEach((particle) => {
            particle.rotation.y += 0.03;
          });
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
      particleGroups.forEach((group) => {
        group.children.forEach((particle) => {
          particle.geometry.dispose();
          particle.material.dispose();
          particle.children[0].material.dispose();
        });
        scene.remove(group);
      });

      starsGeometry.dispose();
      starsMaterial.dispose();
      scene.remove(stars);

      renderer.dispose();

      // ref 초기화
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
    };
  }, [isMaximized, currentIndex]);

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
