import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

function MatrixColumn({ position, speed, length }) {
  const meshRef = useRef();
  const chars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < length; i++) {
      arr.push({
        char: Math.random() > 0.5 ? "1" : "0",
        yOffset: -i * 2.5,
        opacity: 1 - (i / length)
      });
    }
    return arr;
  }, [length]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = ((clock.elapsedTime * speed) % 60) - 30;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {chars.map((c, i) => (
        <Text
          key={i}
          position={[0, c.yOffset, 0]}
          fontSize={1.8}
          color="#00ff00"
          anchorX="center"
          anchorY="middle"
          fillOpacity={c.opacity * 0.8}
        >
          {c.char}
        </Text>
      ))}
    </group>
  );
}

export default function MonjoriBackground() {
  const columns = useMemo(() => {
    const cols = [];
    for (let i = 0; i < 80; i++) {
      cols.push({
        position: [
          (Math.random() - 0.5) * 120,
          Math.random() * 60 - 30,
          -25 - Math.random() * 30
        ],
        speed: 10 + Math.random() * 15,
        length: 6 + Math.floor(Math.random() * 12)
      });
    }
    return cols;
  }, []);

  return (
    <group>
      {columns.map((col, i) => (
        <MatrixColumn
          key={i}
          position={col.position}
          speed={col.speed}
          length={col.length}
        />
      ))}
    </group>
  );
}
