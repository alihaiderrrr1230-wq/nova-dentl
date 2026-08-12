// =============================================================
// NOVA v2 — Central state store (Zustand + persist)
// -------------------------------------------------------------
// All app state lives here. Persists to localStorage with
// key `nova-dental-storage` (version 1).
// =============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  PATIENTS,
  APPOINTMENTS,
  DOCTOR_INFO,
  CROWN_CONDITIONS,
  ROOT_CONDITIONS,
  ALL_CONDITIONS,
  IMPLANT_INFO,
  ORTHO_INFO,
  BRIDGE_INFO,
  SAMPLE_TOOTH_RECORDS,
  SAMPLE_MEDICAL_HISTORY,
} from '@data/seed';
import { newId } from '@utils/id';
import { saveImage, deleteImage } from '@utils/imageStore';

// -------------------------------------------------------------
// Store shape & actions
// -------------------------------------------------------------

const initialState = {
  // Theme — persisted, applied by <html class="dark">
  theme: 'light',

  // Core entities
  patients: PATIENTS,
  appointments: APPOINTMENTS,
  doctorInfo: DOCTOR_INFO,

  // Conditions (crown + root + special)
  crownConditions: CROWN_CONDITIONS,
  rootConditions: ROOT_CONDITIONS,

  // Active tooth records (diseases, implants, ortho, bridge)
  // shape: { id, patient_id, type, tooth_number/part/teeth,
  //          condition_id, ortho_type, status, diagnosis, notes, next_visit_date, created_at }
  toothRecords: SAMPLE_TOOTH_RECORDS,

  // Permanent medical history (auto-archived from "Mark as Treated")
  // shape: { id, patient_id, patient_name, patient_age_at_treatment,
  //          visit_date, tooth_number, part, condition_id, condition_name_ar,
  //          diagnosis, notes, next_visit_date, type }
  medicalHistory: SAMPLE_MEDICAL_HISTORY,
};

// -------------------------------------------------------------
// Debounced localStorage adapter
// -------------------------------------------------------------
// Writing the FULL persisted state (which can include many
// base64 images) synchronously on every single change is what
// causes the UI to freeze/hang, especially right after adding
// a photo. We debounce the actual localStorage.setItem call so
// rapid successive changes (e.g. adding several photos back to
// back) collapse into a single write instead of one per change.
const DEBOUNCE_MS = 500;
let debounceTimer = null;
let pendingWrite = null;
const flushPendingWrite = () => {
  if (pendingWrite) {
    try {
      localStorage.setItem(pendingWrite.name, pendingWrite.value);
    } catch (e) {
      console.warn('Persist flush failed:', e);
    }
    pendingWrite = null;
  }
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
};
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushPendingWrite);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushPendingWrite();
  });
}
const debouncedLocalStorage = {
  getItem: (name) => localStorage.getItem(name),
  setItem: (name, value) => {
    pendingWrite = { name, value };
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(flushPendingWrite, DEBOUNCE_MS);
  },
  removeItem: (name) => localStorage.removeItem(name),
};

