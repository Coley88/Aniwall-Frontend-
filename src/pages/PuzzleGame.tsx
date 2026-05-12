import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, RotateCcw, ArrowLeft, Clock, Hash,
  Star, Lock, ChevronRight, Puzzle,
} from 'lucide-react';

interface Stage {
  id: number;
  name: string;
  subtitle: string;
  grid: number;
  image: string;
  shuffleMoves: number;
  accent: string;
  glow: string;
}

const STAGES: Stage[] = [
  {
    id: 1,
    name: 'Sakura Fields',
    subtitle: 'Easy · 3×3',
    grid: 3,
    image: 'https://picsum.photos/seed/sakurafield/480/480',
    shuffleMoves: 50,
    accent: '#ec4899',
    glow: 'rgba(236,72,153,0.25)',
  },
  {
    id: 2,
    name: 'Neon City',
    subtitle: 'Medium · 4×4',
    grid: 4,
    image: 'https://picsum.photos/seed/neoncity99/480/480',
    shuffleMoves: 120,
    accent: '#06b6d4',
    glow: 'rgba(6,182,212,0.25)',
  },
  {
    id: 3,
    name: "Dragon's Peak",
    subtitle: 'Hard · 5×5',
    grid: 5,
    image: 'https://picsum.photos/seed/dragonpeak/480/480',
    shuffleMoves: 250,
    accent: '#f97316',
    glow: 'rgba(249,115,22,0.25)',
  },
  {
    id: 4,
    name: 'Void Realm',
    subtitle: 'Expert · 5×5',
    grid: 5,
    image: 'https://picsum.photos/seed/voidrealm42/480/480',
    shuffleMoves: 500,
    accent: '#8b5cf6',
    glow: 'rgba(139,92,246,0.25)',
  },
];

// ─── Puzzle logic ────────────────────────────────────────────────────────────

function makeSolved(n: number): number[] {
  return Array.from({ length: n * n - 1 }, (_, i) => i + 1).concat([0]);
}

function doShuffle(n: number, count: number): { tiles: number[]; blank: number } {
  const tiles = makeSolved(n);
  let blank = n * n - 1;
  let prev = -1;

  for (let i = 0; i < count; i++) {
    const neighbors = [-1, 1, -n, n]
      .map(d => blank + d)
      .filter(p => {
        if (p < 0 || p >= n * n || p === prev) return false;
        const d = p - blank;
        if (d === -1 && blank % n === 0) return false;
        if (d === 1 && blank % n === n - 1) return false;
        return true;
      });
    const next = neighbors[Math.floor(Math.random() * neighbors.length)];
    [tiles[blank], tiles[next]] = [tiles[next], tiles[blank]];
    prev = blank;
    blank = next;
  }
  return { tiles, blank };
}

function isAdjacent(pos: number, blank: number, n: number): boolean {
  const dr = Math.abs(Math.floor(pos / n) - Math.floor(blank / n));
  const dc = Math.abs((pos % n) - (blank % n));
  return dr + dc === 1;
}

function isSolved(tiles: number[]): boolean {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return tiles[tiles.length - 1] === 0;
}

// ─── Stage Select ─────────────────────────────────────────────────────────────

