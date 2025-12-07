import { useResponsiveContext } from '../../hooks/useResponsiveContext';

/**
 * Reusable input component with responsive touch-friendly sizing
 */
export const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  min,
  max,
  ...props
}) => {
  const { isTouchDevice } = useResponsiveContext();

  // Touch-friendly input sizing (minimum 44px height)
  const touchClasses = isTouchDevice
    ? 'px-4 py-3 text-base min-h-[44px]'  // Touch: 44px minimum height
    : 'px-4 py-2 text-base';               // Mouse: standard

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      className={`border rounded ${touchClasses} ${className}`}
      {...props}
    />
  );
};

/**
 * Number input with validation
 */
export const NumberInput = ({ value, onChange, min = 1, className = '', ...props }) => {
  const handleChange = (e) => {
    const val = Math.max(min, parseInt(e.target.value) || min);
    onChange({ target: { value: val } });
  };

  return (
    <Input
      type="number"
      value={value}
      onChange={handleChange}
      min={min}
      className={`w-20 ${className}`}
      {...props}
    />
  );
};
