# 🦷 NOVA — Dental Clinic Management System

نظام متكامل لإدارة عيادة أسنان — Desktop App + Web + iPad — يعمل محلياً بدون سيرفر.

![Status](https://img.shields.io/badge/status-ready-success)
![React](https://img.shields.io/badge/React-18-blue)
![Platform](https://img.shields.io/badge/platform-All-lightgrey)

---

## ✨ المميزات

- 🪟 **واجهة زجاجية iOS-style** (Glassmorphism حقيقي)
- 🦷 **مخطط أسنان تفاعلي** عالي الدقة (نظام FDI 1-32)
- 💊 **خطط علاجية ذكية** — اقتراحات تلقائية + قابلة للتعديل
- 👥 **CRUD كامل** — مرضى، حجوزات، مخزن، علاجات، أرشيف
- 📊 **رسوم بيانية** حقيقية تتحدث تلقائياً
- 🔔 **تنبيهات ذكية** للمخزون المنخفض
- 💾 **حفظ تلقائي** (localStorage)
- 🌐 **دعم عربي/إنجليزي** (RTL/LTR)
- 📱 **يعمل على كل المنصات** (Windows, macOS, iPad, Android, Web)

---

## 🚀 التشغيل السريع (3 خطوات)

### 1️⃣ فك الضغط
```bash
unzip nova-dental.zip
cd nova-dental
```

### 2️⃣ ثبّت المكتبات
```bash
npm install
```

### 3️⃣ شغّل
```bash
npm run dev:renderer
```

✅ **التطبيق يفتح تلقائياً على:** `http://localhost:5173`

---

## 📁 بنية المشروع

```
nova-dental/
├── package.json              # تبعيات المشروع
├── vite.config.js            # إعدادات Vite
├── tailwind.config.js        # ألوان NOVA
├── postcss.config.js
├── index.html                # نقطة دخول HTML
│
├── data/
│   └── seed.js               # بيانات افتراضية (6 مرضى، 12 مرض، 12 خطة، 15 مادة)
│
├── docs/
│   ├── BATCH_1_README.md     # تفاصيل الحزمة 1
│   ├── BATCH_2_README.md     # تفاصيل الحزمة 2
│   ├── BATCH_3_README.md     # تفاصيل الحزمة 3
│   ├── BATCH_4_README.md     # تفاصيل الحزمة 4
│   └── BATCH_5_README.md     # تفاصيل الحزمة 5
│
└── src/renderer/
    ├── main.jsx              # نقطة دخول React
    ├── App.jsx               # المكون الرئيسي
    │
    ├── pages/                # الواجهات (7 صفحات)
    │   ├── Splash.jsx        # شاشة الترحيب
    │   ├── Dashboard.jsx     # الداشبورد
    │   ├── Clinic.jsx        # المرضى
    │   ├── Treatment.jsx     # العلاج
    │   ├── Archive.jsx       # الأرشيف
    │   ├── Appointments.jsx  # الحجوزات
    │   └── Inventory.jsx     # المخزن
    │
    ├── components/           # مكونات مشتركة
    │   ├── GlassCard.jsx     # البطاقة الزجاجية
    │   ├── Button.jsx        # الزر
    │   ├── Modal.jsx         # النافذة المنبثقة
    │   ├── Input.jsx         # حقول الإدخال
    │   └── Navbar.jsx        # شريط التنقل
    │
    ├── features/ToothChart/  # مخطط الأسنان
    │   ├── Tooth.jsx         # سن واحد
    │   ├── ToothChart.jsx    # المخطط الكامل
    │   └── teeth-data.js     # بيانات الأسنان
    │
    ├── store/
    │   └── useDataStore.js   # Zustand state
    │
    ├── utils/
    │   ├── colors.js         # ألوان NOVA
    │   └── dateUtils.js      # أدوات التاريخ
    │
    └── styles/
        └── glassmorphism.css # تنسيقات iOS
```

---

## 🎯 الواجهات (7)

| # | الواجهة | الوظيفة |
|---|---|---|
| 1 | **Splash** | شاشة ترحيب مع زر "ابدأ" |
| 2 | **Dashboard** | داشبورد + 4 رسوم بيانية + إحصائيات |
| 3 | **العيادة** | المرضى (CRUD + بحث + فلترة) |
| 4 | **العلاج** | 3 خطوات ذكية: مريض → خطة → تنفيذ |
| 5 | **الحجوزات** | تقويم يومي + فلترة بالحالة |
| 6 | **المخزن** | CRUD + تنبيهات الكمية المنخفضة |
| 7 | **الأرشيف** | تاريخ كامل لكل مريض |

---

## 🧪 سيناريو اختبار كامل

1. **من العيادة:** أضف مريض (اسم: "تجريبي"، عمر: 30)
2. **افتح المخطط:** حدد سن #16 → اختر "تسوس"
3. **حدد سن #26:** اختر "علاج عصب" على "كلاهما"
4. **ارجع للعيادة:** افتح نفس المريض → راح تشوف 2 أسنان ملونة
5. **روح العلاج:** اختر نفس المريض
6. **راح تشوف 2 خطط مقترحة تلقائياً** ✨
7. **اختر خطة، عدّل الخطوات، اكتب التشخيص، حدد الموعد**
8. **اضغط "حفظ العلاج"**
9. **روح المخزن:** راح تشوف المواد نقصت تلقائياً!
10. **روح الأرشيف:** راح تشوف العلاج محفوظ مع كل التفاصيل

---

## 🛠️ التقنيات

- **React 18** + **Vite** (الواجهة)
- **Tailwind CSS** (التصميم)
- **Framer Motion** (الحركات)
- **Recharts** (الرسوم البيانية)
- **Zustand** (إدارة الحالة)
- **Lucide Icons** (الأيقونات)
- **localStorage** (التخزين المحلي)

---

## 📦 للنشر على المنصات

### GitHub Codespaces (الأسهل):
```bash
git init
git add .
git commit -m "NOVA Dental System"
git remote add origin https://github.com/YOUR_USERNAME/nova-dental.git
git push -u origin main
```
ثم افتح بـ Codespaces.

### Electron (تطبيق ديسكتوب):
```bash
npm install --save-dev electron electron-builder
```
ثم أضف `electron-builder.yml` وابنِ.

### PWA (موبايل):
أضف `manifest.json` و Service Worker.

---

## 📊 الإحصائيات

- **24 ملف** كود
- **~4,900 سطر** كود نظيف
- **7 واجهات** كاملة
- **7 مكونات** مشتركة
- **12 مرض** افتراضي
- **12 خطة** علاجية
- **15 مادة** في المخزن
- **6 مرضى** تجريبيين

---

## 📜 الترخيص

© 2026 NOVA. جميع الحقوق محفوظة.

---

**صُمم بألوان NOVA** · 🔵 زرقاوي `#edf2f3` · 🟢 ليموني `#8cea23`

> **"ببساطة، احترافية، ذكية"** — NOVA 🦷
