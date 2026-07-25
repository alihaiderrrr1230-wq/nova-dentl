// البيانات الافتراضية — أمراض، خطط، مواد، مرضى، حجوزات
// تُستخدم في الحزم اللاحقة كمصدر أولي للبيانات

export const DISEASES = [
  { id: 1, name_ar: 'تسوس', name_en: 'Dental Caries', color: '#FF6B6B', description: 'تلف في بنية السن بسبب الأحماض الناتجة من البكتيريا' },
  { id: 2, name_ar: 'علاج عصب', name_en: 'Root Canal Treatment', color: '#4ECDC4', description: 'إزالة لب السن الملتهب أو المصاب وتنظيف القنوات' },
  { id: 3, name_ar: 'خلع', name_en: 'Tooth Extraction', color: '#95A5A6', description: 'إزالة السن بالكامل بسبب تلف لا يمكن إصلاحه' },
  { id: 4, name_ar: 'تاج صناعي', name_en: 'Dental Crown', color: '#FFD93D', description: 'غطاء يوضع فوق السن المتضرر لاستعادة شكله ووظيفته' },
  { id: 5, name_ar: 'تقويم', name_en: 'Orthodontics', color: '#6BCB77', description: 'تصحيح اصطفاف الأسنان باستخدام أجهزة ثابتة أو متحركة' },
  { id: 6, name_ar: 'تبييض', name_en: 'Teeth Whitening', color: '#F8F0FB', description: 'تفتيح لون الأسنان باستخدام مواد كيميائية آمنة' },
  { id: 7, name_ar: 'حشوة عادية', name_en: 'Dental Filling', color: '#A8DADC', description: 'ملء الفراغ الناتج عن التسوس بمادة مناسبة' },
  { id: 8, name_ar: 'التهاب لثة', name_en: 'Gingivitis', color: '#E63946', description: 'التهاب في أنسجة اللثة بسبب تراكم البلاك' },
  { id: 9, name_ar: 'كسر في السن', name_en: 'Tooth Fracture', color: '#F4A261', description: 'شرخ أو كسر في تاج السن أو جذره' },
  { id: 10, name_ar: 'خراج', name_en: 'Dental Abscess', color: '#9D0208', description: 'تجمع صديد بسبب عدوى بكتيرية في السن أو اللثة' },
  { id: 11, name_ar: 'تنظيف جير', name_en: 'Scaling and Polishing', color: '#B4E1FF', description: 'إزالة الترسبات الجيرية والبلاك من الأسنان' },
  { id: 12, name_ar: 'زراعة سن', name_en: 'Dental Implant', color: '#C9B1FF', description: 'زرع جذر صناعي من التيتانيوم لتعويض سن مفقود' },
];

