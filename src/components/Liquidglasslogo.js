import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LiquidGlassLogo = ({ shape = 'hexagon', size = 400 }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 4;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create geometry based on shape
    let geometry;
    switch (shape) {
      case 'hexagon':
        geometry = createHexagonGeometry();
        break;
      case 'diamond':
        geometry = createDiamondGeometry();
        break;
      case 'crystal':
        geometry = createCrystalGeometry();
        break;
      default:
        geometry = createHexagonGeometry();
    }

    // Glass material with refraction effect
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.0,
      transmission: 0.95,
      thickness: 1.5,
      envMapIntensity: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      ior: 2.33,
      reflectivity: 1.0,
      iridescence: 1.0,
      iridescenceIOR: 1.5,
      iridescenceThicknessRange: [100, 800],
      sheen: 1.0,
      sheenRoughness: 0.2,
      sheenColor: new THREE.Color(0.5, 0.5, 1.0),
      specularIntensity: 1.0,
      specularColor: new THREE.Color(1, 1, 1),
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x88ccff, 0.8);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    const pointLight1 = new THREE.PointLight(0xff6600, 0.5, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x0066ff, 0.5, 10);
    pointLight2.position.set(-2, -2, 2);
    scene.add(pointLight2);

    // Environment map for reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x111111);
    
    // Add gradient lights to environment
    const envLight1 = new THREE.PointLight(0xff8866, 2, 50);
    envLight1.position.set(10, 10, 10);
    envScene.add(envLight1);
    
    const envLight2 = new THREE.PointLight(0x6688ff, 2, 50);
    envLight2.position.set(-10, -10, 10);
    envScene.add(envLight2);
    
    const envLight3 = new THREE.PointLight(0x88ff66, 2, 50);
    envLight3.position.set(0, 10, -10);
    envScene.add(envLight3);

    const envMap = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envMap;

    // Animation
    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      if (meshRef.current) {
        // Smooth rotation
        meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.3;
        meshRef.current.rotation.y += 0.008;
        meshRef.current.rotation.z = Math.cos(time * 0.3) * 0.1;

        // Subtle floating motion
        meshRef.current.position.y = Math.sin(time * 0.8) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      geometry.dispose();
      material.dispose();
    };
  }, [shape, size]);

  // Hexagon prism geometry
  function createHexagonGeometry() {
    const shape = new THREE.Shape();
    const sides = 6;
    const radius = 1;
    
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    shape.closePath();

    // Inner triangle hole
    const hole = new THREE.Path();
    const innerRadius = 0.4;
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * innerRadius;
      const y = Math.sin(angle) * innerRadius;
      if (i === 0) {
        hole.moveTo(x, y);
      } else {
        hole.lineTo(x, y);
      }
    }
    hole.closePath();
    shape.holes.push(hole);

    const extrudeSettings = {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 5,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }

  // Diamond/gem geometry
  function createDiamondGeometry() {
    const geometry = new THREE.OctahedronGeometry(1.2, 0);
    geometry.scale(1, 1.3, 1);
    return geometry;
  }

  // Crystal geometry
  function createCrystalGeometry() {
    const geometry = new THREE.IcosahedronGeometry(1.1, 0);
    return geometry;
  }

  return (
    <div 
      ref={containerRef}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
};

export default LiquidGlassLogo;