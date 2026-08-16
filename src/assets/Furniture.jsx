import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { PALETTE } from "../constants";
import { useBoxCollider } from "../fps/collision";
import AssetSlot from "./AssetSlot";
import { ASSET_URLS } from "./assetRegistry";

export function Bookshelf({ position, rotationY = 0, scale = 1, registerCollider, modelUrl = ASSET_URLS.bookshelf }) {
  const groupRef = useRef();
  const shelfW = 1.6 * scale;
  const shelfD = 0.42 * scale;
  const shelfH = 2.6 * scale;
  useBoxCollider(registerCollider, position, [shelfW, shelfH, shelfD], rotationY, 0.05);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.matrixAutoUpdate = false;
      groupRef.current.updateMatrix();
    }
  }, []);

  const bookColors = ["#7a2e2e", "#2e4a7a", "#3a5f3a", "#6b4a1e", "#4a2e5f", "#8a5a2e", "#2e5f5a"];
  const rowY = [0.42, 0.95, 1.48, 2.01, 2.5].map((v) => v * scale);

  const fallback = (
    <group raycast={() => null}>
      <mesh position={[0, shelfH / 2, 0]} castShadow receiveShadow raycast={() => null}>
        <boxGeometry args={[shelfW, shelfH, shelfD]} />
        <meshPhysicalMaterial color={PALETTE.mahoganyDark} roughness={0.3} metalness={0.1} clearcoat={0.5} envMapIntensity={1.1} />
      </mesh>
      {rowY.map((y, i) => (
        <mesh key={i} position={[0, y, shelfD * 0.05]} raycast={() => null}>
          <boxGeometry args={[shelfW * 0.94, 0.03 * scale, shelfD * 0.88]} />
          <meshStandardMaterial color={PALETTE.mahoganyDark} roughness={0.35} />
        </mesh>
      ))}
      {rowY.slice(0, 4).map((y, rowIdx) => {
        const count = 9;
        const bookW = (shelfW * 0.88) / count;
        return (
          <group key={rowIdx} position={[-(shelfW * 0.88) / 2 + bookW / 2, y + 0.24 * scale, shelfD * 0.12]} raycast={() => null}>
            {Array.from({ length: count }).map((_, i) => {
              const h = (0.34 + ((i * 37) % 10) / 60) * scale;
              const c = bookColors[(rowIdx * 3 + i) % bookColors.length];
              return (
                <mesh key={i} position={[i * bookW, h / 2 - 0.24 * scale, 0]} castShadow raycast={() => null}>
                  <boxGeometry args={[bookW * 0.82, h, shelfD * 0.7]} />
                  <meshStandardMaterial color={c} roughness={0.55} />
                </mesh>
              );
            })}
          </group>
        );
      })}
      <mesh position={[0, shelfH + 0.02 * scale, 0]} raycast={() => null}>
        <boxGeometry args={[shelfW + 0.06, 0.04 * scale, shelfD + 0.06]} />
        <meshStandardMaterial color={PALETTE.brass} metalness={0.85} roughness={0.25} envMapIntensity={1.4} />
      </mesh>
    </group>
  );

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]} raycast={() => null}>
      <AssetSlot url={modelUrl} fallback={fallback} />
    </group>
  );
}

