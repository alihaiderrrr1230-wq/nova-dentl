// ألوان NOVA
export const NOVA_COLORS = {
  pearl: '#edf2f3',
  pearlDark: '#d8e3e6',
  lime: '#8cea23',
  limeDark: '#7ad11f',
  limeLight: '#a8f04d',
  deep: '#003a5c',
};

// ألوان الأمراض الـ 12 (نفسها في seed.json)
export const DISEASE_COLORS = {
  1: '#FF6B6B',   // تسوس
  2: '#4ECDC4',   // علاج عصب
  3: '#95A5A6',   // خلع
  4: '#FFD93D',   // تاج صناعي
  5: '#6BCB77',   // تقويم
  6: '#F8F0FB',   // تبييض
  7: '#A8DADC',   // حشوة
  8: '#E63946',   // التهاب لثة
  9: '#F4A261',   // كسر
  10: '#9D0208',  // خراج
  11: '#B4E1FF',  // تنظيف
  12: '#C9B1FF',  // زراعة
};

// دالة للحصول على لون المرض بالـ ID
export const getDiseaseColor = (diseaseId) => {
  return DISEASE_COLORS[diseaseId] || '#95A5A6';
};
