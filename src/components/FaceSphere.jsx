import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const quotes = [
  {
    text: '"So most of you are\ndumb and need me,\nit will be a\nhumanitarian risk\nif I cancelled class"\n- Chaja, 2023',
    position: [14, 0, 0],
    rotation: [0, -Math.PI / 8, 0]
  },
  {
    text: '"Your code is\nprobably on par\nwith a five year old\nthat can barely draw\na Spider-man drawing"\n- Prof. Chaja, 2023',
    position: [-14, 0, 0],
    rotation: [0, Math.PI / 8, 0]
  }
];

function Quote3D({ text, position, rotation }) {
  return (
    <Text
      position={position}
      rotation={rotation}
      fontSize={0.8}
      color="#F472B6"
      anchorX="center"
      anchorY="middle"
      textAlign="center"
      maxWidth={10}
    >
      {text}
    </Text>
  );
}

export default function FaceSphere({
  position = [0, 0, 0],
  radius = 5,
  rotationSpeed = 0.15,
  scale = [1, 1, 1]
}) {
  const groupRef = useRef();
  const cubeRef = useRef();
  const [texture, setTexture] = useState(null);

  // Load face texture
  useEffect(() => {
    const base = import.meta.env.BASE_URL || "/";
    const url = `${base}textures/kevinChaja.jpeg`;

    const loader = new THREE.TextureLoader();
    loader.load(url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setTexture(tex);
    });
  }, []);

  // Animation loop - only rotate the cube, not the quotes
  useFrame(({ clock }) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y = clock.elapsedTime * rotationSpeed;
      cubeRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.1;
    }
  });

  if (!texture) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Rotating cube */}
      <mesh ref={cubeRef} scale={scale}>
        <boxGeometry args={[radius, radius, radius]} />
        <meshStandardMaterial map={texture} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Static quotes on each side */}
      {quotes.map((quote, index) => (
        <Quote3D
          key={index}
          text={quote.text}
          position={quote.position}
          rotation={quote.rotation}
        />
      ))}
    </group>
  );
}
