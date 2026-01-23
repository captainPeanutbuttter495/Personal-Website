// src/environments/cherry-blossom/CherryBlossomScene.jsx
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import FallingPetals from "./FallingPetals";

/**
 * Main scene orchestrator for the cherry blossom environment
 * Sets up lighting, camera, and scene elements
 */
export default function CherryBlossomScene() {
  const { gl, scene, camera } = useThree();

  // Scene setup
  useEffect(() => {
    // Renderer settings
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.8;
    if (gl.outputColorSpace !== undefined) {
      gl.outputColorSpace = THREE.SRGBColorSpace;
    }

    // Background gradient (deep night purple)
    scene.background = new THREE.Color("#1A1820");

    // Add subtle fog for depth (reduced for mountain visibility)
    scene.fog = new THREE.FogExp2("#1A1820", 0.008);

    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [gl, scene]);

  // Camera setup
  useEffect(() => {
    camera.fov = 50;
    camera.near = 0.1;
    camera.far = 1000;
    camera.position.set(0, 12, 30);
    camera.updateProjectionMatrix();
  }, [camera]);

  return (
    <>
      {/* Camera controls - limited movement for focused view */}
      <OrbitControls
        target={[0, 8, 0]}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        minDistance={20}
        maxDistance={50}
        minPolarAngle={Math.PI * 0.3}
        maxPolarAngle={Math.PI * 0.55}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />

      {/* Lighting */}
      {/* Warm ambient light */}
      <ambientLight color="#FFF5E6" intensity={0.4} />

      {/* Main directional light (warm cream) */}
      <directionalLight
        color="#FFF5E6"
        intensity={0.8}
        position={[10, 20, 10]}
        castShadow={false}
      />

      {/* Pink accent light from above */}
      <pointLight color="#FFB7C5" intensity={0.6} position={[0, 25, 0]} />

      {/* Subtle rim light from behind */}
      <directionalLight
        color="#FFD1DC"
        intensity={0.3}
        position={[-5, 10, -10]}
      />

      {/* Sun - glowing orb in the background */}
      <mesh position={[0, 25, -80]}>
        <sphereGeometry args={[12, 32, 32]} />
        <meshBasicMaterial color="#FFECD2" toneMapped={false} />
      </mesh>
      {/* Sun glow halo */}
      <mesh position={[0, 25, -81]}>
        <circleGeometry args={[20, 32]} />
        <meshBasicMaterial
          color="#FFB7C5"
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* Mountains - layered silhouettes */}
      {/* Back mountain layer (darkest) */}
      <mesh position={[0, -5, -70]} rotation={[0, 0, 0]}>
        <coneGeometry args={[45, 35, 4]} />
        <meshBasicMaterial color="#1A1820" />
      </mesh>
      <mesh position={[-50, -8, -65]} rotation={[0, 0.3, 0]}>
        <coneGeometry args={[40, 30, 4]} />
        <meshBasicMaterial color="#1A1820" />
      </mesh>
      <mesh position={[55, -6, -68]} rotation={[0, -0.2, 0]}>
        <coneGeometry args={[38, 32, 4]} />
        <meshBasicMaterial color="#1A1820" />
      </mesh>

      {/* Mid mountain layer */}
      <mesh position={[-25, -8, -55]} rotation={[0, 0.5, 0]}>
        <coneGeometry args={[30, 25, 4]} />
        <meshBasicMaterial color="#252230" />
      </mesh>
      <mesh position={[30, -10, -50]} rotation={[0, -0.4, 0]}>
        <coneGeometry args={[35, 28, 4]} />
        <meshBasicMaterial color="#252230" />
      </mesh>
      <mesh position={[0, -12, -45]} rotation={[0, 0.2, 0]}>
        <coneGeometry args={[28, 22, 4]} />
        <meshBasicMaterial color="#2D2B3A" />
      </mesh>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#1A1820"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Falling petals */}
      <FallingPetals count={500} bounds={{ x: 60, y: 40, z: 60 }} />
    </>
  );
}
