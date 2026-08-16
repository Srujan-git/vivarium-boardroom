import React, { useMemo, useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { PALETTE } from "../constants";

export function Hallway() {
  const lights = useMemo(() => {
    const arr = [];
    for (let x = -20; x <= 20; x += 4) arr.push(x);
    return arr;
  }, []);
  return (
    <group>
      {/* Hallway ceiling mesh yahan se hata diya hai taaki main Ceiling poora seamless cover kare */}
      
      {lights.map((x, i) => (
        <group key={i} position={[x, 4.25, 2]}>
          <mesh>
            <boxGeometry args={[1.4, 0.06, 0.35]} />
            <meshStandardMaterial color="#fff7e0" emissive="#ffedc0" emissiveIntensity={1.5} toneMapped={false} />
          </mesh>
          <pointLight position={[0, -0.3, 0]} intensity={0.45} distance={5} color="#ffedc0" />
        </group>
      ))}
      <mesh position={[0, 0.012, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[44, 2.2]} />
        <meshStandardMaterial color="#4a2119" roughness={0.8} envMapIntensity={0.6} />
      </mesh>
      <mesh position={[-23, 2.1, 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[8, 4.2]} />
        <meshPhysicalMaterial color={PALETTE.mahogany} roughness={0.35} metalness={0.06} clearcoat={0.5} side={THREE.DoubleSide} envMapIntensity={1.1} />
      </mesh>
      <mesh position={[23, 2.1, 2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[8, 4.2]} />
        <meshPhysicalMaterial color={PALETTE.mahogany} roughness={0.35} metalness={0.06} clearcoat={0.5} side={THREE.DoubleSide} envMapIntensity={1.1} />
      </mesh>
    </group>
  );
}

export function Ceiling() {
  const lights = useMemo(() => {
    const arr = [];
    for (let x = -18; x <= 18; x += 6) {
      for (let z = -14; z <= 6; z += 5) {
        arr.push([x, z]);
      }
    }
    return arr;
  }, []);

  return (
    <group>
      {/* Extended back out toward the skyline side — far edge now around
          z=-18 instead of z=-11, to fully cover the cabin that was
          exposed to open sky. Center/depth adjusted accordingly. */}
      <mesh position={[0, 4.4, -5]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[64, 32]} />
        <meshStandardMaterial color="#2a2d32" roughness={0.85} metalness={0.1} envMapIntensity={0.2} />
      </mesh>

      {lights.map(([x, z], i) => (
        <group key={i} position={[x, 4.38, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.12, 0.18, 16]} />
            <meshStandardMaterial color="#4a4f58" metalness={0.9} roughness={0.2} envMapIntensity={1.5} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.12, 16]} />
            <meshBasicMaterial color="#fffae6" toneMapped={false} />
          </mesh>
          <pointLight position={[0, -0.2, 0]} intensity={0.35} distance={6} color="#ffe8b6" />
        </group>
      ))}
    </group>
  );
}

export function AtmosphericFog({ color = "#e8c9a0", density = 0.0105 }) {
  const { scene } = useThree();
  useEffect(() => {
    const prev = scene.fog;
    scene.fog = new THREE.FogExp2(color, density);
    return () => {
      scene.fog = prev;
    };
  }, [scene, color, density]);
  return null;
}