export function FilingCabinet({ position, rotationY = 0, registerCollider, modelUrl = ASSET_URLS.filingCabinet }) {
  const groupRef = useRef();
  const w = 0.55, h = 1.1, d = 0.55;
  useBoxCollider(registerCollider, position, [w, h, d], rotationY, 0.05);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.matrixAutoUpdate = false;
      groupRef.current.updateMatrix();
    }
  }, []);

  const fallback = (
    <group raycast={() => null}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow raycast={() => null}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={PALETTE.steel} roughness={0.35} metalness={0.8} envMapIntensity={1.3} />
      </mesh>
      {[0.22, 0.55, 0.88].map((y, i) => (
        <group key={i} position={[0, y, d / 2 + 0.005]} raycast={() => null}>
          <mesh raycast={() => null}>
            <boxGeometry args={[w * 0.9, 0.28, 0.02]} />
            <meshStandardMaterial color="#6e7276" roughness={0.3} metalness={0.75} envMapIntensity={1.3} />
          </mesh>
          <mesh position={[0, 0, 0.015]} raycast={() => null}>
            <boxGeometry args={[0.14, 0.03, 0.03]} />
            <meshStandardMaterial color={PALETTE.brass} metalness={0.95} roughness={0.15} envMapIntensity={1.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]} raycast={() => null}>
      <AssetSlot url={modelUrl} fallback={fallback} />
    </group>
  );
}

export function PottedPlant({ position, scale = 1, variety = "palm", registerCollider, modelUrl }) {
  const groupRef = useRef();
  const resolvedUrl =
    modelUrl !== undefined ? modelUrl : variety === "palm" ? ASSET_URLS.pottedPlantPalm : ASSET_URLS.pottedPlantMonstera;
  const potR = 0.28 * scale;
  useBoxCollider(registerCollider, position, [potR * 2.2, 1.6 * scale, potR * 2.2], 0, 0.02);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.matrixAutoUpdate = false;
      groupRef.current.updateMatrix();
    }
  }, []);

  const fronds = useMemo(() => {
    const n = variety === "palm" ? 7 : 6;
    return Array.from({ length: n }).map((_, i) => {
      const angle = (i / n) * Math.PI * 2 + (i % 2) * 0.3;
      const tilt = 0.5 + (i % 3) * 0.12;
      return { angle, tilt, len: (0.7 + (i % 3) * 0.15) * scale };
    });
  }, [variety, scale]);

  const fallback = (
    <group raycast={() => null}>
      <mesh position={[0, 0.22 * scale, 0]} castShadow receiveShadow raycast={() => null}>
        <cylinderGeometry args={[potR, potR * 0.82, 0.44 * scale, 16]} />
        <meshStandardMaterial color="#5a4636" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.44 * scale, 0]} raycast={() => null}>
        <cylinderGeometry args={[potR * 1.02, potR * 1.02, 0.03, 16]} />
        <meshStandardMaterial color="#3d3024" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.75 * scale, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.04 * scale, 0.06 * scale, 0.66 * scale, 8]} />
        <meshStandardMaterial color="#4a3a24" roughness={0.75} />
      </mesh>
      {fronds.map((f, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(f.angle) * 0.12 * scale,
            1.05 * scale,
            Math.sin(f.angle) * 0.12 * scale,
          ]}
          rotation={[f.tilt, f.angle, 0]}
          raycast={() => null}
        >
          <coneGeometry args={[0.14 * scale, f.len, 4]} />
          <meshStandardMaterial
            color={variety === "palm" ? PALETTE.plantGreen : PALETTE.plantGreenDark}
            roughness={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );

  return (
    <group ref={groupRef} position={position} raycast={() => null}>
      <AssetSlot url={resolvedUrl} fallback={fallback} />
    </group>
  );
}

export function GuestArmchair({ position, rotationY = 0, registerCollider, modelUrl = ASSET_URLS.guestArmchair }) {
  const groupRef = useRef();
  useBoxCollider(registerCollider, position, [0.62, 0.85, 0.62], rotationY, 0.04);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.matrixAutoUpdate = false;
      groupRef.current.updateMatrix();
    }
  }, []);

  const fallback = (
    <group raycast={() => null}>
      <RoundedBox args={[0.56, 0.14, 0.54]} radius={0.05} position={[0, 0.42, 0]} castShadow raycast={() => null}>
        <meshStandardMaterial color={PALETTE.leather} roughness={0.5} envMapIntensity={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.56, 0.62, 0.13]} radius={0.06} position={[0, 0.72, -0.24]} castShadow raycast={() => null}>
        <meshStandardMaterial color={PALETTE.leather} roughness={0.5} envMapIntensity={0.6} />
      </RoundedBox>
      {[-0.27, 0.27].map((x, i) => (
        <RoundedBox key={i} args={[0.09, 0.32, 0.5]} radius={0.04} position={[x, 0.55, 0]} castShadow raycast={() => null}>
          <meshStandardMaterial color={PALETTE.leatherDark} roughness={0.5} envMapIntensity={0.6} />
        </RoundedBox>
      ))}
      {[
        [-0.22, 0.16, 0.2],
        [0.22, 0.16, 0.2],
        [-0.22, 0.16, -0.2],
        [0.22, 0.16, -0.2],
      ].map((p, i) => (
        <mesh key={i} position={p} raycast={() => null}>
          <cylinderGeometry args={[0.025, 0.025, 0.32, 8]} />
          <meshStandardMaterial color={PALETTE.brass} metalness={0.85} roughness={0.25} envMapIntensity={1.4} />
        </mesh>
      ))}
    </group>
  );
  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]} raycast={() => null}>
      <AssetSlot url={modelUrl} fallback={fallback} />
    </group>
  );
}

