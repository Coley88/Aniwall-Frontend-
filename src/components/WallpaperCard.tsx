import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Download, Eye, Maximize2 } from 'lucide-react';
import type { Wallpaper } from '../types/wallpaper';

interface Props {
  wallpaper: Wallpaper;
  isFavorited: boolean;
  onFavorite: (w: Wallpaper) => void;
  onUnfavorite: (id: string) => void;
  onClick: (w: Wallpaper) => void;
  index?: number;
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function WallpaperCard({
  wallpaper,
  isFavorited,
  onFavorite,
  onUnfavorite,
  onClick,
  index = 0,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const aspectRatio = wallpaper.dimension_y / wallpaper.dimension_x;

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    isFavorited ? onUnfavorite(wallpaper.id) : onFavorite(wallpaper);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const ext = wallpaper.file_type.split('/')[1] || 'jpg';
    const a = document.createElement('a');
    a.href = wallpaper.path;
    a.download = `aniwalls-${wallpaper.id}.${ext}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -3 }}
      className="group relative cursor-pointer rounded-xl overflow-hidden break-inside-avoid"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        marginBottom: '12px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.4)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.2)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
      onClick={() => onClick(wallpaper)}
    >
      {/* Aspect-ratio container */}
      <div
        className="relative overflow-hidden"
        style={{ paddingBottom: `${aspectRatio * 100}%` }}
      >
        {/* Skeleton */}
        {!loaded && (
          <div className="absolute inset-0 shimmer-bg" style={{ background: 'var(--bg-secondary)' }} />
        )}

        {/* Image */}
        <img
          src={wallpaper.thumbs.large}
          alt=""
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top actions */}
        <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-250 -translate-y-1 group-hover:translate-y-0">
          <ActionBtn
            onClick={handleFav}
            active={isFavorited}
            activeStyle={{ background: '#ec4899', boxShadow: '0 0 12px rgba(236,72,153,0.5)' }}
          >
            <Heart size={13} fill={isFavorited ? 'white' : 'none'} />
          </ActionBtn>
          <ActionBtn onClick={handleDownload}>
            <Download size={13} />
          </ActionBtn>
          <ActionBtn onClick={e => { e.stopPropagation(); onClick(wallpaper); }}>
            <Maximize2 size={12} />
          </ActionBtn>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-250 translate-y-1 group-hover:translate-y-0">
          <div className="flex items-end justify-between gap-2">
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(8px)',
                color: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {wallpaper.resolution}
            </span>
            <div
              className="flex items-center gap-2.5 text-[11px]"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              <span className="flex items-center gap-1">
                <Eye size={10} />
                {fmt(wallpaper.views)}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={10} />
                {fmt(wallpaper.favorites)}
              </span>
            </div>
          </div>
        </div>

        {/* Color bar */}
        {wallpaper.colors.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] flex opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {wallpaper.colors.slice(0, 8).map((c, i) => (
              <div key={i} className="flex-1" style={{ background: c }} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ActionBtn({
  onClick,
  active,
  activeStyle,
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  active?: boolean;
  activeStyle?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
      style={
        active
          ? { color: 'white', ...activeStyle }
          : {
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              color: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.1)',
            }
      }
      onMouseEnter={e => {
        if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)';
      }}
      onMouseLeave={e => {
        if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.6)';
      }}
    >
      {children}
    </button>
  );
}
