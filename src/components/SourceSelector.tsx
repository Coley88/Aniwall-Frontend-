import { motion } from 'framer-motion';
import type { WallpaperSource } from '../types/wallpaper';

const SOURCES: { value: WallpaperSource; label: string; sub: string; color: string }[] = [
  { value: 'konachan',  label: 'Konachan',  sub: '~100K classic',  color: '#06b6d4' },
  { value: 'yandere',   label: 'Yande.re',  sub: '~200K HD art',   color: '#ec4899' },
  { value: 'danbooru',  label: 'Danbooru',  sub: '5M+ images',     color: '#f59e0b' },
  { value: 'safebooru', label: 'Safebooru', sub: '4M+ SFW only',   color: '#10b981' },
  { value: 'wallhaven', label: 'Wallhaven', sub: '~160K wallpaper', color: '#8b5cf6' },
];

interface Props {
  value: WallpaperSource;
  onChange: (s: WallpaperSource) => void;
}

export default function SourceSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {SOURCES.map(s => {
        const active = value === s.value;
        return (
          <motion.button
            key={s.value}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(s.value)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-left transition-all duration-200"
            style={{
              background: active ? `${s.color}18` : 'rgba(255,255,255,0.03)',
              border: active ? `1px solid ${s.color}60` : '1px solid var(--border)',
              boxShadow: active ? `0 0 16px ${s.color}20` : 'none',
            }}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0 transition-colors"
              style={{ background: active ? s.color : 'var(--text-muted)' }}
            />
            <div>
              <p className="text-[13px] font-semibold leading-tight"
                style={{ color: active ? s.color : 'var(--text-primary)' }}>
                {s.label}
              </p>
              <p className="text-[11px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                {s.sub}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
