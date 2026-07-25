// Modal زجاجي — يستخدم في كل النماذج (إضافة/تعديل)
// iOS-style — مع backdrop blur للخلفية
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import GlassCard from './GlassCard.jsx';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nova-deep/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}
          >
            <GlassCard variant="strong" className="!p-6">
              {/* العنوان */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-nova-deep/10">
                <h2 className="text-xl font-bold text-nova-deep">{title}</h2>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/40 hover:bg-white/60 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4 text-nova-deep" />
                </button>
              </div>

              {/* المحتوى */}
              {children}
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
