// مكون السن الواحد — رسمة SVG دقيقة (تاج + جذر) + تفاعل
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DISEASE_COLORS } from '../../utils/colors.js';

const Tooth = ({ 
  toothNumber, 
  toothData, 
  partDiseases,  // { crown: diseaseId, root: diseaseId, both: diseaseId }
  size = 'normal',  // 'small' | 'normal' | 'large'
  isSelected = false,
  onClick,
  isChild = false,
}) => {
  const [hover, setHover] = useState(false);

  // الأبعاد حسب الحجم
  const dims = {
    small: { width: 28, height: 60, crownH: 30, rootH: 25, fontSize: 7 },
    normal: { width: 36, height: 80, crownH: 42, rootH: 32, fontSize: 8 },
    large: { width: 44, height: 100, crownH: 52, rootH: 40, fontSize: 9 },
  }[size];

  // لون السن الأساسي
  const baseColor = '#ffffff';
  const strokeColor = '#003a5c';

  // الحصول على لون المرض لكل جزء
  const getPartColor = (part) => {
    const diseaseId = partDiseases[part];
    if (!diseaseId) return null;
    return DISEASE_COLORS[diseaseId] || '#95A5A6';
  };

  const crownDisease = getPartColor('crown');
  const rootDisease = getPartColor('root');
  const hasBothDisease = partDiseases.both;

  // تحديد أي جزء يرسم بلون
  const renderPart = (part, isTop) => {
    const disease = part === 'crown' ? crownDisease : rootDisease;
    const fill = disease || (hasBothDisease ? DISEASE_COLORS[hasBothDisease] : baseColor);
    const opacity = disease || hasBothDisease ? 0.85 : 1;
    
    return (
      <path
        d={isTop ? getCrownPath() : getRootPath()}
        fill={fill}
        opacity={opacity}
        stroke={strokeColor}
        strokeWidth="0.8"
        style={{ transition: 'all 0.3s ease' }}
      />
    );
  };

  // مسار التاج (الجزء العلوي)
  const getCrownPath = () => {
    const w = dims.width;
    const crownW = w * 0.85;
    const offsetX = (w - crownW) / 2;
    const crownH = dims.crownH;
    
    // شكل التاج — بيضاوي مع نتوءات
    if (toothData.type === 'molar') {
      // ضرس — مستطيل مع 4 نتوءات
      return `M ${offsetX} ${crownH * 0.4}
              Q ${offsetX - 1} ${crownH * 0.1} ${offsetX + crownW * 0.15} 0
              L ${offsetX + crownW * 0.3} ${-2}
              L ${offsetX + crownW * 0.5} ${-1}
              L ${offsetX + crownW * 0.7} ${-2}
              L ${offsetX + crownW * 0.85} 0
              Q ${offsetX + crownW + 1} ${crownH * 0.1} ${offsetX + crownW} ${crownH * 0.4}
              L ${offsetX + crownW} ${crownH}
              L ${offsetX} ${crownH} Z`;
    } else if (toothData.type === 'premolar') {
      // ضاحك — شكل بيضاوي مع نتوءين
      return `M ${offsetX} ${crownH * 0.3}
              Q ${offsetX} 0 ${offsetX + crownW * 0.3} 0
              Q ${offsetX + crownW * 0.5} ${-2} ${offsetX + crownW * 0.7} 0
              Q ${offsetX + crownW} 0 ${offsetX + crownW} ${crownH * 0.3}
              L ${offsetX + crownW} ${crownH}
              L ${offsetX} ${crownH} Z`;
    } else if (toothData.type === 'canine') {
      // ناب — مثلث مدبب
      return `M ${offsetX} ${crownH * 0.4}
              L ${offsetX + crownW * 0.3} ${-3}
              L ${offsetX + crownW * 0.5} ${-5}
              L ${offsetX + crownW * 0.7} ${-3}
              L ${offsetX + crownW} ${crownH * 0.4}
              L ${offsetX + crownW} ${crownH}
              L ${offsetX} ${crownH} Z`;
    } else {
      // قاطع — مستطيل بيضاوي
      return `M ${offsetX} ${crownH * 0.2}
              Q ${offsetX - 1} 0 ${offsetX + crownW * 0.1} 0
              L ${offsetX + crownW * 0.9} 0
              Q ${offsetX + crownW + 1} 0 ${offsetX + crownW} ${crownH * 0.2}
              L ${offsetX + crownW} ${crownH}
              L ${offsetX} ${crownH} Z`;
    }
  };

  // مسار الجذر
  const getRootPath = () => {
    const w = dims.width;
    const crownW = w * 0.85;
    const offsetX = (w - crownW) / 2;
    const rootH = dims.rootH;
    
    if (toothData.type === 'molar') {
      // ضرس — جذران أو ثلاثة
      return `M ${offsetX + crownW * 0.1} 0
              L ${offsetX + crownW * 0.2} ${rootH * 0.7}
              L ${offsetX + crownW * 0.15} ${rootH}
              L ${offsetX + crownW * 0.3} ${rootH * 0.9}
              L ${offsetX + crownW * 0.5} ${rootH}
              L ${offsetX + crownW * 0.7} ${rootH * 0.9}
              L ${offsetX + crownW * 0.85} ${rootH}
              L ${offsetX + crownW * 0.8} ${rootH * 0.7}
              L ${offsetX + crownW * 0.9} 0 Z`;
    } else if (toothData.type === 'premolar') {
      // ضاحك — جذر واحد (أو اثنين)
      return `M ${offsetX + crownW * 0.25} 0
              L ${offsetX + crownW * 0.2} ${rootH}
              L ${offsetX + crownW * 0.5} ${rootH}
              L ${offsetX + crownW * 0.5} ${rootH * 0.5}
              L ${offsetX + crownW * 0.5} ${rootH}
              L ${offsetX + crownW * 0.8} ${rootH}
              L ${offsetX + crownW * 0.75} 0 Z`;
    } else if (toothData.type === 'canine') {
      // ناب — جذر طويل واحد
      return `M ${offsetX + crownW * 0.3} 0
              L ${offsetX + crownW * 0.35} ${rootH}
              L ${offsetX + crownW * 0.65} ${rootH}
              L ${offsetX + crownW * 0.7} 0 Z`;
    } else {
      // قاطع — جذر واحد
      return `M ${offsetX + crownW * 0.35} 0
              L ${offsetX + crownW * 0.4} ${rootH}
              L ${offsetX + crownW * 0.6} ${rootH}
              L ${offsetX + crownW * 0.65} 0 Z`;
    }
  };

  // تحديد حالة السن (محدد / عادي)
  const hasDisease = crownDisease || rootDisease || hasBothDisease;
  const isHighlighted = isSelected || hover || hasDisease;

  // التاج
  const crownPath = renderPart('crown', true);
  // الجذر
  const rootPath = renderPart('root', false);

  // تحديد إذا كان تقويم
  const isOrthodontic = hasBothDisease === 5 || crownDisease === 5 || rootDisease === 5;

  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`tooth inline-flex flex-col items-center cursor-pointer relative ${
        isSelected ? 'tooth-selected' : ''
      }`}
      style={{
        filter: isHighlighted ? `drop-shadow(0 0 6px ${hasDisease ? DISEASE_COLORS[hasDisease || crownDisease || rootDisease] : '#8cea23'})` : 'none',
      }}
      title={`${toothData.name_ar} (#${toothNumber})`}
    >
      {/* SVG السن */}
      <svg 
        width={dims.width} 
        height={dims.height} 
        viewBox={`0 0 ${dims.width} ${dims.height}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={`grad-${toothNumber}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.95" />
            <stop offset="100%" stopColor="white" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id={`grad-crown-${toothNumber}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.95" />
            <stop offset="100%" stopColor="white" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* خلفية بيضاء */}
        <rect x="0" y="0" width={dims.width} height={dims.height} fill="transparent" />

        {/* التاج */}
        <g transform="translate(0, 0)">
          {crownPath}
        </g>

        {/* الجذر */}
        <g transform={`translate(0, ${dims.crownH})`}>
          {rootPath}
        </g>

        {/* لمعان على التاج */}
        <ellipse 
          cx={dims.width * 0.35} 
          cy={dims.crownH * 0.2} 
          rx={dims.width * 0.08} 
          ry={dims.crownH * 0.1} 
          fill="white" 
          opacity="0.5" 
        />

        {/* رسم التقويم (إذا كان مريض تقويم) */}
        {isOrthodontic && (
          <g>
            {/* سلك التقويم الأفقي */}
            <line
              x1={-2}
              y1={dims.crownH * 0.3}
              x2={dims.width + 2}
              y2={dims.crownH * 0.3}
              stroke="#003a5c"
              strokeWidth="1.5"
            />
            {/* بريسز التقويم */}
            <rect
              x={dims.width * 0.3}
              y={dims.crownH * 0.2}
              width={dims.width * 0.4}
              height={dims.crownH * 0.2}
              fill="#a8d8ea"
              stroke="#003a5c"
              strokeWidth="0.5"
              rx="2"
            />
          </g>
        )}

        {/* رقم السن */}
        <text
          x={dims.width / 2}
          y={-6}
          textAnchor="middle"
          fontSize={dims.fontSize}
          fill="#003a5c"
          fontWeight="700"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {toothNumber}
        </text>
      </svg>
    </motion.div>
  );
};

export default Tooth;
