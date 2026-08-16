import React, { useMemo } from "react";
import { RoundedBox, Text } from "@react-three/drei";
import { ROOMS, PALETTE } from "../constants";
import { useBoxCollider } from "../fps/collision";
import { FilingCabinet, PottedPlant } from "../assets/Furniture";

function BullpenDeskCollider({ position, registerCollider }) {
  const worldPos = useMemo(() => [position[0], position[1], position[2] - 9], [position]);
  useBoxCollider(registerCollider, worldPos, [1.5, 1.2, 0.8], 0, 0.05);
  return null;
}

export default function Bullpen({ active, registerCollider }) {
  const room = ROOMS.bullpen;
  const desks = [-8, -4.8, -1.6, 1.6, 4.8];

  return (
    <group position={[0, 0, -9]}>
      <mesh position={[-2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[13, 5]} />
        <meshStandardMaterial color={room.color} transparent opacity={active ? 0.2 : 0.08} emissive={room.color} emissiveIntensity={active ? 0.3 : 0} />
      </mesh>
      
      {desks.map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Luxury Desk Top */}
          <RoundedBox args={[1.5, 0.06, 0.8]} radius={0.02} position={[0, 0.75, 0]} castShadow>
            <meshPhysicalMaterial color={PALETTE.mahoganyDark} roughness={0.22} metalness={0.1} clearcoat={0.8} envMapIntensity={1.1} />
          </RoundedBox>
          
          {/* Sleek Steel Desk Legs */}
          <mesh position={[-0.65, 0.375, 0]} castShadow>
            <boxGeometry args={[0.05, 0.75, 0.6]} />
            <meshStandardMaterial color={PALETTE.charcoal} roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0.65, 0.375, 0]} castShadow>
            <boxGeometry args={[0.05, 0.75, 0.6]} />
            <meshStandardMaterial color={PALETTE.charcoal} roughness={0.3} metalness={0.8} />
          </mesh>

          {/* Professional Ultra-Thin Monitor */}
          <group position={[0, 0.78, -0.15]}>
            {/* Stand Base */}
            <mesh position={[0, 0.01, -0.05]}>
              <boxGeometry args={[0.3, 0.02, 0.2]} />
              <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Stand Neck */}
            <mesh position={[0, 0.15, -0.1]}>
              <boxGeometry args={[0.05, 0.3, 0.05]} />
              <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Screen Bezel */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[0.7, 0.45, 0.03]} />
              <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Screen Display (Dark Mode Dashboard Look) */}
            <mesh position={[0, 0.3, 0.016]}>
              <planeGeometry args={[0.66, 0.41]} />
              <meshStandardMaterial color="#0f172a" emissive="#0f172a" emissiveIntensity={0.6} />
            </mesh>
          </group>

          {/* Modern Ergonomic Task Chair */}
          <group position={[0, 0, 0.55]}>
            {/* Seat */}
            <mesh position={[0, 0.45, 0]} castShadow>
              <boxGeometry args={[0.45, 0.08, 0.45]} />
              <meshStandardMaterial color={PALETTE.charcoal} roughness={0.6} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.8, 0.2]} rotation={[-0.1, 0, 0]} castShadow>
              <boxGeometry args={[0.4, 0.5, 0.05]} />
              <meshStandardMaterial color={PALETTE.charcoal} roughness={0.6} />
            </mesh>
            {/* Gas Cylinder */}
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.44]} />
              <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Star Base */}
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[0.5, 0.05, 0.05]} />
              <meshStandardMaterial color="#222" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.5, 0.05, 0.05]} />
              <meshStandardMaterial color="#222" metalness={0.8} />
            </mesh>
          </group>

          <BullpenDeskCollider position={[x, 0, 0]} registerCollider={registerCollider} />
        </group>
      ))}

      <FilingCabinet position={[-9.6, 0, -1.9]} rotationY={Math.PI / 2} registerCollider={registerCollider} />
      <FilingCabinet position={[-9.6, 0, -1.2]} rotationY={Math.PI / 2} registerCollider={registerCollider} />

      <PottedPlant position={[6.2, 0, -1.9]} scale={1.05} variety="palm" registerCollider={registerCollider} />

      <Text position={[-2, 2.6, -2.2]} fontSize={0.24} color={PALETTE.brassLight} anchorX="center">
        
      </Text>
    </group>
  );
}