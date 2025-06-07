export interface OverlayConfig {
  stats: {
    pmcKills: boolean;
    totalDeaths: boolean;
    totalRaids: boolean;
    survivedRaids: boolean;
    kdRatio: boolean;
  };
  items: {
    ledx: boolean;
    gpu: boolean;
    bitcoin: boolean;
    redKeycard: boolean;
    blueKeycard: boolean;
    yellowKeycard: boolean;
  };
  showCards?: boolean;
} 