'use client';

import { useEffect, useState, useRef } from 'react';
import { statConfig } from '@/components/overlayConfig';

interface OverlayConfig {
  stats: {
    pmcKills: boolean;
    totalDeaths: boolean;
    totalRaids: boolean;
    survivedRaids: boolean;
    kdRatio: boolean;
  };
}

interface PlayerStatsOverlayProps {
  stats?: Record<string, number>;
  config?: OverlayConfig;
  card?: boolean;
}

export function PlayerStatsOverlay({ stats: propStats, config: propConfig, card }: PlayerStatsOverlayProps = {}) {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [config, setConfig] = useState<OverlayConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChangedStat, setLastChangedStat] = useState<string | null>(null);
  const prevStats = useRef<Record<string, number> | null>(null);

  useEffect(() => {
    if (propStats && propConfig) {
      setStats(propStats);
      setConfig(propConfig);
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
        setIsLoading(false);
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
  }, [propStats, propConfig]);

  // Detect stat changes and animate
  useEffect(() => {
    const displayStats = propStats || stats;
    if (!displayStats) return;
    if (prevStats.current) {
      for (const key of Object.keys(statConfig)) {
        if (displayStats[key] !== prevStats.current[key]) {
          setLastChangedStat(key);
          setTimeout(() => {
            setLastChangedStat(null);
          }, 500);
          break;
        }
      }
    }
    prevStats.current = { ...displayStats };
  }, [propStats, stats]);

  const displayStats = propStats || stats;
  const displayConfig = propConfig || config;
  const showCard = card ?? (displayConfig && (displayConfig as unknown as { showCards?: boolean }).showCards !== false);
  if (isLoading || !displayStats || !displayConfig) return null;

  const content = (
    <div className="flex space-x-8">
      {Object.entries(statConfig).map(([key, stat]) => (
        displayConfig.stats[key as keyof OverlayConfig['stats']] && (
          <div key={key} className="flex items-center space-x-2">
            {stat.icon}
            <span
              className={
                "text-white text-lg font-bold transition-transform duration-200 " +
                (lastChangedStat === key
                  ? 'scale-110 animate-pulse text-yellow-400 animate-slideUp'
                  : '')
              }
            >
              {key === 'kdRatio' ? Number(displayStats[key] ?? 0).toFixed(2) : Number(displayStats[key] ?? 0)}
            </span>
          </div>
        )
      ))}
    </div>
  );

  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none select-none">
      {showCard ? (
        <div className="bg-zinc-900/90 rounded-xl px-8 py-6 shadow-lg min-h-[72px] flex items-center">
          {content}
        </div>
      ) : (
        content
      )}
    </div>
  );
} 