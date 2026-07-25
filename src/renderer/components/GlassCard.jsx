// مكون البطاقة الزجاجية — المكون الأساسي في كل الواجهات
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  variant = 'default',  // 'default' | 'strong' | 'dark' | 'lime'
  onClick,
  hoverable = true,
  ...props 
}) => {
  const variants = {
    default: 'glass',
    strong: 'glass-strong',
    dark: 'glass-dark',
    lime: 'glass-lime',
  };

  const Card = onClick || hoverable ? motion.div : 'div';
  
  const motionProps = onClick || hoverable ? {
    whileHover: hoverable ? { y: -3, scale: 1.01 } : {},
    whileTap: onClick ? { scale: 0.98 } : {},
    transition: { type: 'spring', stiffness: 300, damping: 20 },
    onClick,
  } : {};

  return (
    <Card
      className={`${variants[variant]} p-5 ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Card>
  );
};

export default GlassCard;
