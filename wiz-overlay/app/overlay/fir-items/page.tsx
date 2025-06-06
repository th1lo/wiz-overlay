'use client';

import { useEffect, useState } from 'react';

interface OverlayConfig {
  items: {
    ledx: boolean;
    gpu: boolean;
    bitcoin: boolean;
    redKeycard: boolean;
    blueKeycard: boolean;
    labsKeycard: boolean;
  };
}

const itemConfig = {
  ledx: { label: 'LEDX', image: '/ledx.png' },
  gpu: { label: 'GPU', image: '/gpu.png' },
  bitcoin: { label: 'Bitcoin', image: '/bitcoin.png' },
  redKeycard: { label: 'Red Keycard', image: '/red_keycard.png' },
  blueKeycard: { label: 'Blue Keycard', image: '/blue_keycard.png' },
  labsKeycard: { label: 'Labs Keycard', image: '/yellow_keycard.png' }
};

export default function FIRItemsOverlay() {
  const [stats, setStats] = useState<Record<string, number>>({
    ledx: 0,
    gpu: 0,
    bitcoin: 0,
    redKeycard: 0,
    blueKeycard: 0,
    labsKeycard: 0
  });

  const [config, setConfig] = useState<OverlayConfig>({
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
        setStats(data);
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
  );
} 