let _screenTexture = null;
function getScreenTexture() {
  if (_screenTexture) return _screenTexture;
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createLinearGradient(0, 0, 0, 64);
  grad.addColorStop(0, PALETTE.screenGradTop);
  grad.addColorStop(1, PALETTE.screenGradBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  ctx.strokeStyle = "rgba(79,168,224,0.35)";
  ctx.lineWidth = 1;
  for (let y = 8; y < 60; y += 10) {
    ctx.beginPath();
    ctx.moveTo(6, y);
    ctx.lineTo(6 + Math.random() * 40, y);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  _screenTexture = tex;
  return tex;
}

function Monitor({ width = 0.4, height = 0.24 }) {
  const tex = useMemo(() => getScreenTexture(), []);
  return (
    <group raycast={() => null}>
      <RoundedBox args={[width, height, 0.012]} radius={0.006} smoothness={2} castShadow raycast={() => null}>
        <meshStandardMaterial color={PALETTE.matteSteel} roughness={0.35} metalness={0.75} envMapIntensity={1.1} />
      </RoundedBox>
      <mesh position={[0, 0, 0.007]} raycast={() => null}>
        <planeGeometry args={[width * 0.94, height * 0.9]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissive={PALETTE.screenAccent}
          emissiveIntensity={0.55}
          color="#ffffff"
          roughness={0.2}
          metalness={0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function MonitorSetup({ position, rotationY = 0, monitors = 2 }) {
  const groupRef = useRef();
  const spacing = 0.44;
  const startX = -((monitors - 1) * spacing) / 2;

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.matrixAutoUpdate = false;
      groupRef.current.updateMatrix();
    }
  }, []);

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]} raycast={() => null}>
      {Array.from({ length: monitors }).map((_, i) => {
        const x = startX + i * spacing;
        const angle = monitors > 1 ? (i - (monitors - 1) / 2) * -0.16 : 0;
        return (
          <group key={i} position={[x, 0, 0]} rotation={[0, angle, 0]} raycast={() => null}>
            <mesh position={[0, 0.05, 0]} raycast={() => null}>
              <cylinderGeometry args={[0.055, 0.06, 0.012, 16]} />
              <meshStandardMaterial color={PALETTE.matteSteel} roughness={0.3} metalness={0.8} envMapIntensity={1.2} />
            </mesh>
            <mesh position={[0, 0.27, 0]} raycast={() => null}>
              <cylinderGeometry args={[0.014, 0.016, 0.42, 8]} />
              <meshStandardMaterial color={PALETTE.matteSteel} roughness={0.3} metalness={0.8} envMapIntensity={1.2} />
            </mesh>
            <group position={[0, 0.48, 0]} raycast={() => null}>
              <Monitor width={0.4} height={0.24} />
            </group>
          </group>
        );
      })}

      <RoundedBox args={[0.34, 0.014, 0.12]} radius={0.006} smoothness={2} position={[0, 0.02, 0.28]} castShadow raycast={() => null}>
        <meshStandardMaterial color={PALETTE.keyboardBody} roughness={0.4} metalness={0.3} envMapIntensity={0.9} />
      </RoundedBox>
      <mesh position={[0, 0.028, 0.28]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <planeGeometry args={[0.31, 0.09]} />
        <meshStandardMaterial color="#2c2c2e" roughness={0.55} metalness={0.1} />
      </mesh>

      <RoundedBox args={[0.06, 0.022, 0.1]} radius={0.02} smoothness={2} position={[0.24, 0.021, 0.3]} castShadow raycast={() => null}>
        <meshStandardMaterial color={PALETTE.keyboardBody} roughness={0.3} metalness={0.4} envMapIntensity={1} />
      </RoundedBox>

      <mesh position={[0, 0.008, 0.29]} raycast={() => null}>
        <planeGeometry args={[0.5, 0.24]} />
        <meshStandardMaterial color="#101012" roughness={0.8} />
      </mesh>

      <mesh position={[-0.34, 0.06, 0.3]} raycast={() => null}>
        <cylinderGeometry args={[0.032, 0.028, 0.1, 12]} />
        <meshStandardMaterial color={PALETTE.brass} metalness={0.85} roughness={0.25} envMapIntensity={1.4} />
      </mesh>

      <group position={[0.36, 0, -0.08]} raycast={() => null}>
        <mesh position={[0, 0.015, 0]} raycast={() => null}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 12]} />
          <meshStandardMaterial color={PALETTE.matteSteel} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[-0.02, 0.16, 0]} rotation={[0, 0, 0.35]} raycast={() => null}>
          <cylinderGeometry args={[0.008, 0.008, 0.3, 6]} />
          <meshStandardMaterial color={PALETTE.matteSteel} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[-0.1, 0.28, 0]} rotation={[0, 0, -0.4]} raycast={() => null}>
          <cylinderGeometry args={[0.008, 0.008, 0.16, 6]} />
          <meshStandardMaterial color={PALETTE.matteSteel} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[-0.16, 0.33, 0]} rotation={[0, 0, 1.15]} raycast={() => null}>
          <coneGeometry args={[0.045, 0.07, 12, 1, true]} />
          <meshStandardMaterial
            color={PALETTE.matteSteel}
            emissive="#ffedc0"
            emissiveIntensity={0.4}
            roughness={0.4}
            metalness={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      <mesh position={[0.34, 0.03, -0.22]} castShadow raycast={() => null}>
        <boxGeometry args={[0.2, 0.05, 0.26]} />
        <meshStandardMaterial color={PALETTE.paperCream} roughness={0.8} />
      </mesh>
    </group>
  );
}