export const TREATMENT_PLANS = [
  {
    id: 1, name: 'علاج تسوس بسيط', disease_id: 1,
    steps: ['تخدير موضعي', 'إزالة التسوس بالمبارد', 'وضع الحشوة', 'تشكيل الحشوة وتلميعها'],
    materials: [{ material_id: 1, quantity: 1, unit: 'أنبوب' }, { material_id: 3, quantity: 1, unit: 'قطعة' }],
    estimated_visits: 1, estimated_duration_days: 1, is_template: true,
  },
  {
    id: 2, name: 'علاج عصب كامل', disease_id: 2,
    steps: ['تخدير موضعي', 'فتح السن وإزالة اللب', 'تنظيف القنوات الجذرية', 'حشو القنوات', 'وضع حشوة مؤقتة', 'وضع التاج النهائي'],
    materials: [{ material_id: 1, quantity: 2, unit: 'أنبوب' }, { material_id: 4, quantity: 1, unit: 'علبة' }],
    estimated_visits: 2, estimated_duration_days: 14, is_template: true,
  },
  {
    id: 3, name: 'خلع بسيط', disease_id: 3,
    steps: ['تخدير موضعي', 'فك السن بالكلامب', 'إزالة السن', 'وضع شاش لوقف النزيف', 'إعطاء تعليمات ما بعد الخلع'],
    materials: [{ material_id: 1, quantity: 1, unit: 'أنبوب' }, { material_id: 5, quantity: 2, unit: 'قطعة' }],
    estimated_visits: 1, estimated_duration_days: 7, is_template: true,
  },
  {
    id: 4, name: 'تركيب تاج خزفي', disease_id: 4,
    steps: ['تخدير موضعي', 'برد السن', 'أخذ طبعة', 'تركيب تاج مؤقت', 'تركيب التاج النهائي'],
    materials: [{ material_id: 1, quantity: 1, unit: 'أنبوب' }, { material_id: 10, quantity: 1, unit: 'قطعة' }],
    estimated_visits: 2, estimated_duration_days: 10, is_template: true,
  },
  {
    id: 5, name: 'تقويم ثابت للفكين', disease_id: 5,
    steps: ['فحص شامل وأشعة', 'تركيب البريسز', 'تركيب الأسلاك', 'متابعة دورية', 'إزالة التقويم', 'تركيب مثبت'],
    materials: [{ material_id: 7, quantity: 1, unit: 'علبة' }, { material_id: 8, quantity: 1, unit: 'علبة' }],
    estimated_visits: 12, estimated_duration_days: 540, is_template: true,
  },
  {
    id: 6, name: 'تبييض احترافي', disease_id: 6,
    steps: ['تنظيف الأسنان', 'حماية اللثة', 'وضع مادة التبييض', 'تنشيط بالضوء', 'شطف الأسنان'],
    materials: [{ material_id: 9, quantity: 1, unit: 'علبة' }],
    estimated_visits: 1, estimated_duration_days: 1, is_template: true,
  },
  {
    id: 7, name: 'حشوة كومبوزت', disease_id: 7,
    steps: ['تخدير موضعي', 'إزالة التسوس', 'تحضير السن', 'وضع الحشوة على طبقات', 'تصلب بالضوء', 'تشكيل وتلميع'],
    materials: [{ material_id: 1, quantity: 1, unit: 'أنبوب' }, { material_id: 3, quantity: 1, unit: 'قطعة' }],
    estimated_visits: 1, estimated_duration_days: 1, is_template: true,
  },
  {
    id: 8, name: 'علاج التهاب اللثة', disease_id: 8,
    steps: ['فحص اللثة', 'تنظيف الجير', 'إعطاء غسول فم طبي', 'تعليمات العناية المنزلية', 'متابعة بعد أسبوعين'],
    materials: [{ material_id: 14, quantity: 1, unit: 'علبة' }],
    estimated_visits: 2, estimated_duration_days: 14, is_template: true,
  },
  {
    id: 9, name: 'إصلاح كسر تاج', disease_id: 9,
    steps: ['فحص السن وأشعة', 'تخدير موضعي', 'إصلاح الكسر بمادة مؤقتة', 'تركيب تاج إذا لزم'],
    materials: [{ material_id: 1, quantity: 1, unit: 'أنبوب' }, { material_id: 10, quantity: 1, unit: 'قطعة' }],
    estimated_visits: 2, estimated_duration_days: 10, is_template: true,
  },
  {
    id: 10, name: 'علاج الخراج', disease_id: 10,
    steps: ['تخدير موضعي', 'تصريف الخراج', 'غسل المنطقة بمحلول معقم', 'وصف مضاد حيوي ومسكن', 'علاج السبب'],
    materials: [{ material_id: 1, quantity: 1, unit: 'أنبوب' }, { material_id: 12, quantity: 1, unit: 'علبة' }, { material_id: 13, quantity: 1, unit: 'علبة' }],
    estimated_visits: 2, estimated_duration_days: 7, is_template: true,
  },
  {
    id: 11, name: 'تنظيف كامل', disease_id: 11,
    steps: ['فحص شامل', 'إزالة الجير بأدوات الموجات', 'تنظيف يدوي', 'تلميع بمعجون خاص', 'وضع فلورايد'],
    materials: [{ material_id: 11, quantity: 1, unit: 'قطعة' }],
    estimated_visits: 1, estimated_duration_days: 1, is_template: true,
  },
  {
    id: 12, name: 'زراعة سن كامل', disease_id: 12,
    steps: ['فحص وأشعة', 'زرع الجذر الصناعي', 'فترة الاندماج', 'تركيب الدعامة', 'تركيب التاج النهائي'],
    materials: [{ material_id: 1, quantity: 2, unit: 'أنبوب' }, { material_id: 10, quantity: 1, unit: 'قطعة' }],
    estimated_visits: 4, estimated_duration_days: 180, is_template: true,
  },
];

