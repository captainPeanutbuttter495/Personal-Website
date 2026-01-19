import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  DEFAULT_CAMERA_POS,
  DEFAULT_TARGET,
  FOCUS_DISTANCE,
  FOCUS_LERP_SPEED,
  RETURN_LERP_SPEED,
  TARGET_LERP_SPEED,
} from "../config/tuning";

export default function CameraRig({ focusPoint, mode, setMode, controlsRef }) {
  const { camera } = useThree();

  const desiredTarget = useMemo(() => new THREE.Vector3(), []);
  const desiredCamPos = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    camera.position.copy(DEFAULT_CAMERA_POS);
  }, [camera]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (focusPoint) {
      desiredTarget.set(focusPoint[0], focusPoint[1], focusPoint[2]);
      controls.target.lerp(desiredTarget, TARGET_LERP_SPEED);

      if (mode === "focusing") {
        dir.copy(camera.position).sub(controls.target).normalize();
        desiredCamPos
          .copy(controls.target)
          .add(dir.multiplyScalar(FOCUS_DISTANCE));
        camera.position.lerp(desiredCamPos, FOCUS_LERP_SPEED);

        if (camera.position.distanceTo(desiredCamPos) < 0.5) {
          setMode("locked");
        }
      }

      controls.update();
      return;
    }

    if (mode === "returning") {
      controls.target.lerp(DEFAULT_TARGET, RETURN_LERP_SPEED);
      camera.position.lerp(DEFAULT_CAMERA_POS, RETURN_LERP_SPEED);

      if (
        camera.position.distanceTo(DEFAULT_CAMERA_POS) < 0.5 &&
        controls.target.distanceTo(DEFAULT_TARGET) < 0.5
      ) {
        setMode("idle");
      }

      controls.update();
    }
  });

  return null;
}