export function ExecutiveDesk({ position, rotationY = 0, scale = 1, registerCollider, monitors = 2, modelUrl = ASSET_URLS.executiveDesk }) {
  const groupRef = useRef();
  useBoxCollider(registerCollider, position, [3.6 * scale, 1.1, 1.8 * scale], rotationY, 0.05);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.matrixAutoUpdate = false;
      groupRef.current.updateMatrix();
    }
  }, []);

  const fallback = (
    <group raycast={() => null}>
      <RoundedBox args={[3.6, 0.12, 1.8]} radius={0.02} smoothness={2} position={[0, 1.02, 0]} castShadow receiveShadow raycast={() => null}>
        <meshPhysicalMaterial
          color={PALETTE.deskWalnut}
          roughness={0.16}
          metalness={0.05}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          envMapIntensity={1.25}
        />
      </RoundedBox>
      <mesh position={[0, 0.95, 0]} raycast={() => null}>
        <boxGeometry args={[3.62, 0.03, 1.82]} />
        <meshStandardMaterial color={PALETTE.deskWalnutEdge} roughness={0.3} metalness={0.05} />
      </mesh>

      <RoundedBox args={[0.7, 0.9, 1.5]} radius={0.02} position={[-1.4, 0.45, 0]} castShadow receiveShadow raycast={() => null}>
        <meshPhysicalMaterial color={PALETTE.mahoganyDark} roughness={0.3} metalness={0.05} clearcoat={0.5} />
      </RoundedBox>

      <RoundedBox args={[0.7, 0.9, 1.5]} radius={0.02} position={[1.4, 0.45, 0]} castShadow receiveShadow raycast={() => null}>
        <meshPhysicalMaterial color={PALETTE.mahoganyDark} roughness={0.3} metalness={0.05} clearcoat={0.5} />
      </RoundedBox>

      {[-1.4, 1.4].map((x, idx) => (
        <group key={idx} position={[x, 0.5, 0.81]} raycast={() => null}>
          {[0.2, 0, -0.2].map((y, i) => (
            <mesh key={i} position={[0, y, 0]} raycast={() => null}>
              <boxGeometry args={[0.16, 0.02, 0.03]} />
              <meshStandardMaterial color={PALETTE.brass} metalness={0.9} roughness={0.2} envMapIntensity={1.5} />
            </mesh>
          ))}
        </group>
      ))}

      <group position={[0, 1.08, -0.1]} rotation={[0, 0, 0]} raycast={() => null}>
        <AssetSlot 
          url={ASSET_URLS.computer} 
          scale={0.002} 
          fallback={<MonitorSetup monitors={monitors} />} 
        />
      </group>

      <group position={[0, 0, 1.3]} raycast={() => null}>
        <mesh position={[0, 0.5, 0]} castShadow raycast={() => null}>
          <boxGeometry args={[0.55, 0.08, 0.55]} />
          <meshStandardMaterial color={PALETTE.charcoal} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.85, 0.25]} castShadow raycast={() => null}>
          <boxGeometry args={[0.55, 0.7, 0.08]} />
          <meshStandardMaterial color={PALETTE.charcoal} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.15, 0]} raycast={() => null}>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
          <meshStandardMaterial color={PALETTE.matteSteel} metalness={0.85} roughness={0.2} envMapIntensity={1.4} />
        </mesh>
      </group>
    </group>
  );

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]} scale={scale} raycast={() => null}>
      <AssetSlot url={modelUrl} fallback={fallback} />
    </group>
  );
}