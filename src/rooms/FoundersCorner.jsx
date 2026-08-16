import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { ROOMS, PALETTE } from "../constants";
import { SolidWall } from "../environment/Walls";
import SwingDoor from "../environment/SwingDoor";
import { ExecutiveDesk, GuestArmchair, Bookshelf, FilingCabinet, PottedPlant } from "../assets/Furniture";

export default function FoundersCorner({ position = [-17.25, 0, -14], rotationY = Math.PI, onDoorClick, active, registerCollider, registerDoorCollider }) {
  const meshRef = useRef();
  const room = ROOMS.founder;
  const pulse = useRef(0);

  useFrame((_, delta) => {
    pulse.current += delta;
    if (meshRef.current) {
      const glow = active ? 0.32 + Math.sin(pulse.current * 2) * 0.06 : 0.0;
      meshRef.current.material.emissiveIntensity = glow;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Side Solid Walls matching GlassCabin */}
      <SolidWall position={[-5.75, 2.05, 0]} size={[0.15, 4.3, 7]} registerCollider={registerCollider} />
      <SolidWall position={[5.75, 2.05, 0]} size={[0.15, 4.3, 7]} registerCollider={registerCollider} />

      {/* Skyline Glass moved to opposite side (z = 3.5) */}
      <mesh position={[0, 2.2, 3.5]}>
        <planeGeometry args={[11.3, 4.4]} />
        <meshPhysicalMaterial color="#dce8f0" transparent opacity={0.15} roughness={0.05} metalness={0.05} ior={1.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Front Glass Panels moved to z = -3.5 (facing hallway now) */}
      <mesh position={[-2.87, 2.1, -3.5]}>
        <planeGeometry args={[5.4, 4.2]} />
        <meshPhysicalMaterial color="#eef4f8" transparent opacity={0.22} roughness={0.12} metalness={0.02} ior={1.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[2.87, 2.1, -3.5]}>
        <planeGeometry args={[5.4, 4.2]} />
        <meshPhysicalMaterial color="#eef4f8" transparent opacity={0.22} roughness={0.12} metalness={0.02} ior={1.5} side={THREE.DoubleSide} />
      </mesh>

      {/* SwingDoor moved to z = -3.5 so it faces the hallway correctly */}
      <group rotation={[0, Math.PI, 0]}>
  <SwingDoor
    position={[0, 0, 3.5]}
    width={1.2}
    height={3.9}
    open={active}
    hinge="right"
    roomId="founder"
    onClick={onDoorClick}
    registerDoorCollider={registerDoorCollider}
  />
</group>
      
      <mesh ref={meshRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10.6, 6.6]} />
        <meshStandardMaterial color={room.color} transparent opacity={0.16} emissive={room.color} emissiveIntensity={0} />
      </mesh>

      {/* Executive Desk - Computer stays 100% perfect as requested */}
      <ExecutiveDesk position={[0, 0, .0]} rotationY={0} scale={1.1} registerCollider={registerCollider} monitors={3} />

      {/* Lounge Area */}
      <GuestArmchair position={[-4.4, 0, -0.4]} rotationY={Math.PI / 2} registerCollider={registerCollider} />
      <GuestArmchair position={[-4.4, 0, 0.8]} rotationY={Math.PI / 2} registerCollider={registerCollider} />
      
      <RoundedBox args={[0.7, 0.42, 1.1]} radius={0.03} smoothness={2} position={[-3.3, 0.21, 0.2]} castShadow receiveShadow>
        <meshPhysicalMaterial color={PALETTE.deskWalnut} roughness={0.15} metalness={0.05} clearcoat={0.8} />
      </RoundedBox>

      <Bookshelf position={[5.1, 0, 2.0]} rotationY={-Math.PI / 2} scale={1.1} registerCollider={registerCollider} />
      <FilingCabinet position={[-5.1, 0, 1.8]} rotationY={Math.PI / 2} registerCollider={registerCollider} />

      <PottedPlant position={[4.5, 0, -2.8]} scale={1.2} variety="palm" registerCollider={registerCollider} />

      {/* Elite Corporate Brass Nameplate */}
      <group position={[5.42, 2.4, -1.2]} rotation={[0, -Math.PI / 2, 0]}>
        <Text fontSize={0.18} color={PALETTE.brassLight} anchorX="center" anchorY="middle" letterSpacing={0.04}>
          Managing Partner
        </Text>
        <Text position={[0, -0.28, 0]} fontSize={0.11} color={PALETTE.cream} opacity={0.85} anchorX="center" anchorY="middle" letterSpacing={0.02}>
          {room.agent}
        </Text>
      </group>
    </group>
  );
}