export const MATERIALS = [
  { id: 1, name: 'مخدر موضعي (Lidocaine 2%)', category: 'تخدير', current_quantity: 25, critical_quantity: 5, unit: 'أنبوب', purchase_date: '2026-06-01', expiry_date: '2027-06-01', supplier: 'شركة الأدوية المتحدة', unit_price: 5.5 },
  { id: 2, name: 'إبر حقن (27G)', category: 'تخدير', current_quantity: 50, critical_quantity: 10, unit: 'قطعة', purchase_date: '2026-06-01', expiry_date: '2028-06-01', supplier: 'شركة الأدوات الطبية', unit_price: 0.25 },
  { id: 3, name: 'حشوة كومبوزت', category: 'حشوات', current_quantity: 15, critical_quantity: 3, unit: 'حقنة', purchase_date: '2026-05-15', expiry_date: '2027-05-15', supplier: '3M ESPE', unit_price: 35.0 },
  { id: 4, name: 'مادة حشو عصب (Gutta-Percha)', category: 'علاج عصب', current_quantity: 8, critical_quantity: 2, unit: 'علبة', purchase_date: '2026-04-20', expiry_date: '2028-04-20', supplier: 'Dentsply', unit_price: 45.0 },
  { id: 5, name: 'قفازات طبية (Nitrile)', category: 'مستلزمات', current_quantity: 100, critical_quantity: 20, unit: 'قطعة', purchase_date: '2026-07-01', expiry_date: '2028-07-01', supplier: 'شركة السلام', unit_price: 0.3 },
  { id: 6, name: 'كمامات طبية', category: 'مستلزمات', current_quantity: 80, critical_quantity: 15, unit: 'قطعة', purchase_date: '2026-07-01', expiry_date: '2028-07-01', supplier: 'شركة السلام', unit_price: 0.15 },
  { id: 7, name: 'بريسز تقويم معدنية', category: 'تقويم', current_quantity: 30, critical_quantity: 5, unit: 'علبة', purchase_date: '2026-03-10', expiry_date: null, supplier: 'Ormco', unit_price: 120.0 },
  { id: 8, name: 'أسلاك تقويم (Archwire)', category: 'تقويم', current_quantity: 20, critical_quantity: 4, unit: 'علبة', purchase_date: '2026-03-10', expiry_date: null, supplier: 'Ormco', unit_price: 25.0 },
  { id: 9, name: 'مادة تبييض (Hydrogen Peroxide 35%)', category: 'تبييض', current_quantity: 6, critical_quantity: 2, unit: 'علبة', purchase_date: '2026-05-01', expiry_date: '2026-12-01', supplier: 'Opalescence', unit_price: 85.0 },
  { id: 10, name: 'تيجان خزفية (Porcelain Crown)', category: 'تيجان', current_quantity: 12, critical_quantity: 3, unit: 'قطعة', purchase_date: '2026-04-15', expiry_date: null, supplier: 'Ivoclar Vivadent', unit_price: 150.0 },
  { id: 11, name: 'فرشاة تلميع (Polishing Brush)', category: 'تنظيف', current_quantity: 25, critical_quantity: 5, unit: 'قطعة', purchase_date: '2026-05-20', expiry_date: null, supplier: 'شركة الأدوات', unit_price: 3.0 },
  { id: 12, name: 'مضاد حيوي (Amoxicillin 500mg)', category: 'أدوية', current_quantity: 40, critical_quantity: 10, unit: 'علبة', purchase_date: '2026-06-15', expiry_date: '2027-06-15', supplier: 'شركة الدواء', unit_price: 8.0 },
  { id: 13, name: 'مسكن ألم (Ibuprofen 400mg)', category: 'أدوية', current_quantity: 50, critical_quantity: 10, unit: 'علبة', purchase_date: '2026-06-15', expiry_date: '2027-06-15', supplier: 'شركة الدواء', unit_price: 5.0 },
  { id: 14, name: 'غسول فم طبي (Chlorhexidine)', category: 'أدوية', current_quantity: 15, critical_quantity: 3, unit: 'علبة', purchase_date: '2026-06-10', expiry_date: '2027-12-10', supplier: 'شركة الدواء', unit_price: 12.0 },
  { id: 15, name: 'محلول تعقيم (Sodium Hypochlorite)', category: 'تعقيم', current_quantity: 10, critical_quantity: 2, unit: 'زجاجة', purchase_date: '2026-05-20', expiry_date: '2027-05-20', supplier: 'شركة الكيمياء', unit_price: 18.0 },
];

