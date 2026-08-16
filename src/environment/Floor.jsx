import React, { useMemo } from "react";
import { PALETTE } from "../constants";

/* Waxed mahogany plank floor slightly oversized to tuck cleanly under outer walls (Width: 48, Z: -22 to 10). */
export default function Floor() {
  const FLOOR_WIDTH = 48.0;   // Slightly wider than 46 to tuck under side walls (-24 to 24)
  const FLOOR_MIN_Z = -22.0;  // Front office boundary
  const FLOOR_MAX_Z = 10.0;   // Extends 1 unit past z = 9.0 so cabins sit fully on top of it
  const FLOOR_DEPTH = FLOOR_MAX_Z - FLOOR_MIN_Z; // 32.0
  const FLOOR_CENTER_Z = (FLOOR_MAX_Z + FLOOR_MIN_Z) / 2; // -6.0

  const planks = useMemo(() => {
    const arr = [];
    for (let i = -23; i < 23; i += 1.4) arr.push(i);
    return arr;
  }, []);

  return (
    <group>
      {/* Main Floor Plane — tucked slightly under walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, FLOOR_CENTER_Z]}>
        <planeGeometry args={[FLOOR_WIDTH, FLOOR_DEPTH]} />
        <meshPhysicalMaterial
          color={PALETTE.mahoganyFloor}
          roughness={0.14}
          metalness={0.04}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.3}
        />
      </mesh>

      {/* Planks adjusted to match */}
      {planks.map((x, i) => (
        <mesh key={i} position={[x, 0.006, FLOOR_CENTER_Z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.018, FLOOR_DEPTH]} />
          <meshStandardMaterial color={PALETTE.mahoganyFloorAccent} roughness={0.45} />
        </mesh>
      ))}

      {/* Marble Medallion */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[14, 0.008, 2]}>
        <circleGeometry args={[2.6, 48]} />
        <meshPhysicalMaterial
          color={PALETTE.marble}
          roughness={0.1}
          metalness={0.02}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[14, 0.009, 2]}>
        <ringGeometry args={[2.35, 2.6, 48]} />
        <meshStandardMaterial color={PALETTE.marbleVein} roughness={0.3} metalness={0.15} />
      </mesh>
    </group>
  );
}