import { FIRItemsOverlay } from './FIRItemsOverlay';
import { PlayerStatsOverlay } from './PlayerStatsOverlay';
import type { OverlayConfig } from './types';

interface OverlayPreviewProps {
  stats: Record<string, number>;
  config: OverlayConfig;
  scale: number;
  showCard?: boolean;
}

export function OverlayPreview({ stats, config, scale, showCard = true }: OverlayPreviewProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-zinc-950/80 border border-zinc-800 rounded-xl shadow-lg mx-auto my-8 p-8" style={{ width: 800, height: 220 }}>
      <div className="flex flex-col items-center justify-center w-full h-full gap-6">
        <FIRItemsOverlay stats={stats} config={config} card={showCard} scale={scale} />
        <PlayerStatsOverlay stats={stats} config={config} card={showCard} scale={scale} />
      </div>
    </div>
  );
} 