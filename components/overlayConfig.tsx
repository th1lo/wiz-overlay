import { LucideIcon, Package, Cpu, Bitcoin, KeyRound, Skull, Cross, Map, CheckCircle, Target } from 'lucide-react';
import type { ItemConfig } from './types';

interface StatConfig {
  label: string;
  icon: keyof typeof iconMap;
}

const iconMap = {
  Skull,
  Cross,
  Map,
  CheckCircle,
  Target
};

export const statConfig: Record<string, StatConfig> = {
  pmcKills: { label: 'PMC Kills', icon: 'Skull' },
  totalDeaths: { label: 'Deaths', icon: 'Cross' },
  totalRaids: { label: 'Total Raids', icon: 'Map' },
  survivedRaids: { label: 'Survived', icon: 'CheckCircle' },
  kdRatio: { label: 'K/D Ratio', icon: 'Target' }
};

export const defaultItemConfig: Record<string, ItemConfig> = {
  ledx: {
    label: 'LEDX',
    icon: Package,
    price: 1500000,
    wikiLink: 'https://escapefromtarkov.fandom.com/wiki/LEDX_Splint'
  },
  gpu: {
    label: 'GPU',
    icon: Cpu,
    price: 350000,
    wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Graphics_card'
  },
  bitcoin: {
    label: 'Bitcoin',
    icon: Bitcoin,
    price: 200000,
    wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Bitcoin'
  },
  redKeycard: {
    label: 'Red Keycard',
    icon: KeyRound,
    price: 50000000,
    wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Red_keycard'
  },
  blueKeycard: {
    label: 'Blue Keycard',
    icon: KeyRound,
    price: 15000000,
    wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Blue_keycard'
  },
  yellowKeycard: {
    label: 'Yellow Keycard',
    icon: KeyRound,
    price: 10000000,
    wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Yellow_keycard'
  }
};

export async function fetchItemConfig(): Promise<Record<string, ItemConfig>> {
  try {
    const response = await fetch('/api/tarkov-items');
    if (!response.ok) throw new Error('Failed to fetch items');
    const items = await response.json();
    
    return Object.entries(items).reduce((acc, [key, item]: [string, any]) => ({
      ...acc,
      [key]: {
        label: item.name,
        icon: defaultItemConfig[key]?.icon || Package,
        price: item.price,
        wikiLink: item.wikiLink
      }
    }), defaultItemConfig);
  } catch (error) {
    console.error('Error fetching item config:', error);
    return defaultItemConfig;
  }
} 