// بيانات الأسنان الكاملة — نظام FDI (1-32)
// كل سن: رقم، موقع (upper/lower)، جهة (right/left)، نوع (incisor/canine/premolar/molar)

export const TEETH_DATA = {
  // الفك العلوي - الجهة اليمنى (من منظور الطبيب)
  18: { number: 18, jaw: 'upper', side: 'right', type: 'molar', name_ar: 'ضرس العقل العلوي الأيمن', name_en: 'Upper Right Third Molar' },
  17: { number: 17, jaw: 'upper', side: 'right', type: 'molar', name_ar: 'الضرس الثاني العلوي الأيمن', name_en: 'Upper Right Second Molar' },
  16: { number: 16, jaw: 'upper', side: 'right', type: 'molar', name_ar: 'الضرس الأول العلوي الأيمن', name_en: 'Upper Right First Molar' },
  15: { number: 15, jaw: 'upper', side: 'right', type: 'premolar', name_ar: 'الضاحك الثاني العلوي الأيمن', name_en: 'Upper Right Second Premolar' },
  14: { number: 14, jaw: 'upper', side: 'right', type: 'premolar', name_ar: 'الضاحك الأول العلوي الأيمن', name_en: 'Upper Right First Premolar' },
  13: { number: 13, jaw: 'upper', side: 'right', type: 'canine', name_ar: 'الناب العلوي الأيمن', name_en: 'Upper Right Canine' },
  12: { number: 12, jaw: 'upper', side: 'right', type: 'incisor', name_ar: 'القاطع الجانبي العلوي الأيمن', name_en: 'Upper Right Lateral Incisor' },
  11: { number: 11, jaw: 'upper', side: 'right', type: 'incisor', name_ar: 'القاطع المركزي العلوي الأيمن', name_en: 'Upper Right Central Incisor' },

  // الفك العلوي - الجهة اليسرى
  21: { number: 21, jaw: 'upper', side: 'left', type: 'incisor', name_ar: 'القاطع المركزي العلوي الأيسر', name_en: 'Upper Left Central Incisor' },
  22: { number: 22, jaw: 'upper', side: 'left', type: 'incisor', name_ar: 'القاطع الجانبي العلوي الأيسر', name_en: 'Upper Left Lateral Incisor' },
  23: { number: 23, jaw: 'upper', side: 'left', type: 'canine', name_ar: 'الناب العلوي الأيسر', name_en: 'Upper Left Canine' },
  24: { number: 24, jaw: 'upper', side: 'left', type: 'premolar', name_ar: 'الضاحك الأول العلوي الأيسر', name_en: 'Upper Left First Premolar' },
  25: { number: 25, jaw: 'upper', side: 'left', type: 'premolar', name_ar: 'الضاحك الثاني العلوي الأيسر', name_en: 'Upper Left Second Premolar' },
  26: { number: 26, jaw: 'upper', side: 'left', type: 'molar', name_ar: 'الضرس الأول العلوي الأيسر', name_en: 'Upper Left First Molar' },
  27: { number: 27, jaw: 'upper', side: 'left', type: 'molar', name_ar: 'الضرس الثاني العلوي الأيسر', name_en: 'Upper Left Second Molar' },
  28: { number: 28, jaw: 'upper', side: 'left', type: 'molar', name_ar: 'ضرس العقل العلوي الأيسر', name_en: 'Upper Left Third Molar' },

  // الفك السفلي - الجهة اليسرى
  31: { number: 31, jaw: 'lower', side: 'left', type: 'incisor', name_ar: 'القاطع المركزي السفلي الأيسر', name_en: 'Lower Left Central Incisor' },
  32: { number: 32, jaw: 'lower', side: 'left', type: 'incisor', name_ar: 'القاطع الجانبي السفلي الأيسر', name_en: 'Lower Left Lateral Incisor' },
  33: { number: 33, jaw: 'lower', side: 'left', type: 'canine', name_ar: 'الناب السفلي الأيسر', name_en: 'Lower Left Canine' },
  34: { number: 34, jaw: 'lower', side: 'left', type: 'premolar', name_ar: 'الضاحك الأول السفلي الأيسر', name_en: 'Lower Left First Premolar' },
  35: { number: 35, jaw: 'lower', side: 'left', type: 'premolar', name_ar: 'الضاحك الثاني السفلي الأيسر', name_en: 'Lower Left Second Premolar' },
  36: { number: 36, jaw: 'lower', side: 'left', type: 'molar', name_ar: 'الضرس الأول السفلي الأيسر', name_en: 'Lower Left First Molar' },
  37: { number: 37, jaw: 'lower', side: 'left', type: 'molar', name_ar: 'الضرس الثاني السفلي الأيسر', name_en: 'Lower Left Second Molar' },
  38: { number: 38, jaw: 'lower', side: 'left', type: 'molar', name_ar: 'ضرس العقل السفلي الأيسر', name_en: 'Lower Left Third Molar' },

  // الفك السفلي - الجهة اليمنى
  41: { number: 41, jaw: 'lower', side: 'right', type: 'incisor', name_ar: 'القاطع المركزي السفلي الأيمن', name_en: 'Lower Right Central Incisor' },
  42: { number: 42, jaw: 'lower', side: 'right', type: 'incisor', name_ar: 'القاطع الجانبي السفلي الأيمن', name_en: 'Lower Right Lateral Incisor' },
  43: { number: 43, jaw: 'lower', side: 'right', type: 'canine', name_ar: 'الناب السفلي الأيمن', name_en: 'Lower Right Canine' },
  44: { number: 44, jaw: 'lower', side: 'right', type: 'premolar', name_ar: 'الضاحك الأول السفلي الأيمن', name_en: 'Lower Right First Premolar' },
  45: { number: 45, jaw: 'lower', side: 'right', type: 'premolar', name_ar: 'الضاحك الثاني السفلي الأيمن', name_en: 'Lower Right Second Premolar' },
  46: { number: 46, jaw: 'lower', side: 'right', type: 'molar', name_ar: 'الضرس الأول السفلي الأيمن', name_en: 'Lower Right First Molar' },
  47: { number: 47, jaw: 'lower', side: 'right', type: 'molar', name_ar: 'الضرس الثاني السفلي الأيمن', name_en: 'Lower Right Second Molar' },
  48: { number: 48, jaw: 'lower', side: 'right', type: 'molar', name_ar: 'ضرس العقل السفلي الأيمن', name_en: 'Lower Right Third Molar' },
};

