import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const GLASS_COOL = ["#4a6b85", "#2e4a5e", "#1c2e3d", "#6b8fa8", "#dce8f0", "#0e2130"];

function makeFootprint(w, d, kind, rnd) {
  const shape = new THREE.Shape();
  const hw = w / 2, hd = d / 2;
  if (kind === "chamfer") {
    const cut = Math.min(hw, hd) * 0.35;
    shape.moveTo(-hw + cut, -hd);
    shape.lineTo(hw - cut, -hd);
    shape.lineTo(hw, -hd + cut);
    shape.lineTo(hw, hd);
    shape.lineTo(-hw, hd);
    shape.lineTo(-hw, -hd + cut);
    shape.closePath();
  } else if (kind === "L") {
    const nx = hw * 0.4, nz = hd * 0.4;
    shape.moveTo(-hw, -hd);
    shape.lineTo(hw, -hd);
    shape.lineTo(hw, hd - nz);
    shape.lineTo(hw - nx, hd - nz);
    shape.lineTo(hw - nx, hd);
    shape.lineTo(-hw, hd);
    shape.closePath();
  } else {
    shape.moveTo(-hw, -hd);
    shape.lineTo(hw, -hd);
    shape.lineTo(hw, hd);
    shape.lineTo(-hw, hd);
    shape.closePath();
  }
  return shape;
}

function useWindowTexture(cols, rows, litColor, seed) {
  return useMemo(() => {
    const rnd = seededRand(seed);
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0a0f16";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;

    const activeBay = rnd() > 0.5 ? Math.floor(rnd() * cols) : -1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isBayLit = activeBay !== -1 && Math.abs(c - activeBay) <= 1 && rnd() < 0.65;
        const isLit = isBayLit || rnd() < 0.32;
        ctx.fillStyle = isLit ? litColor : "#131b24";
        ctx.fillRect(c * cellW + 1, r * cellH + 1, cellW - 2, cellH - 2);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
  }, [cols, rows, litColor, seed]);
}

function HeroSpireTower({ x, z, h, w, baseY }) {
  const groupRef = useRef();
  const segments = 8;
  const windowTex = useWindowTexture(6, 60, "#e8f0f5", 999);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.matrixAutoUpdate = false;
      groupRef.current.updateMatrix();
    }
  }, []);

  const geo = useMemo(() => {
    const geometries = [];
    for (let i = 0; i < segments; i++) {
      const t0 = i / segments;
      const w0 = w * (1 - t0 * 0.85);
      const segH = (h * 0.85) / segments;
      const g = new THREE.BoxGeometry(w0, segH, w0);
      g.translate(0, h * 0.85 * t0 + segH / 2, 0);
      geometries.push(g);
    }
    return geometries;
  }, [h, w]);

  return (
    <group ref={groupRef} position={[x, baseY, z]} raycast={() => null}>
      {geo.map((g, i) => (
        <mesh key={i} geometry={g} castShadow receiveShadow raycast={() => null}>
          <meshPhysicalMaterial
            map={windowTex}
            emissiveMap={windowTex}
            color="#dce8f0"
            emissive="#b8ccd8"
            emissiveIntensity={0.6}
            metalness={0.2}
            roughness={0.1}
            transmission={0.2}
            thickness={0.5}
            ior={1.4}
            reflectivity={0.9}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={1.8}
          />
        </mesh>
      ))}
      <mesh position={[0, h * 0.85 + h * 0.13, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.08, 0.15, h * 0.26, 6]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, h * 0.85 + h * 0.26, 0]} raycast={() => null}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color="#ff3b30" toneMapped={false} />
      </mesh>
    </group>
  );
}

