// صفحة العيادة - عرض + إضافة + تعديل + حذف المرضى
// مربوطة بمخطط الأسنان من الحزمة 3
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Phone, MapPin, Calendar, Plus, Edit, Trash2, 
  Search, FileText, Filter, Baby, UserCircle 
} from 'lucide-react';
import { useDataStore } from '../store/useDataStore.js';
import GlassCard from '../components/GlassCard.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import { Input, Select, Textarea } from '../components/Input.jsx';
import ToothChart from '../features/ToothChart/ToothChart.jsx';
import { ADULT_AGE_THRESHOLD } from '../features/ToothChart/teeth-data.js';

const Clinic = () => {
  const { patients, addPatient, updatePatient, deletePatient } = useDataStore();
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAge, setFilterAge] = useState('all'); // all | adult | child

  // فلترة المرضى
  const filteredPatients = patients.filter(p => {
    const matchSearch = p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.phone?.includes(searchQuery) ||
                        p.region?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchAge = filterAge === 'all' || 
                     (filterAge === 'adult' && p.age >= ADULT_AGE_THRESHOLD) ||
                     (filterAge === 'child' && p.age < ADULT_AGE_THRESHOLD);
    
    return matchSearch && matchAge;
  });

  // فتح نموذج إضافة
  const handleAdd = () => {
    setEditingPatient(null);
    setIsModalOpen(true);
  };

  // فتح نموذج تعديل
  const handleEdit = (patient, e) => {
    e.stopPropagation();
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  // حذف مريض
  const handleDelete = (patient, e) => {
    e.stopPropagation();
    if (confirm(`هل أنت متأكد من حذف "${patient.full_name}"؟ سيتم حذف كل زياراته وحجوزاته.`)) {
      deletePatient(patient.id);
    }
  };

  // حفظ (إضافة أو تعديل)
  const handleSave = (data) => {
    if (editingPatient) {
      updatePatient(editingPatient.id, data);
    } else {
      addPatient(data);
    }
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  // إذا اختار مريض → يعرض المخطط
  if (selectedPatientId) {
    return (
      <ToothChart 
        patientId={selectedPatientId} 
        onClose={() => setSelectedPatientId(null)} 
      />
    );
  }

  return (
    <div className="relative min-h-screen p-6">
      <div className="smoke-bg" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ====== العنوان + أزرار ====== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <GlassCard variant="strong" className="!p-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-nova-deep mb-1">العيادة</h1>
                <p className="text-nova-deep/60 text-sm">
                  {patients.length} مريض مسجل · {filteredPatients.length} معروض
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* ====== البحث + الفلترة ====== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-4"
        >
          <GlassCard className="!p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input
                  icon={Search}
                  placeholder="ابحث بالاسم، الهاتف، أو المنطقة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="md:w-56">
                <Select
                  icon={Filter}
                  value={filterAge}
                  onChange={(e) => setFilterAge(e.target.value)}
                  options={[
                    { value: 'all', label: 'الكل' },
                    { value: 'adult', label: 'بالغون (≥10 سنوات)' },
                    { value: 'child', label: 'أطفال (<10 سنوات)' },
                  ]}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* ====== قائمة المرضى ====== */}
        {filteredPatients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <GlassCard className="!p-12 text-center">
              <UserCircle className="w-20 h-20 mx-auto mb-4 text-nova-deep/20" />
              <h3 className="text-xl font-bold text-nova-deep mb-2">
                {searchQuery || filterAge !== 'all' ? 'لا توجد نتائج' : 'لا يوجد مرضى'}
              </h3>
              <p className="text-nova-deep/60 mb-6">
                {searchQuery || filterAge !== 'all' 
                  ? 'جرّب تغيير معايير البحث' 
                  : 'المرضى يُضافون تلقائياً عند حجز أول موعد لهم من صفحة الحجوزات'}
              </p>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredPatients.map((patient, i) => {
                const isChild = patient.age < ADULT_AGE_THRESHOLD;
                return (
                  <motion.div
                    key={patient.id}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                    layout
                  >
                    <GlassCard 
                      hoverable
                      onClick={() => setSelectedPatientId(patient.id)}
                      className="cursor-pointer relative"
                    >
                      {/* Badge العمر */}
                      {isChild && (
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold flex items-center gap-1">
                          <Baby className="w-3 h-3" />
                          طفل
                        </div>
                      )}

                      {/* معلومات المريض */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                          isChild 
                            ? 'bg-gradient-to-br from-pink-400 to-pink-600' 
                            : 'bg-gradient-to-br from-nova-lime to-nova-lime-dark'
                        }`}>
                          {isChild ? <Baby className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-nova-deep truncate">{patient.full_name}</h3>
                          <p className="text-xs text-nova-deep/60">
                            {patient.age} سنة · {patient.gender}
                          </p>
                        </div>
                      </div>

                      {/* تفاصيل الاتصال */}
                      <div className="space-y-1.5 text-sm">
                        {patient.phone && (
                          <div className="flex items-center gap-2 text-nova-deep/70">
                            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                            <span dir="ltr" className="truncate">{patient.phone}</span>
                          </div>
                        )}
                        {patient.region && (
                          <div className="flex items-center gap-2 text-nova-deep/70">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{patient.region}</span>
                          </div>
                        )}
                        {patient.first_visit_date && (
                          <div className="flex items-center gap-2 text-nova-deep/70">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">أول زيارة: {patient.first_visit_date}</span>
                          </div>
                        )}
                      </div>

                      {/* ملاحظات */}
                      {patient.notes && (
                        <div className="mt-3 pt-3 border-t border-nova-deep/10">
                          <p className="text-xs text-nova-deep/60 italic line-clamp-2">"{patient.notes}"</p>
                        </div>
                      )}

                      {/* أزرار */}
                      <div className="mt-4 pt-3 border-t border-nova-deep/10 flex items-center justify-between">
                        <span className="text-xs text-nova-deep/50 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          اضغط للمخطط
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => handleEdit(patient, e)}
                            className="w-7 h-7 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition"
                            title="تعديل"
                          >
                            <Edit className="w-3.5 h-3.5 text-blue-600" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(patient, e)}
                            className="w-7 h-7 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ====== Modal الإضافة/التعديل ====== */}
      <PatientFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPatient(null);
        }}
        onSave={handleSave}
        patient={editingPatient}
      />
    </div>
  );
};

// ====== Modal إضافة/تعديل مريض ======
const PatientFormModal = ({ isOpen, onClose, onSave, patient }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    phone: '',
    region: '',
    gender: 'ذكر',
    first_visit_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // ملء البيانات عند التعديل
  useState(() => {
    if (patient) {
      setFormData({
        full_name: patient.full_name || '',
        age: patient.age || '',
        phone: patient.phone || '',
        region: patient.region || '',
        gender: patient.gender || 'ذكر',
        first_visit_date: patient.first_visit_date || new Date().toISOString().split('T')[0],
        notes: patient.notes || '',
      });
    }
  }, [patient]);

  // تهيئة النموذج عند الفتح
  const handleOpen = () => {
    if (patient) {
      setFormData({
        full_name: patient.full_name || '',
        age: patient.age || '',
        phone: patient.phone || '',
        region: patient.region || '',
        gender: patient.gender || 'ذكر',
        first_visit_date: patient.first_visit_date || new Date().toISOString().split('T')[0],
        notes: patient.notes || '',
      });
    } else {
      setFormData({
        full_name: '',
        age: '',
        phone: '',
        region: '',
        gender: 'ذكر',
        first_visit_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  };

  // عند فتح Modal، ابدأ بالنموذج الصحيح
  if (isOpen && (formData.full_name === '' && !patient)) {
    handleOpen();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.age) {
      alert('الرجاء إدخال الاسم والعمر');
      return;
    }
    onSave({
      ...formData,
      age: parseInt(formData.age) || 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={patient ? 'تعديل بيانات المريض' : 'إضافة مريض جديد'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="الاسم الثلاثي *"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          placeholder="مثال: أحمد محمد علي"
          required
        />
        
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="العمر *"
            type="number"
            min="0"
            max="120"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            placeholder="25"
            required
          />
          
          <Select
            label="الجنس"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            options={[
              { value: 'ذكر', label: 'ذكر' },
              { value: 'أنثى', label: 'أنثى' },
            ]}
          />
        </div>

        <Input
          label="رقم الهاتف"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="07901234567"
        />

        <Input
          label="المحافظة / المنطقة"
          value={formData.region}
          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
          placeholder="بغداد - الكرادة"
        />

        <Input
          label="تاريخ أول زيارة"
          type="date"
          value={formData.first_visit_date}
          onChange={(e) => setFormData({ ...formData, first_visit_date: e.target.value })}
        />

        <Textarea
          label="ملاحظات"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="حساسية، أمراض مزمنة، ملاحظات خاصة..."
        />

        <div className="flex gap-2 mt-4 pt-3 border-t border-nova-deep/10">
          <Button type="submit" variant="primary" className="flex-1">
            {patient ? 'حفظ التعديلات' : 'إضافة المريض'}
          </Button>
          <Button type="button" variant="glass" onClick={onClose}>
            إلغاء
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Clinic;
