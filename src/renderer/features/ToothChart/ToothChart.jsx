// مخطط الأسنان التفاعلي الكامل
// يدعم: كبار (32 سن) + صغار (20 سن لبني) + اختيار مريض + تلوين + popup
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Baby, User } from 'lucide-react';
import Tooth from './Tooth.jsx';
import GlassCard from '../../components/GlassCard.jsx';
import Button from '../../components/Button.jsx';
import { 
  TEETH_DATA, 
  UPPER_TEETH_ORDER, 
  LOWER_TEETH_ORDER,
  PRIMARY_TEETH,
  PRIMARY_UPPER_ORDER,
  PRIMARY_LOWER_ORDER,
  ADULT_AGE_THRESHOLD,
} from './teeth-data.js';
import { useDataStore } from '../../store/useDataStore.js';
import { DISEASE_COLORS } from '../../utils/colors.js';

const ToothChart = ({ patientId, onClose }) => {
  const { patients, diseases, toothRecords, addToothRecord, deleteToothRecord } = useDataStore();
  
  // المريض المختار
  const patient = patients.find(p => p.id === patientId);
  const isChild = patient && patient.age < ADULT_AGE_THRESHOLD;
  
  // حالة الـ popup
  const [selectedTooth, setSelectedTooth] = useState(null); // رقم السن
  const [selectedPart, setSelectedPart] = useState('crown');  // 'crown' | 'root' | 'both'

  // تجميع سجلات أسنان المريض الحالي
  const patientToothRecords = useMemo(() => {
    return toothRecords.filter(r => r.patient_id === patientId);
  }, [toothRecords, patientId]);

  // دالة للحصول على أمراض كل سن وأجزاءه
  const getPartDiseases = (toothNum) => {
    const records = patientToothRecords.filter(r => r.tooth_number === toothNum);
    return {
      crown: records.find(r => r.part === 'crown')?.disease_id,
      root: records.find(r => r.part === 'root')?.disease_id,
      both: records.find(r => r.part === 'both')?.disease_id,
    };
  };

  // معالج الضغط على سن
  const handleToothClick = (toothNum) => {
    setSelectedTooth(toothNum);
  };

  // حفظ مرض على سن
  const handleSaveDisease = (diseaseId) => {
    if (!selectedTooth || !patientId) return;
    
    addToothRecord({
      patient_id: patientId,
      tooth_number: selectedTooth,
      part: selectedPart,
      disease_id: diseaseId,
      status: 'active',
    });
    
    setSelectedTooth(null);
  };

  // حذف مرض من سن
  const handleDeleteDisease = (diseaseId) => {
    const record = patientToothRecords.find(
      r => r.tooth_number === selectedTooth && r.disease_id === diseaseId
    );
    if (record) {
      deleteToothRecord(record.id);
    }
  };

  if (!patient) {
    return (
      <div className="p-8 text-center">
        <p className="text-nova-deep">اختر مريض أولاً</p>
      </div>
    );
  }

  // الأسنان اللي نعرضها
  const upperOrder = isChild ? PRIMARY_UPPER_ORDER : UPPER_TEETH_ORDER;
  const lowerOrder = isChild ? PRIMARY_LOWER_ORDER : LOWER_TEETH_ORDER;
  const upperData = isChild ? PRIMARY_TEETH : TEETH_DATA;
  const lowerData = upperData;

  return (
    <div className="relative min-h-screen p-6">
      <div className="smoke-bg" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ====== شريط معلومات المريض ====== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard variant="strong" className="!p-5 mb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  isChild 
                    ? 'bg-gradient-to-br from-pink-400 to-pink-600' 
                    : 'bg-gradient-to-br from-nova-lime to-nova-lime-dark'
                }`}>
                  {isChild ? <Baby className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-nova-deep">{patient.full_name}</h2>
                  <p className="text-sm text-nova-deep/60">
                    {patient.age} سنة · {patient.gender} · {patient.region}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-xl ${
                  isChild ? 'bg-pink-100 text-pink-700' : 'bg-nova-lime/20 text-nova-deep'
                } font-semibold text-sm`}>
                  {isChild ? '🦷 أسنان لبنية (صغار)' : '🦷 أسنان دائمة (كبار)'}
                </div>
                
                {onClose && (
                  <Button variant="glass" size="sm" onClick={onClose} icon={X}>
                    إغلاق
                  </Button>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* ====== المخطط ====== */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <GlassCard variant="strong" className="!p-8">
            {/* الفك العلوي */}
            <div className="mb-8">
              <div className="text-center mb-3 text-sm font-semibold text-nova-deep/60">
                ═══ الفك العلوي ═══
              </div>
              <div className="flex justify-center items-end gap-1 flex-wrap" dir="ltr">
                {upperOrder.map(num => (
                  <Tooth
                    key={num}
                    toothNumber={num}
                    toothData={upperData[num]}
                    partDiseases={getPartDiseases(num)}
                    size="normal"
                    isSelected={selectedTooth === num}
                    isChild={isChild}
                    onClick={() => handleToothClick(num)}
                  />
                ))}
              </div>
            </div>

            {/* خط اللثة العلوي */}
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-nova-deep/30 to-transparent" />

            {/* الفك السفلي */}
            <div>
              <div className="flex justify-center items-start gap-1 flex-wrap" dir="ltr">
                {lowerOrder.map(num => (
                  <Tooth
                    key={num}
                    toothNumber={num}
                    toothData={lowerData[num]}
                    partDiseases={getPartDiseases(num)}
                    size="normal"
                    isSelected={selectedTooth === num}
                    isChild={isChild}
                    onClick={() => handleToothClick(num)}
                  />
                ))}
              </div>
              <div className="text-center mt-3 text-sm font-semibold text-nova-deep/60">
                ═══ الفك السفلي ═══
              </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="mt-8 pt-6 border-t border-nova-deep/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                <StatBox 
                  label="أسنان مصابة" 
                  value={new Set(patientToothRecords.map(r => r.tooth_number)).size}
                  color="text-red-600"
                />
                <StatBox 
                  label="إجمالي الحالات" 
                  value={patientToothRecords.length}
                  color="text-nova-deep"
                />
                <StatBox 
                  label="أمراض التاج" 
                  value={patientToothRecords.filter(r => r.part === 'crown' || r.part === 'both').length}
                  color="text-orange-600"
                />
                <StatBox 
                  label="أمراض الجذر" 
                  value={patientToothRecords.filter(r => r.part === 'root' || r.part === 'both').length}
                  color="text-purple-600"
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* ====== دليل الألوان ====== */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-4"
        >
          <GlassCard className="!p-5">
            <h3 className="font-bold text-nova-deep mb-3 text-sm">دليل الألوان</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {diseases.map(d => (
                <div key={d.id} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-4 h-4 rounded-md border border-nova-deep/20" 
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-nova-deep">{d.name_ar}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ====== Popup اختيار المرض ====== */}
      <AnimatePresence>
        {selectedTooth && (
          <DiseasePopup
            toothNumber={selectedTooth}
            toothData={(isChild ? PRIMARY_TEETH : TEETH_DATA)[selectedTooth]}
            existingRecords={patientToothRecords.filter(r => r.tooth_number === selectedTooth)}
            diseases={diseases}
            selectedPart={selectedPart}
            onSelectPart={setSelectedPart}
            onSave={handleSaveDisease}
            onDelete={handleDeleteDisease}
            onClose={() => setSelectedTooth(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ====== Popup اختيار المرض ======
const DiseasePopup = ({ 
  toothNumber, 
  toothData, 
  existingRecords, 
  diseases,
  selectedPart,
  onSelectPart,
  onSave,
  onDelete,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nova-deep/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <GlassCard variant="strong" className="!p-6">
          {/* العنوان */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-nova-deep">
                السن #{toothNumber}
              </h3>
              <p className="text-sm text-nova-deep/60">{toothData?.name_ar}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 flex items-center justify-center transition"
            >
              <X className="w-4 h-4 text-nova-deep" />
            </button>
          </div>

          {/* اختيار الجزء */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-nova-deep mb-2 block">
              اختر الجزء المصاب:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'crown', label: 'التاج', icon: '🦷' },
                { value: 'root', label: 'الجذر', icon: '🌱' },
                { value: 'both', label: 'كلاهما', icon: '⚡' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onSelectPart(opt.value)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedPart === opt.value
                      ? 'bg-nova-lime/30 border-nova-lime shadow-md'
                      : 'bg-white/30 border-white/40 hover:bg-white/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{opt.icon}</div>
                  <div className="text-sm font-semibold text-nova-deep">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* الأمراض المسجلة على هذا السن */}
          {existingRecords.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-nova-deep mb-2">الأمراض الحالية:</h4>
              <div className="space-y-2">
                {existingRecords.map(record => {
                  const disease = diseases.find(d => d.id === record.disease_id);
                  if (!disease) return null;
                  return (
                    <div 
                      key={record.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/50"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: disease.color }}
                        />
                        <div>
                          <p className="font-semibold text-nova-deep text-sm">{disease.name_ar}</p>
                          <p className="text-xs text-nova-deep/60">
                            {record.part === 'crown' ? 'تاج' : record.part === 'root' ? 'جذر' : 'كلاهما'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition"
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* قائمة الأمراض للاختيار */}
          <div>
            <h4 className="text-sm font-semibold text-nova-deep mb-2">اختر المرض:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {diseases.map(disease => (
                <motion.button
                  key={disease.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSave(disease.id)}
                  className="p-3 rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 transition-all text-right"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: disease.color }}
                    />
                    <span className="font-bold text-nova-deep text-sm">{disease.name_ar}</span>
                  </div>
                  <p className="text-xs text-nova-deep/60 leading-tight">{disease.name_en}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

// ====== مربع إحصائية ======
const StatBox = ({ label, value, color }) => (
  <div className="p-3 rounded-xl bg-white/30 border border-white/40">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-xs text-nova-deep/60 mt-1">{label}</div>
  </div>
);

export default ToothChart;
