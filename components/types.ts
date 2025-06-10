import { LucideIcon } from 'lucide-react';

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

export interface ItemConfig {
  label: string;
  icon: LucideIcon;
  price?: number;
  wikiLink?: string;
} 