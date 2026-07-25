// صفحة الأرشيف - تاريخ المريض الكامل (الزيارات، العلاجات، الخطط)
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Archive as ArchiveIcon, FileText, Calendar, User, 
  Clock, CheckCircle, AlertCircle, XCircle, Activity, ChevronRight, Filter
} from 'lucide-react';
import { useDataStore } from '../store/useDataStore.js';
import GlassCard from '../components/GlassCard.jsx';
import Button from '../components/Button.jsx';
import { Select } from '../components/Input.jsx';

const Archive = () => {
  const { patients, treatments, visitsLog, toothRecords, treatmentPlans } = useDataStore();
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [filterType, setFilterType] = useState('all');

  // إحصائيات عامة
  const totalVisits = treatments.length;
  const completedTreatments = treatments.filter(t => t.status === 'completed').length;
  const inProgressTreatments = treatments.filter(t => t.status === 'in_progress').length;
  const pendingTreatments = treatments.filter(t => t.status === 'pending').length;

  if (selectedPatientId) {
    return <PatientArchive patientId={selectedPatientId} onBack={() => setSelectedPatientId(null)} />;
  }

  return (
    <div className="relative min-h-screen p-6">
      <div className="smoke-bg" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* العنوان */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <GlassCard variant="strong" className="!p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                <ArchiveIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-nova-deep">الأرشيف</h1>
                <p className="text-nova-deep/60 text-sm">
                  تاريخ الزيارات والعلاجات لكل المرضى
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* إحصائيات */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatCard icon={FileText} label="إجمالي الزيارات" value={totalVisits} color="from-blue-400 to-blue-600" />
          <StatCard icon={CheckCircle} label="علاجات مكتملة" value={completedTreatments} color="from-emerald-400 to-emerald-600" />
          <StatCard icon={Activity} label="قيد العلاج" value={inProgressTreatments} color="from-orange-400 to-orange-600" />
          <StatCard icon={Clock} label="في الانتظار" value={pendingTreatments} color="from-purple-400 to-purple-600" />
        </div>

        {/* قائمة المرضى */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <GlassCard className="!p-5">
            <h2 className="font-bold text-nova-deep mb-4">اختر مريض لعرض أرشيفه</h2>
            
            {patients.length === 0 ? (
              <div className="text-center py-8 text-nova-deep/50">
                <User className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>لا يوجد مرضى. أضف مريض من العيادة أولاً.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {patients.map((patient, i) => {
                  const patientTreatments = treatments.filter(t => t.patient_id === patient.id);
                  const patientRecords = toothRecords.filter(r => r.patient_id === patient.id);
                  const lastVisit = patientTreatments
                    .sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date))[0];
                  
                  return (
                    <motion.button
                      key={patient.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      whileHover={{ x: -3 }}
                      onClick={() => setSelectedPatientId(patient.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/30 border border-white/40 hover:bg-white/50 transition text-right"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nova-lime to-nova-lime-dark flex items-center justify-center shadow-md flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-nova-deep">{patient.full_name}</h3>
                        <p className="text-xs text-nova-deep/60">
                          {patientTreatments.length} علاج · {patientRecords.length} سن مصاب
                        </p>
                      </div>

                      {lastVisit && (
                        <div className="text-left text-xs text-nova-deep/60 hidden md:block">
                          <p>آخر زيارة</p>
                          <p className="font-semibold text-nova-deep/80">
                            {new Date(lastVisit.visit_date).toLocaleDateString('ar-IQ')}
                          </p>
                        </div>
                      )}

                      <ChevronRight className="w-5 h-5 text-nova-deep/40" />
                    </motion.button>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

// ====== أرشيف مريض واحد ======
const PatientArchive = ({ patientId, onBack }) => {
  const { patients, treatments, visitsLog, toothRecords, treatmentPlans, diseases } = useDataStore();
  const [filterType, setFilterType] = useState('all');

  const patient = patients.find(p => p.id === patientId);
  if (!patient) return null;

  // سجلات المريض
  const patientTreatments = treatments
    .filter(t => t.patient_id === patientId)
    .sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date));

  const patientVisits = visitsLog
    .filter(v => v.patient_id === patientId)
    .sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date));

  // كل السجلات مجمعة ومرتبة
  const allRecords = [
    ...patientTreatments.map(t => ({ ...t, type: 'treatment' })),
    ...patientVisits.map(v => ({ ...v, type: 'visit' })),
  ].sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date));

  const filteredRecords = allRecords.filter(r => filterType === 'all' || r.type === filterType);

  return (
    <div className="relative min-h-screen p-6">
      <div className="smoke-bg" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* العنوان */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <GlassCard variant="strong" className="!p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Button size="sm" variant="glass" onClick={onBack}>
                  → رجوع
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-nova-deep">{patient.full_name}</h1>
                  <p className="text-sm text-nova-deep/60">
                    أرشيف الزيارات والعلاجات
                  </p>
                </div>
              </div>
              <div className="text-sm text-nova-deep/60">
                {patientTreatments.length} علاج · {patientVisits.length} زيارة
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* فلتر */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-4"
        >
          <GlassCard className="!p-3">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-nova-deep/60" />
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                options={[
                  { value: 'all', label: 'كل السجلات' },
                  { value: 'treatment', label: 'العلاجات' },
                  { value: 'visit', label: 'الزيارات' },
                ]}
                className="!w-48"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* السجلات */}
        {filteredRecords.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassCard className="!p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-nova-deep/20" />
              <h3 className="text-lg font-bold text-nova-deep mb-2">لا توجد سجلات</h3>
              <p className="text-nova-deep/60">
                ابدأ بتسجيل علاج أو زيارة من صفحة العلاج
              </p>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((record, i) => (
              <ArchiveRecordCard 
                key={`${record.type}-${record.id}`} 
                record={record} 
                diseases={diseases}
                treatmentPlans={treatmentPlans}
                delay={i * 0.04}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ====== بطاقة سجل واحد ======
const ArchiveRecordCard = ({ record, diseases, treatmentPlans, delay }) => {
  const isTreatment = record.type === 'treatment';
  const statusConfig = {
    completed: { label: 'مكتمل', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
    in_progress: { label: 'قيد العلاج', color: 'bg-orange-100 text-orange-700', icon: Activity },
    pending: { label: 'في الانتظار', color: 'bg-blue-100 text-blue-700', icon: Clock },
    cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-700', icon: XCircle },
  };
  
  const status = statusConfig[record.status] || statusConfig.completed;
  const StatusIcon = status.icon;

  // الخطة العلاجية
  const plan = record.plan_id ? treatmentPlans.find(p => p.id === record.plan_id) : null;
  
  // المرض
  const disease = plan ? diseases.find(d => d.id === plan.disease_id) : null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <GlassCard className="!p-4">
        <div className="flex items-start gap-3">
          {/* أيقونة */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isTreatment 
              ? 'bg-gradient-to-br from-nova-lime to-nova-lime-dark' 
              : 'bg-gradient-to-br from-blue-400 to-blue-600'
          }`}>
            {isTreatment ? <Activity className="w-5 h-5 text-white" /> : <Calendar className="w-5 h-5 text-white" />}
          </div>

          {/* المحتوى */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-nova-deep">
                {plan?.name || (isTreatment ? 'علاج' : 'زيارة')}
              </h3>
              {isTreatment && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${status.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>
              )}
            </div>

            {/* التاريخ */}
            <p className="text-xs text-nova-deep/60 mb-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(record.visit_date).toLocaleDateString('ar-IQ', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>

            {/* التشخيص */}
            {record.diagnosis && (
              <div className="mb-2">
                <p className="text-xs font-semibold text-nova-deep/60 mb-1">التشخيص:</p>
                <p className="text-sm text-nova-deep/80">{record.diagnosis}</p>
              </div>
            )}

            {/* الوصفة */}
            {record.prescription && typeof record.prescription === 'string' && (
              <div className="mb-2">
                <p className="text-xs font-semibold text-nova-deep/60 mb-1">الوصفة:</p>
                <p className="text-sm text-nova-deep/80 whitespace-pre-line">{record.prescription}</p>
              </div>
            )}

            {/* الخطة العلاجية - الخطوات */}
            {plan && plan.steps && (
              <div className="mb-2">
                <p className="text-xs font-semibold text-nova-deep/60 mb-1">خطوات الخطة:</p>
                <ol className="text-sm text-nova-deep/80 space-y-0.5">
                  {plan.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-nova-lime-dark font-bold">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* الملخص */}
            {record.summary && (
              <div className="mb-2">
                <p className="text-xs font-semibold text-nova-deep/60 mb-1">ملخص:</p>
                <p className="text-sm text-nova-deep/80">{record.summary}</p>
              </div>
            )}

            {/* الموعد القادم */}
            {record.next_visit_date && (
              <div className="mt-2 pt-2 border-t border-nova-deep/10">
                <p className="text-xs text-nova-deep/60 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  الموعد القادم: <span className="font-semibold text-nova-deep">{record.next_visit_date}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

// ====== بطاقة إحصائية ======
const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div whileHover={{ y: -3 }}>
    <GlassCard className="!p-3">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs text-nova-deep/60">{label}</p>
          <p className="text-2xl font-bold text-nova-deep">{value}</p>
        </div>
      </div>
    </GlassCard>
  </motion.div>
);

export default Archive;
