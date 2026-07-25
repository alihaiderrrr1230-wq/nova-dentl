// صفحة العلاج - أهم صفحة في النظام
// 1. اختيار مريض
// 2. عرض المخطط التفاعلي
// 3. اختيار الخطة العلاجية (اقتراحات تلقائية + قوالب جاهزة)
// 4. تعديل الخطة
// 5. الوصفة الطبية
// 6. خصم المواد من المخزن تلقائياً
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, User, FileText, Pill, Save, Calendar,
  Sparkles, Check, Plus, Trash2, ChevronRight, Search, ArrowRight,
  Edit, X, Printer, Send
} from 'lucide-react';
import { useDataStore } from '../store/useDataStore.js';
import GlassCard from '../components/GlassCard.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import { Input, Textarea, Select } from '../components/Input.jsx';
import ToothChart from '../features/ToothChart/ToothChart.jsx';
import { ADULT_AGE_THRESHOLD } from '../features/ToothChart/teeth-data.js';

const Treatment = () => {
  const { 
    patients, diseases, treatmentPlans, materials, toothRecords, 
    treatments, addTreatment, useMaterial 
  } = useDataStore();
  
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showChart, setShowChart] = useState(false);

  const patient = patients.find(p => p.id === selectedPatientId);

  // الأسنان المصابة للمريض
  const patientDiseases = useMemo(() => {
    if (!selectedPatientId) return [];
    const records = toothRecords.filter(r => r.patient_id === selectedPatientId);
    return [...new Set(records.map(r => r.disease_id).filter(Boolean))];
  }, [toothRecords, selectedPatientId]);

  // الخطط المقترحة (حسب أمراض المريض)
  const suggestedPlans = useMemo(() => {
    return treatmentPlans.filter(p => patientDiseases.includes(p.disease_id));
  }, [treatmentPlans, patientDiseases]);

  // الخطة المختارة
  const selectedPlan = treatmentPlans.find(p => p.id === selectedPlanId);

  // ====== اختيار مريض ======
  if (!selectedPatientId) {
    return <PatientSelector patients={patients} onSelect={setSelectedPatientId} />;
  }

  // ====== الخطوة 2: اختيار المرض والخطة ======
  if (!selectedPlanId) {
    return (
      <PlanSelector
        patient={patient}
        patientDiseases={patientDiseases}
        diseases={diseases}
        treatmentPlans={treatmentPlans}
        suggestedPlans={suggestedPlans}
        onSelectPlan={setSelectedPlanId}
        onSelectDisease={setSelectedDiseaseId}
        onShowChart={() => setShowChart(true)}
        onBack={() => setSelectedPatientId(null)}
        showChart={showChart}
        onCloseChart={() => setShowChart(false)}
      />
    );
  }

  // ====== الخطوة 3: تنفيذ العلاج ======
  return (
    <TreatmentExecution
      patient={patient}
      plan={selectedPlan}
      disease={diseases.find(d => d.id === selectedPlan.disease_id)}
      materials={materials}
      onSave={(data) => {
        // إضافة العلاج
        addTreatment({
          patient_id: patient.id,
          plan_id: selectedPlan.id,
          tooth_record_id: null,
          diagnosis: data.diagnosis,
          prescription: data.prescription,
          next_visit_date: data.next_visit_date,
          status: 'completed',
          notes: data.notes,
        });
        // خصم المواد من المخزن
        if (selectedPlan.materials) {
          selectedPlan.materials.forEach(m => {
            useMaterial(m.material_id, m.quantity);
          });
        }
        alert('✅ تم حفظ العلاج وخصم المواد من المخزن');
        setSelectedPlanId(null);
      }}
      onCancel={() => setSelectedPlanId(null)}
    />
  );
};

