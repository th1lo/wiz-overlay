'use client';

import { useEffect, useState, useRef } from 'react';
import { statConfig } from '@/components/overlayConfig';
import type { OverlayConfig } from './types';
import { useSocket } from '@/lib/hooks/useSocket';
import { Skull, Cross, Map, CheckCircle, Target } from 'lucide-react';

interface PlayerStatsOverlayProps {
  stats?: Record<string, number>;
  config?: OverlayConfig;
  card?: boolean;
  scale?: number;
}

const iconMap = {
  Skull: Skull,
  Cross: Cross,
  Map: Map,
  CheckCircle: CheckCircle,
  Target: Target
};

export function PlayerStatsOverlay({ stats: propStats, config: propConfig, card, scale = 1 }: PlayerStatsOverlayProps = {}) {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [config, setConfig] = useState<OverlayConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChangedStat, setLastChangedStat] = useState<string | null>(null);
  const prevStats = useRef<Record<string, number> | null>(null);
  const { onUpdate } = useSocket();

  useEffect(() => {
    if (propStats && propConfig) {
      setStats(propStats);
      setConfig(propConfig);
      setIsLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      try {
        const [statsResponse, configResponse] = await Promise.all([
          fetch('/api/data'),
          fetch('/api/config')
        ]);

        if (!statsResponse.ok || !configResponse.ok) {
          throw new Error('Failed to fetch initial data');
        }

        const [statsData, configData] = await Promise.all([
          statsResponse.json(),
          configResponse.json()
        ]);

        setStats(statsData);
        setConfig(configData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();

    // Set up WebSocket listener for real-time updates
    onUpdate((data) => {
      if (data.type === 'player-stats') {
        setStats(prev => ({ ...prev, ...data.data }));
      }
    });
  }, [propStats, propConfig, onUpdate]);

  useEffect(() => {
    if (!stats || !prevStats.current) {
      prevStats.current = stats;
      return;
    }

    // Find changed stats
    const changedStat = Object.entries(stats).find(
      ([key, value]) => prevStats.current?.[key] !== value
    );

    if (changedStat) {
      setLastChangedStat(changedStat[0]);
      const timer = setTimeout(() => setLastChangedStat(null), 2000);
      return () => clearTimeout(timer);
    }

    prevStats.current = stats;
  }, [stats]);

  if (isLoading || !stats || !config) return null;

  const enabledStats = Object.entries(config.stats)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key);

  if (enabledStats.length === 0) return null;

  return (
    <div
      className={`fixed top-4 right-4 flex flex-col gap-2 ${card ? 'bg-zinc-800/90 backdrop-blur-sm p-4 rounded-lg border border-zinc-700' : ''}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'top right' }}
    >
      {enabledStats.map((key) => {
        const stat = statConfig[key];
        if (!stat) return null;

        const value = stats[key] || 0;
        const isHighlighted = lastChangedStat === key;
        const Icon = iconMap[stat.icon as keyof typeof iconMap];

        return (
          <div
            key={key}
            className={`flex items-center gap-2 transition-all duration-300 ${
              isHighlighted ? 'scale-110' : ''
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-zinc-700 rounded">
              <Icon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">{stat.label}</span>
              <span className="text-xs text-zinc-400">{value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
} 