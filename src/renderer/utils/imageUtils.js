// =============================================================
// Image utilities
// -------------------------------------------------------------
// - readFileAsDataURL: read a File into a base64 data URL
// - compressImage: resize + JPEG-compress to stay within
//   reasonable size limits (localStorage has ~5MB cap)
// - formatBytes: tiny human-readable byte formatter
// - estimateStorageUsage: total bytes used in localStorage
// =============================================================

const DEFAULT_MAX_DIMENSION = 640;
const DEFAULT_QUALITY = 0.6;

/**
 * Read a File as a data URL (base64).
 * @param {File} file
 * @returns {Promise<string>}
 */
export const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

/**
 * Compress an image to a smaller data URL.
 * - Resizes so the longest side is at most `maxDim`.
 * - Outputs JPEG at `quality` (ignored for PNGs without alpha).
 *
 * Uses `createImageBitmap` when available: browsers decode the image
 * off the main thread with this API, so large gallery/camera photos
 * (which can be 5-15MB) don't freeze the UI while decoding. Falls
 * back to the classic <img> + canvas approach on older browsers.
 *
 * @param {string} dataUrl - the source image (any browser-supported format)
 * @param {object} [opts]
 * @param {number} [opts.maxDim=640]
 * @param {number} [opts.quality=0.6]
 * @returns {Promise<string>} compressed data URL
 */
export const compressImage = async (
  dataUrl,
  { maxDim = DEFAULT_MAX_DIMENSION, quality = DEFAULT_QUALITY } = {}
) => {
  const wasPng = /^data:image\/png/i.test(dataUrl);

  const drawToCanvas = (source, sw, sh) => {
    const scale = Math.min(1, maxDim / Math.max(sw, sh));
    const w = Math.round(sw * scale);
    const h = Math.round(sh * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(source, 0, 0, w, h);
    return wasPng && quality >= 0.9
      ? canvas.toDataURL('image/png')
      : canvas.toDataURL('image/jpeg', quality);
  };

  // Preferred path: off-main-thread decode via createImageBitmap.
  if (typeof createImageBitmap === 'function') {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const bitmap = await createImageBitmap(blob);
      const out = drawToCanvas(bitmap, bitmap.width, bitmap.height);
      bitmap.close?.();
      if (out) return out;
    } catch {
      // fall through to the <img> fallback below
    }
  }

  // Fallback for browsers without createImageBitmap support.
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const out = drawToCanvas(img, img.width, img.height);
      resolve(out ?? dataUrl);
    };
    img.onerror = () => reject(new Error('فشل تحميل الصورة'));
    img.src = dataUrl;
  });
};

/**
 * Process a File: read + compress in one step.
 * When createImageBitmap is available, we decode straight from the
 * File (skipping the base64 round-trip) for the fastest, most
 * off-main-thread path — this is the case that matters most for
 * large gallery/camera photos that used to freeze the UI.
 * @param {File} file
 * @param {object} [opts]
 * @returns {Promise<string>}
 */
export const processImageFile = async (file, opts) => {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('الملف ليس صورة');
  }

  if (typeof createImageBitmap === 'function') {
    try {
      const {
        maxDim = DEFAULT_MAX_DIMENSION,
        quality = DEFAULT_QUALITY,
      } = opts ?? {};
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
      const w = Math.round(bitmap.width * scale);
      const h = Math.round(bitmap.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(bitmap, 0, 0, w, h);
        bitmap.close?.();
        const wasPng = file.type === 'image/png';
        return wasPng && quality >= 0.9
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', quality);
      }
      bitmap.close?.();
    } catch {
      // fall through to the dataURL-based path below
    }
  }

  const dataUrl = await readFileAsDataURL(file);
  return compressImage(dataUrl, opts);
};

/** Human-readable bytes. */
export const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/** Total localStorage usage in bytes (for quota warnings). */
export const estimateStorageUsage = () => {
  if (typeof localStorage === 'undefined') return 0;
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const value = localStorage.getItem(key) ?? '';
    total += key.length + value.length;
  }
  // Each char in JS is 2 bytes (UTF-16)
  return total * 2;
};

/** Soft cap for warning (~3MB). Hard cap (~4.5MB). */
export const STORAGE_WARN_BYTES = 3 * 1024 * 1024;
export const STORAGE_HARD_BYTES = 4.5 * 1024 * 1024;
