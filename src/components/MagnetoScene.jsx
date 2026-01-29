import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Metallic particles orbiting around Magneto
function MetalParticles({ count = 100 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random particle data
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 8 + Math.random() * 10;
      const speed = 0.3 + Math.random() * 0.5;
      const yOffset = (Math.random() - 0.5) * 15;
      const orbitTilt = (Math.random() - 0.5) * 0.5;
      temp.push({ angle, radius, speed, yOffset, orbitTilt });
    }
    return temp;
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = clock.elapsedTime;

    particles.forEach((particle, i) => {
      // Orbital motion with magnetic pull effect
      const angle = particle.angle + time * particle.speed;
      const pulseRadius = particle.radius + Math.sin(time * 2 + i) * 1.5;

      const x = Math.cos(angle) * pulseRadius;
      const z = Math.sin(angle) * pulseRadius * Math.cos(particle.orbitTilt);
      const y = particle.yOffset + Math.sin(angle) * pulseRadius * Math.sin(particle.orbitTilt);

      dummy.position.set(x, y, z);
      dummy.rotation.set(time * 2, time * 3, time);
      dummy.scale.setScalar(0.1 + Math.sin(time * 3 + i) * 0.05);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <octahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#888888" metalness={1} roughness={0.2} />
    </instancedMesh>
  );
}

// Magnetic field rings
function MagneticRings() {
  const ringsRef = useRef([]);

  useFrame(({ clock }) => {
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        ring.rotation.x = clock.elapsedTime * 0.3 + i * 0.5;
        ring.rotation.y = clock.elapsedTime * 0.2 + i * 0.3;
      }
    });
  });

  return (
    <group>
      {[6, 8, 10].map((radius, i) => (
        <mesh
          key={i}
          ref={el => ringsRef.current[i] = el}
          rotation={[Math.PI / 2 + i * 0.3, 0, 0]}
        >
          <torusGeometry args={[radius, 0.05, 8, 64]} />
          <meshBasicMaterial color="#F472B6" transparent opacity={0.4 - i * 0.1} />
        </mesh>
      ))}
    </group>
  );
}

// Main Magneto image panel
function MagnetoPanel({ texture }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Subtle floating motion
      meshRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.5;
      meshRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[8, 10]} />
      <meshStandardMaterial
        map={texture}
        transparent
        side={THREE.DoubleSide}
        emissive="#F472B6"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

export default function MagnetoScene({ position = [0, 0, 0] }) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL || "/";
    const url = `${base}textures/magneto`;

    const loader = new THREE.TextureLoader();
    loader.load(url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setTexture(tex);
    });
  }, []);

  if (!texture) return null;

  return (
    <group position={position}>
      <MagnetoPanel texture={texture} />
      <MagneticRings />
      <MetalParticles count={80} />
    </group>
  );
}
