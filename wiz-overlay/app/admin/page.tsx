'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Stats {
  ledx: number;
  gpu: number;
  bitcoin: number;
  redKeycard: number;
  blueKeycard: number;
  labsKeycard: number;
  pmcKills: number;
  totalDeaths: number;
}

const lootItems = [
  { key: 'ledx', label: 'LEDX', icon: '/ledx.png' },
  { key: 'gpu', label: 'GPU', icon: '/gpu.png' },
  { key: 'bitcoin', label: 'Bitcoin', icon: '/bitcoin.png' },
  { key: 'redKeycard', label: 'Red Keycard', icon: '/red_keycard.png' },
  { key: 'blueKeycard', label: 'Blue Keycard', icon: '/blue_keycard.png' },
  { key: 'labsKeycard', label: 'Labs Keycard', icon: '/yellow_keycard.png' },
];

const statItems = [
  { key: 'pmcKills', label: 'PMC Kills', icon: '/pmc_kills.svg', color: 'text-white' },
  { key: 'totalDeaths', label: 'Total Deaths', icon: '/deaths.svg', color: 'text-white' },
];

export default function Admin() {
  const [stats, setStats] = useState<Stats>({
    ledx: 0,
    gpu: 0,
    bitcoin: 0,
    redKeycard: 0,
    blueKeycard: 0,
    labsKeycard: 0,
    pmcKills: 0,
    totalDeaths: 0,
  });

  const [inputValues, setInputValues] = useState(() => ({
    ...stats
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setInputValues(stats);
  }, [stats]);

  const updateStat = async (key: keyof Stats, action: 'inc' | 'dec') => {
    try {
      const response = await fetch(`/api/${action}/${key}`, { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setStats((prev) => ({ ...prev, [key]: data.value }));
      }
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
    }
  };

  const handleInputChange = (key: keyof Stats, value: string) => {
    if (/^\d*$/.test(value)) {
      setInputValues((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleInputBlur = (key: keyof Stats) => {
    const val = parseInt(inputValues[key] as any, 10);
    if (!isNaN(val) && val !== stats[key]) {
      // Simulate direct set by incrementing or decrementing until match
      const diff = val - stats[key];
      const action = diff > 0 ? 'inc' : 'dec';
      const times = Math.abs(diff);
      for (let i = 0; i < times; i++) {
        updateStat(key, action as 'inc' | 'dec');
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, key: keyof Stats) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="p-8 min-h-screen bg-zinc-800">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">Admin Panel</h1>
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loot Controls */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-white">Loot Items</h2>
          <div className="space-y-3">
            {lootItems.map(item => (
              <div key={item.key} className="flex items-center justify-between bg-zinc-700 rounded-xl px-8 py-6 shadow-md">
                <div className="flex items-center gap-4 min-w-0">
                  <img src={item.icon} alt={item.label} className="h-12 w-12 flex-shrink-0" />
                  <span className="font-semibold text-xl text-white whitespace-nowrap">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 ml-10">
                  <Button size="icon" variant="outline" aria-label={`Decrement ${item.label}`} onClick={() => updateStat(item.key as keyof Stats, 'dec')}>
                    <Minus className="w-5 h-5" />
                  </Button>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-16 text-center text-2xl text-white font-bold bg-transparent border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    value={inputValues[item.key as keyof Stats] ?? ''}
                    onChange={e => handleInputChange(item.key as keyof Stats, e.target.value)}
                    onBlur={() => handleInputBlur(item.key as keyof Stats)}
                    onKeyDown={e => handleInputKeyDown(e, item.key as keyof Stats)}
                  />
                  <Button size="icon" variant="outline" aria-label={`Increment ${item.label}`} onClick={() => updateStat(item.key as keyof Stats, 'inc')}>
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Stat Controls */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-white">Stats</h2>
          <div className="space-y-3">
            {statItems.map(item => (
              <div key={item.key} className="flex items-center justify-between bg-zinc-700 rounded-xl px-8 py-6 shadow-md">
                <div className="flex items-center gap-4 min-w-0">
                  <img src={item.icon} alt={item.label} className="h-12 w-12 flex-shrink-0" />
                  <span className="font-semibold text-xl text-white whitespace-nowrap">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 ml-10">
                  <Button size="icon" variant="outline" aria-label={`Decrement ${item.label}`} onClick={() => updateStat(item.key as keyof Stats, 'dec')}>
                    <Minus className="w-5 h-5" />
                  </Button>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-16 text-center text-2xl text-white font-bold bg-transparent border border-zinc-600 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    value={inputValues[item.key as keyof Stats] ?? ''}
                    onChange={e => handleInputChange(item.key as keyof Stats, e.target.value)}
                    onBlur={() => handleInputBlur(item.key as keyof Stats)}
                    onKeyDown={e => handleInputKeyDown(e, item.key as keyof Stats)}
                  />
                  <Button size="icon" variant="outline" aria-label={`Increment ${item.label}`} onClick={() => updateStat(item.key as keyof Stats, 'inc')}>
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Overlay Preview */}
      <div className="fixed bottom-12 left-0 w-full flex justify-center pointer-events-none select-none">
        <div className="flex items-end w-full max-w-5xl justify-between">
          {/* Centered Loot Bar */}
          <div className="flex-1 flex justify-center">
            <div className="flex bg-zinc-900/90 rounded-xl px-8 py-6 space-x-8 shadow-lg">
              {lootItems.map(item => (
                <div key={item.key} className="flex items-center space-x-2">
                  <img src={item.icon} alt={item.label} className="h-8 w-8" />
                  <span className="text-white text-lg font-medium">{stats[item.key as keyof Stats]}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right Stats Box */}
          <div className="ml-8 flex flex-col items-end">
            <div className="flex bg-zinc-900/90 rounded-xl px-8 py-6 space-x-8 shadow-lg">
              {statItems.map(item => (
                <div key={item.key} className="flex items-center space-x-2">
                  <img src={item.icon} alt={item.label} className="h-7 w-7" />
                  <span className={`text-lg font-bold ${item.color}`}>{stats[item.key as keyof Stats]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 