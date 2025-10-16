/**
 * Reusable button component
 */
export const Button = ({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  icon: Icon,
  active = false,
  className = '',
  title,
  ...props
}) => {
  const baseClasses = 'rounded flex items-center gap-2 transition-colors';

  const variantClasses = {
    default: active ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300',
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
    purple: 'bg-purple-500 text-white hover:bg-purple-600',
    indigo: 'bg-indigo-500 text-white hover:bg-indigo-600'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      title={title}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};
