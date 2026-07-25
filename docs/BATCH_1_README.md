# 🦷 NOVA — Dental Clinic Management System

## 📦 الحزمة 1 من 5: الأساس

هذه الحزمة تحتوي على **الملفات الأساسية** التي تحتاجها كل الحزم اللاحقة.

---

## 📁 بنية المشروع بعد الحزمة 1:

```
nova-dental/
├── 📄 package.json                    ← معلومات المشروع + dependencies
├── 📄 vite.config.js                  ← إعدادات Vite + aliases
├── 📄 tailwind.config.js              ← ألوان NOVA + animations
├── 📄 postcss.config.js               ← معالج CSS
├── 📄 index.html                      ← نقطة دخول React
├── 📄 .gitignore
│
├── 📂 data/                           ← (يأتي في حزمة لاحقة)
│
├── 📂 docs/
│   └── BATCH_1_README.md              ← هذا الملف
│
└── 📂 src/
    └── 📂 renderer/
        ├── 📄 main.jsx                ← (الحزمة 2)
        ├── 📄 App.jsx                 ← (الحزمة 2)
        │
        ├── 📂 styles/
        │   └── glassmorphism.css      ✅ تنسيقات iOS الزجاجية
        │
        ├── 📂 utils/
        │   ├── colors.js              ✅ ألوان NOVA + ألوان الأمراض
        │   └── dateUtils.js           ✅ أدوات التاريخ (هجري/ميلادي)
        │
        ├── 📂 components/             ← (الحزم اللاحقة)
        ├── 📂 pages/                  ← (الحزم اللاحقة)
        ├── 📂 store/                  ← (الحزمة 2)
        ├── 📂 hooks/                  ← (الحزم اللاحقة)
        └── 📂 features/               ← (الحزمة 3)
```

---

## 🚀 كيف تثبّت الحزمة 1:

### الخطوة 1: إنشاء المجلد
```bash
mkdir nova-dental
cd nova-dental
```

### الخطوة 2: نسخ الملفات
انسخ الملفات التالية إلى المسارات المحددة:

| الملف | المسار |
|---|---|
| `package.json` | `/nova-dental/package.json` |
| `vite.config.js` | `/nova-dental/vite.config.js` |
| `tailwind.config.js` | `/nova-dental/tailwind.config.js` |
| `postcss.config.js` | `/nova-dental/postcss.config.js` |
| `index.html` | `/nova-dental/index.html` |
| `.gitignore` | `/nova-dental/.gitignore` |
| `glassmorphism.css` | `/nova-dental/src/renderer/styles/glassmorphism.css` |
| `colors.js` | `/nova-dental/src/renderer/utils/colors.js` |
| `dateUtils.js` | `/nova-dental/src/renderer/utils/dateUtils.js` |
| `BATCH_1_README.md` | `/nova-dental/docs/BATCH_1_README.md` |

### الخطوة 3: إنشاء المجلدات الفارغة
```bash
mkdir -p data
mkdir -p assets/icons assets/images assets/fonts
mkdir -p backups
mkdir -p src/main
mkdir -p src/renderer/components
mkdir -p src/renderer/pages
mkdir -p src/renderer/store
mkdir -p src/renderer/hooks
mkdir -p src/renderer/features
```

### الخطوة 4: تثبيت المكتبات
```bash
npm install
```

⚠️ ملاحظة: `npm install` ممكن يأخذ دقيقة أو دقيقتين.

---

## ✅ كيف تتأكد إن الحزمة 1 شغّالة؟

بعد الحزمة 1، ما راح يشتغل التطبيق لسا (لأن ما عندنا `main.jsx` و `App.jsx`).
لكن نتأكد إن **التنسيقات والـ Tailwind** شغّالين.

**الحزمة 2** راح تجهز شاشة Splash + Dashboard ويبدأ التطبيق يشتغل.

---

## 🔗 شو راح تضيف الحزم اللاحقة:

| الحزمة | الملفات الرئيسية | النتيجة |
|---|---|---|
| **الحزمة 2** | `main.jsx`, `App.jsx`, `Splash.jsx`, `Dashboard.jsx` | **التطبيق يشتغل** — شاشة ترحيب + داشبورد |
| **الحزمة 3** | `ToothChart.jsx`, `teeth-data.js` | **مخطط الأسنان التفاعلي** |
| **الحزمة 4** | `Patients.jsx`, `Appointments.jsx`, `Inventory.jsx` | **3 صفحات كاملة** |
| **الحزمة 5** | `Treatment.jsx`, `PlanEditor.jsx`, `Prescription.jsx` | **العلاج + الخطط** |

---

## 💡 شو تعمل لو صار خطأ؟

1. تأكد إنك نسخت كل ملف في مساره الصحيح
2. تأكد إنك سويت `npm install` بنجاح
3. لو الـ Tailwind ما اشتغل، تأكد إن `postcss.config.js` و `tailwind.config.js` في الجذر

**جاهز للحزمة 2؟ قول "الحزمة 2" وأرسلها لك!** 🚀