export const useDataStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // ---------------------------------------------------------
      // Theme
      // ---------------------------------------------------------
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: next });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', next === 'dark');
        }
      },
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },

      // ---------------------------------------------------------
      // Patients
      // ---------------------------------------------------------
      addPatient: (data) => {
        const patient = {
          ...data,
          id: newId(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ patients: [patient, ...state.patients] }));
        return patient;
      },
      updatePatient: (id, updates) => {
        set((state) => ({
          patients: state.patients.map((p) =>
            p.id === id
              ? { ...p, ...updates, updated_at: new Date().toISOString() }
              : p
          ),
        }));
      },
      deletePatient: (id) => {
        const state = get();
        state.toothRecords
          .filter((r) => r.patient_id === id)
          .forEach((r) => (r.images ?? []).forEach(deleteImage));
        state.medicalHistory
          .filter((h) => h.patient_id === id)
          .forEach((h) => (h.images ?? []).forEach(deleteImage));
        set((state) => ({
          patients: state.patients.filter((p) => p.id !== id),
          appointments: state.appointments.filter((a) => a.patient_id !== id),
          toothRecords: state.toothRecords.filter((r) => r.patient_id !== id),
          medicalHistory: state.medicalHistory.filter((h) => h.patient_id !== id),
        }));
      },

      // ---------------------------------------------------------
      // Appointments
      // ---------------------------------------------------------
      addAppointment: (data) => {
        const appt = {
          ...data,
          id: newId(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ appointments: [appt, ...state.appointments] }));
        return appt;
      },
      updateAppointment: (id, updates) => {
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        }));
      },
      deleteAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        }));
      },

      // ---------------------------------------------------------
      // Tooth records
      // ---------------------------------------------------------
      /**
       * Add a regular disease (crown/root) or implant to a tooth.
       * `data` must include: patient_id, tooth_number, part ('crown'|'root'|'implant'),
       *   condition_id (numeric) OR set type='implant'.
       * Optional: images: string[] (data URLs).
       */
      addToothRecord: (data) => {
        const record = {
          ...data,
          images: data.images ?? [],
          id: newId(),
          status: 'active',
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          toothRecords: [...state.toothRecords, record],
        }));
        return record;
      },

      /** Update an existing active tooth record. */
      updateToothRecord: (id, updates) => {
        set((state) => ({
          toothRecords: state.toothRecords.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      /**
       * Append a single image to a tooth record.
       * @param {string} id
       * @param {string} dataUrl
       */
      addImageToRecord: (id, dataUrl) => {
        const imgId = saveImage(dataUrl);
        set((state) => ({
          toothRecords: state.toothRecords.map((r) =>
            r.id === id
              ? { ...r, images: [...(r.images ?? []), imgId] }
              : r
          ),
        }));
      },

      /** Remove a specific image (by index) from a tooth record. */
      removeImageFromRecord: (id, index) => {
        set((state) => ({
          toothRecords: state.toothRecords.map((r) => {
            if (r.id !== id) return r;
            const next = [...(r.images ?? [])];
            const [removedRef] = next.splice(index, 1);
            deleteImage(removedRef);
            return { ...r, images: next };
          }),
        }));
      },

      /**
       * Hard-delete a tooth record (used for "wrong diagnosis" corrections).
       * Does NOT archive to medical history.
       */
      deleteToothRecord: (id) => {
        const state = get();
        const record = state.toothRecords.find((r) => r.id === id);
        (record?.images ?? []).forEach(deleteImage);
        set((state) => ({
          toothRecords: state.toothRecords.filter((r) => r.id !== id),
        }));
      },

      /**
       * Mark a tooth record as Treated:
       *   - remove from active list
       *   - append a permanent record to medicalHistory (with images)
       *   - include patient_name & age-at-time-of-treatment
       */
      completeToothRecord: (id, extra = {}) => {
        const state = get();
        const record = state.toothRecords.find((r) => r.id === id);
        if (!record) return;
        const patient = state.patients.find((p) => p.id === record.patient_id);
        if (!patient) return;

        let conditionNameAr = '';
        if (record.type === 'implant') {
          conditionNameAr = IMPLANT_INFO.name_ar;
        } else if (record.type === 'ortho') {
          conditionNameAr = ORTHO_INFO.name_ar;
        } else if (record.type === 'bridge') {
          conditionNameAr = BRIDGE_INFO.name_ar;
        } else {
          const cond = ALL_CONDITIONS.find((c) => c.id === record.condition_id);
          conditionNameAr = cond?.name_ar ?? '';
        }

        const historyEntry = {
          id: newId(),
          patient_id: patient.id,
          patient_name: patient.full_name,
          patient_age_at_treatment: patient.age,
          visit_date: new Date().toISOString(),
          tooth_number: record.tooth_number ?? null,
          tooth_numbers: record.tooth_numbers ?? null,
          part: record.part ?? null,
          type: record.type ?? 'condition',
          ortho_type: record.ortho_type ?? null,
          condition_id: record.condition_id ?? null,
          condition_name_ar: conditionNameAr,
          diagnosis: record.diagnosis ?? extra.diagnosis ?? '',
          notes: record.notes ?? extra.notes ?? '',
          next_visit_date: record.next_visit_date ?? extra.next_visit_date ?? '',
          images: [...(record.images ?? [])],
        };

        set({
          toothRecords: state.toothRecords.filter((r) => r.id !== id),
          medicalHistory: [historyEntry, ...state.medicalHistory],
        });
        return historyEntry;
      },

      // ---------------------------------------------------------
      // Multi-tooth groups: orthodontics / bridge
      // ---------------------------------------------------------
      /**
       * Add an orthodontics or bridge record spanning multiple teeth.
       * data: { patient_id, type: 'ortho'|'bridge', tooth_numbers: [...],
       *         ortho_type?: string, diagnosis, notes, next_visit_date }
       */
      addGroupRecord: (data) => {
        const record = {
          ...data,
          images: data.images ?? [],
          id: newId(),
          status: 'active',
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          toothRecords: [...state.toothRecords, record],
        }));
        return record;
      },

      deleteGroupRecord: (id) => {
        set((state) => ({
          toothRecords: state.toothRecords.filter((r) => r.id !== id),
        }));
      },

      completeGroupRecord: (id) => {
        const state = get();
        const record = state.toothRecords.find((r) => r.id === id);
        if (!record) return;
        const patient = state.patients.find((p) => p.id === record.patient_id);
        if (!patient) return;

        const nameAr =
          record.type === 'ortho' ? ORTHO_INFO.name_ar : BRIDGE_INFO.name_ar;

        const historyEntry = {
          id: newId(),
          patient_id: patient.id,
          patient_name: patient.full_name,
          patient_age_at_treatment: patient.age,
          visit_date: new Date().toISOString(),
          tooth_number: null,
          tooth_numbers: record.tooth_numbers ?? null,
          part: null,
          type: record.type,
          ortho_type: record.ortho_type ?? null,
          condition_id: null,
          condition_name_ar: nameAr,
          diagnosis: record.diagnosis ?? '',
          notes: record.notes ?? '',
          next_visit_date: record.next_visit_date ?? '',
          images: [...(record.images ?? [])],
        };
        set({
          toothRecords: state.toothRecords.filter((r) => r.id !== id),
          medicalHistory: [historyEntry, ...state.medicalHistory],
        });
        return historyEntry;
      },

      // ---------------------------------------------------------
      // Doctor info
      // ---------------------------------------------------------
      updateDoctorInfo: (updates) => {
        set((state) => ({ doctorInfo: { ...state.doctorInfo, ...updates } }));
      },

      // ---------------------------------------------------------
      // Reset
      // ---------------------------------------------------------
      /**
       * Clear all dynamic data (tooth records, history) but keep
       * patients/appointments/conditions/theme/doctor. Useful for
       * the "clean slate" debug action.
       */
      clearDynamic: () => {
        set({ toothRecords: [], medicalHistory: [] });
      },
    }),
    {
      name: 'nova-dental-storage',
      version: 1,
      storage: createJSONStorage(() => debouncedLocalStorage),
      partialize: (state) => ({
        theme: state.theme,
        patients: state.patients,
        appointments: state.appointments,
        doctorInfo: state.doctorInfo,
        toothRecords: state.toothRecords,
        medicalHistory: state.medicalHistory,
      }),
    }
  )
);

// -------------------------------------------------------------
// Hydration helper: apply persisted theme to <html> ASAP.
// Called from main.jsx (and from the inline init script in index.html).
// -------------------------------------------------------------
export const applyPersistedTheme = () => {
  if (typeof document === 'undefined') return;
  try {
    const stored = localStorage.getItem('nova-dental-storage');
    if (!stored) return;
    const parsed = JSON.parse(stored);
    const theme = parsed?.state?.theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch {
    /* noop */
  }
};
