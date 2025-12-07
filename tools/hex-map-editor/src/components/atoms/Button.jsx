import { useResponsiveContext } from '../../hooks/useResponsiveContext';

/**
 * Reusable button component with responsive touch-friendly sizing
 */
export const Button = ({
  children,
  onClick,
  variant = 'default',
  size = 'auto',
  icon: Icon,
  active = false,
  className = '',
  title,
  ...props
}) => {
  const { isTouchDevice, isMobile } = useResponsiveContext();

  // Auto-size based on device capabilities
  const resolvedSize = size === 'auto'
    ? (isMobile ? 'sm' : 'md')
    : size;

  const baseClasses = 'rounded flex items-center gap-2 transition-colors justify-center';

  const variantClasses = {
    default: active ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300',
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
    purple: 'bg-purple-500 text-white hover:bg-purple-600',
    indigo: 'bg-indigo-500 text-white hover:bg-indigo-600'
  };

  // Touch-friendly sizing (44px minimum for touch devices)
  const sizeClasses = {
    sm: isTouchDevice
      ? 'px-3 py-3 text-sm min-w-[44px] min-h-[44px]'  // Touch: 44px minimum
      : 'px-3 py-1.5 text-sm',                          // Mouse: compact
    md: isTouchDevice
      ? 'px-4 py-3 text-base min-w-[44px] min-h-[44px]' // Touch: 44px minimum
      : 'px-4 py-2 text-base',                           // Mouse: standard
    lg: 'px-6 py-3 text-lg min-w-[48px] min-h-[48px]'    // Large: 48px minimum (both)
  };

  // Icon size based on resolved size and device
  const getIconSize = () => {
    if (resolvedSize === 'lg') return 24;
    if (resolvedSize === 'md') return isTouchDevice ? 22 : 20;
    return isTouchDevice ? 20 : 16;
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[resolvedSize]} ${className}`}
      title={title}
      {...props}
    >
      {Icon && <Icon size={getIconSize()} />}
      {children}
    </button>
  );
};
