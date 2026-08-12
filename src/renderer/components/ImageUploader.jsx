// =============================================================
// ImageUploader — drag-and-drop + file picker for medical images
// -------------------------------------------------------------
// - Compresses & resizes before storing
// - Shows a soft warning when localStorage approaches the cap
// - Thumbnail grid + remove buttons
// =============================================================

import { useRef, useState } from 'react';
import { Camera, ImagePlus, X, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  processImageFile,
  estimateStorageUsage,
  formatBytes,
  STORAGE_WARN_BYTES,
  STORAGE_HARD_BYTES,
} from '@utils/imageUtils';
import { clsx } from '@utils/clsx';

const ImageUploader = ({ images = [], onAdd, onRemove, max = 12, compact = false }) => {
  const inputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    setLoading(true);
    try {
      const remaining = max - images.length;
      const files = Array.from(fileList).slice(0, remaining);
      for (const file of files) {
        // Check storage cap before processing
        const usage = estimateStorageUsage();
        if (usage > STORAGE_HARD_BYTES) {
          setError('ذاكرة الجهاز ممتلئة تقريباً — احذف بعض الصور أو البيانات أولاً');
          break;
        }
        try {
          const dataUrl = await processImageFile(file);
          onAdd?.(dataUrl);
        } catch (err) {
          setError(err.message || 'فشل تحميل إحدى الصور');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const usage = estimateStorageUsage();
  const nearLimit = usage > STORAGE_WARN_BYTES;

  return (
    <div>
      {/* Hidden file inputs: one for gallery, one that opens the camera directly */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            {images.length} {images.length === 1 ? 'صورة' : 'صور'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={loading || images.length >= max}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition',
              'bg-nova-lime text-[var(--nova-deep)] hover:bg-nova-lime-dark',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus:outline-none focus:ring-2 focus:ring-nova-lime'
            )}
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
            التقاط صورة
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading || images.length >= max}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition',
              'bg-nova-lime/20 text-nova-lime-dark hover:bg-nova-lime/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'focus:outline-none focus:ring-2 focus:ring-nova-lime'
            )}
          >
            <ImagePlus className="w-3.5 h-3.5" />
            من المعرض
          </button>
        </div>
      </div>

      {/* Storage warning */}
      {nearLimit && (
        <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2 mb-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            استخدام التخزين: {formatBytes(usage)} من ~5 MB. قد تواجه قيوداً قريباً.
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-xs text-red-500 bg-red-500/10 rounded-lg px-3 py-2 mb-2">
          {error}
        </div>
      )}

      {/* Drop zone + thumbnails */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer?.files);
        }}
        onClick={() => !loading && images.length < max && inputRef.current?.click()}
        className={clsx(
          'rounded-2xl border-2 border-dashed transition cursor-pointer overflow-hidden',
          dragOver
            ? 'border-nova-lime bg-nova-lime/10'
            : 'border-[var(--glass-border)] bg-white/20 dark:bg-white/[0.02] hover:border-nova-lime/40',
          !compact ? 'p-2 min-h-[100px]' : 'p-1.5 min-h-[80px]'
        )}
      >
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-4 text-center">
            <Camera
              className={clsx(
                'text-[var(--text-muted)]/50',
                compact ? 'w-6 h-6' : 'w-8 h-8'
              )}
            />
            <p className="text-xs text-[var(--text-muted)] mt-1.5">
              اسحب الصور هنا أو اضغط للإضافة
            </p>
            <p className="text-2xs text-[var(--text-muted)]/60 mt-0.5">
              JPG / PNG — يٌضغط تلقائياً
            </p>
          </div>
        ) : (
          <div className={clsx('grid gap-1.5', compact ? 'grid-cols-4' : 'grid-cols-3')}>
            <AnimatePresence>
              {images.map((src, i) => (
                <motion.div
                  key={src.slice(-32) + i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  layout
                  className="relative group rounded-xl overflow-hidden border border-[var(--glass-border)] aspect-square bg-white/30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={src}
                    alt={`صورة ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemove?.(i)}
                    className="absolute top-1 left-1 w-6 h-6 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition focus:opacity-100 focus:outline-none"
                    aria-label="حذف الصورة"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