export const PATIENTS = [
  { id: 1, full_name: 'أحمد محمد علي', age: 32, phone: '07901234567', region: 'بغداد - الكرادة', gender: 'ذكر', first_visit_date: '2026-01-15', notes: 'حساسية من البنسلين' },
  { id: 2, full_name: 'فاطمة حسين كاظم', age: 28, phone: '07712345678', region: 'بغداد - المنصور', gender: 'أنثى', first_visit_date: '2026-02-20', notes: 'تخاف من الحقن' },
  { id: 3, full_name: 'علي عبدالله الجبوري', age: 45, phone: '07801112233', region: 'الموصل', gender: 'ذكر', first_visit_date: '2026-03-10', notes: 'مريض سكري' },
  { id: 4, full_name: 'مريم سعد البصري', age: 18, phone: '07714445566', region: 'البصرة', gender: 'أنثى', first_visit_date: '2026-05-05', notes: 'تقويم أسنان' },
  { id: 5, full_name: 'يوسف كريم العبيدي', age: 9, phone: '07802223344', region: 'أربيل', gender: 'ذكر', first_visit_date: '2026-06-12', notes: 'مخطط أسنان صغار' },
  { id: 6, full_name: 'زهراء عدنان النجار', age: 55, phone: '07903334455', region: 'النجف', gender: 'أنثى', first_visit_date: '2026-04-18', notes: '' },
];

export const APPOINTMENTS = [
  { id: 1, patient_id: 1, appointment_date: '2026-07-16', appointment_time: '10:00', duration_minutes: 60, status: 'scheduled', notes: 'متابعة علاج عصب' },
  { id: 2, patient_id: 2, appointment_date: '2026-07-16', appointment_time: '11:30', duration_minutes: 30, status: 'scheduled', notes: 'تنظيف' },
  { id: 3, patient_id: 3, appointment_date: '2026-07-17', appointment_time: '09:00', duration_minutes: 45, status: 'scheduled', notes: 'كشف أولي' },
  { id: 4, patient_id: 4, appointment_date: '2026-07-18', appointment_time: '14:00', duration_minutes: 60, status: 'scheduled', notes: 'متابعة تقويم' },
  { id: 5, patient_id: 5, appointment_date: '2026-07-20', appointment_time: '15:30', duration_minutes: 30, status: 'scheduled', notes: 'كشف + تنظيف' },
];

export const DOCTOR_INFO = {
  id: 1,
  full_name: 'د. علي حيدر',
  clinic_name: 'عيادة NOVA للأسنان',
  presence_period: 'السبت - الخميس',
  working_hours: {
    saturday: '09:00 - 17:00',
    sunday: '09:00 - 17:00',
    monday: '09:00 - 17:00',
    tuesday: '09:00 - 17:00',
    wednesday: '09:00 - 17:00',
    thursday: '09:00 - 14:00',
    friday: 'مغلق',
  },
  hijri_date: '21 محرم 1448',
  miladi_date: '16 يوليو 2026',
};
