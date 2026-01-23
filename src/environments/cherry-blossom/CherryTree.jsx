// src/environments/cherry-blossom/CherryTree.jsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Stylized cherry blossom tree with swaying animation
 * Uses procedural geometry (cylinders + spheres) for a minimal lofi aesthetic
 */
export default function CherryTree({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef();
  const foliageRef = useRef();

  // Swaying animation using sine wave
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      // Gentle sway on the whole tree
      groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.02;
      groupRef.current.rotation.x = Math.sin(time * 0.3 + 1) * 0.01;
    }
    if (foliageRef.current) {
      const time = clock.getElapsedTime();
      // More pronounced sway on foliage
      foliageRef.current.rotation.z = Math.sin(time * 0.7) * 0.03;
      foliageRef.current.rotation.x = Math.sin(time * 0.5 + 0.5) * 0.02;
    }
  });

  // Color palette
  const trunkColor = "#5D4037";
  const foliageColors = ["#FFB7C5", "#FADADD", "#FFD1DC", "#FFC0CB"];

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main trunk */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.8, 1.2, 8, 12]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* Upper trunk */}
      <mesh position={[0, 9, 0]} rotation={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.5, 0.8, 4, 12]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* Main branches */}
      <mesh position={[-1.5, 7, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.2, 0.4, 4, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      <mesh position={[1.5, 7.5, 0.5]} rotation={[0.2, 0, -Math.PI / 5]}>
        <cylinderGeometry args={[0.2, 0.35, 3.5, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 8, -1]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.3, 3, 8]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>

      {/* Foliage cluster - multiple pink spheres */}
      <group ref={foliageRef} position={[0, 11, 0]}>
        {/* Central foliage spheres */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[3, 16, 16]} />
          <meshStandardMaterial
            color={foliageColors[0]}
            roughness={0.7}
            emissive={foliageColors[0]}
            emissiveIntensity={0.1}
          />
        </mesh>
        <mesh position={[2.5, -0.5, 1]}>
          <sphereGeometry args={[2.2, 16, 16]} />
          <meshStandardMaterial
            color={foliageColors[1]}
            roughness={0.7}
            emissive={foliageColors[1]}
            emissiveIntensity={0.1}
          />
        </mesh>
        <mesh position={[-2.2, -0.3, 0.8]}>
          <sphereGeometry args={[2.4, 16, 16]} />
          <meshStandardMaterial
            color={foliageColors[2]}
            roughness={0.7}
            emissive={foliageColors[2]}
            emissiveIntensity={0.1}
          />
        </mesh>
        <mesh position={[0.5, 1.5, -1]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshStandardMaterial
            color={foliageColors[3]}
            roughness={0.7}
            emissive={foliageColors[3]}
            emissiveIntensity={0.1}
          />
        </mesh>
        <mesh position={[-1.5, 0.5, -1.5]}>
          <sphereGeometry args={[1.8, 16, 16]} />
          <meshStandardMaterial
            color={foliageColors[0]}
            roughness={0.7}
            emissive={foliageColors[0]}
            emissiveIntensity={0.1}
          />
        </mesh>
        <mesh position={[1.8, 1, 0]}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshStandardMaterial
            color={foliageColors[1]}
            roughness={0.7}
            emissive={foliageColors[1]}
            emissiveIntensity={0.1}
          />
        </mesh>
        <mesh position={[-0.8, -1.5, 2]}>
          <sphereGeometry args={[1.6, 16, 16]} />
          <meshStandardMaterial
            color={foliageColors[2]}
            roughness={0.7}
            emissive={foliageColors[2]}
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}
