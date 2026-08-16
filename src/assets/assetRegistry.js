import { useGLTF } from "@react-three/drei";

/* ============================================================================
   ASSET URL REGISTRY — single place to bind real .glb models

   Every furniture component (ExecutiveDesk, Bookshelf, GuestArmchair,
   FilingCabinet, PottedPlant) accepts a `modelUrl` prop and reads it from
   this object by default. Drop a verified URL in and it loads automatically
   — no other code changes needed. Leave an entry null and that piece keeps
   rendering its procedural PBR fallback.

   We intentionally do NOT fill these in with guessed CDN URLs — a broken or
   wrongly-licensed link baked into the app is worse than the honest
   fallback already in place. Sources worth checking:
     - Khronos glTF-Sample-Assets (github.com/KhronosGroup/glTF-Sample-Assets)
       — CC0/permissive, mostly not office furniture.
     - Poly Pizza (poly.pizza) — CC0/CC-BY .glb models, filterable by
       license, includes furniture.
     - Sketchfab (sketchfab.com) — huge selection, check each license
       individually (many are NOT free for commercial use).
     - Your own pipeline — export from Blender, run through
       gltf-transform / gltfpack for Draco + texture compression, host on
       your own CDN/object storage (recommended for production).
============================================================================ */

export const ASSET_URLS = {
  executiveDesk: null,
  computer: "/models/computer.glb", 
  bookshelf: null,
  guestArmchair: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb", // Asli luxury chair model
  filingCabinet: null,
  pottedPlantPalm: null,
  pottedPlantMonstera: null,
};

/** Preload whichever entries are filled in, so the first cabin visited
 *  isn't the one paying the download/parse cost. Call once at module init. */
export function preloadAssets() {
  Object.values(ASSET_URLS).forEach((url) => {
    if (url) useGLTF.preload(url);
  });
}
