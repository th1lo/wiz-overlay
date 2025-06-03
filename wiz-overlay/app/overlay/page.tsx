'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';


interface Stats {
  gpu: number;
  tetriz: number;
  bitcoin: number;
  ledx: number;
  redKeycard: number;
  blueKeycard: number;
  labsKeycard: number;
  pmcKills: number;
  totalKills: number;
}

export default function Overlay() {
  const [stats, setStats] = useState<Stats>({
    gpu: 0,
    tetriz: 0,
    bitcoin: 0,
    ledx: 0,
    redKeycard: 0,
    blueKeycard: 0,
    labsKeycard: 0,
    pmcKills: 0,
    totalKills: 0,
  });

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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black p-4">
      <div className="flex justify-around">
        <Card className="bg-gray-800 text-white">
          <CardContent className="flex items-center space-x-2">
            <img src="/icons/gpu.svg" alt="GPU" className="h-8 w-8" />
            <span>{stats.gpu}</span>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardContent className="flex items-center space-x-2">
            <img src="/icons/tetriz.svg" alt="Tetriz" className="h-8 w-8" />
            <span>{stats.tetriz}</span>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardContent className="flex items-center space-x-2">
            <img src="/icons/bitcoin.svg" alt="Bitcoin" className="h-8 w-8" />
            <span>{stats.bitcoin}</span>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardContent className="flex items-center space-x-2">
            <img src="/icons/ledx.svg" alt="LEDX" className="h-8 w-8" />
            <span>{stats.ledx}</span>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardContent className="flex items-center space-x-2">
            <img src="/icons/red-keycard.svg" alt="Red Keycard" className="h-8 w-8" />
            <span>{stats.redKeycard}</span>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardContent className="flex items-center space-x-2">
            <img src="/icons/blue-keycard.svg" alt="Blue Keycard" className="h-8 w-8" />
            <span>{stats.blueKeycard}</span>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardContent className="flex items-center space-x-2">
            <img src="/icons/labs-keycard.svg" alt="Labs Keycard" className="h-8 w-8" />
            <span>{stats.labsKeycard}</span>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardContent className="flex items-center space-x-2">
            <img src="/icons/pmc-kills.svg" alt="PMC Kills" className="h-8 w-8" />
            <span>{stats.pmcKills}</span>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardContent className="flex items-center space-x-2">
            <img src="/icons/total-kills.svg" alt="Total Kills" className="h-8 w-8" />
            <span>{stats.totalKills}</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 