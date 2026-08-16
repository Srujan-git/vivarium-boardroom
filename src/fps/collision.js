import { useRef, useCallback, useEffect } from "react";
import { PLAYER_RADIUS } from "../constants";

/* ============================================================================
   COLLISION REGISTRY (unchanged logic — do not "improve")
   Static geometry (walls, desks, shelves, plants, cabinets) registers an
   AABB here. Doors register separately (see SwingDoor) since their block
   state depends on open/closed angle each frame, not a fixed box.
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

/** Registers an AABB collider sized from a box geometry footprint. */
export function useBoxCollider(registerFn, position, size, rotationY = 0, padding = 0.05) {
  useEffect(() => {
    if (!registerFn) return;
    const [px, , pz] = position;
    const [w, , d] = size;
    const cos = Math.abs(Math.cos(rotationY));
    const sin = Math.abs(Math.sin(rotationY));
    const halfW = (w * cos + d * sin) / 2 + padding;
    const halfD = (w * sin + d * cos) / 2 + padding;
    const box = {
      minX: px - halfW,
      maxX: px + halfW,
      minZ: pz - halfD,
      maxZ: pz + halfD,
    };
    return registerFn(box);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerFn, position[0], position[1], position[2], size[0], size[1], size[2], rotationY, padding]);
}

/** Resolves whether a candidate (x,z) position (as a circle of PLAYER_RADIUS)
 *  collides with any registered AABB or closed door. Returns true if CLEAR. */
export function isClear(x, z, staticBoxes, doorColliders) {
  // SAFETY CHECK: bypass collision right around spawn so the player never traps.
  const distFromSpawn = Math.hypot(x - 0, z - 2);
  if (distFromSpawn < 0.9) return true;

  if (x < -22.5 || x > 22.5) return false;
  if (z < -20.5 || z > 14.5) return false;

  for (const b of staticBoxes) {
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
