/**
 * Reusable input component
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
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      className={`border rounded px-4 py-2 text-base ${className}`}
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
