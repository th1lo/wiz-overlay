import { Crosshair, Skull, ChartNoAxesColumn, Sword, DoorOpen } from 'lucide-react';

export const statConfig = {
  pmcKills: { label: 'PMC Kills', icon: <Crosshair className="h-7 w-7 text-yellow-400" /> },
  totalDeaths: { label: 'Deaths', icon: <Skull className="h-7 w-7 text-yellow-400" /> },
  totalRaids: { label: 'Raids', icon: <Sword className="h-7 w-7 text-yellow-400" /> },
  survivedRaids: { label: 'Survived', icon: <DoorOpen className="h-7 w-7 text-yellow-400" /> },
  kdRatio: { label: 'K/D', icon: <ChartNoAxesColumn className="h-7 w-7 text-yellow-400" /> }
};

export const itemConfig = {
  ledx: { label: 'LEDX', image: '/ledx.png' },
  gpu: { label: 'GPU', image: '/gpu.png' },
  bitcoin: { label: 'Bitcoin', image: '/bitcoin.png' },
  redKeycard: { label: 'Red Keycard', image: '/red_keycard.png' },
  blueKeycard: { label: 'Blue Keycard', image: '/blue_keycard.png' },
  yellowKeycard: { label: 'Yellow Keycard', image: '/yellow_keycard.png' }
}; 