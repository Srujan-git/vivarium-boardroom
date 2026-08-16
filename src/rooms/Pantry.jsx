import React, { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { ROOMS, PALETTE } from "../constants";
import { SolidWall } from "../environment/Walls";
import SwingDoor from "../environment/SwingDoor";
import { PottedPlant, GuestArmchair } from "../assets/Furniture";

// ==========================================
// NEW: Clickable Animated Cabinet Door Component (REAL FROSTED GLASS)
// ==========================================
function CabinetDoor({ position, args, hinge = "left", handleY }) {
  const [isOpen, setIsOpen] = useState(false);
  const groupRef = useRef();

  const width = args[0];
  const pivotOffset = hinge === "left" ? -width / 2 : width / 2;
  const meshOffset = hinge === "left" ? width / 2 : -width / 2;
  const handleX = hinge === "left" ? width / 2 - 0.15 : -width / 2 + 0.15;
  
  // YAHAN FIX KIYA HAI: Signs reverse kar diye taaki bahar khule
  const targetRotation = isOpen ? (hinge === "left" ? -Math.PI / 2 : Math.PI / 2) : 0;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation,
        delta * 6
      );
    }
  });

  return (
    <group position={[position[0] + pivotOffset, position[1], position[2]]} ref={groupRef}>
      <mesh
        position={[meshOffset, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        cursor="pointer"
      >
        <boxGeometry args={args} />
        
        {/* REAL FROSTED BLACK GLASS MATERIAL */}
        <meshPhysicalMaterial 
          color="#111111" 
          transmission={0.75} // Glass transparency
          transparent={true}
          opacity={1}
          roughness={0.6} // Yeh dega asli "Frosted" blur effect
          metalness={0.2}
          ior={1.5} // Glass refraction
          thickness={0.05}
        />

        {/* Brass Handle */}
        <mesh position={[handleX, handleY, args[2] / 2 + 0.015]}>
          <boxGeometry args={[0.02, 0.15, 0.03]} />
          <meshStandardMaterial color={PALETTE.brassLight} metalness={0.8} roughness={0.2} />
        </mesh>
      </mesh>
    </group>
  );
}
export default function Pantry({ onDoorClick, active, registerCollider, registerDoorCollider }) {
  const room = ROOMS.pantry;
  
  return (
    <group position={[20, 0, -12]} rotation={[0, -Math.PI / 2, 0]}>
      
      {/* ==========================================
          THE GLASS CABIN SHELL
      ========================================== */}
      <SolidWall position={[-8, 2.05, 0]} size={[0.15, 4.3, 7]} registerCollider={registerCollider} />
      <SolidWall position={[4, 2.05, 0]} size={[0.15, 4.3, 7]} registerCollider={registerCollider} />

      <mesh position={[-2, 2.2, -3.5]}>
        <planeGeometry args={[12, 4.4]} />
        <meshPhysicalMaterial color="#dce8f0" transparent opacity={0.15} roughness={0.05} metalness={0.05} ior={1.5} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[-4.3, 2.1, 3.5]}>
        <planeGeometry args={[7.4, 4.2]} />
        <meshPhysicalMaterial color="#eef4f8" transparent opacity={0.22} roughness={0.12} metalness={0.02} ior={1.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[2.3, 2.1, 3.5]}>
        <planeGeometry args={[3.4, 4.2]} />
        <meshPhysicalMaterial color="#eef4f8" transparent opacity={0.22} roughness={0.12} metalness={0.02} ior={1.5} side={THREE.DoubleSide} />
      </mesh>

      <SwingDoor
        position={[0, 0, 3.5]}
        width={1.2}
        height={3.9}
        open={active}
        hinge="right"
        roomId="pantry"
        onClick={onDoorClick}
        registerDoorCollider={registerDoorCollider}
      />
      
      <mesh position={[-2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11.8, 6.8]} />
        <meshStandardMaterial color={room.color} transparent opacity={active ? 0.2 : 0.08} emissive={room.color} emissiveIntensity={active ? 0.3 : 0} />
      </mesh>

      <group position={[2.3, 2.4, 3.6]} rotation={[0, 0, 0]}>
        <Text fontSize={0.18} color={PALETTE.brassLight} anchorX="center" anchorY="middle" letterSpacing={0.04}>
          EXECUTIVE LOUNGE
        </Text>
      </group>


      {/* ==========================================
          THE INTERIOR (Luxury Cafe Setup)
      ========================================== */}
      
      {/* THE BACK COUNTER (COFFEE STATION) */}
      <group position={[0, 0, -2.8]}>
        {/* Base Cabinet Body */}
        <RoundedBox args={[4.4, 0.9, 0.7]} radius={0.03} position={[0, 0.45, 0]} castShadow>
          <meshStandardMaterial color={PALETTE.charcoal} roughness={0.35} envMapIntensity={0.9} />
        </RoundedBox>
        
        {/* Lower Cabinet Doors (Animated) */}
        <CabinetDoor position={[-1.6, 0.42, 0.36]} args={[1.02, 0.78, 0.02]} hinge="left" handleY={0.25} />
        <CabinetDoor position={[-0.53, 0.42, 0.36]} args={[1.02, 0.78, 0.02]} hinge="right" handleY={0.25} />
        <CabinetDoor position={[0.53, 0.42, 0.36]} args={[1.02, 0.78, 0.02]} hinge="left" handleY={0.25} />
        <CabinetDoor position={[1.6, 0.42, 0.36]} args={[1.02, 0.78, 0.02]} hinge="right" handleY={0.25} />

        {/* Glossy Countertop */}
        <RoundedBox args={[4.4, 0.06, 0.75]} radius={0.02} position={[0, 0.93, 0]}>
          <meshPhysicalMaterial color="#0d0e10" roughness={0.06} metalness={0.55} clearcoat={0.8} envMapIntensity={1.4} />
        </RoundedBox>

        {/* High-End Espresso Machine Illusion */}
        <group position={[-1.2, 0.96, 0]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.6, 0.4, 0.35]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.2, 0.18]}>
            <boxGeometry args={[0.5, 0.3, 0.02]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[-0.15, 0.3, 0.2]}>
            <circleGeometry args={[0.02, 16]} />
            <meshBasicMaterial color="#3b82f6" />
          </mesh>
          <mesh position={[0, 0.3, 0.2]}>
            <circleGeometry args={[0.02, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>

        {/* Upper Wall Cabinets (Floating Cupboards) */}
        <group position={[0, 2.4, -0.15]}>
          <RoundedBox args={[4.4, 0.8, 0.4]} radius={0.02} castShadow>
            <meshStandardMaterial color={PALETTE.charcoal} roughness={0.3} />
          </RoundedBox>
          {/* Upper Cabinet Doors (Animated) */}
          <CabinetDoor position={[-1.6, 0, 0.21]} args={[1.02, 0.76, 0.02]} hinge="left" handleY={-0.25} />
          <CabinetDoor position={[-0.53, 0, 0.21]} args={[1.02, 0.76, 0.02]} hinge="right" handleY={-0.25} />
          <CabinetDoor position={[0.53, 0, 0.21]} args={[1.02, 0.76, 0.02]} hinge="left" handleY={-0.25} />
          <CabinetDoor position={[1.6, 0, 0.21]} args={[1.02, 0.76, 0.02]} hinge="right" handleY={-0.25} />
        </group>
      </group>

      {/* THE CENTER ISLAND (Dark Marble) */}
      <group position={[0, 0, 0]}>
        <RoundedBox args={[2.0, 0.85, 0.7]} radius={0.02} position={[0, 0.425, 0]} castShadow>
          <meshStandardMaterial color="#111" roughness={0.2} metalness={0.4} />
        </RoundedBox>
        <RoundedBox args={[2.4, 0.06, 1.2]} radius={0.03} position={[0, 0.88, 0]} castShadow>
          <meshPhysicalMaterial color={PALETTE.mahoganyDark} roughness={0.15} clearcoat={0.8} envMapIntensity={1.2} />
        </RoundedBox>
      </group>

      {/* BAR STOOLS (SEATING) */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <group key={`stool-${i}`} position={[x, 0, 0.8]}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.1, 0.7, 16]} />
            <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.72, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 32]} />
            <meshStandardMaterial color={PALETTE.charcoal} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* LUXURY PENDANT LIGHTING */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <group key={`light-${i}`} position={[x, 2.8, 0]}>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1.2]} />
            <meshStandardMaterial color={PALETTE.brassLight} metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.15, 0.15, 32]} />
            <meshStandardMaterial color={PALETTE.brassLight} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.08, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      ))}

      {/* ==========================================
          THE CAFE CORNER (Left Side Empty Space)
      ========================================== */}
      <group position={[-5, 0, 0]}>
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <cylinderGeometry args={[1.8, 1.8, 0.01, 64]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.3, 0.7, 32]} />
          <meshStandardMaterial color={PALETTE.charcoal} roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.72, 0]} castShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.04, 64]} />  
          <meshPhysicalMaterial color="#0d0e10" roughness={0.05} metalness={0.6} clearcoat={1} envMapIntensity={1.5} />
        </mesh>
        <GuestArmchair position={[-1.1, 0, 0]} rotationY={Math.PI / 2} scale={1} registerCollider={registerCollider} />
        <GuestArmchair position={[1.1, 0, 0]} rotationY={-Math.PI / 2} scale={1} registerCollider={registerCollider} />
        <GuestArmchair position={[0, 0, -1.1]} rotationY={0} scale={1} registerCollider={registerCollider} />
      </group>

      {/* Decor */}
      <PottedPlant position={[3.2, 0, 2.8]} scale={1.1} variety="monstera" registerCollider={registerCollider} />
      <PottedPlant position={[-3.2, 0, -2.8]} scale={1.1} variety="palm" registerCollider={registerCollider} />

    </group>
  );
}