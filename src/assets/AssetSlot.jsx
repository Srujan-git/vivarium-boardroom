import React, { useMemo, useEffect, Suspense } from "react";
import { useGLTF } from "@react-three/drei";

/* ============================================================================
   ASSET SLOT — GLTF-ready wrapper with Draco fallback to primitives

   Usage:
     <AssetSlot url="/models/desk_exec.glb" fallback={<ExecutiveDeskPrimitive .../>} />

   - If `url` is provided and the GLTF loads, its scene graph is rendered.
   - If `url` is omitted, or the load throws (missing file, bad Draco path,
     network error), the `fallback` primitive is rendered instead — so the
     scene never goes blank. Collision registration is done by the parent
     component, not the model, so it's unaffected either way.
============================================================================ */

function GLTFModel({ url, scale = 1, rotationY = 0 }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cloned.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        // Align imported materials with the scene's PBR environment so they
        // don't look flat next to the hand-tuned procedural fallbacks —
        // most exported glTFs default envMapIntensity to 1.
        if (o.material && "envMapIntensity" in o.material) {
          o.material.envMapIntensity = 1.3;
        }
      }
    });
  }, [cloned]);

  return <primitive object={cloned} scale={scale} rotation={[0, rotationY, 0]} />;
}

class AssetErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    // Swallow — fallback primitive already covers the visual, this just
    // prevents a bad/missing asset from taking down the whole scene.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[AssetSlot] GLTF load failed, using fallback primitive:", error?.message);
    }
  }
  render() {
    if (this.state.failed) return this.props.fallback || null;
    return this.props.children;
  }
}

export default function AssetSlot({ url, fallback, scale = 1, rotationY = 0 }) {
  if (!url) return fallback || null;
  return (
    <AssetErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GLTFModel url={url} scale={scale} rotationY={rotationY} />
      </Suspense>
    </AssetErrorBoundary>
  );
}
