import { motion } from 'framer-motion';
import WallpaperCard from './WallpaperCard';
import type { Wallpaper } from '../types/wallpaper';

interface Props {
  wallpapers: Wallpaper[];
  favoriteIds: Set<string>;
  onFavorite: (w: Wallpaper) => void;
  onUnfavorite: (id: string) => void;
  onOpen: (w: Wallpaper) => void;
}

export default function WallpaperGrid({
  wallpapers,
  favoriteIds,
  onFavorite,
  onUnfavorite,
  onOpen,
}: Props) {
  return (
    <div
      style={{
        columns: 'var(--grid-cols, 4) 260px',
        columnGap: '12px',
      }}
    >
      <style>{`
        @media (max-width: 480px)  { :root { --grid-cols: 1; } }
        @media (min-width: 481px)  { :root { --grid-cols: 2; } }
        @media (min-width: 768px)  { :root { --grid-cols: 3; } }
        @media (min-width: 1100px) { :root { --grid-cols: 4; } }
        @media (min-width: 1440px) { :root { --grid-cols: 5; } }
      `}</style>

      {wallpapers.map((w, i) => (
        <WallpaperCard
          key={w.id}
          wallpaper={w}
          isFavorited={favoriteIds.has(w.id)}
          onFavorite={onFavorite}
          onUnfavorite={onUnfavorite}
          onClick={onOpen}
          index={i}
        />
      ))}
    </div>
  );
}

export function GridSkeleton() {
  const heights = [220, 310, 260, 180, 290, 240, 300, 210, 270, 200, 330, 250];

  return (
    <div
      style={{
        columns: 'var(--grid-cols, 4) 260px',
        columnGap: '12px',
      }}
    >
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.04 }}
          className="rounded-xl overflow-hidden shimmer-bg mb-3"
          style={{ height: h, background: 'var(--bg-card)' }}
        />
      ))}
    </div>
  );
}
