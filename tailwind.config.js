/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/renderer/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ألوان NOVA الأساسية
        'nova-pearl': '#edf2f3',
        'nova-pearl-dark': '#d8e3e6',
        'nova-lime': '#8cea23',
        'nova-lime-dark': '#7ad11f',
        'nova-lime-light': '#a8f04d',
        'nova-deep': '#003a5c',
        
        // ألوان الأمراض (12 لون)
        'disease-1': '#FF6B6B',  // تسوس
        'disease-2': '#4ECDC4',  // علاج عصب
        'disease-3': '#95A5A6',  // خلع
        'disease-4': '#FFD93D',  // تاج
        'disease-5': '#6BCB77',  // تقويم
        'disease-6': '#F8F0FB',  // تبييض
        'disease-7': '#A8DADC',  // حشوة
        'disease-8': '#E63946',  // التهاب لثة
        'disease-9': '#F4A261',  // كسر
        'disease-10': '#9D0208', // خراج
        'disease-11': '#B4E1FF', // تنظيف
        'disease-12': '#C9B1FF', // زراعة
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
        english: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'smoke': 'smoke 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        smoke: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.4' },
          '50%': { transform: 'translate(30px, -40px) scale(1.2)', opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
