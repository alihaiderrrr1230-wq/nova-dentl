// =============================================================
// Navbar v2 — iOS-style frosted top bar with active indicator
// -------------------------------------------------------------
// The Settings button is wired to theme toggle.
// The Inventory link is REMOVED (no more inventory in v2).
// =============================================================

import { motion } from 'framer-motion';
import {
  Home,
  User,
  Activity,
  Calendar,
  Archive,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useDataStore } from '@store/useDataStore';
import { clsx } from '@utils/clsx';

const Navbar = ({ currentPage, onNavigate }) => {
  const theme = useDataStore((s) => s.theme);
  const toggleTheme = useDataStore((s) => s.toggleTheme);

  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: Home },
    { id: 'appointments', label: 'الحجوزات', icon: Calendar },
    { id: 'clinic', label: 'العيادة', icon: User },
    { id: 'treatment', label: 'العلاج', icon: Activity },
    { id: 'archive', label: 'الأرشيف', icon: Archive },
  ];

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 px-4 pt-4 pb-2"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className="glass !p-1.5 flex items-center gap-1"
          style={{
            background: 'var(--glass-bg-strong)',
            boxShadow: 'var(--glass-shadow-strong)',
          }}
        >
          {/* Logo */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-nova-lime/30 to-nova-lime/10 hover:from-nova-lime/40 hover:to-nova-lime/20 transition-all"
            aria-label="العودة للرئيسية"
          >
            <Sparkles className="w-5 h-5 text-nova-lime-dark" />
            <span className="font-extrabold text-[var(--text-primary)] hidden sm:inline tracking-tight">
              NOVA
            </span>
          </motion.button>

          <div className="w-px h-6 bg-[var(--glass-border)] mx-1" />

          {/* Nav items */}
          <div
            className="flex items-center gap-1 flex-1 overflow-x-auto"
            role="tablist"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate(item.id)}
                  className={clsx(
                    'relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap',
                    isActive
                      ? 'bg-gradient-to-br from-nova-lime/40 to-nova-lime/15 text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-white/30 dark:hover:bg-white/5'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-xl ring-2 ring-nova-lime/60"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="text-sm font-semibold hidden md:inline relative z-10">
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="w-px h-6 bg-[var(--glass-border)] mx-1" />

          {/* Theme toggle (the activated "Settings" button) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-white/30 dark:hover:bg-white/5 transition"
            title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
            aria-label="تبديل المظهر"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--text-secondary)]" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
