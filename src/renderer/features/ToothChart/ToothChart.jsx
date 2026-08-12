// =============================================================
// ToothChart v2 — the unified treatment hub
// -------------------------------------------------------------
// Replaces the old Treatment page entirely.
// Single-tooth popup supports: crown / root / implant / existing
// records (mark treated, edit, delete).
// Multi-tooth flow supports: orthodontics + bridge.
//   - Click "Add Orthodontics/Bridge" → pick type → multi-select teeth
//   - "Orthodontics" requires a type to be selected before save.
// All on one page.
// =============================================================

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Baby,
  User,
  Sparkles,
  Layers,
  Check,
  Trash2,
  Edit3,
  Activity,
  Crown,
  Anchor,
  Plus,
  Save,
  Calendar,
  Stethoscope,
} from 'lucide-react';
import Tooth from './Tooth';
import { resolveImages } from '@utils/imageStore';
import {
  TEETH_DATA,
  UPPER_TEETH_ORDER,
  LOWER_TEETH_ORDER,
  PRIMARY_TEETH,
  PRIMARY_UPPER_ORDER,
  PRIMARY_LOWER_ORDER,
  ADULT_AGE_THRESHOLD,
} from './teeth-data';
import {
  CROWN_CONDITIONS,
  ROOT_CONDITIONS,
  IMPLANT_INFO,
  ORTHO_INFO,
  BRIDGE_INFO,
  ORTHO_TYPES,
  getConditionById,
} from '@data/seed';
import { useDataStore } from '@store/useDataStore';
import { CONDITION_COLORS, safeColorLookup } from '@utils/colors';
import { clsx } from '@utils/clsx';
import GlassCard from '@components/GlassCard';
import Button from '@components/Button';
import Modal from '@components/Modal';
import { Textarea, Select, Input } from '@components/Input';
import ConfirmDialog from '@components/ConfirmDialog';
import PageLayout from '@components/PageLayout';
import ImageUploader from '@components/ImageUploader';
import ImageGallery from '@components/ImageGallery';

const PART_OPTIONS = [
  { value: 'crown', label: 'التاج', icon: '🦷' },
  { value: 'root', label: 'الجذر', icon: '🌱' },
  { value: 'implant', label: 'زراعة كاملة', icon: '⚙️' },
];

