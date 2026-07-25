// صفحة المخزن - عرض + إضافة + تعديل + حذف المواد
// مع تنبيهات للكميات القليلة + بحث + فلترة
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Plus, Edit, Trash2, Search, AlertTriangle, 
  Calendar, DollarSign, TrendingDown, Filter, Box
} from 'lucide-react';
import { useDataStore } from '../store/useDataStore.js';
import GlassCard from '../components/GlassCard.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import { Input, Select, Textarea } from '../components/Input.jsx';

const Inventory = () => {
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useDataStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showLowOnly, setShowLowOnly] = useState(false);

  // استخراج الفئات
  const categories = [...new Set(materials.map(m => m.category).filter(Boolean))];

  // المواد المفلترة
  const filteredMaterials = materials.filter(m => {
    const matchSearch = m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.supplier?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'all' || m.category === filterCategory;
    const matchLow = !showLowOnly || m.current_quantity <= m.critical_quantity;
    return matchSearch && matchCategory && matchLow;
  });

  // إحصائيات
  const lowStockCount = materials.filter(m => m.current_quantity <= m.critical_quantity).length;
  const expiringSoonCount = materials.filter(m => {
    if (!m.expiry_date) return false;
    const days = (new Date(m.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
    return days < 60 && days > 0;
  }).length;
  const totalValue = materials.reduce((sum, m) => sum + (m.current_quantity * (m.unit_price || 0)), 0);

  // فتح نموذج
  const handleAdd = () => {
    setEditingMaterial(null);
    setIsModalOpen(true);
  };

  const handleEdit = (material, e) => {
    e.stopPropagation();
    setEditingMaterial(material);
    setIsModalOpen(true);
  };

  const handleDelete = (material, e) => {
    e.stopPropagation();
    if (confirm(`هل تريد حذف "${material.name}"؟`)) {
      deleteMaterial(material.id);
    }
  };

  const handleSave = (data) => {
    if (editingMaterial) {
      updateMaterial(editingMaterial.id, data);
    } else {
      addMaterial(data);
    }
    setIsModalOpen(false);
    setEditingMaterial(null);
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
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-nova-deep">المخزن</h1>
                  <p className="text-nova-deep/60 text-sm">
                    {materials.length} مادة · {lowStockCount} تحتاج إعادة طلب
                  </p>
                </div>
              </div>
              <Button variant="primary" icon={Plus} onClick={handleAdd}>
                إضافة مادة جديدة
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        {/* ====== إحصائيات ====== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatCard
            icon={Package}
            label="إجمالي المواد"
            value={materials.length}
            color="from-blue-400 to-blue-600"
          />
          <StatCard
            icon={AlertTriangle}
            label="مخزون منخفض"
            value={lowStockCount}
            color="from-red-400 to-red-600"
          />
          <StatCard
            icon={Calendar}
            label="تنتهي قريباً"
            value={expiringSoonCount}
            color="from-orange-400 to-orange-600"
          />
          <StatCard
            icon={DollarSign}
            label="قيمة المخزون"
            value={`${totalValue.toFixed(0)} د`}
            color="from-emerald-400 to-emerald-600"
          />
        </div>

        {/* ====== شريط البحث والفلترة ====== */}
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
                  placeholder="ابحث بالاسم أو المورد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="md:w-56">
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  options={[
                    { value: 'all', label: 'كل الفئات' },
                    ...categories.map(c => ({ value: c, label: c })),
                  ]}
                />
              </div>
              <button
                onClick={() => setShowLowOnly(!showLowOnly)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                  showLowOnly
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-white/40 text-nova-deep hover:bg-white/60 border border-white/50'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                {showLowOnly ? 'إظهار الكل' : 'مخزون منخفض فقط'}
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* ====== جدول المواد ====== */}
        {filteredMaterials.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlassCard className="!p-12 text-center">
              <Box className="w-20 h-20 mx-auto mb-4 text-nova-deep/20" />
              <h3 className="text-xl font-bold text-nova-deep mb-2">
                {searchQuery || filterCategory !== 'all' || showLowOnly ? 'لا توجد نتائج' : 'المخزن فارغ'}
              </h3>
              <p className="text-nova-deep/60 mb-6">
                {searchQuery || filterCategory !== 'all' || showLowOnly
                  ? 'جرّب تغيير معايير البحث'
                  : 'ابدأ بإضافة أول مادة للمخزن'}
              </p>
              {!searchQuery && filterCategory === 'all' && !showLowOnly && (
                <Button variant="primary" icon={Plus} onClick={handleAdd}>
                  إضافة مادة جديدة
                </Button>
              )}
            </GlassCard>
          </motion.div>
        ) : (
          <GlassCard className="!p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-right text-xs font-bold text-nova-deep/60 uppercase">
                    <th className="p-3">المادة</th>
                    <th className="p-3">الفئة</th>
                    <th className="p-3 text-center">الكمية</th>
                    <th className="p-3 text-center">الحد الأدنى</th>
                    <th className="p-3 text-center">السعر</th>
                    <th className="p-3">الانتهاء</th>
                    <th className="p-3 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-nova-deep/5">
                  <AnimatePresence>
                    {filteredMaterials.map((m, i) => {
                      const isLow = m.current_quantity <= m.critical_quantity;
                      const daysToExpiry = m.expiry_date 
                        ? Math.floor((new Date(m.expiry_date) - new Date()) / (1000 * 60 * 60 * 24))
                        : null;
                      const isExpiringSoon = daysToExpiry !== null && daysToExpiry < 60 && daysToExpiry > 0;
                      const isExpired = daysToExpiry !== null && daysToExpiry < 0;

                      return (
                        <motion.tr
                          key={m.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: i * 0.02, duration: 0.3 }}
                          className={`hover:bg-white/30 transition ${
                            isLow || isExpiringSoon || isExpired ? 'bg-orange-50/30' : ''
                          }`}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {(isLow || isExpired) && (
                                <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${
                                  isExpired ? 'text-red-600' : 'text-orange-500'
                                }`} />
                              )}
                              <div>
                                <p className="font-semibold text-nova-deep text-sm">{m.name}</p>
                                {m.supplier && (
                                  <p className="text-xs text-nova-deep/50">{m.supplier}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-xs px-2 py-1 rounded-full bg-white/40 text-nova-deep/70">
                              {m.category || '—'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`font-bold text-base ${
                              isLow ? 'text-red-600' : 'text-nova-deep'
                            }`}>
                              {m.current_quantity}
                            </span>
                            <span className="text-xs text-nova-deep/50 mr-1">{m.unit}</span>
                          </td>
                          <td className="p-3 text-center text-sm text-nova-deep/60">
                            {m.critical_quantity}
                          </td>
                          <td className="p-3 text-center text-sm text-nova-deep/70">
                            {m.unit_price ? `${m.unit_price.toFixed(2)} د` : '—'}
                          </td>
                          <td className="p-3">
                            {m.expiry_date ? (
                              <div className="text-xs">
                                <p className={isExpired ? 'text-red-600 font-bold' : isExpiringSoon ? 'text-orange-600' : 'text-nova-deep/70'}>
                                  {m.expiry_date}
                                </p>
                                {daysToExpiry !== null && (
                                  <p className="text-nova-deep/50">
                                    {isExpired ? `منتهية منذ ${Math.abs(daysToExpiry)} يوم` : `${daysToExpiry} يوم`}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-nova-deep/40">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={(e) => handleEdit(m, e)}
                                className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition"
                                title="تعديل"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(m, e)}
                                className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>

      {/* ====== Modal الإضافة/التعديل ====== */}
      <MaterialFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMaterial(null);
        }}
        onSave={handleSave}
        material={editingMaterial}
        existingCategories={categories}
      />
    </div>
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
          <p className="text-xl font-bold text-nova-deep">{value}</p>
        </div>
      </div>
    </GlassCard>
  </motion.div>
);

// ====== Modal إضافة/تعديل مادة ======
const MaterialFormModal = ({ isOpen, onClose, onSave, material, existingCategories }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    current_quantity: 0,
    critical_quantity: 5,
    unit: 'قطعة',
    purchase_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    supplier: '',
    unit_price: 0,
  });

  useEffect(() => {
    if (isOpen) {
      if (material) {
        setFormData({
          name: material.name || '',
          category: material.category || '',
          current_quantity: material.current_quantity || 0,
          critical_quantity: material.critical_quantity || 5,
          unit: material.unit || 'قطعة',
          purchase_date: material.purchase_date || new Date().toISOString().split('T')[0],
          expiry_date: material.expiry_date || '',
          supplier: material.supplier || '',
          unit_price: material.unit_price || 0,
        });
      } else {
        setFormData({
          name: '',
          category: existingCategories[0] || '',
          current_quantity: 0,
          critical_quantity: 5,
          unit: 'قطعة',
          purchase_date: new Date().toISOString().split('T')[0],
          expiry_date: '',
          supplier: '',
          unit_price: 0,
        });
      }
    }
  }, [isOpen, material]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('الرجاء إدخال اسم المادة');
      return;
    }
    onSave({
      ...formData,
      current_quantity: parseInt(formData.current_quantity) || 0,
      critical_quantity: parseInt(formData.critical_quantity) || 5,
      unit_price: parseFloat(formData.unit_price) || 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={material ? 'تعديل المادة' : 'إضافة مادة جديدة'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="اسم المادة *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="مثال: مخدر موضعي"
            required
            className="col-span-2"
          />

          <Input
            label="الفئة"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="تخدير، حشوات، تقويم..."
            list="categories"
          />
          <datalist id="categories">
            {existingCategories.map(c => <option key={c} value={c} />)}
          </datalist>

          <Input
            label="الوحدة"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="قطعة، علبة، أنبوب..."
          />

          <Input
            label="الكمية الحالية *"
            type="number"
            min="0"
            value={formData.current_quantity}
            onChange={(e) => setFormData({ ...formData, current_quantity: e.target.value })}
            required
          />

          <Input
            label="حد التنبيه (الكمية الحرجة) *"
            type="number"
            min="0"
            value={formData.critical_quantity}
            onChange={(e) => setFormData({ ...formData, critical_quantity: e.target.value })}
            required
          />

          <Input
            label="سعر الوحدة (دينار)"
            type="number"
            min="0"
            step="0.01"
            value={formData.unit_price}
            onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
          />

          <Input
            label="تاريخ الشراء"
            type="date"
            value={formData.purchase_date}
            onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
          />

          <Input
            label="تاريخ الانتهاء"
            type="date"
            value={formData.expiry_date}
            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
          />

          <Input
            label="المورد"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            placeholder="اسم الشركة الموردة"
            className="col-span-2"
          />
        </div>

        <div className="mt-3 p-3 rounded-xl bg-nova-lime/10 border border-nova-lime/30 flex items-start gap-2">
          <TrendingDown className="w-4 h-4 text-nova-lime-dark flex-shrink-0 mt-0.5" />
          <p className="text-xs text-nova-deep/80">
            <strong>حد التنبيه:</strong> عندما تصل الكمية إلى هذا الرقم أو أقل، سيظهر تنبيه تلقائي في الداشبورد.
          </p>
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t border-nova-deep/10">
          <Button type="submit" variant="primary" className="flex-1">
            {material ? 'حفظ التعديلات' : 'إضافة المادة'}
          </Button>
          <Button type="button" variant="glass" onClick={onClose}>
            إلغاء
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default Inventory;
