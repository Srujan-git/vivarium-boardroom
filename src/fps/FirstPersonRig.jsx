import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { EYE_HEIGHT, SPAWN } from "../constants";
import { isClear } from "./collision";

/* ============================================================================
   FIRST-PERSON CONTROLLER WITH AABB COLLISION
   Movement is independent of pointer-lock state so WASD always works.
   INTENTIONALLY UNCHANGED FROM THE ORIGINAL — byte-for-byte compatible
   behavior. Do not "improve" the movement feel here; it's been tuned.
============================================================================ */

function useKeyboard() {
  const keys = useRef({});
  useEffect(() => {
    const down = (e) => {
      keys.current[e.code] = true;
    };
    const up = (e) => {
      keys.current[e.code] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
  return keys;
}

export default function FirstPersonRig({ setLocked, doorColliders, staticBoxesRef, lockTrigger }) {
  const { camera } = useThree();
  const keys = useKeyboard();
  const controlsRef = useRef();
  const lockPending = useRef(false);

  useEffect(() => {
    camera.position.set(SPAWN.pos[0], EYE_HEIGHT, SPAWN.pos[2]);
    camera.rotation.set(0, SPAWN.yaw, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  useEffect(() => {
    if (lockTrigger > 0 && controlsRef.current && !lockPending.current) {
      lockPending.current = true;
      const tryLock = (attempt = 0) => {
        try {
          controlsRef.current.lock();
        } catch (e) {
          if (attempt < 5) {
            setTimeout(() => tryLock(attempt + 1), 200);
          }
        } finally {
          lockPending.current = false;
        }
      };
      tryLock();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockTrigger]);

  useFrame((_, delta) => {
    const speed = 4.2;
    const dir = new THREE.Vector3();
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

    const k = keys.current;
    if (k["KeyW"] || k["ArrowUp"]) dir.add(forward);
    if (k["KeyS"] || k["ArrowDown"]) dir.sub(forward);
    if (k["KeyD"] || k["ArrowRight"]) dir.add(right);
    if (k["KeyA"] || k["ArrowLeft"]) dir.sub(right);

    if (dir.lengthSq() > 0) {
      dir.normalize().multiplyScalar(speed * delta);
      const boxes = staticBoxesRef.current;
      const doors = doorColliders.current;
      const curX = camera.position.x;
      const curZ = camera.position.z;
      const nextX = curX + dir.x;
      const nextZ = curZ + dir.z;

      if (isClear(nextX, nextZ, boxes, doors)) {
        camera.position.x = nextX;
        camera.position.z = nextZ;
      } else {
        if (isClear(nextX, curZ, boxes, doors)) camera.position.x = nextX;
        if (isClear(camera.position.x, nextZ, boxes, doors)) camera.position.z = nextZ;
      }
    }
    camera.position.y = EYE_HEIGHT;
  });

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={() => setLocked(true)}
      onUnlock={() => setLocked(false)}
    />
  );
}