function StageSelect({
  onSelect,
  completed,
}: {
  onSelect: (s: Stage) => void;
  completed: Set<number>;
}) {
  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center gap-2.5 mb-3">
          <Puzzle size={26} style={{ color: '#a78bfa' }} />
          <h1 className="text-3xl font-bold text-gradient">Slide Puzzle</h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Slide tiles to restore the hidden anime art
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        {STAGES.map((stage, i) => {
          const locked = i > 0 && !completed.has(STAGES[i - 1].id);
          const done = completed.has(stage.id);

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => !locked && onSelect(stage)}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${locked ? 'var(--border)' : stage.accent + '44'}`,
                opacity: locked ? 0.55 : 1,
                cursor: locked ? 'not-allowed' : 'pointer',
              }}
              whileHover={!locked ? { scale: 1.02, boxShadow: `0 8px 30px ${stage.glow}` } : {}}
              whileTap={!locked ? { scale: 0.97 } : {}}
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src={stage.image}
                  alt={stage.name}
                  className="w-full h-full object-cover"
                  style={{ filter: locked ? 'grayscale(1) brightness(0.4)' : 'none' }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to bottom, transparent 30%, var(--bg-card) 100%)' }}
                />
                {locked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.5)' }}
                    >
                      <Lock size={20} style={{ color: 'var(--text-secondary)' }} />
                    </div>
                  </div>
                )}
                {done && (
                  <div
                    className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                      background: `${stage.accent}28`,
                      color: stage.accent,
                      border: `1px solid ${stage.accent}44`,
                    }}
                  >
                    <Star size={9} fill="currentColor" /> Cleared
                  </div>
                )}
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>
                    {stage.name}
                  </p>
                  <p className="text-[11px] mt-0.5 font-medium" style={{ color: stage.accent }}>
                    {stage.subtitle}
                  </p>
                </div>
                {!locked && <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Puzzle Board ─────────────────────────────────────────────────────────────

function PuzzleBoard({
  stage,
  onBack,
  onComplete,
  onNextStage,
}: {
  stage: Stage;
  onBack: () => void;
  onComplete: (moves: number, time: number) => void;
  onNextStage?: () => void;
}) {
  const n = stage.grid;
  const BOARD = Math.min(480, (typeof window !== 'undefined' ? window.innerWidth : 480) - 48);
  const TILE = Math.floor(BOARD / n);

  const [{ tiles, blank }, setGame] = useState(() => doShuffle(n, stage.shuffleMoves));
  const [resetKey, setResetKey] = useState(0);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [won, setWon] = useState(false);
  const calledComplete = useRef(false);

  useEffect(() => {
    const s = doShuffle(n, stage.shuffleMoves);
    setGame(s);
    setResetKey(k => k + 1);
    setMoves(0);
    setElapsed(0);
    setWon(false);
    calledComplete.current = false;
  }, [stage.id]);

  useEffect(() => {
    if (won) return;
    const id = window.setInterval(() => setElapsed(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [won, stage.id]);

  const handleTileClick = (pos: number) => {
    if (won || !isAdjacent(pos, blank, n)) return;

    const next = [...tiles];
    [next[blank], next[pos]] = [next[pos], next[blank]];
    const newMoves = moves + 1;

    setGame({ tiles: next, blank: pos });
    setMoves(newMoves);

    if (isSolved(next) && !calledComplete.current) {
      calledComplete.current = true;
      setWon(true);
      setTimeout(() => onComplete(newMoves, elapsed), 300);
    }
  };

  const restart = () => {
    const s = doShuffle(n, stage.shuffleMoves);
    setGame(s);
    setResetKey(k => k + 1);
    setMoves(0);
    setElapsed(0);
    setWon(false);
    calledComplete.current = false;
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col items-center px-4 py-8">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="p-2 rounded-xl transition-all"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <ArrowLeft size={17} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-[17px] leading-tight" style={{ color: 'var(--text-primary)' }}>
            {stage.name}
          </h2>
          <p className="text-[11px] font-medium" style={{ color: stage.accent }}>
            {stage.subtitle}
          </p>
        </div>
        <button
          onClick={restart}
          title="Restart"
          className="p-2 rounded-xl transition-all"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <RotateCcw size={15} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-5">
        {[
          { Icon: Hash, label: 'Moves', value: String(moves) },
          { Icon: Clock, label: 'Time', value: fmt(elapsed) },
        ].map(({ Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <Icon size={13} style={{ color: stage.accent }} />
            <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{label}:</span>
            <span className="font-mono font-bold text-[13px]" style={{ color: 'var(--text-primary)' }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Puzzle board */}
      <div
        className="relative rounded-2xl overflow-hidden select-none"
        style={{
          width: TILE * n,
          height: TILE * n,
          background: '#000',
          border: `2px solid ${stage.accent}44`,
          boxShadow: `0 0 48px ${stage.glow}`,
        }}
      >
        <div key={resetKey} style={{ position: 'relative', width: TILE * n, height: TILE * n }}>
          {tiles.map((value, pos) => {
            if (value === 0) return null;
            const row = Math.floor(pos / n);
            const col = pos % n;
            const origRow = Math.floor((value - 1) / n);
            const origCol = (value - 1) % n;
            const canMove = isAdjacent(pos, blank, n);

            return (
              <div
                key={value}
                onClick={() => handleTileClick(pos)}
                style={{
                  position: 'absolute',
                  left: col * TILE + 1,
                  top: row * TILE + 1,
                  width: TILE - 2,
                  height: TILE - 2,
                  backgroundImage: `url(${stage.image})`,
                  backgroundSize: `${TILE * n}px ${TILE * n}px`,
                  backgroundPosition: `-${origCol * TILE}px -${origRow * TILE}px`,
                  backgroundRepeat: 'no-repeat',
                  cursor: canMove ? 'pointer' : 'default',
                  borderRadius: 3,
                  border: '1px solid rgba(0,0,0,0.3)',
                  transition: 'left 0.11s cubic-bezier(0.4,0,0.2,1), top 0.11s cubic-bezier(0.4,0,0.2,1)',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}
              />
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-[11px]" style={{ color: 'var(--text-muted)' }}>
        Tap a tile adjacent to the empty space to slide it
      </p>

      {/* Win modal */}
      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            style={{ background: 'rgba(8,8,17,0.88)', backdropFilter: 'blur(10px)' }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="w-full max-w-xs rounded-3xl p-8 text-center"
              style={{
                background: 'var(--bg-card)',
                border: `2px solid ${stage.accent}55`,
                boxShadow: `0 20px 60px ${stage.glow}`,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: `${stage.accent}22` }}
              >
                <Trophy size={30} style={{ color: stage.accent }} />
              </motion.div>

              <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Stage Clear!
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                {stage.name} completed
              </p>

              <div className="flex justify-center gap-8 mb-7">
                <div>
                  <p className="text-3xl font-black font-mono" style={{ color: stage.accent }}>
                    {moves}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>moves</p>
                </div>
                <div className="w-px" style={{ background: 'var(--border)' }} />
                <div>
                  <p className="text-3xl font-black font-mono" style={{ color: stage.accent }}>
                    {fmt(elapsed)}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>time</p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {onNextStage && (
                  <button
                    onClick={onNextStage}
                    className="w-full py-3 rounded-2xl text-sm font-semibold transition-all"
                    style={{
                      background: `${stage.accent}22`,
                      color: stage.accent,
                      border: `1px solid ${stage.accent}55`,
                    }}
                  >
                    Next Stage →
                  </button>
                )}
                <button
                  onClick={restart}
                  className="w-full py-2.5 rounded-2xl text-sm font-medium transition-all"
                  style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                >
                  Play Again
                </button>
                <button
                  onClick={onBack}
                  className="w-full py-2.5 rounded-2xl text-sm font-medium transition-all"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Back to Stages
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PuzzleGame() {
  const [selected, setSelected] = useState<Stage | null>(null);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const handleComplete = (stageId: number) => {
    setCompleted(prev => new Set([...prev, stageId]));
  };

  const goToNextStage = (currentId: number) => {
    const next = STAGES.find(s => s.id === currentId + 1);
    if (next) setSelected(next);
  };

  return (
    <AnimatePresence mode="wait">
      {selected ? (
        <motion.div
          key={`game-${selected.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <PuzzleBoard
            stage={selected}
            onBack={() => setSelected(null)}
            onComplete={(moves, time) => {
              handleComplete(selected.id);
              console.debug('Stage complete', { stage: selected.id, moves, time });
            }}
            onNextStage={
              STAGES.find(s => s.id === selected.id + 1)
                ? () => goToNextStage(selected.id)
                : undefined
            }
          />
        </motion.div>
      ) : (
        <motion.div
          key="select"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <StageSelect onSelect={setSelected} completed={completed} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
