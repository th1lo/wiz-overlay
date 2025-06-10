'use client';

import { useEffect, useState, useRef } from 'react';
import { defaultItemConfig, fetchItemConfig } from '@/components/overlayConfig';
import type { OverlayConfig } from './types';
import { useSocket } from '@/lib/hooks/useSocket';

interface FIRItemsOverlayProps {
  stats?: Record<string, number>;
  config?: OverlayConfig;
  card?: boolean;
  scale?: number;
}

export function FIRItemsOverlay(props?: FIRItemsOverlayProps) {
  const { stats: propStats, config: propConfig, card, scale = 1 } = props || {};
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [config, setConfig] = useState<OverlayConfig | null>(null);
  const [itemConfig, setItemConfig] = useState(defaultItemConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChangedItem, setLastChangedItem] = useState<string | null>(null);
  const prevStats = useRef<Record<string, number> | null>(null);
  const { onUpdate } = useSocket();

  useEffect(() => {
    // Fetch item config
    fetchItemConfig().then(setItemConfig);

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
      if (data.type === 'fir-items') {
        setStats(data.data);
      }
    });
  }, [propStats, propConfig, onUpdate]);

  useEffect(() => {
    if (!stats || !prevStats.current) {
      prevStats.current = stats;
      return;
    }

    // Find changed items
    const changedItem = Object.entries(stats).find(
      ([key, value]) => prevStats.current?.[key] !== value
    );

    if (changedItem) {
      setLastChangedItem(changedItem[0]);
      const timer = setTimeout(() => setLastChangedItem(null), 2000);
      return () => clearTimeout(timer);
    }

    prevStats.current = stats;
  }, [stats]);

  if (isLoading || !stats || !config) return null;

  const enabledItems = Object.entries(config.items)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key);

  if (enabledItems.length === 0) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 flex flex-col gap-2 ${card ? 'bg-zinc-800/90 backdrop-blur-sm p-4 rounded-lg border border-zinc-700' : ''}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'bottom right' }}
    >
      {enabledItems.map((key) => {
        const item = itemConfig[key];
        if (!item) return null;

        const count = stats[key] || 0;
        const isHighlighted = lastChangedItem === key;

        return (
          <div
            key={key}
            className={`flex items-center gap-2 transition-all duration-300 ${
              isHighlighted ? 'scale-110' : ''
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center bg-zinc-700 rounded">
              {item.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">{item.label}</span>
              <span className="text-xs text-zinc-400">{count}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
} 