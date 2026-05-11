import { motion } from 'framer-motion';
import type { SortOption } from '../types/wallpaper';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'toplist', label: 'Trending' },
  { value: 'date_added', label: 'New' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'favorites', label: 'Most Loved' },
  { value: 'random', label: 'Random' },
];

const RATIO_OPTIONS = [
  { value: '', label: 'All Ratios' },
  { value: '16x9', label: '16:9' },
  { value: '16x10', label: '16:10' },
  { value: '21x9', label: '21:9' },
  { value: '9x16', label: '9:16 Portrait' },
  { value: '1x1', label: '1:1 Square' },
];

interface Props {
  sorting: SortOption;
  ratio: string;
  onSortChange: (s: SortOption) => void;
  onRatioChange: (r: string) => void;
}

export default function SortFilter({ sorting, ratio, onSortChange, onRatioChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* Sort pills */}
      <div className="flex flex-wrap gap-2">
        {SORT_OPTIONS.map(opt => (
          <Pill
            key={opt.value}
            active={sorting === opt.value}
            onClick={() => onSortChange(opt.value)}
          >
            {opt.label}
          </Pill>
        ))}
      </div>

      {/* Ratio pills */}
      <div className="flex flex-wrap gap-2">
        {RATIO_OPTIONS.map(opt => (
          <Pill
            key={opt.value}
            active={ratio === opt.value}
            onClick={() => onRatioChange(opt.value)}
            small
          >
            {opt.label}
          </Pill>
        ))}
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
  small,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative rounded-full font-medium transition-all duration-200 ${
        small ? 'px-3 py-1 text-[11px]' : 'px-4 py-1.5 text-[13px]'
      }`}
      style={{
        background: active ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
        border: active ? '1px solid rgba(139,92,246,0.5)' : '1px solid var(--border)',
        color: active ? '#a78bfa' : 'var(--text-secondary)',
        boxShadow: active ? '0 0 12px rgba(139,92,246,0.15)' : 'none',
      }}
    >
      {children}
    </motion.button>
  );
}
