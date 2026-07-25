// مكون الزر — مع نسختين (زجاجي + أساسي)
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary',  // 'primary' | 'glass' | 'danger'
  size = 'md',          // 'sm' | 'md' | 'lg'
  icon: Icon,
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  const variantClasses = {
    primary: 'btn-primary',
    glass: 'btn-glass',
    danger: 'btn-primary !bg-gradient-to-br !from-red-500 !to-red-600',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 22 : 18} />}
      {children}
    </motion.button>
  );
};

export default Button;
