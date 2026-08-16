import React, { useState, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { SPAWN, EYE_HEIGHT } from "./constants";
import { useColliderRegistry } from "./fps/collision";
import { preloadAssets } from "./assets/assetRegistry";
import Scene from "./Scene";
import { TitleBar, Crosshair, AgentOverlay, LockOverlay, MovementHint } from "./ui/Overlays";

/* ============================================================================
   PEARSON SPECTER LITT — 47th FLOOR
   Root application component. Owns interaction state (active room, pointer
   lock) and the canvas; all rendering logic lives in Scene and its
   sub-modules (environment/, rooms/, assets/, fps/, ui/).
============================================================================ */

preloadAssets();

export default function PSLOfficeFloorFPS() {
  const [activeRoom, setActiveRoom] = useState(null);
  const [locked, setLocked] = useState(false);
  const [lockTrigger, setLockTrigger] = useState(0);
  const doorColliders = useRef(new Map());
  const { boxes: staticBoxesRef, register: registerStatic } = useColliderRegistry();

  const handleDoorClick = useCallback((roomId) => {
    setActiveRoom((prev) => (prev === roomId ? null : roomId));
  }, []);

  const requestLock = useCallback(() => {
    setLockTrigger((n) => n + 1);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "#e8c9a0", overflow: "hidden" }}>
      <Canvas
        shadows="soft"
        camera={{ position: [SPAWN.pos[0], EYE_HEIGHT, SPAWN.pos[2]], fov: 62, near: 0.05, far: 400 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Scene
          activeRoom={activeRoom}
          onDoorClick={handleDoorClick}
          setLocked={setLocked}
          doorColliders={doorColliders}
          staticBoxesRef={staticBoxesRef}
          registerStatic={registerStatic}
          lockTrigger={lockTrigger}
        />
      </Canvas>

      <TitleBar />
      <Crosshair />
      <AgentOverlay roomId={activeRoom} onClose={() => setActiveRoom(null)} />
      <MovementHint locked={locked} />
      {!locked && <LockOverlay onLock={requestLock} />}
    </div>
  );
}
