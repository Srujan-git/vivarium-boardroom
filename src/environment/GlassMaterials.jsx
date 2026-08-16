import React from "react";
import * as THREE from "three";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { PALETTE, TRANSMISSION_SAMPLES, TRANSMISSION_RESOLUTION } from "../constants";

/* ============================================================================
   GLASS MATERIALS
   - RealGlass: true architectural transmission glass (refraction, thickness,
     chromatic distortion). GPU-heavy — used on doors (focal interaction
     point) and glass surfaces within the performance budget.
   - CheapGlass: cheap physical-material "fake glass" fallback for surfaces
     beyond the transmission budget, so ultrabook iGPUs still hold 60fps.
============================================================================ */

export function CheapGlass() {
  return (
    <meshPhysicalMaterial
      color={PALETTE.glass}
      transparent
      opacity={0.14}
      roughness={0.05}
      metalness={0.02}
      transmission={0.6}
      thickness={0.2}
      ior={1.45}
      reflectivity={0.5}
      clearcoat={1}
      clearcoatRoughness={0.05}
      envMapIntensity={1.6}
    />
  );
}

export function RealGlass({ thickness = 0.12, distortion = 0.05, color = PALETTE.glass }) {
  return (
    <MeshTransmissionMaterial
      samples={TRANSMISSION_SAMPLES}
      resolution={TRANSMISSION_RESOLUTION}
      thickness={thickness}
      roughness={0.04}
      transmission={1}
      ior={1.5}
      chromaticAberration={0.015}
      distortion={distortion}
      distortionScale={0.2}
      temporalDistortion={0.02}
      anisotropy={0.15}
      color={color}
      background={new THREE.Color("#dfe7ee")}
      clearcoat={1}
      clearcoatRoughness={0.06}
      attenuationDistance={2.5}
      attenuationColor={"#eaf2f8"}
    />
  );
}
