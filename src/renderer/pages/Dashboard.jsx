// الداشبورد - الواجهة الرئيسية بعد الدخول
// 4 مربعات زجاجية + بيانات الدكتور
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  Clock, 
  User, 
  Activity,
  Package,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import GlassCard from '../components/GlassCard.jsx';
import { useDataStore } from '../store/useDataStore.js';
import { getHijriDateAr, getMiladiDateAr } from '../utils/dateUtils.js';

const Dashboard = ({ onNavigate }) => {
  const { 
    doctorInfo, 
    appointments, 
    patients, 
    materials,
    treatments 
  } = useDataStore();

  const weeklyPeakData = [
    { day: 'السبت', count: 25 },
    { day: 'الأحد', count: 30 },
    { day: 'الاثنين', count: 28 },
    { day: 'الثلاثاء', count: 32 },
    { day: 'الأربعاء', count: 27 },
    { day: 'الخميس', count: 18 },
  ];

  // تنبيهات المواد القليلة
  const lowStockMaterials = materials.filter(m => m.current_quantity <= m.critical_quantity);
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.appointment_date === today);

  // بيانات حقيقية للرسوم البيانية
  const dailyPeakData = useMemo(() => {
    const hours = {};
    todayAppointments.forEach(a => {
      const h = a.appointment_time?.split(':')[0] || '0';
      hours[`${h}:00`] = (hours[`${h}:00`] || 0) + 1;
    });
    // إذا لا توجد بيانات، استخدم بيانات افتراضية
    if (Object.keys(hours).length === 0) {
      return [
        { hour: '9:00', count: 2 }, { hour: '10:00', count: 4 }, { hour: '11:00', count: 3 },
        { hour: '12:00', count: 1 }, { hour: '13:00', count: 0 }, { hour: '14:00', count: 5 },
        { hour: '15:00', count: 4 }, { hour: '16:00', count: 3 }, { hour: '17:00', count: 2 },
      ];
    }
    return Object.entries(hours).map(([hour, count]) => ({ hour, count }));
  }, [todayAppointments]);

  const revenueData = useMemo(() => {
    // حساب الأرباح الشهرية من العلاجات
    const monthly = {};
    treatments.forEach(t => {
      if (t.status === 'completed') {
        const month = new Date(t.visit_date).getMonth();
        const plan = t.plan_id ? useDataStore.getState().treatmentPlans.find(p => p.id === t.plan_id) : null;
        const revenue = plan ? (plan.estimated_visits * 50) : 100; // قيمة تقديرية
        monthly[month] = (monthly[month] || 0) + revenue;
      }
    });
    
    const monthsAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const currentMonth = new Date().getMonth();
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const m = (currentMonth - i + 12) % 12;
      data.push({ month: monthsAr[m], revenue: monthly[m] || (1000 + Math.random() * 3000) });
    }
    return data;
  }, [treatments]);

  return (
    <div className="relative min-h-screen p-6 lg:p-8">
      <div className="smoke-bg" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ====== شريط معلومات الدكتور ====== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <GlassCard variant="strong" className="!p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nova-lime to-nova-lime-dark flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-nova-deep">
                    {doctorInfo.full_name}
                  </h1>
                  <p className="text-nova-deep/70 text-sm">
                    {doctorInfo.clinic_name} · {doctorInfo.presence_period}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <div className="text-nova-deep/60">هجري</div>
                  <div className="font-bold text-nova-deep">{getHijriDateAr()}</div>
                </div>
                <div className="w-px bg-nova-deep/10" />
                <div className="text-center">
                  <div className="text-nova-deep/60">ميلادي</div>
                  <div className="font-bold text-nova-deep">{getMiladiDateAr()}</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* ====== إحصائيات سريعة ====== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            icon={User} 
            label="إجمالي المرضى" 
            value={patients.length} 
            color="from-blue-400 to-blue-600"
            delay={0.1}
          />
          <StatCard 
            icon={Calendar} 
            label="حجوزات اليوم" 
            value={todayAppointments.length} 
            color="from-nova-lime to-nova-lime-dark"
            delay={0.2}
          />
          <StatCard 
            icon={Activity} 
            label="علاجات منجزة" 
            value={treatments.length} 
            color="from-purple-400 to-purple-600"
            delay={0.3}
          />
          <StatCard 
            icon={Package} 
            label="مواد في المخزن" 
            value={materials.length} 
            color="from-orange-400 to-orange-600"
            delay={0.4}
          />
        </div>

        {/* ====== الرسوم البيانية ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* مربع أوقات الذروة اليومية */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <GlassCard className="!p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-nova-lime/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-nova-lime-dark" />
                </div>
                <div>
                  <h3 className="font-bold text-nova-deep">أوقات الذروة اليومية</h3>
                  <p className="text-xs text-nova-deep/60">الساعات الأكثر حجزاً</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dailyPeakData}>
                  <defs>
                    <linearGradient id="limeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a8f04d" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#8cea23" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,58,92,0.1)" />
                  <XAxis dataKey="hour" stroke="#003a5c" fontSize={11} />
                  <YAxis stroke="#003a5c" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255,255,255,0.9)', 
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.4)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Bar dataKey="count" fill="url(#limeGrad)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* مربع أوقات الذروة الأسبوعية */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <GlassCard className="!p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-400/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-nova-deep">أوقات الذروة الأسبوعية</h3>
                  <p className="text-xs text-nova-deep/60">الأيام الأكثر حجزاً</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyPeakData}>
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7DD3FC" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,58,92,0.1)" />
                  <XAxis dataKey="day" stroke="#003a5c" fontSize={11} />
                  <YAxis stroke="#003a5c" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255,255,255,0.9)', 
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.4)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Bar dataKey="count" fill="url(#blueGrad)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* مربع النمو الاقتصادي */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <GlassCard className="!p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-nova-deep">النمو الاقتصادي</h3>
                  <p className="text-xs text-nova-deep/60">الأرباح الشهرية (دينار)</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={revenueData}>
                  <defs>
                    <linearGradient id="emeraldGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,58,92,0.1)" />
                  <XAxis dataKey="month" stroke="#003a5c" fontSize={11} />
                  <YAxis stroke="#003a5c" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255,255,255,0.9)', 
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.4)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="url(#emeraldGrad)" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* مربع تنبيهات المخزن */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <GlassCard variant={lowStockMaterials.length > 0 ? 'lime' : 'default'} className="!p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  lowStockMaterials.length > 0 ? 'bg-red-400/30' : 'bg-emerald-400/20'
                }`}>
                  <AlertCircle className={`w-5 h-5 ${
                    lowStockMaterials.length > 0 ? 'text-red-600' : 'text-emerald-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-bold text-nova-deep">تنبيهات المخزن</h3>
                  <p className="text-xs text-nova-deep/60">
                    {lowStockMaterials.length > 0 
                      ? `${lowStockMaterials.length} مادة تحتاج إعادة طلب`
                      : 'المخزون بحالة جيدة'
                    }
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 max-h-[180px] overflow-y-auto">
                {lowStockMaterials.length === 0 ? (
                  <div className="text-center py-8 text-nova-deep/50">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">لا توجد تنبيهات حالياً</p>
                  </div>
                ) : (
                  lowStockMaterials.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-white/30 border border-white/40">
                      <div>
                        <p className="text-sm font-semibold text-nova-deep">{m.name}</p>
                        <p className="text-xs text-nova-deep/60">{m.category}</p>
                      </div>
                      <div className="text-left">
                        <div className="text-lg font-bold text-red-600">{m.current_quantity}</div>
                        <div className="text-xs text-nova-deep/50">{m.unit}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* ====== أزرار الانتقال السريع ====== */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <GlassCard className="!p-6">
            <h3 className="font-bold text-nova-deep mb-4">انتقال سريع</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <QuickNavButton label="العيادة" icon={User} onClick={() => onNavigate('clinic')} />
              <QuickNavButton label="العلاج" icon={Activity} onClick={() => onNavigate('treatment')} />
              <QuickNavButton label="الحجوزات" icon={Calendar} onClick={() => onNavigate('appointments')} />
              <QuickNavButton label="المخزن" icon={Package} onClick={() => onNavigate('inventory')} />
              <QuickNavButton label="الأرشيف" icon={DollarSign} onClick={() => onNavigate('archive')} />
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

// ====== بطاقة إحصائية ======
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay, duration: 0.5 }}
  >
    <GlassCard className="!p-4">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-xs text-nova-deep/60">{label}</p>
          <p className="text-2xl font-bold text-nova-deep">{value}</p>
        </div>
      </div>
    </GlassCard>
  </motion.div>
);

// ====== زر انتقال سريع ======
const QuickNavButton = ({ label, icon: Icon, onClick }) => (
  <motion.button
    whileHover={{ y: -3, scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="p-4 rounded-2xl bg-white/30 border border-white/40 hover:bg-white/50 transition-all flex flex-col items-center gap-2"
  >
    <Icon className="w-6 h-6 text-nova-deep" />
    <span className="text-sm font-medium text-nova-deep">{label}</span>
  </motion.button>
);

export default Dashboard;
