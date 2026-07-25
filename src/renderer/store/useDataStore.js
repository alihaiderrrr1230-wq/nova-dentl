// Store مركزي لكل البيانات — Zustand
// يُستخدم في كل الصفحات
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DISEASES, TREATMENT_PLANS, MATERIALS, PATIENTS, APPOINTMENTS, DOCTOR_INFO } from '../../../data/seed.js';

export const useDataStore = create(
  persist(
    (set, get) => ({
      // البيانات الأساسية
      diseases: DISEASES,
      treatmentPlans: TREATMENT_PLANS,
      materials: MATERIALS,
      patients: PATIENTS,
      appointments: APPOINTMENTS,
      doctorInfo: DOCTOR_INFO,
      
      // سجل الأسنان لكل مريض
      toothRecords: [],
      
      // العلاجات المنفذة
      treatments: [],
      
      // سجل الزيارات (للأرشيف)
      visitsLog: [],
      
      // ========== المرضى ==========
      addPatient: (patient) => {
        const newPatient = { ...patient, id: Date.now(), created_at: new Date().toISOString() };
        set((state) => ({
          patients: [...state.patients, newPatient]
        }));
        return newPatient;
      },
      
      updatePatient: (id, updates) => set((state) => ({
        patients: state.patients.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p)
      })),
      
      deletePatient: (id) => set((state) => ({
        patients: state.patients.filter(p => p.id !== id),
        appointments: state.appointments.filter(a => a.patient_id !== id),
      })),
      
      // ========== الحجوزات ==========
      addAppointment: (appointment) => set((state) => ({
        appointments: [...state.appointments, { ...appointment, id: Date.now(), created_at: new Date().toISOString() }]
      })),
      
      updateAppointment: (id, updates) => set((state) => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, ...updates } : a)
      })),
      
      deleteAppointment: (id) => set((state) => ({
        appointments: state.appointments.filter(a => a.id !== id)
      })),
      
      // ========== المخزن ==========
      addMaterial: (material) => set((state) => ({
        materials: [...state.materials, { ...material, id: Date.now() }]
      })),
      
      updateMaterial: (id, updates) => set((state) => ({
        materials: state.materials.map(m => m.id === id ? { ...m, ...updates } : m)
      })),
      
      deleteMaterial: (id) => set((state) => ({
        materials: state.materials.filter(m => m.id !== id)
      })),
      
      // خصم من المخزن عند الاستخدام
      useMaterial: (materialId, quantity) => set((state) => ({
        materials: state.materials.map(m => 
          m.id === materialId 
            ? { ...m, current_quantity: Math.max(0, m.current_quantity - quantity) }
            : m
        )
      })),
      
      // ========== الأسنان ==========
      addToothRecord: (record) => set((state) => ({
        toothRecords: [...state.toothRecords, { ...record, id: Date.now(), created_at: new Date().toISOString() }]
      })),
      
      deleteToothRecord: (id) => set((state) => ({
        toothRecords: state.toothRecords.filter(r => r.id !== id)
      })),
      
      getPatientTeeth: (patientId) => {
        return get().toothRecords.filter(r => r.patient_id === patientId);
      },
      
      // ========== العلاجات ==========
      addTreatment: (treatment) => set((state) => ({
        treatments: [...state.treatments, { 
          ...treatment, 
          id: Date.now(), 
          visit_date: new Date().toISOString(),
          created_at: new Date().toISOString()
        }]
      })),
      
      // ========== إعدادات الطبيب ==========
      updateDoctorInfo: (updates) => set((state) => ({
        doctorInfo: { ...state.doctorInfo, ...updates }
      })),
      
      // ========== الحفظ ==========
      clearAll: () => set({
        toothRecords: [],
        treatments: [],
        visitsLog: [],
      }),
    }),
    {
      name: 'nova-dental-storage',  // اسم المفتاح في localStorage
      version: 1,
    }
  )
);
