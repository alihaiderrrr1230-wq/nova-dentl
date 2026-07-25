// Navbar - شريط التنقل العلوي
// يظهر في كل الصفحات ما عدا Splash
// زجاجي شفاف تماماً مثل iOS
import { motion } from 'framer-motion';
import { Home, User, Activity, Calendar, Package, Archive, Settings, ChevronLeft, Sparkles } from 'lucide-react';

const Navbar = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: Home },
    { id: 'clinic', label: 'العيادة', icon: User },
    { id: 'treatment', label: 'العلاج', icon: Activity },
    { id: 'appointments', label: 'الحجوزات', icon: Calendar },
    { id: 'inventory', label: 'المخزن', icon: Package },
    { id: 'archive', label: 'الأرشيف', icon: Archive },
  ];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-40 px-4 pt-4 pb-2"
    >
      <div className="max-w-7xl mx-auto">
        <div 
          className="glass !p-2 flex items-center gap-1"
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            boxShadow: '0 4px 30px rgba(0, 50, 80, 0.08)',
          }}
        >
          {/* اللوغو (يرجع للرئيسية) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-nova-lime/20 to-nova-lime/5 hover:from-nova-lime/30 hover:to-nova-lime/10 transition-all"
          >
            <Sparkles className="w-5 h-5 text-nova-lime-dark" />
            <span className="font-bold text-nova-deep hidden sm:inline">NOVA</span>
          </motion.button>

          {/* فاصل */}
          <div className="w-px h-6 bg-nova-deep/10 mx-1" />

          {/* أزرار التنقل */}
          <div className="flex items-center gap-1 flex-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-br from-nova-lime/40 to-nova-lime/20 text-nova-deep shadow-sm'
                      : 'hover:bg-white/40 text-nova-deep/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-semibold hidden md:inline">{item.label}</span>
                  
                  {/* مؤشر نشط */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-xl border-2 border-nova-lime/50"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* فاصل */}
          <div className="w-px h-6 bg-nova-deep/10 mx-1" />

          {/* الإعدادات */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="p-2 rounded-xl hover:bg-white/40 transition"
            title="الإعدادات"
          >
            <Settings className="w-4 h-4 text-nova-deep/70" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
