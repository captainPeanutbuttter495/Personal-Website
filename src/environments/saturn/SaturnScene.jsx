// src/environments/saturn/SaturnScene.jsx
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/**
 * Saturn planet with rings and star particles
 * Inspired by theringsofsaturn/the-rings-of-saturn-particles-threejs
 */

// Star particles background
function StarField({ count = 15000 }) {
  const points = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 100;
    }
    return pos;
  }, [count]);

  useFrame(() => {
    if (points.current) {
      points.current.rotation.y += -0.0001;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.15}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

// Saturn's rings
function SaturnRings({ innerRadius = 1.4, outerRadius = 2.5 }) {
  const ringRef = useRef();

  // Create ring geometry with custom UV for gradient
  const geometry = useMemo(() => {
    const geo = new THREE.RingGeometry(innerRadius, outerRadius, 128);
    // Modify UVs for radial gradient
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      const t = (dist - innerRadius) / (outerRadius - innerRadius);
      uv.setXY(i, t, 0.5);
    }
    return geo;
  }, [innerRadius, outerRadius]);

  // Create ring texture with bands
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    // Create gradient with ring bands
    const gradient = ctx.createLinearGradient(0, 0, 512, 0);
    gradient.addColorStop(0, "rgba(180, 160, 140, 0.1)");
    gradient.addColorStop(0.1, "rgba(200, 180, 150, 0.6)");
    gradient.addColorStop(0.2, "rgba(160, 140, 120, 0.3)");
    gradient.addColorStop(0.3, "rgba(190, 170, 140, 0.7)");
    gradient.addColorStop(0.4, "rgba(140, 120, 100, 0.2)");
    gradient.addColorStop(0.5, "rgba(210, 190, 160, 0.8)");
    gradient.addColorStop(0.6, "rgba(170, 150, 130, 0.4)");
    gradient.addColorStop(0.7, "rgba(200, 180, 150, 0.6)");
    gradient.addColorStop(0.85, "rgba(150, 130, 110, 0.3)");
    gradient.addColorStop(1, "rgba(120, 100, 80, 0.1)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// Saturn planet body
function SaturnBody({ radius = 1 }) {
  const meshRef = useRef();

  // Create planet texture with bands
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    // Base color - Saturn's golden/tan color
    ctx.fillStyle = "#c9a227";
    ctx.fillRect(0, 0, 512, 256);

    // Add horizontal bands
    const bands = [
      { y: 20, height: 15, color: "rgba(180, 140, 60, 0.4)" },
      { y: 50, height: 25, color: "rgba(200, 170, 100, 0.3)" },
      { y: 90, height: 20, color: "rgba(160, 120, 50, 0.5)" },
      { y: 120, height: 30, color: "rgba(190, 150, 80, 0.3)" },
      { y: 160, height: 18, color: "rgba(170, 130, 60, 0.4)" },
      { y: 190, height: 22, color: "rgba(210, 180, 110, 0.3)" },
      { y: 220, height: 20, color: "rgba(150, 110, 40, 0.5)" },
    ];

    bands.forEach((band) => {
      ctx.fillStyle = band.color;
      ctx.fillRect(0, band.y, 512, band.height);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

// Main Saturn scene component
export default function SaturnScene() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle floating motion
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <>
      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.3}
      />

      {/* Lighting */}
      <ambientLight color="#ffffff" intensity={0.5} />
      <pointLight color="#ffffff" intensity={1.5} position={[5, 3, 5]} />
      <pointLight color="#ffd699" intensity={0.5} position={[-5, -2, -5]} />

      {/* Star field background */}
      <StarField count={15000} />

      {/* Saturn with rings */}
      <group ref={groupRef}>
        <SaturnBody radius={1} />
        <SaturnRings innerRadius={1.4} outerRadius={2.5} />
      </group>
    </>
  );
}
