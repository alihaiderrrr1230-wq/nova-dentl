// شاشة Splash — شاشة الترحيب مع زر "ابدأ"
// iOS-style glassmorphism + smoke effect
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import Button from '../components/Button.jsx';

const Splash = ({ onStart }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* خلفية تأثير السراب */}
      <div className="smoke-bg" />
      
      {/* الشبكة الخلفية الزخرفية */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-nova-lime/20 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-blue-300/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-nova-lime/15 blur-2xl animate-pulse-slow" />
      </div>

      {/* المحتوى الرئيسي */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl px-6"
      >
        {/* اللوغو */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-10 h-10 text-nova-lime" />
            </motion.div>
            <h1 className="text-6xl font-bold bg-gradient-to-br from-nova-deep via-nova-deep to-nova-lime-dark bg-clip-text text-transparent">
              NOVA
            </h1>
            <motion.div
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-10 h-10 text-nova-lime" />
            </motion.div>
          </div>
          <p className="text-nova-deep/70 text-lg font-medium">
            نظام إدارة عيادة الأسنان الذكي
          </p>
        </motion.div>

        {/* البطاقة الزجاجية الرئيسية */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass-strong p-10 text-center"
        >
          {/* أيقونة السن الكبيرة */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-8"
          >
            <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
              {/* رسمة سن زجاجية */}
              <defs>
                <linearGradient id="toothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#edf2f3" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#8cea23" stopOpacity="0.6" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M 60 15 
                   C 80 15, 95 25, 95 45
                   C 95 60, 90 75, 85 88
                   C 80 100, 75 105, 70 105
                   C 67 105, 65 100, 63 90
                   C 62 85, 60 80, 60 75
                   C 60 80, 58 85, 57 90
                   C 55 100, 53 105, 50 105
                   C 45 105, 40 100, 35 88
                   C 30 75, 25 60, 25 45
                   C 25 25, 40 15, 60 15 Z"
                fill="url(#toothGrad)"
                stroke="#003a5c"
                strokeWidth="1.5"
                filter="url(#glow)"
                opacity="0.95"
              />
              {/* لمعان */}
              <ellipse cx="50" cy="35" rx="6" ry="10" fill="white" opacity="0.5" />
            </svg>
          </motion.div>

          <h2 className="text-3xl font-bold text-nova-deep mb-3">
            مرحباً بك في NOVA
          </h2>
          <p className="text-nova-deep/70 text-base mb-8 leading-relaxed">
            نظامك المتكامل لإدارة عيادة الأسنان
            <br />
            <span className="text-sm">بسيط · احترافي · ذكي</span>
          </p>

          {/* زر البدء */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              size="lg"
              icon={Play}
              onClick={onStart}
              className="!text-lg !px-12 !py-4"
            >
              ابدأ
            </Button>
          </motion.div>

          {/* معلومات إضافية */}
          <div className="mt-8 pt-6 border-t border-nova-deep/10">
            <div className="flex items-center justify-center gap-6 text-sm text-nova-deep/60">
              <span>v 0.1.0</span>
              <span>•</span>
              <span>يعمل بدون إنترنت</span>
              <span>•</span>
              <span>تخزين محلي</span>
            </div>
          </div>
        </motion.div>

        {/* الإصدار والمطور */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-6 text-nova-deep/50 text-sm"
        >
          صُمم بألوان <span className="text-nova-lime-dark font-semibold">NOVA</span> · 2026
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Splash;
