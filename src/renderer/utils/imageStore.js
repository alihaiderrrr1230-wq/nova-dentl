// =============================================================
// Per-image localStorage store
// -------------------------------------------------------------
// WHY THIS EXISTS:
// Previously every image (as a base64 data URL) was stored INSIDE
// the single big Zustand-persisted blob alongside every patient,
// appointment, and tooth record. That blob gets fully re-serialized
// (JSON.stringify) and re-written to localStorage on EVERY store
// change — so as more images piled up over time, even unrelated
// actions (let alone adding a new photo) got slower and slower,
// eventually freezing the tab.
//
// Now each image lives in its OWN localStorage key. Tooth records
// only store a short image *id* (e.g. "img_abc123") instead of the
// full picture. Adding/removing a photo is now a single small,
// isolated write — it no longer touches (or re-serializes) the
// rest of the app's data at all.
// =============================================================

const PREFIX = 'nova-img-';

const newImageId = () =>
  `img_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

/** Save a data URL under its own key, returns the generated id. */
export const saveImage = (dataUrl) => {
  const id = newImageId();
  try {
    localStorage.setItem(PREFIX + id, dataUrl);
  } catch (e) {
    console.warn('Failed to save image (storage full?):', e);
  }
  return id;
};

/** Remove a stored image by id. Safe no-op if it doesn't exist. */
export const deleteImage = (id) => {
  if (!id) return;
  try {
    localStorage.removeItem(PREFIX + id);
  } catch {
    /* ignore */
  }
};

/**
 * Resolve a single image reference to a displayable data URL.
 * Backward-compatible: old records (saved before this change)
 * still hold the raw data URL directly — those are returned as-is.
 */
export const resolveImage = (ref) => {
  if (!ref) return null;
  if (ref.startsWith('data:')) return ref; // legacy: already a data URL
  try {
    return localStorage.getItem(PREFIX + ref) ?? null;
  } catch {
    return null;
  }
};

/** Resolve a whole array of image refs (ids or legacy data URLs). */
export const resolveImages = (refs) =>
  (refs ?? []).map(resolveImage).filter(Boolean);