// ====== مكون اختيار المريض ======
const PatientSelector = ({ patients, onSelect }) => {
  const [search, setSearch] = useState('');
  const filtered = patients.filter(p => 
    p.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen p-6">
      <div className="smoke-bg" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="mb-6">
          <GlassCard variant="strong" className="!p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-nova-lime to-nova-lime-dark flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-nova-deep">بدء علاج جديد</h1>
                <p className="text-nova-deep/60 text-sm">اختر المريض لبدء جلسة العلاج</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="mb-4">
          <GlassCard className="!p-4">
            <Input
              icon={Search}
              placeholder="ابحث عن مريض..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </GlassCard>
        </motion.div>

        {filtered.length === 0 ? (
          <GlassCard className="!p-12 text-center">
            <User className="w-16 h-16 mx-auto mb-3 text-nova-deep/20" />
            <p className="text-nova-deep/60">لا يوجد مرضى. أضف مريض من العيادة أولاً.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <GlassCard hoverable onClick={() => onSelect(p.id)} className="cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-nova-lime to-nova-lime-dark flex items-center justify-center shadow-md">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-nova-deep truncate">{p.full_name}</h3>
                      <p className="text-xs text-nova-deep/60">{p.age} سنة · {p.gender}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-nova-deep/40" />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ====== مكون اختيار الخطة ======
const PlanSelector = ({ 
  patient, patientDiseases, diseases, treatmentPlans, suggestedPlans,
  onSelectPlan, onSelectDisease, onShowChart, onBack, showChart, onCloseChart
}) => {
  // لو المستخدم فتح المخطط
  if (showChart) {
    return <ToothChart patientId={patient.id} onClose={onCloseChart} />;
  }

  return (
    <div className="relative min-h-screen p-6">
      <div className="smoke-bg" />
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* شريط المريض */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-4">
          <GlassCard variant="strong" className="!p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Button size="sm" variant="glass" onClick={onBack}>→ رجوع</Button>
                <div>
                  <h2 className="text-xl font-bold text-nova-deep">{patient.full_name}</h2>
                  <p className="text-xs text-nova-deep/60">
                    {patient.age} سنة · {patient.gender} · {patientDiseases.length} مرض مكتشف
                  </p>
                </div>
              </div>
              <Button variant="lime" icon={FileText} onClick={onShowChart}>
                فتح المخطط التفاعلي
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        {/* أمراض المريض + الخطط المقترحة */}
        {patientDiseases.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassCard className="!p-12 text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-3 text-nova-deep/20" />
              <h3 className="text-xl font-bold text-nova-deep mb-2">لا توجد أمراض مكتشفة</h3>
              <p className="text-nova-deep/60 mb-4">
                افتح المخطط التفاعلي لتحديد الأمراض على أسنان المريض
              </p>
              <Button variant="primary" icon={FileText} onClick={onShowChart}>
                فتح المخطط
              </Button>
            </GlassCard>
          </motion.div>
        ) : (
          <>
            {/* الأمراض المكتشفة */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="mb-4">
              <GlassCard className="!p-4">
                <h3 className="font-bold text-nova-deep mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-nova-lime-dark" />
                  الأمراض المكتشفة (اقتراحات تلقائية)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {patientDiseases.map(diseaseId => {
                    const disease = diseases.find(d => d.id === diseaseId);
                    if (!disease) return null;
                    return (
                      <div
                        key={diseaseId}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/40 border border-white/50"
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: disease.color }} />
                        <span className="text-sm font-semibold text-nova-deep">{disease.name_ar}</span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>

            {/* الخطط المقترحة */}
            {suggestedPlans.length > 0 && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mb-4">
                <GlassCard variant="lime" className="!p-4">
                  <h3 className="font-bold text-nova-deep mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-nova-lime-dark" />
                    خطط مقترحة (بناءً على الأمراض)
                  </h3>
                  <div className="space-y-2">
                    {suggestedPlans.map(plan => {
                      const disease = diseases.find(d => d.id === plan.disease_id);
                      return (
                        <PlanCard
                          key={plan.id}
                          plan={plan}
                          disease={disease}
                          materials={[]}
                          onClick={() => onSelectPlan(plan.id)}
                          suggested
                        />
                      );
                    })}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* كل الخطط (قوالب جاهزة) */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <GlassCard className="!p-4">
                <h3 className="font-bold text-nova-deep mb-3">كل القوالب الجاهزة</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {treatmentPlans.map(plan => {
                    const disease = diseases.find(d => d.id === plan.disease_id);
                    return (
                      <PlanCard
                        key={plan.id}
                        plan={plan}
                        disease={disease}
                        materials={[]}
                        onClick={() => onSelectPlan(plan.id)}
                      />
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

// ====== بطاقة الخطة ======
const PlanCard = ({ plan, disease, materials, onClick, suggested }) => {
  return (
    <motion.button
      whileHover={{ x: -3 }}
      onClick={onClick}
      className={`w-full p-3 rounded-2xl border text-right transition ${
        suggested
          ? 'bg-nova-lime/10 border-nova-lime/40 hover:bg-nova-lime/20'
          : 'bg-white/30 border-white/40 hover:bg-white/50'
      }`}
    >
      <div className="flex items-center gap-3">
        {disease && (
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: disease.color }} />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-nova-deep text-sm">{plan.name}</h4>
          <p className="text-xs text-nova-deep/60">
            {plan.steps?.length || 0} خطوات · {plan.estimated_visits} زيارة · {plan.estimated_duration_days} يوم
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-nova-deep/40" />
      </div>
    </motion.button>
  );
};

// ====== مكون تنفيذ العلاج ======
const TreatmentExecution = ({ patient, plan, disease, materials, onSave, onCancel }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [nextVisit, setNextVisit] = useState('');
  const [notes, setNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [editedSteps, setEditedSteps] = useState(plan.steps || []);
  const [editingStep, setEditingStep] = useState(null);

  // توليد الوصفة تلقائياً من مواد الخطة
  useState(() => {
    if (plan.materials && plan.materials.length > 0) {
      const rx = plan.materials.map(m => {
        const mat = materials.find(x => x.id === m.material_id);
        if (!mat) return null;
        if (mat.category === 'أدوية') {
          return `${mat.name} - ${m.quantity} ${m.unit}\n  الجرعة: حسب إرشادات الطبيب`;
        }
        return null;
      }).filter(Boolean).join('\n\n');
      setPrescription(rx || 'لا توجد أدوية في هذه الخطة');
    }
  }, []);

  const handleAddStep = () => {
    setEditedSteps([...editedSteps, '']);
  };

  const handleRemoveStep = (i) => {
    setEditedSteps(editedSteps.filter((_, idx) => idx !== i));
  };

  const handleStepChange = (i, value) => {
    const newSteps = [...editedSteps];
    newSteps[i] = value;
    setEditedSteps(newSteps);
  };

  const handleSave = () => {
    if (!diagnosis) {
      alert('الرجاء إدخال التشخيص');
      return;
    }
    onSave({
      diagnosis,
      prescription,
      next_visit_date: nextVisit,
      notes: `الخطوات:\n${editedSteps.filter(s => s).join('\n')}\n\n${notes}`,
    });
  };

  return (
    <div className="relative min-h-screen p-6">
      <div className="smoke-bg" />
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* شريط المريض */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-4">
          <GlassCard variant="strong" className="!p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Button size="sm" variant="glass" onClick={onCancel}>→ رجوع</Button>
                <div>
                  <h2 className="text-xl font-bold text-nova-deep">{patient.full_name}</h2>
                  <div className="flex items-center gap-2 text-xs text-nova-deep/60">
                    {disease && (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: disease.color }} />
                        {disease.name_ar}
                      </span>
                    )}
                    <span>·</span>
                    <span>{plan.name}</span>
                  </div>
                </div>
              </div>
              <Button variant="primary" icon={Save} onClick={handleSave}>
                حفظ العلاج
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* العمود الأيمن - الخطة */}
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <GlassCard className="!p-5">
              <h3 className="font-bold text-nova-deep mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                الخطة العلاجية (قابلة للتعديل)
              </h3>
              
              <div className="space-y-2 mb-3">
                {editedSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-nova-lime/20 text-nova-lime-dark font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <input
                      value={step}
                      onChange={(e) => handleStepChange(i, e.target.value)}
                      className="input-glass !py-1.5 !text-sm flex-1"
                      placeholder={`الخطوة ${i + 1}`}
                    />
                    <button
                      onClick={() => handleRemoveStep(i)}
                      className="w-7 h-7 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition"
                    >
                      <X className="w-3.5 h-3.5 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>

              <Button size="sm" variant="glass" icon={Plus} onClick={handleAddStep}>
                إضافة خطوة
              </Button>

              {/* المواد المستخدمة */}
              {plan.materials && plan.materials.length > 0 && (
                <div className="mt-4 pt-4 border-t border-nova-deep/10">
                  <h4 className="text-sm font-semibold text-nova-deep mb-2">المواد (تخصم تلقائياً من المخزن)</h4>
                  <div className="space-y-1">
                    {plan.materials.map((m, i) => {
                      const mat = materials.find(x => x.id === m.material_id);
                      return (
                        <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-white/30">
                          <span className="text-nova-deep">{mat?.name || 'مادة'}</span>
                          <span className="font-bold text-nova-lime-dark">- {m.quantity} {m.unit}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* العمود الأيسر - التشخيص والوصفة */}
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
            <GlassCard className="!p-5">
              <h3 className="font-bold text-nova-deep mb-3">التشخيص الدقيق</h3>
              <Textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="اكتب التشخيص التفصيلي هنا..."
                rows={3}
              />
            </GlassCard>

            <GlassCard className="!p-5">
              <h3 className="font-bold text-nova-deep mb-3 flex items-center gap-2">
                <Pill className="w-4 h-4" />
                الوصفة الطبية (تعبأ تلقائياً + قابلة للتعديل)
              </h3>
              <Textarea
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="الوصفة الطبية..."
                rows={5}
              />
            </GlassCard>

            <GlassCard className="!p-5">
              <h3 className="font-bold text-nova-deep mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                الموعد القادم
              </h3>
              <Input
                type="date"
                value={nextVisit}
                onChange={(e) => setNextVisit(e.target.value)}
              />
              <Textarea
                label="ملاحظات إضافية"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="أي ملاحظات إضافية..."
              />
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Treatment;
