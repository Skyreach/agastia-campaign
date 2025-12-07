import { useResponsiveContext } from '../../hooks/useResponsiveContext';

/**
 * Reusable select component with responsive touch-friendly sizing
 */
export const Select = ({
  value,
  onChange,
  options,
  className = '',
  title,
  renderOption,
  ...props
}) => {
  const { isTouchDevice } = useResponsiveContext();

  // Touch-friendly select sizing (minimum 44px height)
  const touchClasses = isTouchDevice
    ? 'px-4 py-3 text-base min-h-[44px]'  // Touch: 44px minimum height
    : 'px-4 py-2 text-base';               // Mouse: standard

  return (
    <select
      value={value}
      onChange={onChange}
      className={`border rounded ${touchClasses} font-medium ${className}`}
      title={title}
      {...props}
    >
      {options.map((option, idx) => {
        if (renderOption) {
          return renderOption(option, idx);
        }
        return (
          <option key={idx} value={option.value}>
            {option.label}
          </option>
        );
      })}
    </select>
  );
};
