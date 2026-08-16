/* ============================================================================
   CONSTANTS — palette, room registry, spawn point, player physics
============================================================================ */

export const PALETTE = {
  mahogany: "#3b2317",
  mahoganyDark: "#180d06",
  mahoganyFloor: "#241408",
  mahoganyFloorAccent: "#150b04",
  brass: "#9c7a44",
  brassLight: "#e0bd82",
  glass: "#dce8f0",
  glassFrame: "#6d7278",
  charcoal: "#151517",
  cream: "#f3ede0",
  skyWarm: "#f2b06a",
  sunlight: "#ffe3ac",
  leather: "#5f3225",
  leatherDark: "#3f1f19",
  plantGreen: "#3c6b3f",
  plantGreenDark: "#254a29",
  paperCream: "#e8e0c8",
  steel: "#7c8085",
  marble: "#e7ddc8",
  marbleVein: "#b8a888",
  deskWalnut: "#3a2418",
  deskWalnutEdge: "#241407",
  matteSteel: "#2b2d30",
  screenGradTop: "#0d1b2a",
  screenGradBottom: "#132a3d",
  screenAccent: "#4fa8e0",
  keyboardBody: "#1c1c1e",
};

export const EYE_HEIGHT = 1.6;
export const PLAYER_RADIUS = 0.32;

export const ROOMS = {
  founder: {
    id: "founder",
    name: "The Founder's Corner",
    subtitle: "Managing Partner Suite",
    agent: "HARVEY — Principal Strategist",
    status: "Reviewing closing arguments",
    load: 0.82,
    color: "#c99a4b",
    doorPos: [-19.5, 0, 12.5],
  },
  cfa: {
    id: "cfa",
    name: "CFA Level III Cabin",
    subtitle: "Quantitative Research",
    agent: "MIKE — Portfolio Analyst",
    status: "Backtesting factor model",
    load: 0.47,
    color: "#4b8fc9",
    doorPos: [-6, 0, 7.5],
  },
  banker: {
    id: "banker",
    name: "Investment Banking Cabin",
    subtitle: "M&A + Capital Markets",
    agent: "LOUIS — Deal Lead",
    status: "Modeling LBO sensitivity",
    load: 0.63,
    color: "#4bc98f",
    doorPos: [2, 0, 7.5],
  },
  bankruptcy: {
    id: "bankruptcy",
    name: "Bankruptcy Law Cabin",
    subtitle: "Restructuring Counsel",
    agent: "DONNA — Compliance Counsel",
    status: "Drafting Chapter 11 brief",
    load: 0.31,
    color: "#c94b6a",
    doorPos: [10, 0, 7.5],
  },
  strategy: {
    id: "strategy",
    name: "Strategy Head Cabin",
    subtitle: "Corporate Strategy",
    agent: "JESSICA — Chief of Staff",
    status: "Synthesizing board memo",
    load: 0.55,
    color: "#9a6bc9",
    doorPos: [18, 0, 7.5],
  },
  boardroom: {
    id: "boardroom",
    name: "The Grand Boardroom",
    subtitle: "Multi-Agent Conference",
    agent: "ALL AGENTS — Standing By",
    status: "Idle — no active session",
    load: 0.0,
    color: "#c9b04b",
    doorPos: [1.05, 0, -11.6],
  },
  bullpen: {
    id: "bullpen",
    name: "The Execution Bullpen",
    subtitle: "5 Associate Workstations",
    agent: "ASSOCIATES — 5 active",
    status: "Executing task queue",
    load: 0.71,
    color: "#4bb0c9",
    doorPos: [-2, 0, -7],
  },
  pantry: {
    id: "pantry",
    name: "The Pantry",
    subtitle: "Break Room",
    agent: "—",
    status: "Unoccupied",
    load: 0.0,
    color: "#c9884b",
    doorPos: [19.8, 0, -12],
  },
};

export const SPAWN = { pos: [0, EYE_HEIGHT, 2], yaw: Math.PI };

/* Performance tiering — MeshTransmissionMaterial is VRAM/GPU heavy (it
   renders a back-buffer pass per instance). These caps keep ultrabook
   iGPUs at 60fps: samples lowered 6→3 halves backbuffer sample cost,
   resolution lowered 256→128 quarters the backbuffer render target. */
export const TRANSMISSION_SAMPLES = 3;
export const TRANSMISSION_RESOLUTION = 128;