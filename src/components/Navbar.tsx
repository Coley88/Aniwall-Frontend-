import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Puzzle } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 glass"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="max-w-screen-xl mx-auto px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}
          >
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="text-[17px] font-semibold text-gradient tracking-tight">
            AniWalls
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <NavLink to="/" active={pathname === '/'}>
            Browse
          </NavLink>
          <NavLink to="/favorites" active={pathname === '/favorites'}>
            <Heart
              size={13}
              className="inline mr-1.5 mb-0.5"
              fill={pathname === '/favorites' ? 'currentColor' : 'none'}
            />
            Favorites
          </NavLink>
          <NavLink to="/puzzle" active={pathname === '/puzzle'}>
            <Puzzle size={13} className="inline mr-1.5 mb-0.5" />
            Puzzle
          </NavLink>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
        active
          ? 'text-purple-300'
          : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-white/5'
      }`}
      style={active ? { background: 'rgba(139,92,246,0.15)' } : {}}
    >
      {children}
    </Link>
  );
}
