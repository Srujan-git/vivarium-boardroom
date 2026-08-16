import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROOMS } from "../constants";

/* ============================================================================
   GLASSMORPHIC AGENT OVERLAY
============================================================================ */
export function AgentOverlay({ roomId, onClose }) {
  if (!roomId) return null;
  const room = ROOMS[roomId];

  return (
    <AnimatePresence>
      <motion.div
        key={roomId}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: "5%",
          right: "3%",
          width: 320,
          padding: "22px 24px",
          borderRadius: 18,
          background: "rgba(20, 16, 12, 0.55)",
          backdropFilter: "blur(22px) saturate(160%)",
          WebkitBackdropFilter: "blur(22px) saturate(160%)",
          border: "1px solid rgba(212, 175, 122, 0.35)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          color: "#f3ede0",
          fontFamily: "'Georgia', 'Times New Roman', serif",
          zIndex: 20,
          pointerEvents: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.6, textTransform: "uppercase" }}>{room.subtitle}</div>
            <div style={{ fontSize: 19, fontWeight: 600, marginTop: 4 }}>{room.name}</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#f3ede0", opacity: 0.6, fontSize: 18, cursor: "pointer", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(212, 175, 122, 0.08)",
            border: "1px solid rgba(212, 175, 122, 0.2)",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: room.load > 0 ? "#5fd88a" : "#8a8a8a",
              boxShadow: room.load > 0 ? "0 0 8px #5fd88a" : "none",
            }}
          />
          <div style={{ fontSize: 13, fontFamily: "system-ui, sans-serif" }}>{room.agent}</div>
        </div>

        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4, fontFamily: "system-ui, sans-serif" }}>{room.status}</div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ============================================================================
   TOP TITLE BAR
============================================================================ */
export function TitleBar() {
  return (
    <div
      style={{
        position: "absolute",
        top: 24,
        left: 28,
        zIndex: 20,
        color: "#f3ede0",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        pointerEvents: "none",
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: 1 }}>PEARSON SPECTER LITT</div>
      <div style={{ fontSize: 11, letterSpacing: 3, opacity: 0.65, marginTop: 2, fontFamily: "system-ui, sans-serif" }}>
        47TH FLOOR · ONE WORLD PLAZA
      </div>
    </div>
  );
}

/* ============================================================================
   CROSSHAIR
============================================================================ */
export function Crosshair() {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 6,
        height: 6,
        marginLeft: -3,
        marginTop: -3,
        borderRadius: "50%",
        background: "rgba(243,237,224,0.85)",
        boxShadow: "0 0 4px rgba(0,0,0,0.6)",
        zIndex: 15,
        pointerEvents: "none",
      }}
    />
  );
}

/* ============================================================================
   LOCK OVERLAY (entry screen)
============================================================================ */
export function LockOverlay({ onLock }) {
  return (
    <div
      onClick={onLock}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "rgba(10,8,6,0.55)",
        backdropFilter: "blur(6px)",
        zIndex: 30,
        cursor: "pointer",
        color: "#f3ede0",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: 1, marginBottom: 10 }}>
        PEARSON SPECTER LITT — 47TH FLOOR
      </div>
      <div style={{ fontSize: 14, opacity: 0.8, fontFamily: "system-ui, sans-serif", marginBottom: 22 }}>
        Click to step onto the floor
      </div>
      <div
        style={{
          padding: "12px 26px",
          borderRadius: 10,
          border: "1px solid rgba(212,175,122,0.5)",
          background: "rgba(212,175,122,0.12)",
          fontSize: 13,
          letterSpacing: 1,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        ENTER LOBBY
      </div>
      <div style={{ fontSize: 12, opacity: 0.55, marginTop: 22, fontFamily: "system-ui, sans-serif" }}>
        WASD / Arrow Keys to walk · Mouse to look · Click a glass door to open it
      </div>
    </div>
  );
}

/* ============================================================================
   MOVEMENT HINT (bottom HUD, shown once locked)
============================================================================ */
export function MovementHint({ locked }) {
  if (!locked) return null;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "8px 16px",
        borderRadius: 10,
        background: "rgba(20, 16, 12, 0.5)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(212,175,122,0.25)",
        color: "#f3ede0",
        fontSize: 11.5,
        fontFamily: "system-ui, sans-serif",
        letterSpacing: 0.4,
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      WASD / Arrows to walk · Click a door to swing it open · Esc to release cursor
    </div>
  );
}
