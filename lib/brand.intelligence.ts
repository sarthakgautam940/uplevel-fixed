export type Personality = "refined" | "bold" | "playful" | "technical" | "warm";
export type ColorMode = "dark-luxury" | "light-minimal" | "earth-tones" | "vivid" | "monochrome";
export type FontPairing =
  | "cormorant-geist"
  | "playfair-inter"
  | "libre-roboto"
  | "bodoni-source"
  | "garamond-helvetica"
  | "chronicle-neue"
  | "freight-aktiv"
  | "caslon-gill";
export type AnimationIntensity = "subtle" | "moderate" | "expressive";
export type LayoutVariant = "editorial" | "centered" | "asymmetric" | "grid-heavy";
export type TargetClient = "ultra-luxury" | "upper-middle" | "commercial";
export type PrimaryEmotion = "awe" | "trust" | "excitement" | "comfort" | "prestige";

export interface BrandIntelligence {
  personality: Personality;
  colorMode: ColorMode;
  fontPairing: FontPairing;
  animationIntensity: AnimationIntensity;
  layoutVariant: LayoutVariant;
  targetClient: TargetClient;
  primaryEmotion: PrimaryEmotion;
}

export const brandIntelligence: BrandIntelligence = {
  personality: "refined",
  colorMode: "dark-luxury",
  fontPairing: "cormorant-geist",
  animationIntensity: "moderate",
  layoutVariant: "editorial",
  targetClient: "ultra-luxury",
  primaryEmotion: "awe",
};

export interface ColorPreset {
  void: string;
  surface1: string;
  surface2: string;
  surface3: string;
  borderDim: string;
  borderMid: string;
  borderBright: string;
  gold: string;
  goldLight: string;
  goldDim: string;
  goldRgb: string;
  water: string;
  waterLight: string;
  textPrimary: string;
  textSecondary: string;
  textDim: string;
  textGhost: string;
}

export const DARK_LUXURY: ColorPreset = {
  void: "#050508",
  surface1: "#0c0c12",
  surface2: "#12121a",
  surface3: "#1a1a26",
  borderDim: "rgba(255,255,255,0.03)",
  borderMid: "rgba(255,255,255,0.08)",
  borderBright: "rgba(255,255,255,0.16)",
  gold: "#c9a84c",
  goldLight: "#e8c876",
  goldDim: "#7a5e28",
  goldRgb: "201,168,76",
  water: "#1a6b8a",
  waterLight: "#2a9bc4",
  textPrimary: "#f2f2f0",
  textSecondary: "#a8a89e",
  textDim: "#5a5a54",
  textGhost: "#2e2e2a",
};

export const LIGHT_MINIMAL: ColorPreset = {
  void: "#faf9f7",
  surface1: "#f2f0ed",
  surface2: "#e8e6e3",
  surface3: "#dddbd8",
  borderDim: "rgba(0,0,0,0.04)",
  borderMid: "rgba(0,0,0,0.09)",
  borderBright: "rgba(0,0,0,0.18)",
  gold: "#8b6914",
  goldLight: "#b38b1e",
  goldDim: "#c4a55a",
  goldRgb: "139,105,20",
  water: "#1a6b8a",
  waterLight: "#2a9bc4",
  textPrimary: "#1a1a18",
  textSecondary: "#4a4a44",
  textDim: "#8a8a84",
  textGhost: "#c8c8c0",
};

export const EARTH_TONES: ColorPreset = {
  void: "#1c1510",
  surface1: "#251e18",
  surface2: "#2e2620",
  surface3: "#382e28",
  borderDim: "rgba(255,220,180,0.04)",
  borderMid: "rgba(255,220,180,0.09)",
  borderBright: "rgba(255,220,180,0.18)",
  gold: "#c4855a",
  goldLight: "#d9a07a",
  goldDim: "#8a5a3a",
  goldRgb: "196,133,90",
  water: "#5a8a6a",
  waterLight: "#7aaa8a",
  textPrimary: "#f0ebe5",
  textSecondary: "#b8b0a8",
  textDim: "#706860",
  textGhost: "#3a3228",
};

const presetMap: Record<ColorMode, ColorPreset> = {
  "dark-luxury": DARK_LUXURY,
  "light-minimal": LIGHT_MINIMAL,
  "earth-tones": EARTH_TONES,
  vivid: DARK_LUXURY,
  monochrome: DARK_LUXURY,
};

export function generateCSSVariables(intelligence: BrandIntelligence): string {
  const preset = presetMap[intelligence.colorMode];
  return `
    --void: ${preset.void};
    --surface-1: ${preset.surface1};
    --surface-2: ${preset.surface2};
    --surface-3: ${preset.surface3};
    --border-dim: ${preset.borderDim};
    --border-mid: ${preset.borderMid};
    --border-bright: ${preset.borderBright};
    --gold: ${preset.gold};
    --gold-light: ${preset.goldLight};
    --gold-dim: ${preset.goldDim};
    --gold-rgb: ${preset.goldRgb};
    --water: ${preset.water};
    --water-light: ${preset.waterLight};
    --text-primary: ${preset.textPrimary};
    --text-secondary: ${preset.textSecondary};
    --text-dim: ${preset.textDim};
    --text-ghost: ${preset.textGhost};
    --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-elastic: cubic-bezier(0.34, 1.56, 0.64, 1);
  `.trim();
}
