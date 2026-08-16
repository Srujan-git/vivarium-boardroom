import React, { Suspense, useCallback, useRef, useEffect } from "react";
import { ContactShadows, Environment, Sky } from "@react-three/drei";
import { PALETTE } from "./constants";
import Floor from "./environment/Floor";
import RooftopTerrace from "./environment/RooftopTerrace";
import Skyline from "./environment/Skyline";
import { Hallway, Ceiling, AtmosphericFog } from "./environment/Shell";
import FirstPersonRig from "./fps/FirstPersonRig";
import FoundersCorner from "./rooms/FoundersCorner";
import GlassCabin from "./rooms/GlassCabin";
import Bullpen from "./rooms/Bullpen";
import Boardroom from "./rooms/Boardroom";
import Pantry from "./rooms/Pantry";

export default function Scene({ activeRoom, onDoorClick, setLocked, doorColliders, staticBoxesRef, registerStatic, lockTrigger }) {
  const envRef = useRef();
  const skylineRef = useRef();

  const registerDoorCollider = useCallback(
    (roomId, collider) => {
      doorColliders.current.set(roomId, collider);
    },
    [doorColliders]
  );

  // Freeze static environment and skyline matrices permanently on mount to kill CPU matrix churn
  useEffect(() => {
    if (envRef.current) {
      envRef.current.matrixAutoUpdate = false;
      envRef.current.updateMatrix();
    }
    if (skylineRef.current) {
      skylineRef.current.matrixAutoUpdate = false;
      skylineRef.current.updateMatrix();
    }
  }, []);

  return (
    <>
      <color attach="background" args={["#e9c8a0"]} />
      <AtmosphericFog color="#e9c8a0" density={0.004} />

      <directionalLight
        position={[-25, 20, 22]}
        intensity={2.8}
        color={PALETTE.sunlight}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-bias={-0.0003}
        shadow-radius={4}
      />
      <ambientLight intensity={0.42} color="#f0dcc0" />
      <hemisphereLight args={["#f2c98e", "#20130a", 0.4]} />
      <directionalLight position={[18, 10, -20]} intensity={0.35} color="#bcd4e8" />

      {/* Skyline wrapped in raycast-null and frozen group */}
      <Suspense fallback={null}>
        <group ref={skylineRef} raycast={() => null}>
          <Skyline position={[0, 0, -90]} />
          <Skyline position={[0, 0, 80]} rotation={[0, Math.PI, 0]} />
        </group>
        <Sky sunPosition={[-25, 8, 18]} turbidity={4} rayleigh={1.2} mieCoefficient={0.02} mieDirectionalG={0.85} />
        <Environment preset="city" background={false} environmentIntensity={1.25} />
      </Suspense>

      {/* Static office environment shell wrapped to eliminate raycasting and matrix overhead */}
      <group ref={envRef} raycast={() => null}>
        <Floor />
        <RooftopTerrace /> 
        <Hallway />
        <Ceiling />
      </group>

      <FoundersCorner 
        position={[-17.25, 0, -15.5]} 
        rotationY={Math.PI} 
        onDoorClick={onDoorClick} 
        active={activeRoom === "founder"} 
        registerCollider={registerStatic} 
        registerDoorCollider={registerDoorCollider} 
      />
      
      <GlassCabin x={-17.25} roomId="cfa" onDoorClick={onDoorClick} active={activeRoom === "cfa"} label="CFA LEVEL III" registerCollider={registerStatic} registerDoorCollider={registerDoorCollider} monitors={2} />
      <GlassCabin x={-5.75} roomId="banker" onDoorClick={onDoorClick} active={activeRoom === "banker"} label="INVESTMENT BANKING" registerCollider={registerStatic} registerDoorCollider={registerDoorCollider} monitors={3} />
      <GlassCabin x={5.75} roomId="bankruptcy" onDoorClick={onDoorClick} active={activeRoom === "bankruptcy"} label="BANKRUPTCY LAW" registerCollider={registerStatic} registerDoorCollider={registerDoorCollider} monitors={2} />
      <GlassCabin x={17.25} roomId="strategy" onDoorClick={onDoorClick} active={activeRoom === "strategy"} label="STRATEGY HEAD" registerCollider={registerStatic} registerDoorCollider={registerDoorCollider} monitors={2} />

      <Bullpen active={activeRoom === "bullpen"} registerCollider={registerStatic} />
      <Boardroom onDoorClick={onDoorClick} active={activeRoom === "boardroom"} registerCollider={registerStatic} registerDoorCollider={registerDoorCollider} />
      <Pantry onDoorClick={onDoorClick} active={activeRoom === "pantry"} registerCollider={registerStatic} registerDoorCollider={registerDoorCollider} />

      <ContactShadows position={[0, 0.01, 0]} opacity={0.45} scale={70} blur={2.2} far={10} />

      <FirstPersonRig setLocked={setLocked} doorColliders={doorColliders} staticBoxesRef={staticBoxesRef} lockTrigger={lockTrigger} />
    </>
  );
}