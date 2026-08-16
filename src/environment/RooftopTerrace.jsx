import React from "react";

/* Sleek Manhattan penthouse perimeter terrace slab.
   Wraps cleanly right outside the office glass walls (z: -26 to 15, x: -28 to 28),
   leaving open air before reaching the skyline towers at z = -95 and z = 75. */
export default function RooftopTerrace() {
  const TERRACE_WIDTH = 56.0;   // Wraps just outside office width (48)
  const TERRACE_MIN_Z = -26.0;  // Just past front office boundary (-20)
  const TERRACE_MAX_Z = 15.0;   // Just past back glass walls (9.0)
  const TERRACE_DEPTH = TERRACE_MAX_Z - TERRACE_MIN_Z; // 41.0
  const TERRACE_CENTER_Z = (TERRACE_MAX_Z + TERRACE_MIN_Z) / 2; // -5.5

  return (
    <group>
      {/* Main Perimeter Terrace Slab */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.02, TERRACE_CENTER_Z]}>
        <planeGeometry args={[TERRACE_WIDTH, TERRACE_DEPTH]} />
        <meshStandardMaterial
          color="#1a1d22" // Dark Manhattan architectural rooftop stone/asphalt
          roughness={0.8}
          metalness={0.08}
        />
      </mesh>

      {/* Clean outer perimeter trim border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, TERRACE_CENTER_Z]}>
        <planeGeometry args={[TERRACE_WIDTH + 1.2, TERRACE_DEPTH + 1.2]} />
        <meshStandardMaterial color="#2d3138" roughness={0.7} />
      </mesh>
    </group>
  );
}