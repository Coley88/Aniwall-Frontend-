import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Trash2, Download, AlertTriangle } from 'lucide-react';

import WallpaperModal from '../components/WallpaperModal';
import { fetchFavorites, removeFavorite } from '../api';
import type { FavoriteWallpaper, Wallpaper } from '../types/wallpaper';

function favToWallpaper(f: FavoriteWallpaper): Wallpaper {
  const [w, h] = f.resolution?.split('x').map(Number) ?? [1920, 1080];
  return {
    id: f.id,
    url: `https://wallhaven.cc/w/${f.id}`,
    short_url: `https://whvn.cc/${f.id}`,
    views: f.views,
    favorites: f.favorites,
    source: '',
    purity: 'sfw',
    category: 'anime',
    dimension_x: w || 1920,
    dimension_y: h || 1080,
    resolution: f.resolution,
    ratio: f.ratio,
    file_size: 0,
    file_type: f.file_type,
    created_at: f.created_at,
    colors: f.colors,
    path: f.path,
    thumbs: { large: f.thumb, original: f.thumb, small: f.thumb },
  };
}

export default function Favorites() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Wallpaper | null>(null);

  const { data: favorites = [], isLoading, isError } = useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
  });

  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['favorites'] });
      qc.invalidateQueries({ queryKey: ['favorite-ids'] });
      if (selected && favorites.find(f => f.id === selected.id)) {
        setSelected(null);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <AlertTriangle style={{ color: 'var(--accent-pink)' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Failed to load favorites.</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.3)' }}
          >
            <Heart size={17} style={{ color: '#ec4899' }} fill="#ec4899" />
          </div>
          <h1 className="text-[28px] font-bold" style={{ color: 'var(--text-primary)' }}>
            Favorites
          </h1>
        </div>
        <p className="text-[14px] ml-12" style={{ color: 'var(--text-muted)' }}>
          {favorites.length} saved wallpaper{favorites.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Empty state */}
      {favorites.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-32 gap-5"
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.15)' }}
          >
            <Heart size={32} style={{ color: 'rgba(236,72,153,0.4)' }} />
          </div>
          <div className="text-center">
            <p className="text-[17px] font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              No favorites yet
            </p>
            <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>
              Browse wallpapers and click the heart to save them here
            </p>
          </div>
        </motion.div>
      )}

      {/* Grid */}
      {favorites.length > 0 && (
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

          {favorites.map((fav, i) => {
            const w = favToWallpaper(fav);
            const aspectRatio = w.dimension_y / w.dimension_x;

            return (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group relative cursor-pointer rounded-xl overflow-hidden break-inside-avoid mb-3"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(236,72,153,0.4)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
                onClick={() => setSelected(w)}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ paddingBottom: `${Math.min(Math.max(aspectRatio, 0.4), 2) * 100}%` }}
                >
                  <img
                    src={fav.thumb}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Actions overlay */}
                  <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-250 -translate-y-1 group-hover:translate-y-0">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        const a = document.createElement('a');
                        a.href = fav.path;
                        a.download = `aniwalls-${fav.id}.jpg`;
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <Download size={12} />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        removeMutation.mutate(fav.id);
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:brightness-110"
                      style={{ background: 'rgba(236,72,153,0.7)', backdropFilter: 'blur(8px)', color: 'white' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Resolution badge */}
                  <div className="absolute bottom-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', color: 'rgba(255,255,255,0.8)' }}
                    >
                      {fav.resolution}
                    </span>
                  </div>

                  {/* Color bar */}
                  {fav.colors.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] flex opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {fav.colors.slice(0, 8).map((c, ci) => (
                        <div key={ci} className="flex-1" style={{ background: c }} />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <WallpaperModal
        wallpaper={selected}
        isFavorited={selected ? favorites.some(f => f.id === selected.id) : false}
        onClose={() => setSelected(null)}
        onFavorite={() => {}}
        onUnfavorite={id => removeMutation.mutate(id)}
      />
    </div>
  );
}
