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
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      title={title}
      {...props}
    >
      {Icon && <Icon size={size === 'lg' ? 24 : size === 'md' ? 20 : 16} />}
      {children}
    </button>
  );
};
