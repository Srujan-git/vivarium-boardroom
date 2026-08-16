"use client";
import dynamic from "next/dynamic";

// Three.js/WebGL cannot run during SSR - load the scene client-only with the new modular path
const PSLOfficeFloor = dynamic(() => import("../src/PSLOfficeFloorFPS"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#cfe0ec",
        color: "#3b2317",
        fontFamily: "'Georgia', serif",
        fontSize: 18,
        letterSpacing: 2,
      }}
    >
      LOADING 47TH FLOOR...
    </div>
  ),
});

export default function Page() {
  return <PSLOfficeFloor />;
}