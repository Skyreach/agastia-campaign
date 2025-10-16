/**
 * Reusable select component
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
  return (
    <select
      value={value}
      onChange={onChange}
      className={`border rounded px-3 py-2 text-sm font-medium ${className}`}
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
