import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Heart, ExternalLink, Eye, Star, FileImage, Info } from 'lucide-react';
import type { Wallpaper } from '../types/wallpaper';

interface Props {
  wallpaper: Wallpaper | null;
  isFavorited: boolean;
  onClose: () => void;
  onFavorite: (w: Wallpaper) => void;
  onUnfavorite: (id: string) => void;
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function fmtBytes(b: number) {
  if (b >= 1_000_000) return `${(b / 1_000_000).toFixed(1)} MB`;
  return `${(b / 1_000).toFixed(0)} KB`;
}

export default function WallpaperModal({
  wallpaper,
  isFavorited,
  onClose,
  onFavorite,
  onUnfavorite,
}: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!wallpaper) return;
    setImgLoaded(false);
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [wallpaper, onClose]);

  const handleDownload = () => {
    if (!wallpaper) return;
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

  const handleFav = () => {
    if (!wallpaper) return;
    isFavorited ? onUnfavorite(wallpaper.id) : onFavorite(wallpaper);
  };

  return (
    <AnimatePresence>
      {wallpaper && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
          style={{ background: 'rgba(4,4,10,0.92)', backdropFilter: 'blur(12px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden w-full max-w-6xl max-h-[90vh]"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(139,92,246,0.2)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(139,92,246,0.1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <X size={15} />
            </button>

            {/* Image */}
            <div
              className="relative flex-1 flex items-center justify-center overflow-hidden"
              style={{ background: '#05050e', minHeight: 300 }}
            >
              {!imgLoaded && (
                <div className="absolute inset-0 shimmer-bg" />
              )}
              <img
                src={wallpaper.path}
                alt=""
                className="w-full h-full object-contain max-h-[90vh]"
                onLoad={() => setImgLoaded(true)}
                style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
              />

              {/* Bottom color bar */}
              {wallpaper.colors.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-[4px] flex">
                  {wallpaper.colors.map((c, i) => (
                    <div key={i} className="flex-1" style={{ background: c }} />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div
              className="w-full md:w-[280px] flex-shrink-0 flex flex-col overflow-y-auto"
              style={{ borderLeft: '1px solid var(--border)' }}
            >
              {/* Header */}
              <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}
                  >
                    Anime
                  </span>
                  <span
                    className="text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(6,182,212,0.12)', color: '#67e8f9' }}
                  >
                    {wallpaper.purity.toUpperCase()}
                  </span>
                </div>
                <p
                  className="text-[12px] mt-2 font-mono"
                  style={{ color: 'var(--text-muted)' }}
                >
                  ID: {wallpaper.id}
                </p>
              </div>

              {/* Stats */}
              <div className="p-5 border-b grid grid-cols-2 gap-3" style={{ borderColor: 'var(--border)' }}>
                <StatItem icon={<Eye size={13} />} label="Views" value={fmt(wallpaper.views)} />
                <StatItem icon={<Heart size={13} />} label="Favorites" value={fmt(wallpaper.favorites)} />
                <StatItem icon={<FileImage size={13} />} label="Size" value={fmtBytes(wallpaper.file_size)} />
                <StatItem icon={<Info size={13} />} label="Type" value={wallpaper.file_type.split('/')[1].toUpperCase()} />
              </div>

              {/* Resolution */}
              <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
                <p className="text-[11px] font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                  Resolution
                </p>
                <p className="text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  {wallpaper.resolution}
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {wallpaper.ratio} ratio
                </p>
              </div>

              {/* Color palette */}
              {wallpaper.colors.length > 0 && (
                <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-[11px] font-medium uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                    Palette
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {wallpaper.colors.map((c, i) => (
                      <div
                        key={i}
                        title={c}
                        className="w-7 h-7 rounded-md cursor-pointer hover:scale-110 transition-transform"
                        style={{
                          background: c,
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="p-5 flex flex-col gap-2.5 mt-auto">
                <button
                  onClick={handleDownload}
                  className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-[14px] text-white transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    boxShadow: '0 4px 20px rgba(139,92,246,0.35)',
                  }}
                >
                  <Download size={15} />
                  Download
                </button>

                <button
                  onClick={handleFav}
                  className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-[13px] transition-all hover:brightness-110 active:scale-[0.98]"
                  style={
                    isFavorited
                      ? {
                          background: 'rgba(236,72,153,0.15)',
                          border: '1px solid rgba(236,72,153,0.4)',
                          color: '#f9a8d4',
                        }
                      : {
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-secondary)',
                        }
                  }
                >
                  <Heart size={14} fill={isFavorited ? 'currentColor' : 'none'} />
                  {isFavorited ? 'Unfavorite' : 'Add to Favorites'}
                </button>

                <a
                  href={wallpaper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 font-medium text-[13px] transition-all hover:brightness-110"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  <ExternalLink size={13} />
                  View on Wallhaven
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-xl p-3"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-1.5 mb-1" style={{ color: 'var(--text-muted)' }}>
        {icon}
        <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  );
}
