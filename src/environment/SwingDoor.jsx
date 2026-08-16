import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE } from "../constants";
import { RealGlass } from "./GlassMaterials";

/* ============================================================================
   SWING DOOR
   Collider registration/open-angle logic is UNCHANGED from the original —
   it drives isClear() in fps/collision.js. Only the visual shader (RealGlass)
   was upgraded, since the door is the focal interactive surface.
============================================================================ */

export default function SwingDoor({ position, rotationY = 0, width = 1.05, height = 3.9, open, hinge = "left", onClick, roomId, registerDoorCollider }) {
  const pivotRef = useRef();
  const groupRef = useRef();
  const targetAngle = open ? (hinge === "left" ? -1.85 : 1.85) : 0;
  const currentAngle = useRef(0);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    currentAngle.current = THREE.MathUtils.damp(currentAngle.current, targetAngle, 4.2, delta);
    if (pivotRef.current) pivotRef.current.rotation.y = currentAngle.current;
  });

  useEffect(() => {
    if (registerDoorCollider) {
      registerDoorCollider(roomId, {
        position,
        rotationY,
        width,
        getOpenAmount: () => Math.abs(currentAngle.current),
      });
    }
  }, [registerDoorCollider, roomId, position, rotationY, width]);

  const hingeOffset = hinge === "left" ? -width / 2 : width / 2;

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      <group ref={pivotRef} position={[hingeOffset, 0, 0]}>
        <mesh
          position={[-hingeOffset, height / 2, 0]}
          castShadow
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(roomId);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "auto";
          }}
        >
          <boxGeometry args={[width, height, 0.04]} />
          <RealGlass thickness={0.08} distortion={hovered ? 0.08 : 0.04} color={hovered ? "#f1dfb8" : PALETTE.glass} />
        </mesh>
        <mesh position={[-hingeOffset, height / 2, 0.021]}>
          <boxGeometry args={[width, 0.04, 0.03]} />
          <meshStandardMaterial color={PALETTE.brass} roughness={0.25} metalness={0.9} envMapIntensity={1.5} />
        </mesh>
        <mesh position={[-hingeOffset, height - 0.02, 0]}>
          <boxGeometry args={[width, 0.04, 0.05]} />
          <meshStandardMaterial color={PALETTE.brass} roughness={0.25} metalness={0.9} envMapIntensity={1.5} />
        </mesh>
        <mesh position={[-hingeOffset + (hinge === "left" ? width * 0.38 : -width * 0.38), height * 0.42, 0.035]}>
          <boxGeometry args={[0.03, 0.34, 0.03]} />
          <meshStandardMaterial color={PALETTE.brassLight} roughness={0.15} metalness={0.98} envMapIntensity={1.6} />
        </mesh>
      </group>
    </group>
  );
}
