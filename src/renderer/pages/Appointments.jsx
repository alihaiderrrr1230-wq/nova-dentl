// صفحة الحجوزات - عرض + إضافة + تعديل + حذف
// مع تقويم بسيط (حسب اليوم) + قائمة بالحجوزات
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Plus, Edit, Trash2, Clock, User, 
  CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight,
  CalendarDays
} from 'lucide-react';
import { useDataStore } from '../store/useDataStore.js';
import GlassCard from '../components/GlassCard.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import { Input, Select, Textarea } from '../components/Input.jsx';

const Appointments = () => {
  const { appointments, patients, addAppointment, updateAppointment, deleteAppointment, addPatient } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');

  // الحجوزات حسب التاريخ المختار
  const dayAppointments = appointments
    .filter(a => a.appointment_date === selectedDate)
    .sort((a, b) => (a.appointment_time || '').localeCompare(b.appointment_time || ''));

  // كل الحجوزات (للعرض)
  const allFiltered = appointments
    .filter(a => filterStatus === 'all' || a.status === filterStatus)
    .sort((a, b) => {
      const dateCompare = b.appointment_date.localeCompare(a.appointment_date);
      if (dateCompare !== 0) return dateCompare;
      return (b.appointment_time || '').localeCompare(a.appointment_time || '');
    });

  // فتح نموذج
  const handleAdd = () => {
    setEditingAppt(null);
    setIsModalOpen(true);
  };

  const handleEdit = (appt, e) => {
    e.stopPropagation();
    setEditingAppt(appt);
    setIsModalOpen(true);
  };

  const handleDelete = (appt, e) => {
    e.stopPropagation();
    if (confirm(`هل تريد حذف هذا الحجز؟`)) {
      deleteAppointment(appt.id);
    }
  };

  const handleSave = (data) => {
    if (editingAppt) {
      updateAppointment(editingAppt.id, data);
    } else {
      addAppointment(data);
    }
    setIsModalOpen(false);
    setEditingAppt(null);
  };

  // تغيير التاريخ (سابق/تالي)
  const changeDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // الحصول على اسم المريض
  const getPatientName = (id) => {
    const p = patients.find(pt => pt.id === id);
    return p ? p.full_name : 'مريض محذوف';
  };

  // عداد حالات الحجوزات
  const statusCounts = {
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    no_show: appointments.filter(a => a.status === 'no_show').length,
  };

  return (
    <div className="relative min-h-screen p-6">
      <div className="smoke-bg" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ====== العنوان ====== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <GlassCard variant="strong" className="!p-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-nova-deep mb-1">الحجوزات</h1>
                <p className="text-nova-deep/60 text-sm">
                  {appointments.length} حجز إجمالي
                </p>
              </div>
              <Button variant="primary" icon={Plus} onClick={handleAdd}>
                إضافة حجز جديد
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        {/* ====== إحصائيات سريعة ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatusCard icon={Clock} label="مجدول" value={statusCounts.scheduled} color="from-blue-400 to-blue-600" />
          <StatusCard icon={CheckCircle} label="مكتمل" value={statusCounts.completed} color="from-emerald-400 to-emerald-600" />
          <StatusCard icon={XCircle} label="ملغي" value={statusCounts.cancelled} color="from-red-400 to-red-600" />
          <StatusCard icon={AlertCircle} label="لم يحضر" value={statusCounts.no_show} color="from-orange-400 to-orange-600" />
        </div>

        {/* ====== حجوزات اليوم المختار ====== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-4"
        >
          <GlassCard variant="strong" className="!p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-nova-lime/20 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-nova-lime-dark" />
                </div>
                <div>
                  <h2 className="font-bold text-nova-deep">حجوزات يوم</h2>
                  <p className="text-sm text-nova-deep/60">{formatDateAr(selectedDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="sm" variant="glass" icon={ChevronRight} onClick={() => changeDate(-1)}>
                  السابق
                </Button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-glass !w-auto !py-1.5"
                />
                <Button size="sm" variant="glass" icon={ChevronLeft} onClick={() => changeDate(1)}>
                  التالي
                </Button>
              </div>
            </div>

            {/* قائمة حجوزات اليوم */}
            {dayAppointments.length === 0 ? (
              <div className="text-center py-8 text-nova-deep/50">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>لا توجد حجوزات لهذا اليوم</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dayAppointments.map((appt, i) => (
                  <AppointmentItem
                    key={appt.id}
                    appt={appt}
                    patientName={getPatientName(appt.patient_id)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    delay={i * 0.05}
                  />
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* ====== كل الحجوزات ====== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <GlassCard className="!p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="font-bold text-nova-deep">كل الحجوزات</h2>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: 'all', label: 'كل الحالات' },
                  { value: 'scheduled', label: 'مجدول' },
                  { value: 'completed', label: 'مكتمل' },
                  { value: 'cancelled', label: 'ملغي' },
                  { value: 'no_show', label: 'لم يحضر' },
                ]}
                className="!w-48 !py-1.5"
              />
            </div>

            {allFiltered.length === 0 ? (
              <div className="text-center py-8 text-nova-deep/50">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>لا توجد حجوزات</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allFiltered.slice(0, 20).map((appt, i) => (
                  <AppointmentItem
                    key={appt.id}
                    appt={appt}
                    patientName={getPatientName(appt.patient_id)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    delay={i * 0.02}
                    compact
                  />
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* ====== Modal الإضافة/التعديل ====== */}
      <AppointmentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAppt(null);
        }}
        onSave={handleSave}
        appointment={editingAppt}
        patients={patients}
        addPatient={addPatient}
        defaultDate={selectedDate}
      />
    </div>
  );
};

// ====== عنصر حجز واحد ======
const AppointmentItem = ({ appt, patientName, onEdit, onDelete, delay, compact }) => {
  const statusConfig = {
    scheduled: { label: 'مجدول', color: 'bg-blue-100 text-blue-700', icon: Clock },
    completed: { label: 'مكتمل', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
    cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-700', icon: XCircle },
    no_show: { label: 'لم يحضر', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
  };

  const status = statusConfig[appt.status] || statusConfig.scheduled;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ x: -3 }}
      className={`flex items-center gap-3 p-3 rounded-2xl bg-white/30 border border-white/40 hover:bg-white/50 transition ${
        compact ? '!p-2' : ''
      }`}
    >
      {/* الوقت */}
      <div className={`text-center ${compact ? 'w-14' : 'w-20'} flex-shrink-0`}>
        <div className="text-lg font-bold text-nova-deep">
          {appt.appointment_time || '—'}
        </div>
        {!compact && (
          <div className="text-xs text-nova-deep/60">
            {appt.duration_minutes} د
          </div>
        )}
      </div>

      {/* خط فاصل */}
      <div className="w-px h-10 bg-nova-deep/10" />

      {/* المعلومات */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-nova-deep/60" />
          <span className="font-semibold text-nova-deep truncate">{patientName}</span>
        </div>
        {!compact && appt.notes && (
          <p className="text-xs text-nova-deep/60 mt-0.5 truncate">{appt.notes}</p>
        )}
        {compact && (
          <p className="text-xs text-nova-deep/50 mt-0.5">{appt.appointment_date}</p>
        )}
      </div>

      {/* الحالة */}
      <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${status.color}`}>
        <StatusIcon className="w-3 h-3" />
        {status.label}
      </div>

      {/* الأزرار */}
      <div className="flex gap-1">
        <button
          onClick={(e) => onEdit(appt, e)}
          className="w-7 h-7 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition"
          title="تعديل"
        >
          <Edit className="w-3.5 h-3.5 text-blue-600" />
        </button>
        <button
          onClick={(e) => onDelete(appt, e)}
          className="w-7 h-7 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition"
          title="حذف"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-600" />
        </button>
      </div>
    </motion.div>
  );
};

// ====== بطاقة إحصائية ======
const StatusCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    whileHover={{ y: -3 }}
  >
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

// ====== Modal إضافة/تعديل حجز ======
const AppointmentFormModal = ({ isOpen, onClose, onSave, appointment, patients, addPatient, defaultDate }) => {
  const [formData, setFormData] = useState({
    patient_id: '',
    full_name: '',
    phone: '',
    age: '',
    appointment_date: defaultDate,
    appointment_time: '10:00',
    duration_minutes: 30,
    notes: '',
  });
  const [nameConflict, setNameConflict] = useState(false);

  // إعادة تهيئة فقط عند فتح النافذة (مرة واحدة، مش بكل render)
  useEffect(() => {
    if (isOpen) {
      if (appointment) {
        const existingPatient = patients.find(p => p.id === appointment.patient_id);
        setFormData({
          patient_id: appointment.patient_id || '',
          full_name: existingPatient?.full_name || '',
          phone: existingPatient?.phone || '',
          age: existingPatient?.age || '',
          appointment_date: appointment.appointment_date || defaultDate,
          appointment_time: appointment.appointment_time || '10:00',
          duration_minutes: appointment.duration_minutes || 30,
          notes: appointment.notes || '',
        });
      } else {
        setFormData({
          patient_id: '',
          full_name: '',
          phone: '',
          age: '',
          appointment_date: defaultDate,
          appointment_time: '10:00',
          duration_minutes: 30,
          notes: '',
        });
      }
      setNameConflict(false);
    }
  }, [isOpen, appointment]);

  // فحص التطابق: إذا الاسم الثلاثي (أول 3 كلمات) موجود بالفعل عند مريض آخر
  const checkNameConflict = (name) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length < 3) return false;
    const threeWordName = parts.slice(0, 3).join(' ');
    return patients.some(p => {
      if (appointment && p.id === appointment.patient_id) return false; // تجاهل نفس المريض عند التعديل
      const pParts = p.full_name.trim().split(/\s+/).filter(Boolean);
      return pParts.slice(0, 3).join(' ') === threeWordName;
    });
  };

  const handleNameChange = (value) => {
    setFormData({ ...formData, full_name: value });
    setNameConflict(checkNameConflict(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameParts = formData.full_name.trim().split(/\s+/).filter(Boolean);
    if (nameParts.length < 3) {
      alert('الرجاء إدخال الاسم الثلاثي على الأقل (الاسم + اسم الأب + اسم الجد)');
      return;
    }
    if (nameConflict && nameParts.length < 4) {
      alert('يوجد مريض آخر بنفس الاسم الثلاثي — الرجاء إدخال الاسم الرباعي للتمييز بينهما');
      return;
    }
    if (!formData.phone.trim()) {
      alert('الرجاء إدخال رقم الهاتف');
      return;
    }
    if (!formData.age || formData.age <= 0) {
      alert('الرجاء إدخال عمر صحيح');
      return;
    }
    if (!formData.appointment_date) {
      alert('الرجاء اختيار التاريخ');
      return;
    }

    let patientId = formData.patient_id;

    // لو مريض جديد (تعديل بدون patient_id موجود، أو إضافة جديدة) → أنشئ سجل مريض تلقائياً
    if (!appointment) {
      // تحقق: هل هذا الاسم بالضبط (كامل) موجود مسبقاً؟ لو نعم استخدم نفس المريض بدل تكرار سجل
      const exactMatch = patients.find(p => p.full_name.trim() === formData.full_name.trim());
      if (exactMatch) {
        patientId = exactMatch.id;
        // تحديث بياناته لو تغيرت
      } else {
        const newPatient = addPatient({
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim(),
          age: parseInt(formData.age),
          region: '',
          gender: '',
          first_visit_date: formData.appointment_date,
          notes: '',
        });
        patientId = newPatient.id;
      }
    }

    onSave({
      patient_id: patientId,
      appointment_date: formData.appointment_date,
      appointment_time: formData.appointment_time,
      duration_minutes: formData.duration_minutes,
      status: appointment?.status || 'scheduled',
      notes: formData.notes,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={appointment ? 'تعديل الحجز' : 'إضافة حجز جديد'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="الاسم الثلاثي *"
          type="text"
          value={formData.full_name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="مثال: أحمد محمد علي"
          required
        />
        {nameConflict && (
          <div className="text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2 -mt-2 mb-2">
            ⚠ يوجد مريض آخر بنفس الاسم الثلاثي — الرجاء إضافة اسم رابع للتمييز (مثال: أحمد محمد علي الجبوري)
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="رقم الهاتف *"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="07xxxxxxxxx"
            required
          />
          <Input
            label="العمر *"
            type="number"
            min="0"
            max="120"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="التاريخ *"
            type="date"
            value={formData.appointment_date}
            onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
            required
          />
          <Input
            label="الوقت *"
            type="time"
            value={formData.appointment_time}
            onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
            required
          />
        </div>

        <Input
          label="المدة (دقيقة)"
          type="number"
          min="15"
          max="180"
          step="15"
          value={formData.duration_minutes}
          onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 30 })}
        />

        <Textarea
          label="ملاحظات"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="مثال: متابعة علاج عصب، تنظيف، كشف أولي..."
        />

        <div className="flex gap-2 mt-4 pt-3 border-t border-nova-deep/10">
          <Button type="submit" variant="primary" className="flex-1">
            {appointment ? 'حفظ التعديلات' : 'إضافة الحجز'}
          </Button>
          <Button type="button" variant="glass" onClick={onClose}>
            إلغاء
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ====== تنسيق التاريخ بالعربي ======
const formatDateAr = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  return `${days[d.getDay()]} - ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export default Appointments;
