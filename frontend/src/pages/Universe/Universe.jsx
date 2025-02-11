import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

const PlanetGallery = () => {
  const mountRef = useRef(null);
  const [isMaximized, setIsMaximized] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Planet Data
  const planetData = [
    { name: "Mercury", color: 0x4B9CD3, size: 0.8, emotion: "#기쁜" },
    { name: "Venus", color: 0xFDB813, size: 1.2, emotion: "#행복한" },
    { name: "Earth", color: 0x2E8B57, size: 1.2, emotion: "#편안한" },
    { name: "Mars", color: 0xCD5C5C, size: 1.0, emotion: "#지루한" },
    { name: "Jupiter", color: 0xF4A460, size: 2.0, emotion: "#지친" },
    { name: "Saturn", color: 0xDAA520, size: 1.8, emotion: "#슬픈" },
    { name: "Uranus", color: 0x4682B4, size: 1.5, emotion: "#짜증난" },
    { name: "Neptune", color: 0x4169E1, size: 1.5, emotion: "#화난" }
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    
    // Gradient Background
    const bgCanvas = document.createElement('canvas');
    const bgContext = bgCanvas.getContext('2d');
    bgCanvas.width = 2;
    bgCanvas.height = 512;

    const gradient = bgContext.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(0.5, '#000038');
    gradient.addColorStop(1, '#000025');

    bgContext.fillStyle = gradient;
    bgContext.fillRect(0, 0, 2, 512);

    const texture = new THREE.CanvasTexture(bgCanvas);
    scene.background = texture;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = isMaximized ? 50 : 8;
    camera.position.y = isMaximized ? 30 : 2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 100;
    controls.minDistance = 5;

    // Lights
    const ambientLight = new THREE.AmbientLight('white', 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('white', 1);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);

    // Create Planets Group
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // Create Planets
    const planets = planetData.map((data, index) => {
      const geometry = new THREE.SphereGeometry(data.size, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: data.color,
        shininess: 25
      });
      const planet = new THREE.Mesh(geometry, material);

      // Add glow effect
      const glowMaterial = new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load('/glow.png'),
        color: data.color,
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      const glow = new THREE.Sprite(glowMaterial);
      glow.scale.set(data.size * 4, data.size * 4, 1);
      planet.add(glow);

      // Position planets
      if (isMaximized) {
        const radius = 20;
        const angle = (index / planetData.length) * Math.PI * 2;
        planet.position.x = Math.cos(angle) * radius;
        planet.position.z = Math.sin(angle) * radius;
      } else {
        if (index === currentIndex) {
          planet.position.set(0, 0, 0);
        } else {
          planet.position.y = -100; // Hide other planets
        }
      }

      planetGroup.add(planet);
      return planet;
    });

    // Create background stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.1,
      transparent: true,
      opacity: 0.8
    });

    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 1000;
      const y = (Math.random() - 0.5) * 1000;
      const z = (Math.random() - 0.5) * 1000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position',
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      planets.forEach(planet => {
        planet.rotation.y += 0.01;
      });
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [isMaximized, currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? planetData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === planetData.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Maximize/Minimize Button */}
      <button
        onClick={() => setIsMaximized(prev => !prev)}
        className="absolute top-4 right-4 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
      >
        {isMaximized ? 
          <Minimize2 className="text-white w-5 h-5" /> : 
          <Maximize2 className="text-white w-5 h-5" />
        }
      </button>

      {/* Navigation Buttons (only in detail view) */}
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
          
          {/* Emotion Tag */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/30 px-3 py-1 rounded-full text-white">
            {planetData[currentIndex].emotion}
          </div>
        </>
      )}

      {/* Title */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center text-white">
        <h1 className="text-2xl font-bold mb-2">우리의 우주</h1>
        <p className="text-sm opacity-80">
          "오늘, 당신의 마음은 어떤 별에 머무르고 있나요?"
        </p>
      </div>
    </div>
  );
};

export default PlanetGallery;