// ترتيب عرض الأسنان في الواجهة (الصف العلوي)
export const UPPER_TEETH_ORDER = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];

// ترتيب عرض الأسنان في الواجهة (الصف السفلي)
export const LOWER_TEETH_ORDER = [38, 37, 36, 35, 34, 33, 32, 31, 41, 42, 43, 44, 45, 46, 47, 48];

// أبعاد رسم السن
export const TOOTH_DIMS = {
  width: 40,
  height: 100,
  spacing: 6,
  crownHeight: 55,
  rootHeight: 40,
  crownWidth: 34,
};

// الأسنان اللبنية (للأطفال) - نظام FDI: 51-85
export const PRIMARY_TEETH = {
  55: { number: 55, jaw: 'upper', side: 'right', type: 'molar', name_ar: 'ضرس لبني', name_en: 'Primary Molar' },
  54: { number: 54, jaw: 'upper', side: 'right', type: 'molar', name_ar: 'ضرس لبني', name_en: 'Primary Molar' },
  53: { number: 53, jaw: 'upper', side: 'right', type: 'canine', name_ar: 'ناب لبني', name_en: 'Primary Canine' },
  52: { number: 52, jaw: 'upper', side: 'right', type: 'incisor', name_ar: 'قاطع لبني', name_en: 'Primary Incisor' },
  51: { number: 51, jaw: 'upper', side: 'right', type: 'incisor', name_ar: 'قاطع لبني', name_en: 'Primary Incisor' },
  61: { number: 61, jaw: 'upper', side: 'left', type: 'incisor', name_ar: 'قاطع لبني', name_en: 'Primary Incisor' },
  62: { number: 62, jaw: 'upper', side: 'left', type: 'incisor', name_ar: 'قاطع لبني', name_en: 'Primary Incisor' },
  63: { number: 63, jaw: 'upper', side: 'left', type: 'canine', name_ar: 'ناب لبني', name_en: 'Primary Canine' },
  64: { number: 64, jaw: 'upper', side: 'left', type: 'molar', name_ar: 'ضرس لبني', name_en: 'Primary Molar' },
  65: { number: 65, jaw: 'upper', side: 'left', type: 'molar', name_ar: 'ضرس لبني', name_en: 'Primary Molar' },
  75: { number: 75, jaw: 'lower', side: 'left', type: 'molar', name_ar: 'ضرس لبني', name_en: 'Primary Molar' },
  74: { number: 74, jaw: 'lower', side: 'left', type: 'molar', name_ar: 'ضرس لبني', name_en: 'Primary Molar' },
  73: { number: 73, jaw: 'lower', side: 'left', type: 'canine', name_ar: 'ناب لبني', name_en: 'Primary Canine' },
  72: { number: 72, jaw: 'lower', side: 'left', type: 'incisor', name_ar: 'قاطع لبني', name_en: 'Primary Incisor' },
  71: { number: 71, jaw: 'lower', side: 'left', type: 'incisor', name_ar: 'قاطع لبني', name_en: 'Primary Incisor' },
  81: { number: 81, jaw: 'lower', side: 'right', type: 'incisor', name_ar: 'قاطع لبني', name_en: 'Primary Incisor' },
  82: { number: 82, jaw: 'lower', side: 'right', type: 'incisor', name_ar: 'قاطع لبني', name_en: 'Primary Incisor' },
  83: { number: 83, jaw: 'lower', side: 'right', type: 'canine', name_ar: 'ناب لبني', name_en: 'Primary Canine' },
  84: { number: 84, jaw: 'lower', side: 'right', type: 'molar', name_ar: 'ضرس لبني', name_en: 'Primary Molar' },
  85: { number: 85, jaw: 'lower', side: 'right', type: 'molar', name_ar: 'ضرس لبني', name_en: 'Primary Molar' },
};

export const PRIMARY_UPPER_ORDER = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
export const PRIMARY_LOWER_ORDER = [75, 74, 73, 72, 71, 81, 82, 83, 84, 85];

// عتبة العمر
export const ADULT_AGE_THRESHOLD = 10;
