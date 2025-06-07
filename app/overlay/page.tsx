'use client';

import { useEffect, useState } from 'react';
import { FIRItemsOverlay } from '@/components/FIRItemsOverlay';
import { PlayerStatsOverlay } from '@/components/PlayerStatsOverlay';

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
    yellowKeycard: boolean;
  };
  showCards: boolean;
}

export default function Overlay() {
  const [stats, setStats] = useState<Record<string, number>>({
    ledx: 0,
    gpu: 0,
    bitcoin: 0,
    redKeycard: 0,
    blueKeycard: 0,
    yellowKeycard: 0,
    pmcKills: 0,
    totalDeaths: 0,
    totalRaids: 0,
    survivedRaids: 0,
    kdRatio: 0
  });

  const [config, setConfig] = useState<OverlayConfig | null>(null);

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

  if (!config) return null;

  return (
    <>
      <FIRItemsOverlay stats={stats} config={config} card={config.showCards !== false} />
      <PlayerStatsOverlay stats={stats} config={config} card={config.showCards !== false} />
    </>
  );
} 