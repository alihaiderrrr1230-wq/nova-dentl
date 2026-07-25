# 📦 الحزمة 2: شاشة Splash + Dashboard + قاعدة البيانات

## 🎉 بعد هذه الحزمة، التطبيق يشتغل!

---

## 📁 الملفات المضافة في الحزمة 2:

```
nova-dental/
├── 📂 src/renderer/
│   ├── main.jsx                    ✅ نقطة دخول React
│   ├── App.jsx                     ✅ يدير الواجهات
│   │
│   ├── 📂 pages/
│   │   ├── Splash.jsx              ✅ شاشة الترحيب
│   │   └── Dashboard.jsx           ✅ الداشبورد
│   │
│   ├── 📂 components/
│   │   ├── GlassCard.jsx           ✅ البطاقة الزجاجية
│   │   └── Button.jsx              ✅ الزر
│   │
│   ├── 📂 store/
│   │   └── useDataStore.js         ✅ إدارة الحالة (Zustand)
│   │
│   └── 📂 features/ToothChart/
│       └── teeth-data.js           ✅ بيانات الأسنان (للحزم اللاحقة)
│
└── 📂 data/
    └── seed.js                     ✅ البيانات الافتراضية
```

---

## 🚀 خطوات التثبيت:

### الخطوة 1: انسخ الملفات

| الملف | المسار |
|---|---|
| `main.jsx` | `/nova-dental/src/renderer/main.jsx` |
| `App.jsx` | `/nova-dental/src/renderer/App.jsx` |
| `Splash.jsx` | `/nova-dental/src/renderer/pages/Splash.jsx` |
| `Dashboard.jsx` | `/nova-dental/src/renderer/pages/Dashboard.jsx` |
| `GlassCard.jsx` | `/nova-dental/src/renderer/components/GlassCard.jsx` |
| `Button.jsx` | `/nova-dental/src/renderer/components/Button.jsx` |
| `useDataStore.js` | `/nova-dental/src/renderer/store/useDataStore.js` |
| `teeth-data.js` | `/nova-dental/src/renderer/features/ToothChart/teeth-data.js` |
| `seed.js` | `/nova-dental/data/seed.js` |

### الخطوة 2: أنشئ المجلدات إن لم تكن موجودة
```bash
mkdir -p src/renderer/components
mkdir -p src/renderer/pages
mkdir -p src/renderer/store
mkdir -p src/renderer/features/ToothChart
```

### الخطوة 3: شغّل التطبيق!
```bash
npm run dev:renderer
```

أو شغّل بـ:
```bash
npm run dev
```
(الـ Electron ما يشتغل بدون تنصيبه، استخدم dev:renderer للتجربة السريعة)

---

## ✅ شو تشوف بعد التشغيل:

1. **شاشة Splash** — لوغو NOVA + رسمة سن + زر "ابدأ" كبير
2. **اضغط ابدأ** → تنتقل للداشبورد
3. **الداشبورد** فيه:
   - شريط معلومات الدكتور (اسمك + تاريخ هجري/ميلادي)
   - 4 بطاقات إحصائية (مرضى، حجوزات، علاجات، مواد)
   - 4 مربعات بيانية (ذروة يومية، ذروة أسبوعية، أرباح، تنبيهات المخزن)
   - أزرار انتقال سريع (الحزم اللاحقة راح تشتغل)

---

## 🔗 كيف الحزم اللاحقة راح تربط:

- **الحزمة 3** راح تستورد `teeth-data.js` (موجود ✅) لبناء المخطط
- **الحزمة 4** راح تستخدم `useDataStore` (موجود ✅) للمرضى/الحجوزات/المخزن
- **الحزمة 5** راح تستخدم كل اللي سبق + خطط العلاج

**كل حزمة تضيف فوق اللي قبلها — ما تحذف شي** ✅

---

## ⚠️ ملاحظات مهمة:

1. **البيانات تنحفظ في localStorage تلقائياً** (بفضل Zustand persist)
2. **لو تبي تمسح كل البيانات**: افتح Console واكتب:
   ```javascript
   localStorage.removeItem('nova-dental-storage');
   location.reload();
   ```
3. **الرسوم البيانية حالياً بيانات وهمية** — راح تتربط بالبيانات الحقيقية في الحزم اللاحقة
4. **التنبيهات** في الداشبورد تشتغل من البيانات الافتراضية (15 مادة)

---

## 🎯 الخطوة التالية:

الحزمة 3 — **مخطط الأسنان التفاعلي** (الأهم!) 🦷

**قول "الحزمة 3" وأرسلها لك!** 🚀
