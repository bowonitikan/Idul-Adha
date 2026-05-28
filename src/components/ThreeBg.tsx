import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeBgProps {
  intensity?: number;
}

export default function ThreeBg({ intensity = 1.0 }: ThreeBgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Background Gradient: Deep Islamic Emerald to Midnight Dark
    scene.background = null; // Let CSS handle the background gradient, rendering Three.js on top with transparency makes it extra gorgeous!

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 15;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true, // Transparent bg toblend beautifully with CSS colors
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0x064e3b, 1.5); // Deep emerald light
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xf59e0b, 3, 30); // Golden light
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x10b981, 2, 30); // Radiant green light
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Group to hold all 3D objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Particle Star Field (Golden Celestial light points)
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const goldColor = new THREE.Color(0xd97706); // Warm amber gold

    for (let i = 0; i < particleCount; i++) {
      // Celestial sphere distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 8 + Math.random() * 12; // Radius between 8 and 20

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Light custom color variation (gold to brilliant emerald green)
      const mixedColor = goldColor.clone().lerp(new THREE.Color(0x34d399), Math.random() * 0.4);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom Particle Material (rendering stars as volumetric glowing spheres)
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const starParticles = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(starParticles);

    // 2. Centerpiece: Geometric 3D "Islamic Sacred Star/Kaukab" Ornament
    // Created as an intersecting set of elegant wireframes and polished solid polygons
    const centerpieceGroup = new THREE.Group();
    mainGroup.add(centerpieceGroup);

    // Solid inner octahedron (Gold)
    const innerGeometry = new THREE.OctahedronGeometry(2, 0);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.2,
      metalness: 0.9,
      flatShading: true,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    centerpieceGroup.add(innerMesh);

    // Outer skeletal icosahedron wireframe (Brilliant Gold)
    const outerGeometry = new THREE.IcosahedronGeometry(3.5, 0);
    const outerWireframeGeo = new THREE.WireframeGeometry(outerGeometry);
    const outerMaterial = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const outerWireframe = new THREE.LineSegments(outerWireframeGeo, outerMaterial);
    centerpieceGroup.add(outerWireframe);

    // Additional floating rings (representing orbiting light/sacred balance)
    const ringGeometry = new THREE.TorusGeometry(4.5, 0.05, 8, 64);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.1,
    });
    const orbitRing1 = new THREE.Mesh(ringGeometry, ringMaterial);
    orbitRing1.rotation.x = Math.PI / 3;
    orbitRing1.rotation.y = Math.PI / 4;
    centerpieceGroup.add(orbitRing1);

    const orbitRing2 = new THREE.Mesh(ringGeometry, ringMaterial);
    orbitRing2.rotation.x = -Math.PI / 3;
    orbitRing2.rotation.y = -Math.PI / 4;
    centerpieceGroup.add(orbitRing2);

    // 3. Ambient floating nodes in background
    const microNodeCount = 20;
    const microNodeGeometry = new THREE.DodecahedronGeometry(0.3, 0);
    const microNodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.3,
      metalness: 0.8,
    });
    
    const microNodes: THREE.Mesh[] = [];
    for (let i = 0; i < microNodeCount; i++) {
      const mesh = new THREE.Mesh(microNodeGeometry, microNodeMaterial);
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      
      const speed = 0.005 + Math.random() * 0.01;
      mesh.userData = { speed, rotationSpeed: Math.random() * 0.02 };
      
      mainGroup.add(mesh);
      microNodes.push(mesh);
    }

    // Interactive mouse movement logic
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates to [-1, 1]
      targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation for mouse responsiveness (parallax effect)
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Rotate group gently based on mouse & time
      mainGroup.rotation.y = elapsedTime * 0.05 + currentMouseX * 0.25;
      mainGroup.rotation.x = elapsedTime * 0.02 + currentMouseY * 0.25;

      // Animate center piece distinctly
      centerpieceGroup.rotation.y = -elapsedTime * 0.15;
      centerpieceGroup.rotation.z = elapsedTime * 0.07;
      
      const scaleValue = 1.0 + Math.sin(elapsedTime * 2) * 0.05;
      innerMesh.scale.set(scaleValue, scaleValue, scaleValue);

      // Orbit rings rotation
      orbitRing1.rotation.z = elapsedTime * 0.2;
      orbitRing2.rotation.z = -elapsedTime * 0.2;

      // Animate background floating micro-nodes
      microNodes.forEach((node) => {
        node.position.y += Math.sin(elapsedTime + node.position.x) * 0.003;
        node.rotation.y += node.userData.rotationSpeed;
        node.rotation.x += node.userData.rotationSpeed * 0.5;
      });

      // Adjust particle opacity based on scroll / intensity prop
      particleMaterial.opacity = 0.5 + Math.sin(elapsedTime * 0.8) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer for robust responsive layout fitting
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      
      // Dispose Three assets helper
      particleGeometry.dispose();
      particleMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      outerGeometry.dispose();
      outerMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      microNodeGeometry.dispose();
      microNodeMaterial.dispose();
      renderer.dispose();
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ mixBlendMode: "screen" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        id="hero-three-canvas"
      />
    </div>
  );
}
