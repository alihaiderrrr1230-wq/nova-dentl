// App.jsx - المكون الرئيسي الذي يدير كل الواجهات
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Calendar, Package, Activity, DollarSign } from 'lucide-react';
import Splash from './pages/Splash.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Clinic from './pages/Clinic.jsx';
import Appointments from './pages/Appointments.jsx';
import Inventory from './pages/Inventory.jsx';
import Treatment from './pages/Treatment.jsx';
import Archive from './pages/Archive.jsx';
import Navbar from './components/Navbar.jsx';
import { useDataStore } from './store/useDataStore.js';

const App = () => {
  const [currentPage, setCurrentPage] = useState('splash'); // 'splash' | 'dashboard' | 'clinic' | ...
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  const { clearAll } = useDataStore();

  // رسالة قبل الخروج (حفظ البيانات)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (currentPage !== 'splash') {
        e.preventDefault();
        e.returnValue = 'هل تريد حفظ البيانات قبل الخروج؟';
        return 'هل تريد حفظ البيانات قبل الخروج؟';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentPage]);

  // اختصارات لوحة المفاتيح
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl+S للحفظ السريع
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        // البيانات تنحفظ تلقائياً في Zustand
        console.log('✓ تم حفظ البيانات');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleStart = () => setCurrentPage('dashboard');

  const handleNavigate = (page) => {
    console.log(`📍 الانتقال إلى: ${page}`);
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen font-arabic" dir="rtl">
      <AnimatePresence mode="wait">
        {currentPage === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Splash onStart={handleStart} />
          </motion.div>
        )}

        {currentPage === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
            <Dashboard onNavigate={handleNavigate} />
          </motion.div>
        )}

        {currentPage === 'clinic' && (
          <motion.div
            key="clinic"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
            <Clinic />
          </motion.div>
        )}

        {currentPage === 'appointments' && (
          <motion.div
            key="appointments"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
            <Appointments />
          </motion.div>
        )}

        {currentPage === 'inventory' && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
            <Inventory />
          </motion.div>
        )}

        {currentPage === 'treatment' && (
          <motion.div
            key="treatment"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
            <Treatment />
          </motion.div>
        )}

        {currentPage === 'archive' && (
          <motion.div
            key="archive"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
            <Archive />
          </motion.div>
        )}

        {/* صفحة "تحت الإنشاء" للصفحات غير المعرفة */}
        {!['splash', 'dashboard', 'clinic', 'appointments', 'inventory', 'treatment', 'archive'].includes(currentPage) && (
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen flex items-center justify-center"
          >
            <div className="glass-strong p-10 text-center max-w-md">
              <h2 className="text-2xl font-bold text-nova-deep mb-3">
                🚧 {currentPage}
              </h2>
              <p className="text-nova-deep/70 mb-6">
                راح تجهز في الحزم القادمة
              </p>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="btn-primary"
              >
                العودة للداشبورد
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
