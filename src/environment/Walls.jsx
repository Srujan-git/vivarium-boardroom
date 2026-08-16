import React, { useMemo } from "react";
import { PALETTE } from "../constants";
import { useBoxCollider } from "../fps/collision";
import { RealGlass, CheapGlass } from "./GlassMaterials";

export function GlassWall({ position, size = [6, 4.2], rotationY = 0, mullions = 3, registerCollider, useRealGlass = true }) {
  const [w, h] = size;
  const gaps = useMemo(() => {
    const arr = [];
    for (let i = 1; i < mullions; i++) arr.push((i / mullions) * w - w / 2);
    return arr;
  }, [w, mullions]);

  useBoxCollider(registerCollider, position, [w, h, 0.12], rotationY, 0.08);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, h / 2, 0]}>
        <planeGeometry args={[w, h]} />
        {useRealGlass ? <RealGlass thickness={0.1} distortion={0.03} /> : <CheapGlass />}
      </mesh>
      <mesh position={[0, h / 2, -0.02]}>
        <boxGeometry args={[w + 0.06, h + 0.06, 0.05]} />
        <meshStandardMaterial color={PALETTE.glassFrame} roughness={0.25} metalness={0.92} envMapIntensity={1.4} />
      </mesh>
      {gaps.map((gx, i) => (
        <mesh key={i} position={[gx, h / 2, 0.03]}>
          <boxGeometry args={[0.05, h, 0.06]} />
          <meshStandardMaterial color={PALETTE.glassFrame} roughness={0.2} metalness={0.95} envMapIntensity={1.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.02, 0.03]}>
        <boxGeometry args={[w, 0.06, 0.06]} />
        <meshStandardMaterial color={PALETTE.glassFrame} roughness={0.2} metalness={0.95} envMapIntensity={1.4} />
      </mesh>
      <mesh position={[0, h - 0.02, 0.03]}>
        <boxGeometry args={[w, 0.06, 0.06]} />
        <meshStandardMaterial color={PALETTE.glassFrame} roughness={0.2} metalness={0.95} envMapIntensity={1.4} />
      </mesh>
    </group>
  );
}

export function SolidWall({ position, size = [1, 4.2, 0.15], rotationY = 0, registerCollider }) {
  useBoxCollider(registerCollider, position, size, rotationY, 0.05);
  return (
    <mesh position={position} rotation={[0, rotationY, 0]} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshPhysicalMaterial
        color={PALETTE.mahogany}
        roughness={0.32}
        metalness={0.08}
        clearcoat={0.6}
        clearcoatRoughness={0.25}
        envMapIntensity={1.1}
      />
    </mesh>
  );
}
