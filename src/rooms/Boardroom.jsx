import React, { useMemo } from "react";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { ROOMS, PALETTE } from "../constants";
import { SolidWall } from "../environment/Walls";
import SwingDoor from "../environment/SwingDoor";
import { Bookshelf, PottedPlant, GuestArmchair } from "../assets/Furniture";

export default function Boardroom({ onDoorClick, active, registerCollider, registerDoorCollider }) {
  const room = ROOMS.boardroom;
  
  const chairPositions = useMemo(() => {
    const arr = [];
    for (let i = -2; i <= 2; i++) {
      arr.push({ x: i * 1.4, z: -1.5, rot: 0 });      // Back side
      arr.push({ x: i * 1.4, z: 1.5, rot: Math.PI }); // Front side
    }
    return arr;
  }, []);

  return (
    <group position={[0, 0, -16]}>
      {/* Side Solid Walls */}
      <SolidWall position={[-5.75, 2.05, 0]} size={[0.15, 4.3, 9]} registerCollider={registerCollider} />
      <SolidWall position={[5.75, 2.05, 0]} size={[0.15, 4.3, 9]} registerCollider={registerCollider} />

      {/* Back Wall: Full Span Glass (Skyline View) */}
      <mesh position={[0, 2.2, -4.5]}>
        <planeGeometry args={[11.3, 4.4]} />
        <meshPhysicalMaterial color="#dce8f0" transparent opacity={0.15} roughness={0.05} metalness={0.05} ior={1.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Front Wall Glass Panels */}
      <mesh position={[-2.87, 2.1, 4.5]}>
        <planeGeometry args={[5.4, 4.2]} />
        <meshPhysicalMaterial color="#eef4f8" transparent opacity={0.22} roughness={0.12} metalness={0.02} ior={1.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[2.87, 2.1, 4.5]}>
        <planeGeometry args={[5.4, 4.2]} />
        <meshPhysicalMaterial color="#eef4f8" transparent opacity={0.22} roughness={0.12} metalness={0.02} ior={1.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Swing Door */}
      <SwingDoor
        position={[0, 0, 4.5]}
        width={1.2}
        height={3.9}
        open={active}
        hinge="right"
        roomId="boardroom"
        onClick={onDoorClick}
        registerDoorCollider={registerDoorCollider}
      />
      
      {/* Room Floor Glow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10.6, 8.6]} />
        <meshStandardMaterial color={room.color} transparent opacity={0.16} emissive={room.color} emissiveIntensity={0} />
      </mesh>

      {/* Grand Boardroom Table */}
      <RoundedBox args={[6.2, 0.1, 2.4]} radius={0.05} position={[0, 0.75, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={PALETTE.mahoganyDark} roughness={0.08} metalness={0.15} clearcoat={1} clearcoatRoughness={0.06} envMapIntensity={1.3} />
      </RoundedBox>

      {/* Solid Table Legs */}
      <RoundedBox args={[0.4, 0.74, 1.8]} radius={0.02} position={[-2.4, 0.37, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={PALETTE.mahoganyDark} roughness={0.15} metalness={0.1} />
      </RoundedBox>
      <RoundedBox args={[0.4, 0.74, 1.8]} radius={0.02} position={[2.4, 0.37, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={PALETTE.mahoganyDark} roughness={0.15} metalness={0.1} />
      </RoundedBox>

      {/* Clean Luxury Chairs replacing the blocky box kachra */}
      {chairPositions.map((chair, idx) => (
        <GuestArmchair 
          key={`chair-${idx}`} 
          position={[chair.x, 0, chair.z]} 
          rotationY={chair.rot} 
          scale={1.1} 
          registerCollider={registerCollider} 
        />
      ))}

      {/* Furniture */}
      <Bookshelf position={[-5.1, 0, -3.0]} rotationY={Math.PI / 2} scale={1.1} registerCollider={registerCollider} />
      <Bookshelf position={[5.1, 0, -3.0]} rotationY={-Math.PI / 2} scale={1.1} registerCollider={registerCollider} />
      <PottedPlant position={[-5.1, 0, 3.0]} scale={1.2} variety="palm" registerCollider={registerCollider} />
      <PottedPlant position={[5.1, 0, 3.0]} scale={1.1} variety="monstera" registerCollider={registerCollider} />

      {/* Elite Corporate Brass Nameplate */}
      <group position={[5.42, 2.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <Text fontSize={0.18} color={PALETTE.brassLight} anchorX="center" anchorY="middle" letterSpacing={0.04}>
          GRAND BOARDROOM
        </Text>
        <Text position={[0, -0.28, 0]} fontSize={0.11} color={PALETTE.cream} opacity={0.85} anchorX="center" anchorY="middle" letterSpacing={0.02}>
          {room.agent}
        </Text>
      </group>
    </group>
  );
}