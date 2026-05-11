import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSearch: (val: string) => void;
}

export default function SearchBar({ value, onChange, onSearch }: Props) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch(value);
    if (e.key === 'Escape') {
      onChange('');
      inputRef.current?.blur();
    }
  };

  const clear = () => {
    onChange('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        animate={
          focused
            ? { boxShadow: '0 0 0 2px rgba(139,92,246,0.5), 0 8px 32px rgba(139,92,246,0.15)' }
            : { boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }
        }
        transition={{ duration: 0.2 }}
        className="relative flex items-center rounded-2xl overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          border: focused ? '1px solid rgba(139,92,246,0.5)' : '1px solid var(--border)',
        }}
      >
        <Search
          size={17}
          className="absolute left-4 transition-colors duration-200"
          style={{ color: focused ? 'var(--accent-purple)' : 'var(--text-muted)' }}
        />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search anime wallpapers…"
          className="w-full bg-transparent py-3.5 pl-11 pr-11 text-[15px] outline-none placeholder:text-[color:var(--text-muted)]"
          style={{ color: 'var(--text-primary)' }}
        />

        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={clear}
              className="absolute right-3 w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
