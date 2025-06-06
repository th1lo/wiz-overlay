'use client';

import { useEffect, useState } from 'react';
import { Crosshair, Skull, ChartNoAxesColumn, Sword, DoorOpen } from 'lucide-react';

interface OverlayConfig {
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
    labsKeycard: boolean;
  };
}

const statConfig = {
  pmcKills: { label: 'PMC Kills', icon: <Crosshair className="h-7 w-7 text-yellow-400" /> },
  totalDeaths: { label: 'Deaths', icon: <Skull className="h-7 w-7 text-yellow-400" /> },
  totalRaids: { label: 'Raids', icon: <Sword className="h-7 w-7 text-yellow-400" /> },
  survivedRaids: { label: 'Survived', icon: <DoorOpen className="h-7 w-7 text-yellow-400" /> },
  kdRatio: { label: 'K/D', icon: <ChartNoAxesColumn className="h-7 w-7 text-yellow-400" /> }
};

const itemConfig = {
  ledx: { label: 'LEDX', image: '/ledx.png' },
  gpu: { label: 'GPU', image: '/gpu.png' },
  bitcoin: { label: 'Bitcoin', image: '/bitcoin.png' },
  redKeycard: { label: 'Red Keycard', image: '/red_keycard.png' },
  blueKeycard: { label: 'Blue Keycard', image: '/blue_keycard.png' },
  labsKeycard: { label: 'Labs Keycard', image: '/yellow_keycard.png' }
};

function FIRItemsOverlay({ stats, config }: { stats: Record<string, number>, config: OverlayConfig }) {
  return (
    <div className="fixed bottom-12 left-12 pointer-events-none select-none">
      <div className="flex bg-zinc-900/90 rounded-xl px-8 py-6 space-x-8 shadow-lg">
        {Object.entries(itemConfig).map(([key, item]) => (
          config.items[key as keyof OverlayConfig['items']] && (
            <div key={key} className="flex items-center space-x-2">
              <img src={item.image} alt={item.label} className="h-8 w-8" />
              <span className="text-white text-lg font-medium">{stats[key]}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

function PlayerStatsOverlay({ stats, config }: { stats: Record<string, number>, config: OverlayConfig }) {
  return (
    <div className="fixed bottom-12 right-12 pointer-events-none select-none">
      <div className="flex bg-zinc-900/90 rounded-xl px-8 py-6 space-x-8 shadow-lg">
        {Object.entries(statConfig).map(([key, stat]) => (
          config.stats[key as keyof OverlayConfig['stats']] && (
            <div key={key} className="flex items-center space-x-2">
              {stat.icon}
              <span className="text-white text-lg font-bold">
                {key === 'kdRatio' ? stats[key]?.toFixed(2) : stats[key]}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default function Overlay() {
  const [stats, setStats] = useState<Record<string, number>>({
    ledx: 0,
    gpu: 0,
    bitcoin: 0,
    redKeycard: 0,
    blueKeycard: 0,
    labsKeycard: 0,
    pmcKills: 0,
    totalDeaths: 0,
    totalRaids: 0,
    survivedRaids: 0,
    kdRatio: 0
  });

  const [config, setConfig] = useState<OverlayConfig>({
    stats: {
      pmcKills: true,
      totalDeaths: true,
      totalRaids: true,
      survivedRaids: true,
      kdRatio: true
    },
    items: {
      ledx: true,
      gpu: true,
      bitcoin: true,
      redKeycard: true,
      blueKeycard: true,
      labsKeycard: true
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        const mergedStats = {
          ...data,
          ...(data.playerStats || {})
        };
        delete mergedStats.playerStats;
        setStats(mergedStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        if (!response.ok) throw new Error('Failed to fetch config');
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };

    fetchStats();
    fetchConfig();
    const statsInterval = setInterval(fetchStats, 5000);
    const configInterval = setInterval(fetchConfig, 1000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(configInterval);
    };
  }, []);

  return (
    <>
      <FIRItemsOverlay stats={stats} config={config} />
      <PlayerStatsOverlay stats={stats} config={config} />
    </>
  );
} 