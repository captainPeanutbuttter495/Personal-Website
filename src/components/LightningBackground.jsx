import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function LightningBolt({ startPos, seed }) {
  const lineRef = useRef();
  const materialRef = useRef();

  // Generate jagged lightning path
  const points = useMemo(() => {
    const pts = [];
    const segments = 8;
    let x = startPos[0];
    let y = startPos[1];
    const z = startPos[2];

    pts.push(new THREE.Vector3(x, y, z));

    for (let i = 0; i < segments; i++) {
      x += (Math.random() - 0.5) * 4;
      y -= 4;
      pts.push(new THREE.Vector3(x, y, z));
    }

    return pts;
  }, [startPos]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Create random flashing effect
      const time = clock.elapsedTime + seed;
      const flash = Math.sin(time * 8) > 0.97 ? 1 : 0;
      const secondFlash = Math.sin(time * 8 + 0.2) > 0.98 ? 0.5 : 0;
      materialRef.current.opacity = flash + secondFlash;
    }
  });

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        color="#F472B6"
        transparent
        opacity={0}
        linewidth={2}
      />
    </line>
  );
}

function LightningFlash() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Random bright flashes
      const flash = Math.sin(clock.elapsedTime * 5) > 0.95 ? 0.3 : 0;
      const flash2 = Math.sin(clock.elapsedTime * 7 + 2) > 0.96 ? 0.2 : 0;
      meshRef.current.material.opacity = flash + flash2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -50]}>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial color="#F472B6" transparent opacity={0} />
    </mesh>
  );
}

export default function LightningBackground() {
  // Create multiple lightning bolts at different positions
  const bolts = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 6; i++) {
      positions.push({
        startPos: [
          (Math.random() - 0.5) * 60,
          25,
          -20 - Math.random() * 20
        ],
        seed: Math.random() * 100
      });
    }
    return positions;
  }, []);

  return (
    <group>
      <LightningFlash />
      {bolts.map((bolt, i) => (
        <LightningBolt key={i} startPos={bolt.startPos} seed={bolt.seed} />
      ))}
    </group>
  );
}
