'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Plus, Minus, InfoIcon, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { statConfig, itemConfig } from '@/components/overlayConfig';
import type { OverlayConfig as OverlayConfigType } from '@/components/types';
import { FIRItemsOverlay } from '@/components/FIRItemsOverlay';
import { PlayerStatsOverlay } from '@/components/PlayerStatsOverlay';
import { useSocket } from '@/lib/hooks/useSocket';

interface OverlayConfigProps {
  userId: string;
}

export function OverlayConfig({ userId }: OverlayConfigProps) {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [config, setConfig] = useState<OverlayConfigType>({
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
      yellowKeycard: true
    },
    showCards: true
  });
  const [syncing, setSyncing] = useState(false);
  const [scale, setScale] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const { emitUpdate } = useSocket();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/data?userId=${userId}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    const fetchConfig = async () => {
      try {
        const response = await fetch(`/api/config?userId=${userId}`);
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };

    fetchStats();
    fetchConfig();
  }, [userId]);

  const saveConfig = async (newConfig: OverlayConfigType) => {
    try {
      await fetch(`/api/config?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      });
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  const toggleStat = (key: keyof OverlayConfigType['stats']) => {
    const newConfig = {
      ...config,
      stats: {
        ...config.stats,
        [key]: !config.stats[key]
      }
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const toggleItem = (key: keyof OverlayConfigType['items']) => {
    const newConfig = {
      ...config,
      items: {
        ...config.items,
        [key]: !config.items[key]
      }
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleIncrementItem = async (itemKey: string) => {
    try {
      const response = await fetch(`/api/data?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: itemKey,
          value: (stats[itemKey] || 0) + 1
        }),
      });
      const data = await response.json();
      if (data.success) {
        const newStats = { ...stats, [itemKey]: data.value };
        setStats(newStats);
        emitUpdate('fir-items', newStats);
      }
    } catch (error) {
      console.error(`Error incrementing ${itemKey}:`, error);
    }
  };

  const handleDecrementItem = async (itemKey: string) => {
    try {
      const response = await fetch(`/api/data?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: itemKey,
          value: Math.max(0, (stats[itemKey] || 0) - 1)
        }),
      });
      const data = await response.json();
      if (data.success) {
        const newStats = { ...stats, [itemKey]: data.value };
        setStats(newStats);
        emitUpdate('fir-items', newStats);
      }
    } catch (error) {
      console.error(`Error decrementing ${itemKey}:`, error);
    }
  };

  const handleItemCountChange = async (itemKey: string, value: string) => {
    const numValue = parseInt(value) || 0;
    try {
      const response = await fetch(`/api/data?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: itemKey,
          value: Math.max(0, numValue)
        }),
      });
      const data = await response.json();
      if (data.success) {
        const newStats = { ...stats, [itemKey]: data.value };
        setStats(newStats);
        emitUpdate('fir-items', newStats);
      }
    } catch (error) {
      console.error(`Error updating ${itemKey}:`, error);
    }
  };

  const syncPlayerStats = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`/api/tarkov-profile?userId=${userId}`);
      const data = await res.json();
      const items = data.pmcStats?.eft?.overAllCounters?.Items || [];
      const getValue = (keyArr: string[]) => {
        const found = items.find((i: unknown) => {
          if (typeof i === 'object' && i !== null && 'Key' in i && 'Value' in i) {
            return JSON.stringify((i as { Key: unknown }).Key) === JSON.stringify(keyArr);
          }
          return false;
        });
        return found && typeof (found as { Value?: number }).Value === 'number' ? (found as { Value: number }).Value : 0;
      };
      const pmcKills = getValue(["Kills"]);
      const totalDeaths = getValue(["Deaths"]);
      const totalRaids = getValue(["Sessions", "Pmc"]);
      const survivedRaids = getValue(["ExitStatus", "Survived", "Pmc"]);
      const kdRatio = totalDeaths > 0 ? pmcKills / totalDeaths : 0;
      const updates = { pmcKills, totalDeaths, totalRaids, survivedRaids, kdRatio };
      await Promise.all(Object.entries(updates).map(([key, value]) =>
        fetch(`/api/data?userId=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        })
      ));
      const newStats = { ...stats, ...updates };
      setStats(newStats);
      emitUpdate('player-stats', updates);
    } catch (error) {
      console.error('Failed to sync player stats:', error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative">
      {/* Background Video and Gradient - only show if preview is enabled */}
      {showPreview && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <video
            src="/demo.mp4"
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/100 via-zinc-900/90 to-zinc-900/50" />
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Overlay Configuration</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label>Preview</Label>
              <Switch
                checked={showPreview}
                onCheckedChange={setShowPreview}
              />
            </div>
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-zinc-800/50 hover:bg-zinc-700/50 border-zinc-700 hover:border-zinc-600 text-zinc-200 hover:text-white transition-colors">
                  <span>Settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
                <DialogHeader>
                  <DialogTitle>Overlay Settings</DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Customize your overlay appearance
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="scale" className="text-zinc-200">Scale</Label>
                      <span className="text-sm text-zinc-400">{scale.toFixed(2)}x</span>
                    </div>
                    <Slider
                      min={0.5}
                      max={2}
                      step={0.01}
                      value={[scale]}
                      onValueChange={([val]: number[]) => setScale(val)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-zinc-200">Show Card</Label>
                      <Switch
                        checked={config.showCards}
                        onCheckedChange={(checked) => {
                          setConfig(prev => ({
                            ...prev,
                            showCards: checked
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={() => setShowSettings(false)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-zinc-800/50 hover:bg-zinc-700/50 border-zinc-700 hover:border-zinc-600 text-zinc-200 hover:text-white transition-colors"
                >
                  <InfoIcon className="h-4 w-4 mr-2" />
                  <span>OBS Instructions</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-700 [&>button]:text-zinc-400 [&>button]:hover:text-zinc-200 [&>button]:hover:bg-zinc-800/50">
                <DialogHeader>
                  <DialogTitle className="text-white">OBS Setup Instructions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-white">
                  <p>
                    <strong>To add the overlay to OBS:</strong>
                    <ol className="list-decimal list-inside mt-2 mb-4 space-y-1">
                      <li>Open OBS Studio.</li>
                      <li>In the <b>Sources</b> panel, click the <b>+</b> and select <b>Browser</b>.</li>
                      <li>Name your source (e.g., <b>Tarkov Overlay</b>) and click <b>OK</b>.</li>
                      <li>Paste one of the following URLs in the <b>URL</b> field:</li>
                    </ol>
                  </p>
                  <div className="space-y-2">
                    <p>Production (recommended):</p>
                    <code className="block bg-zinc-800 p-2 rounded">https://obs-overlays.vercel.app/overlay/{userId}/player-stats</code>
                    <code className="block bg-zinc-800 p-2 rounded">https://obs-overlays.vercel.app/overlay/{userId}/fir-items</code>
                    <code className="block bg-zinc-800 p-2 rounded">https://obs-overlays.vercel.app/overlay/{userId}</code>
                    <p>Development (local only):</p>
                    <code className="block bg-zinc-800 p-2 rounded">http://localhost:3000/overlay/{userId}/player-stats</code>
                    <code className="block bg-zinc-800 p-2 rounded">http://localhost:3000/overlay/{userId}/fir-items</code>
                    <code className="block bg-zinc-800 p-2 rounded">http://localhost:3000/overlay/{userId}</code>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Set the width and height in OBS to match your stream layout. You can position and resize each overlay as needed in your scene.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stats Configuration */}
            <Card className="bg-zinc-800/90 backdrop-blur-sm border-zinc-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-white flex items-center justify-between">
                  <span>Player Stats</span>
                  <Button
                    onClick={syncPlayerStats}
                    disabled={syncing}
                    size="icon"
                    variant="outline"
                    className="ml-4 bg-zinc-700 hover:bg-blue-500/30 text-blue-400 hover:text-white border-zinc-600 hover:border-blue-500/50"
                    title="Sync Player Stats"
                  >
                    <RefreshCw className={syncing ? 'animate-spin' : ''} />
                  </Button>
                </h2>
                <div className="space-y-4">
                  {Object.entries(statConfig).map(([key, stat]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {stat.icon}
                        <span className="text-white">{stat.label}</span>
                      </div>
                      <Switch
                        checked={config.stats[key as keyof OverlayConfigType['stats']]}
                        onCheckedChange={() => toggleStat(key as keyof OverlayConfigType['stats'])}
                        className={
                          (config.stats[key as keyof OverlayConfigType['stats']]
                            ? 'bg-green-500 border-green-600'
                            : 'bg-red-500 border-red-600') +
                          ' disabled:bg-zinc-700 disabled:border-zinc-600 disabled:opacity-60 disabled:cursor-not-allowed'
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Items Configuration */}
            <Card className="bg-zinc-800/90 backdrop-blur-sm border-zinc-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">FIR Items</h2>
                <div className="space-y-4">
                  {Object.entries(itemConfig).map(([key, item]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Image src={item.image} alt={item.label} width={24} height={24} className="h-6 w-6" />
                        <span className="text-white">{item.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDecrementItem(key)}
                          className="h-8 w-8 bg-zinc-700 border-zinc-600 text-white transition-all duration-150 hover:bg-red-600/50 hover:text-white hover:border-red-400/50 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-red-400"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={stats[key] ?? 0}
                          onChange={(e) => handleItemCountChange(key, e.target.value)}
                          className="w-16 h-8 text-center bg-zinc-700 text-white border-zinc-600 focus:border-zinc-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleIncrementItem(key)}
                          className="h-8 w-8 bg-zinc-700 border-zinc-600 text-white transition-all duration-150 hover:bg-green-600/50 hover:text-white hover:border-green-400/50 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-green-400"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={config.items[key as keyof OverlayConfigType['items']]}
                          onCheckedChange={() => toggleItem(key as keyof OverlayConfigType['items'])}
                          className={
                            (config.items[key as keyof OverlayConfigType['items']]
                              ? 'bg-green-500 border-green-600'
                              : 'bg-red-500 border-red-600') +
                            ' disabled:bg-zinc-700 disabled:border-zinc-600 disabled:opacity-60 disabled:cursor-not-allowed'
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Preview - Positioned at bottom corners */}
        {showPreview && (
          <>
            <div className="fixed bottom-0 left-0 p-8 pointer-events-none z-50">
              <FIRItemsOverlay
                stats={stats}
                config={config}
                scale={scale}
                card={config.showCards}
              />
            </div>
            <div className="fixed bottom-0 right-0 p-8 pointer-events-none z-50">
              <PlayerStatsOverlay
                stats={stats}
                config={config}
                scale={scale}
                card={config.showCards}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
} 