const ToothChart = ({ patientId, onClose }) => {
  const {
    patients,
    toothRecords,
    addToothRecord,
    updateToothRecord,
    deleteToothRecord,
    completeToothRecord,
    addGroupRecord,
    deleteGroupRecord,
    completeGroupRecord,
    addImageToRecord,
    removeImageFromRecord,
  } = useDataStore();

  const patient = patients.find((p) => p.id === patientId);
  const isChild = patient ? patient.age < ADULT_AGE_THRESHOLD : false;

  // Single-tooth popup state
  const [singleTooth, setSingleTooth] = useState(null); // number
  const [partChoice, setPartChoice] = useState('crown');

  // Multi-tooth group flow state
  const [groupMode, setGroupMode] = useState(null); // null | { kind: 'ortho'|'bridge', orthoType: string|null }
  const [groupSelected, setGroupSelected] = useState(new Set());

  // Edit / view state for an existing group record
  const [editingGroup, setEditingGroup] = useState(null);

  // Delete confirm
  const [pendingDelete, setPendingDelete] = useState(null);

  // ----- Active records indexed by tooth number -----
  const recordsByTooth = useMemo(() => {
    const map = new Map();
    toothRecords
      .filter((r) => r.patient_id === patientId && r.status === 'active')
      .forEach((r) => {
        if (r.type === 'ortho' || r.type === 'bridge') {
          // multi-tooth group
          (r.tooth_numbers ?? []).forEach((n) => {
            if (!map.has(n)) map.set(n, []);
            map.get(n).push({ ...r, _isGroup: true });
          });
        } else {
          // single tooth
          if (r.tooth_number != null) {
            if (!map.has(r.tooth_number)) map.set(r.tooth_number, []);
            map.get(r.tooth_number).push(r);
          }
        }
      });
    return map;
  }, [toothRecords, patientId]);

  // Groups on this patient (ortho/bridge)
  const patientGroups = useMemo(
    () =>
      toothRecords.filter(
        (r) =>
          r.patient_id === patientId &&
          (r.type === 'ortho' || r.type === 'bridge') &&
          r.status === 'active'
      ),
    [toothRecords, patientId]
  );

  // For a given tooth, the "single" (non-group) partDiseases map
  const getPartDiseases = (toothNum) => {
    const records = (recordsByTooth.get(toothNum) ?? []).filter((r) => !r._isGroup);
    const out = {};
    for (const r of records) {
      if (r.type === 'implant') {
        out.implant = true;
        continue;
      }
      out[r.part] = r.condition_id;
    }
    return out;
  };

  // Whether the tooth is already an implant
  const isToothImplant = (n) => {
    const records = recordsByTooth.get(n) ?? [];
    return records.some((r) => r.type === 'implant' && !r._isGroup);
  };

  // Whether the tooth belongs to a group (ortho/bridge) and which
  const toothGroup = (n) => {
    const recs = recordsByTooth.get(n) ?? [];
    const g = recs.find((r) => r._isGroup);
    return g ? g : null;
  };

  // ----- Click handler for a tooth in the chart -----
  const handleToothClick = (n) => {
    if (groupMode) {
      // multi-select mode
      setGroupSelected((prev) => {
        const next = new Set(prev);
        if (next.has(n)) next.delete(n);
        else next.add(n);
        return next;
      });
      return;
    }
    // If tooth has a group, open group detail
    const g = toothGroup(n);
    if (g) {
      setEditingGroup(g);
      return;
    }
    setSingleTooth(n);
    setPartChoice('crown');
  };

  // ----- Single-tooth: add condition -----
  const handleSaveCondition = (conditionId) => {
    if (!singleTooth || !patientId) return;
    if (partChoice === 'implant') {
      addToothRecord({
        patient_id: patientId,
        type: 'implant',
        tooth_number: singleTooth,
        part: 'implant',
        condition_id: null,
        diagnosis: '',
        notes: '',
        next_visit_date: '',
      });
    } else {
      addToothRecord({
        patient_id: patientId,
        type: 'condition',
        tooth_number: singleTooth,
        part: partChoice,
        condition_id: conditionId,
        diagnosis: '',
        notes: '',
        next_visit_date: '',
      });
    }
    // NOTE: we intentionally do NOT close the popup here anymore.
    // Keeping it open lets the user add photos immediately after
    // saving ANY procedure (crown/root disease OR implant), not
    // just implants. The user closes manually with the X button.
  };

  // ----- Single-tooth: complete (mark as treated) -----
  const handleComplete = (recordId, extra) => {
    completeToothRecord(recordId, extra);
    setSingleTooth(null);
  };

  // ----- Single-tooth: delete -----
  const handleDelete = (recordId) => {
    deleteToothRecord(recordId);
    setSingleTooth(null);
  };

  // ----- Group: open multi-select mode -----
  const startGroupMode = (kind) => {
    setGroupMode({ kind, orthoType: kind === 'ortho' ? null : null });
    setGroupSelected(new Set());
  };
  const cancelGroupMode = () => {
    setGroupMode(null);
    setGroupSelected(new Set());
  };

  const setOrthoType = (typeId) => {
    setGroupMode((prev) => (prev ? { ...prev, orthoType: typeId } : prev));
  };

  const saveGroup = ({ diagnosis, notes, next_visit_date }) => {
    if (!groupMode) return;
    const toothArr = Array.from(groupSelected).sort((a, b) => a - b);
    if (toothArr.length === 0) return;
    addGroupRecord({
      patient_id: patientId,
      type: groupMode.kind,
      ortho_type: groupMode.kind === 'ortho' ? groupMode.orthoType : null,
      tooth_numbers: toothArr,
      diagnosis,
      notes,
      next_visit_date,
    });
    cancelGroupMode();
  };

  // ----- Existing group: complete or delete -----
  const onCompleteGroup = (id) => {
    completeGroupRecord(id);
    setEditingGroup(null);
  };
  const onDeleteGroup = (id) => {
    deleteGroupRecord(id);
    setEditingGroup(null);
  };

  if (!patient) {
    return (
      <PageLayout>
        <GlassCard className="!p-12 text-center">
          <p className="text-[var(--text-secondary)] text-lg">المريض غير موجود</p>
          <Button variant="glass" onClick={onClose} className="mt-4">
            عودة
          </Button>
        </GlassCard>
      </PageLayout>
    );
  }

  // Tooth display order based on age
  const upperOrder = isChild ? PRIMARY_UPPER_ORDER : UPPER_TEETH_ORDER;
  const lowerOrder = isChild ? PRIMARY_LOWER_ORDER : LOWER_TEETH_ORDER;
  const upperData = isChild ? PRIMARY_TEETH : TEETH_DATA;
  const lowerData = upperData;

  return (
    <PageLayout>
      {/* Patient header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <GlassCard variant="strong" className="!p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  'w-12 h-12 rounded-2xl flex items-center justify-center shadow-md text-white',
                  isChild
                    ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                    : 'bg-gradient-to-br from-nova-lime to-nova-lime-dark text-[var(--nova-deep)]'
                )}
              >
                {isChild ? <Baby className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  {patient.full_name}
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  {patient.age} سنة · {patient.gender} · {patient.region}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={clsx(
                  'px-3 py-1.5 rounded-xl text-sm font-semibold',
                  isChild
                    ? 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300'
                    : 'bg-nova-lime/20 text-nova-lime-dark'
                )}
              >
                {isChild ? '🦷 أسنان لبنية' : '🦷 أسنان دائمة'}
              </div>
              {onClose && (
                <Button variant="glass" size="sm" icon={X} onClick={onClose}>
                  إغلاق
                </Button>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Group-mode banner */}
      {groupMode && (
        <GroupModeBanner
          mode={groupMode}
          orthoTypes={ORTHO_TYPES}
          setOrthoType={setOrthoType}
          selectedCount={groupSelected.size}
          onCancel={cancelGroupMode}
          onSave={saveGroup}
        />
      )}

      {/* Action bar */}
      {!groupMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4"
        >
          <GlassCard className="!p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[var(--text-muted)] ml-2">
                إجراءات سريعة:
              </span>
              <Button
                size="sm"
                variant="glass"
                icon={Activity}
                onClick={() => startGroupMode('ortho')}
              >
                تقويم أسنان
              </Button>
              <Button
                size="sm"
                variant="glass"
                icon={Layers}
                onClick={() => startGroupMode('bridge')}
              >
                جسر أسنان
              </Button>
              {patientGroups.length > 0 && (
                <span className="text-xs text-[var(--text-muted)] mr-auto">
                  {patientGroups.length} مجموعة نشطة
                </span>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* The chart */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        <GlassCard variant="strong" className="!p-6">
          <JawRow
            label="═══ الفك العلوي ═══"
            order={upperOrder}
            data={upperData}
            recordsByTooth={recordsByTooth}
            groupMode={groupMode}
            groupSelected={groupSelected}
            onToothClick={handleToothClick}
          />

          <div className="my-4 h-px bg-gradient-to-r from-transparent via-nova-lime/40 to-transparent" />

          <JawRow
            label="═══ الفك السفلي ═══"
            order={lowerOrder}
            data={lowerData}
            recordsByTooth={recordsByTooth}
            groupMode={groupMode}
            groupSelected={groupSelected}
            onToothClick={handleToothClick}
            reverseLabel
          />

          {/* Quick stats */}
          <ChartStats recordsByTooth={recordsByTooth} />
        </GlassCard>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-4"
      >
        <LegendCard />
      </motion.div>

      {/* Single-tooth popup */}
      <AnimatePresence>
        {singleTooth && (
          <SingleToothPopup
            toothNumber={singleTooth}
            toothData={upperData[singleTooth] || lowerData[singleTooth]}
            patient={patient}
            partChoice={partChoice}
            setPartChoice={setPartChoice}
            records={(recordsByTooth.get(singleTooth) ?? []).filter((r) => !r._isGroup)}
            onClose={() => setSingleTooth(null)}
            onSave={handleSaveCondition}
            onComplete={handleComplete}
            onDelete={handleDelete}
            onAddImage={addImageToRecord}
            onRemoveImage={removeImageFromRecord}
          />
        )}
      </AnimatePresence>

      {/* Edit / view existing group */}
      <AnimatePresence>
        {editingGroup && (
          <GroupDetailModal
            group={editingGroup}
            onClose={() => setEditingGroup(null)}
            onComplete={onCompleteGroup}
            onDelete={onDeleteGroup}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            deleteToothRecord(pendingDelete);
            setPendingDelete(null);
            setSingleTooth(null);
          }
        }}
        title="حذف السجل"
        message="هل تريد حذف هذا السجل نهائياً؟ (لن يُحفظ في الأرشيف)"
        confirmText="حذف"
      />
    </PageLayout>
  );
};

// =============================================================
// Sub-components
// =============================================================

const JawRow = ({ label, order, data, recordsByTooth, groupMode, groupSelected, onToothClick, reverseLabel }) => (
  <div>
    {!reverseLabel && (
      <div className="text-center mb-2 text-xs font-bold text-[var(--text-muted)]">
        {label}
      </div>
    )}
    <div
      className="flex justify-center items-end gap-1 flex-wrap"
      dir="ltr"
    >
      {order.map((n) => {
        const recs = recordsByTooth.get(n) ?? [];
        const hasImplant = recs.some((r) => r.type === 'implant' && !r._isGroup);
        const hasOrtho = recs.some((r) => r.type === 'ortho' && r._isGroup);
        const hasBridge = recs.some((r) => r.type === 'bridge' && r._isGroup);
        return (
          <Tooth
            key={n}
            toothNumber={n}
            toothData={data[n]}
            partDiseases={getPartDiseasesForRender(n, recordsByTooth)}
            isSelected={Boolean(groupMode && groupSelected.has(n))}
            isMultiSelected={Boolean(groupMode && groupSelected.has(n))}
            isImplant={hasImplant}
            isOrtho={hasOrtho}
            isBridge={hasBridge}
            onClick={() => onToothClick(n)}
          />
        );
      })}
    </div>
    {reverseLabel && (
      <div className="text-center mt-2 text-xs font-bold text-[var(--text-muted)]">
        {label}
      </div>
    )}
  </div>
);

const getPartDiseasesForRender = (n, recordsByTooth) => {
  const recs = (recordsByTooth.get(n) ?? []).filter((r) => !r._isGroup);
  const out = {};
  for (const r of recs) {
    if (r.type === 'implant') {
      out.implant = true;
      continue;
    }
    out[r.part] = r.condition_id;
  }
  return out;
};

const ChartStats = ({ recordsByTooth }) => {
  const all = Array.from(recordsByTooth.values()).flat().filter((r) => !r._isGroup);
  const uniqueTeeth = new Set(all.map((r) => r.tooth_number)).size;
  const crownCount = all.filter((r) => r.part === 'crown' || r.part === 'both').length;
  const rootCount = all.filter((r) => r.part === 'root' || r.part === 'both').length;
  const implantCount = all.filter((r) => r.type === 'implant').length;
  return (
    <div className="mt-6 pt-5 border-t border-[var(--glass-border)]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <Stat label="أسنان مصابة" value={uniqueTeeth} color="text-red-500" />
        <Stat label="إجمالي الحالات" value={all.length} color="text-[var(--text-primary)]" />
        <Stat label="تاج" value={crownCount} color="text-orange-500" />
        <Stat label="جذر / زراعة" value={rootCount + implantCount} color="text-violet-500" />
      </div>
    </div>
  );
};

const Stat = ({ label, value, color }) => (
  <div className="p-3 rounded-xl bg-white/30 dark:bg-white/[0.03] border border-[var(--glass-border)]">
    <div className={clsx('text-2xl font-extrabold', color)}>{value}</div>
    <div className="text-xs text-[var(--text-muted)] mt-0.5">{label}</div>
  </div>
);

const LegendCard = () => {
  const items = [
    ...CROWN_CONDITIONS.map((c) => ({ ...c, type: 'crown' })),
    ...ROOT_CONDITIONS.map((c) => ({ ...c, type: 'root' })),
    { id: 'implant', name_ar: 'زراعة', color: CONDITION_COLORS.implant },
    { id: 'ortho', name_ar: 'تقويم', color: CONDITION_COLORS.ortho },
    { id: 'bridge', name_ar: 'جسر', color: CONDITION_COLORS.bridge },
  ];
  return (
    <GlassCard className="!p-4">
      <h3 className="font-bold text-[var(--text-primary)] text-sm mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-nova-lime-dark" />
        دليل الألوان
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 text-xs">
            <div
              className="w-3.5 h-3.5 rounded-md border border-[var(--glass-border)] flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[var(--text-secondary)] truncate">{item.name_ar}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// =============================================================
// Group Mode Banner (the multi-tooth flow)
// =============================================================
const GroupModeBanner = ({ mode, orthoTypes, setOrthoType, selectedCount, onCancel, onSave }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [nextVisit, setNextVisit] = useState('');

  const canSave =
    selectedCount > 0 &&
    (mode.kind === 'bridge' || Boolean(mode.orthoType));

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="mb-4"
    >
      <GlassCard variant="lime" className="!p-4">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2">
            {mode.kind === 'ortho' ? (
              <Activity className="w-5 h-5 text-nova-lime-dark" />
            ) : (
              <Layers className="w-5 h-5 text-nova-lime-dark" />
            )}
            <h3 className="font-bold text-[var(--text-primary)]">
              {mode.kind === 'ortho' ? 'إضافة تقويم أسنان' : 'إضافة جسر أسنان'}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/40 dark:bg-white/10 text-[var(--text-primary)]">
              {selectedCount} سن محدد
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={onCancel}>
              إلغاء
            </Button>
            <Button
              size="sm"
              variant="primary"
              icon={Save}
              onClick={() => onSave({ diagnosis, notes, next_visit_date: nextVisit })}
              disabled={!canSave}
            >
              حفظ
            </Button>
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary)] mb-3">
          اضغط على الأسنان في المخطط لتحديد/إلغاء تحديد
        </p>

        {mode.kind === 'ortho' && (
          <div className="mb-3">
            <Select
              label="نوع التقويم *"
              value={mode.orthoType ?? ''}
              onChange={(e) => setOrthoType(e.target.value)}
              placeholder="اختر نوع التقويم..."
              options={orthoTypes.map((o) => ({ value: o.id, label: o.name_ar }))}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Textarea
            label="تشخيص (اختياري)"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            rows={2}
            placeholder="مثال: ازدحام بسيط في الأسنان الأمامية..."
          />
          <Textarea
            label="ملاحظات (اختياري)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="أي ملاحظات إضافية..."
          />
        </div>

        <div className="mt-3 max-w-xs">
          <Input
            label="الموعد القادم (اختياري)"
            type="date"
            value={nextVisit}
            onChange={(e) => setNextVisit(e.target.value)}
          />
        </div>
      </GlassCard>
    </motion.div>
  );
};

// =============================================================
// Single-tooth popup (replaces old DiseasePopup)
// =============================================================
const SingleToothPopup = ({
  toothNumber,
  toothData,
  patient,
  partChoice,
  setPartChoice,
  records,
  onClose,
  onSave,
  onComplete,
  onDelete,
  onAddImage,
  onRemoveImage,
}) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [nextVisit, setNextVisit] = useState('');
  const [activeRecordId, setActiveRecordId] = useState(null);

  // Reset inputs when tooth changes
  useEffect(() => {
    setDiagnosis('');
    setNotes('');
    setNextVisit('');
    // Default to the most recently added record (last in the array)
    // so that right after saving a new procedure, its own image
    // uploader is the one shown — not the oldest record.
    setActiveRecordId(records[records.length - 1]?.id ?? null);
  }, [toothNumber, records.length]);

  // Keep activeRecordId valid as records change
  useEffect(() => {
    if (!records.find((r) => r.id === activeRecordId)) {
      setActiveRecordId(records[0]?.id ?? null);
    }
  }, [records, activeRecordId]);

  const conditions = partChoice === 'crown' ? CROWN_CONDITIONS : partChoice === 'root' ? ROOT_CONDITIONS : [];
  const alreadyImplant = records.some((r) => r.type === 'implant');
  const activeRecord = records.find((r) => r.id === activeRecordId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 30 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <GlassCard variant="strong" className="!p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[var(--glass-border)]">
            <div>
              <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                السن #{toothNumber}
              </h3>
              <p className="text-sm text-[var(--text-muted)]">{toothData?.name_ar}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/40 hover:bg-white/60 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-nova-lime"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4 text-[var(--text-primary)]" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto max-h-[70vh]">
            {/* Part selection */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-[var(--text-primary)] mb-2 block">
                اختر الجزء:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PART_OPTIONS.map((opt) => {
                  const disabled = opt.value === 'implant' && alreadyImplant;
                  const selected = partChoice === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={disabled}
                      onClick={() => setPartChoice(opt.value)}
                      className={clsx(
                        'p-3 rounded-xl border-2 transition-all',
                        selected
                          ? 'bg-nova-lime/30 border-nova-lime shadow-md'
                          : 'bg-white/30 dark:bg-white/5 border-[var(--glass-border)] hover:bg-white/50 dark:hover:bg-white/10',
                        disabled && 'opacity-40 cursor-not-allowed'
                      )}
                    >
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">
                        {opt.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Existing records (with Mark as Treated / Delete) */}
            {records.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                  السجلات الحالية ({records.length})
                </h4>
                <div className="space-y-2">
                  {records.map((r) => {
                    const cond = r.condition_id ? getConditionById(r.condition_id) : null;
                    const partLabel =
                      r.type === 'implant'
                        ? 'زراعة كاملة'
                        : r.part === 'crown'
                        ? 'تاج'
                        : r.part === 'root'
                        ? 'جذر'
                        : 'الكل';
                    const colorHex =
                      r.type === 'implant'
                        ? CONDITION_COLORS.implant
                        : safeColorLookup(r.condition_id);
                    return (
                      <div
                        key={r.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-[var(--glass-border)]"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: colorHex }}
                          />
                          <div>
                            <p className="font-semibold text-[var(--text-primary)] text-sm">
                              {r.type === 'implant' ? IMPLANT_INFO.name_ar : cond?.name_ar}
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">
                              {partLabel}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              onComplete(r.id, { diagnosis, notes, next_visit_date: nextVisit })
                            }
                            title="إنهاء العلاج (يُحفظ في الأرشيف)"
                            className="w-7 h-7 rounded-full bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-nova-lime"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(r.id)}
                            title="حذف (بدون أرشفة)"
                            className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-700 dark:text-red-300 flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-nova-lime"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Disease list / Implant notice */}
            {partChoice === 'implant' ? (
              <div className="rounded-xl border-2 border-dashed border-[var(--glass-border)] p-6 text-center">
                <div
                  className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center text-white text-2xl"
                  style={{ backgroundColor: CONDITION_COLORS.implant }}
                >
                  ⚙️
                </div>
                <h4 className="font-bold text-[var(--text-primary)] mb-1">
                  تسجيل زراعة سن كاملة
                </h4>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  سيتم تسجيل السن كزراعة كاملة، يحل محل السن الطبيعي
                </p>
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={() => onSave(null)}
                  disabled={alreadyImplant}
                >
                  تسجيل الزراعة
                </Button>
              </div>
            ) : null}

            {/* Images for the active record */}
            {activeRecord && (
              <div className="mt-5 pt-4 border-t border-[var(--glass-border)]">
                <ImageUploader
                  images={resolveImages(activeRecord.images)}
                  onAdd={(url) => onAddImage?.(activeRecord.id, url)}
                  onRemove={(idx) => onRemoveImage?.(activeRecord.id, idx)}
                />
                {(activeRecord.images ?? []).length > 0 && (
                  <div className="mt-3">
                    <ImageGallery images={resolveImages(activeRecord.images)} compact />
                  </div>
                )}
              </div>
            )}

            {/* Disease list (only if not implant) */}
            {partChoice !== 'implant' && (
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  اختر {partChoice === 'crown' ? 'حالة التاج' : 'حالة الجذر'}:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                  {conditions.map((c) => (
                    <motion.button
                      key={c.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSave(c.id)}
                      className="p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-[var(--glass-border)] hover:border-nova-lime/40 transition-all text-right focus:outline-none focus:ring-2 focus:ring-nova-lime"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="font-bold text-[var(--text-primary)] text-sm">
                          {c.name_ar}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-tight line-clamp-2">
                        {c.description}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Optional diagnosis / notes for the next add */}
            {partChoice !== 'implant' && (
              <div className="mt-4 space-y-3 border-t border-[var(--glass-border)] pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Textarea
                    label="تشخيص (اختياري)"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    rows={2}
                    placeholder="اكتب تشخيصك هنا..."
                  />
                  <Textarea
                    label="ملاحظات (اختياري)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="max-w-xs">
                  <Input
                    label="الموعد القادم (اختياري)"
                    type="date"
                    value={nextVisit}
                    onChange={(e) => setNextVisit(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

// =============================================================
// Group detail modal (for existing ortho/bridge)
// =============================================================
const GroupDetailModal = ({ group, onClose, onComplete, onDelete }) => {
  const typeInfo = group.type === 'ortho' ? ORTHO_INFO : BRIDGE_INFO;
  const orthoTypeName = group.ortho_type
    ? ORTHO_TYPES.find((o) => o.id === group.ortho_type)?.name_ar
    : null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg"
      >
        <GlassCard variant="strong" className="!p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: typeInfo.color }}
            >
              {group.type === 'ortho' ? <Activity className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {typeInfo.name_ar}
              </h3>
              {orthoTypeName && (
                <p className="text-sm text-[var(--text-muted)]">{orthoTypeName}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mr-auto w-8 h-8 rounded-full bg-white/40 hover:bg-white/60 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 mb-5">
            <div>
              <span className="text-xs text-[var(--text-muted)]">الأسنان المشاركة:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {(group.tooth_numbers ?? []).map((n) => (
                  <span
                    key={n}
                    className="px-2 py-0.5 rounded-md bg-nova-lime/20 text-nova-lime-dark text-xs font-bold"
                  >
                    #{n}
                  </span>
                ))}
              </div>
            </div>
            {group.diagnosis && (
              <div>
                <span className="text-xs text-[var(--text-muted)]">التشخيص:</span>
                <p className="text-sm text-[var(--text-primary)] mt-0.5">{group.diagnosis}</p>
              </div>
            )}
            {group.notes && (
              <div>
                <span className="text-xs text-[var(--text-muted)]">ملاحظات:</span>
                <p className="text-sm text-[var(--text-primary)] mt-0.5">{group.notes}</p>
              </div>
            )}
            {group.next_visit_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-[var(--text-muted)]">الموعد القادم:</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {group.next_visit_date}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-3 border-t border-[var(--glass-border)]">
            <Button
              variant="primary"
              icon={Check}
              onClick={() => onComplete(group.id)}
              fullWidth
            >
              إنهاء العلاج (أرشفة)
            </Button>
            <Button variant="danger" icon={Trash2} onClick={() => onDelete(group.id)}>
              حذف
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default ToothChart;