function TowerField({ count, seed, xRange, zRange, hRange, wRange, litRatio = 0.6, baseY }) {
  const groupRef = useRef();
  const rnd = useMemo(() => seededRand(seed), [seed]);
  
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.matrixAutoUpdate = false;
      groupRef.current.updateMatrix();
    }
  }, []);

  const towers = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const x = xRange[0] + rnd() * (xRange[1] - xRange[0]);
      const z = zRange[0] + rnd() * (zRange[1] - zRange[0]);
      const h = hRange[0] + rnd() * (hRange[1] - hRange[0]);
      const w = wRange[0] + rnd() * (wRange[1] - wRange[0]);
      const d = w * (0.6 + rnd() * 0.6);
      const lit = rnd() < litRatio;
      arr.push({ x, z, h, w, d, lit, key: i, tseed: seed * 1000 + i });
    }
    return arr.sort((a, b) => a.z - b.z);
  }, [count, seed, xRange, zRange, hRange, wRange, rnd, litRatio]);

  return (
    <group ref={groupRef} raycast={() => null}>
      {towers.map((t) => (
        <StaticTower key={t.key} {...t} baseY={baseY} />
      ))}
    </group>
  );
}

function StaticTower({ x, z, h, w, d, lit, tseed, baseY }) {
  const meshRef = useRef();
  const rnd = useMemo(() => seededRand(tseed), [tseed]);
  const glow = useMemo(() => GLASS_COOL[Math.floor(rnd() * GLASS_COOL.length)], [rnd]);
  const shapeKind = rnd() < 0.35 ? "chamfer" : rnd() < 0.6 ? "L" : "rect";
  const shape = useMemo(() => makeFootprint(w, d, shapeKind, rnd), [w, d, shapeKind, rnd]);
  
  const windowCols = Math.max(4, Math.round(w));
  const windowRows = Math.max(10, Math.round(h / 2.2));
  const windowTex = useWindowTexture(windowCols, windowRows, glow, tseed);

  const hasWaterTower = rnd() < 0.2;
  const hasHvac = rnd() < 0.25 && !hasWaterTower;
  const hasSpire = rnd() < 0.25;

  const baseGeo = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(shape, { depth: h * 0.55, bevelEnabled: false, steps: 1 });
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [shape, h]);

  const midShape = useMemo(() => makeFootprint(w * 0.78, d * 0.78, shapeKind, rnd), [w, d, shapeKind, rnd]);
  const midGeo = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(midShape, { depth: h * 0.3, bevelEnabled: false, steps: 1 });
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [midShape, h]);

  const topShape = useMemo(() => makeFootprint(w * 0.55, d * 0.55, "rect", rnd), [w, d, rnd]);
  const topGeo = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(topShape, { depth: h * 0.15, bevelEnabled: false, steps: 1 });
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [topShape, h]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.matrixAutoUpdate = false;
      meshRef.current.updateMatrix();
    }
  }, []);

  return (
    <group ref={meshRef} position={[x, baseY, z]} raycast={() => null}>
      <mesh geometry={baseGeo} position={[0, 0, 0]} castShadow receiveShadow raycast={() => null}>
        <meshPhysicalMaterial
          map={windowTex}
          emissiveMap={windowTex}
          color={glow}
          emissive={lit ? glow : "#020304"}
          emissiveIntensity={lit ? 0.8 : 0.05}
          metalness={0.3}
          roughness={0.15}
          transmission={0.1}
          thickness={0.4}
          ior={1.5}
          reflectivity={0.8}
          clearcoat={0.6}
          envMapIntensity={1.6}
        />
      </mesh>

      <mesh geometry={midGeo} position={[0, h * 0.55, 0]} castShadow receiveShadow raycast={() => null}>
        <meshPhysicalMaterial
          map={windowTex}
          emissiveMap={windowTex}
          color={glow}
          emissive={lit ? glow : "#020304"}
          emissiveIntensity={lit ? 0.7 : 0.05}
          metalness={0.3}
          roughness={0.15}
          transmission={0.1}
          reflectivity={0.8}
          clearcoat={0.6}
          envMapIntensity={1.6}
        />
      </mesh>

      <mesh geometry={topGeo} position={[0, h * 0.85, 0]} castShadow receiveShadow raycast={() => null}>
        <meshPhysicalMaterial
          map={windowTex}
          emissiveMap={windowTex}
          color={glow}
          emissive={lit ? glow : "#020304"}
          emissiveIntensity={lit ? 0.9 : 0.05}
          metalness={0.3}
          roughness={0.15}
          transmission={0.1}
          reflectivity={0.8}
          clearcoat={0.6}
          envMapIntensity={1.6}
        />
      </mesh>

      {hasWaterTower && (
        <group position={[w * 0.15, h, d * 0.15]} raycast={() => null}>
          <mesh position={[0, 0.3, 0]} raycast={() => null}>
            <cylinderGeometry args={[0.25, 0.25, 0.5, 10]} />
            <meshStandardMaterial color="#2d1c14" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.6, 0]} raycast={() => null}>
            <coneGeometry args={[0.27, 0.2, 10]} />
            <meshStandardMaterial color="#1a110a" roughness={0.8} />
          </mesh>
        </group>
      )}

      {hasHvac && (
        <mesh position={[-w * 0.15, h + 0.2, -d * 0.15]} castShadow raycast={() => null}>
          <boxGeometry args={[0.5, 0.4, 0.8]} />
          <meshStandardMaterial color="#3a3d42" metalness={0.6} roughness={0.4} />
        </mesh>
      )}

      {hasSpire && (
        <group position={[0, h, 0]} raycast={() => null}>
          <mesh position={[0, h * 0.06, 0]} raycast={() => null}>
            <cylinderGeometry args={[0.06, 0.12, h * 0.12, 6]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, h * 0.13, 0]} raycast={() => null}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial color="#ff3b30" toneMapped={false} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function SkylineCluster({ showBackdrop = false }) {
  return (
    <group raycast={() => null}>
      {showBackdrop && (
        <>
          <mesh position={[0, 90, -350]} raycast={() => null}>
            <planeGeometry args={[1200, 300]} />
            <meshBasicMaterial color="#3f6b96" transparent opacity={0.7} toneMapped={false} />
          </mesh>
          <mesh position={[0, 30, -340]} raycast={() => null}>
            <planeGeometry args={[1200, 160]} />
            <meshBasicMaterial color="#e8a15c" transparent opacity={0.3} toneMapped={false} />
          </mesh>
        </>
      )}

      <mesh position={[0, 10, -80]} raycast={() => null}>
        <planeGeometry args={[1200, 60]} />
        <meshBasicMaterial color="#d4a373" transparent opacity={0.18} toneMapped={false} />
      </mesh>

      <TowerField count={80} seed={7} xRange={[-400, 400]} zRange={[-130, -70]} hRange={[35, 85]} wRange={[6, 12]} litRatio={0.4} baseY={0} />
      <TowerField count={65} seed={19} xRange={[-320, 320]} zRange={[-60, 5]} hRange={[28, 70]} wRange={[5, 11]} litRatio={0.5} baseY={0} />
      <TowerField count={36} seed={31} xRange={[-200, -14]} zRange={[15, 55]} hRange={[22, 65]} wRange={[6, 13]} litRatio={0.6} baseY={0} />
      <TowerField count={36} seed={43} xRange={[14, 200]} zRange={[15, 55]} hRange={[22, 65]} wRange={[6, 13]} litRatio={0.6} baseY={0} />

      <HeroSpireTower x={0} z={35} h={95} w={11} baseY={0} />

      <mesh position={[0, 4, 60]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <planeGeometry args={[1200, 80]} />
        <meshBasicMaterial color="#8fb0c4" transparent opacity={0.08} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function Skyline() {
  return (
    <group>
      {/* Front Skyline (at z = -75 with sky backdrop) */}
      <group position={[0, 0, -95]}>
        <SkylineCluster showBackdrop={true} />
      </group>

      {/* Back Skyline behind Glass Cabins (at z = 75, rotated 180°, no backdrop) */}
      <group position={[0, 0, 75]} rotation={[0, Math.PI, 0]}>
        <SkylineCluster showBackdrop={false} />
      </group>
    </group>
  );
}