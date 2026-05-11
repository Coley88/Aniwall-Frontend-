import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

import SearchBar from '../components/SearchBar';
import SortFilter from '../components/SortFilter';
import SourceSelector from '../components/SourceSelector';
import WallpaperGrid, { GridSkeleton } from '../components/WallpaperGrid';
import WallpaperModal from '../components/WallpaperModal';
import { fetchWallpapers, fetchFavoriteIds, addFavorite, removeFavorite } from '../api';
import type { Wallpaper, SortOption, WallpaperSource } from '../types/wallpaper';

export default function Home() {
  const qc = useQueryClient();

  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [sorting, setSorting] = useState<SortOption>('date_added');
  const [ratio, setRatio] = useState('');
  const [source, setSource] = useState<WallpaperSource>('konachan');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Wallpaper | null>(null);

  const wallpapersQuery = useQuery({
    queryKey: ['wallpapers', query, sorting, ratio, source, page],
    queryFn: () =>
      fetchWallpapers({ q: query, sorting, page, ratios: ratio, source }),
  });

  const favIdsQuery = useQuery({
    queryKey: ['favorite-ids'],
    queryFn: fetchFavoriteIds,
    initialData: [],
  });

  const favSet = new Set(favIdsQuery.data ?? []);

  const addFavMutation = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorite-ids'] }),
  });

  const removeFavMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorite-ids'] }),
  });

  const handleSearch = useCallback((val: string) => {
    setQuery(val);
    setPage(1);
  }, []);

  const handleSort = (s: SortOption) => {
    setSorting(s);
    setPage(1);
  };

  const handleRatio = (r: string) => {
    setRatio(r);
    setPage(1);
  };

  const handleSource = (s: WallpaperSource) => {
    setSource(s);
    setPage(1);
  };

  const meta = wallpapersQuery.data?.meta;
  const currentResults = wallpapersQuery.data?.data ?? [];
  const totalPages = meta?.last_page ?? 1;
  const hasMore = currentResults.length > 0 && page < totalPages;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.18) 0%, transparent 70%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-[36px] md:text-[48px] font-bold tracking-tight mb-3">
              <span className="text-gradient">Anime Wallpapers</span>
            </h1>
            <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>
              Thousands of stunning 4K anime wallpapers, curated for you
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center gap-5"
          >
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              onSearch={handleSearch}
            />
            <SourceSelector value={source} onChange={handleSource} />
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div
        className="sticky top-[60px] z-40"
        style={{
          background: 'rgba(8,8,17,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-3">
          <SortFilter
            sorting={sorting}
            ratio={ratio}
            onSortChange={handleSort}
            onRatioChange={handleRatio}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Results count */}
        {meta && !wallpapersQuery.isLoading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[13px] mb-5"
            style={{ color: 'var(--text-muted)' }}
          >
            {meta.total.toLocaleString()} wallpapers
            {query && ` for "${query}"`}
            {' · '}page {meta.current_page} of {meta.last_page}
          </motion.p>
        )}

        {/* Loading */}
        {wallpapersQuery.isLoading && <GridSkeleton />}

        {/* Error */}
        {wallpapersQuery.isError && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <AlertTriangle size={32} style={{ color: 'var(--accent-pink)' }} />
            <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>
              Failed to load wallpapers. Check that the backend is running.
            </p>
            <button
              onClick={() => wallpapersQuery.refetch()}
              className="px-4 py-2 rounded-lg text-[13px] font-medium transition-all hover:brightness-110"
              style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        {wallpapersQuery.data && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${query}-${sorting}-${ratio}-${source}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <WallpaperGrid
                wallpapers={wallpapersQuery.data.data}
                favoriteIds={favSet}
                onFavorite={w => addFavMutation.mutate(w)}
                onUnfavorite={id => removeFavMutation.mutate(id)}
                onOpen={setSelected}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {totalPages > 1 && !wallpapersQuery.isLoading && (
          <div className="flex items-center justify-center gap-3 mt-10 pb-4">
            <PaginationBtn
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
              Prev
            </PaginationBtn>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
              <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                Page {page}
              </span>
            </div>

            <PaginationBtn
              disabled={!hasMore}
              onClick={() => setPage(p => p + 1)}
            >
              Next
              <ChevronRight size={16} />
            </PaginationBtn>
          </div>
        )}
      </div>

      {/* Modal */}
      <WallpaperModal
        wallpaper={selected}
        isFavorited={selected ? favSet.has(selected.id) : false}
        onClose={() => setSelected(null)}
        onFavorite={w => addFavMutation.mutate(w)}
        onUnfavorite={id => removeFavMutation.mutate(id)}
      />
    </div>
  );
}

function PaginationBtn({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all"
      style={{
        background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
        border: '1px solid var(--border)',
        color: disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

function getPageNums(current: number, total: number): (number | '...')[] {
  const pages: (number | '...')[] = [];
  const delta = 2;
  const range: number[] = [];

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }

  pages.push(1);
  if (range[0] > 2) pages.push('...');
  pages.push(...range);
  if (range[range.length - 1] < total - 1) pages.push('...');
  if (total > 1) pages.push(total);

  return pages;
}
