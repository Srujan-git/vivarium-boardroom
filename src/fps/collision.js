import { useRef, useCallback, useEffect } from "react";
import { PLAYER_RADIUS } from "../constants";

/* ============================================================================
   COLLISION REGISTRY (Optimized for zero-churn performance)
============================================================================ */

export function useColliderRegistry() {
  const boxes = useRef([]); // { minX, maxX, minZ, maxZ }
  
  const register = useCallback((box) => {
    boxes.current.push(box);
    return () => {
      boxes.current = boxes.current.filter((b) => b !== box);
    };
  }, []);

  return { boxes, register };
}

/** Registers an AABB collider sized from a box geometry footprint (memoized to prevent churn). */
export function useBoxCollider(registerFn, position, size, rotationY = 0, padding = 0.05) {
  const boxRef = useRef(null);

  useEffect(() => {
    if (!registerFn) return;
    const [px, , pz] = position;
    const [w, , d] = size;
    const cos = Math.abs(Math.cos(rotationY));
    const sin = Math.abs(Math.sin(rotationY));
    const halfW = (w * cos + d * sin) / 2 + padding;
    const halfD = (w * sin + d * cos) / 2 + padding;
    
    boxRef.current = {
      minX: px - halfW,
      maxX: px + halfW,
      minZ: pz - halfD,
      maxZ: pz + halfD,
    };

    return registerFn(boxRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerFn, position[0], position[2], size[0], size[2], rotationY, padding]);
}

/** Resolves whether a candidate (x,z) position collides with any registered AABB or closed door. 
 *  Optimized with spatial pre-filtering to eliminate lag. */
export function isClear(x, z, staticBoxes, doorColliders) {
  // SAFETY CHECK: bypass collision right around spawn so the player never traps.
  const distFromSpawn = Math.hypot(x - 0, z - 2);
  if (distFromSpawn < 0.9) return true;

  if (x < -22.5 || x > 22.5) return false;
  if (z < -20.5 || z > 14.5) return false;

  // Optimized AABB scan with spatial broadphase check
  for (let i = 0; i < staticBoxes.length; i++) {
    const b = staticBoxes[i];
    // Fast broadphase pre-filter (skip boxes far from player current position)
    if (x < b.minX - PLAYER_RADIUS || x > b.maxX + PLAYER_RADIUS || 
        z < b.minZ - PLAYER_RADIUS || z > b.maxZ + PLAYER_RADIUS) {
      continue;
    }

    const cx = Math.max(b.minX, Math.min(x, b.maxX));
    const cz = Math.max(b.minZ, Math.min(z, b.maxZ));
    const dx = x - cx;
    const dz = z - cz;
    if (dx * dx + dz * dz < PLAYER_RADIUS * PLAYER_RADIUS) return false;
  }

  for (const collider of doorColliders.values()) {
    const openAmt = collider.getOpenAmount ? collider.getOpenAmount() : 0;
    if (openAmt > 0.6) continue;
    const [dx0, , dz0] = collider.position;
    const dist = Math.hypot(x - dx0, z - dz0);
    if (dist < 1.05 + PLAYER_RADIUS) return false;
  }

  return true;
}