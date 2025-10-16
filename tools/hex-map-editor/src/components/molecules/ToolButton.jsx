import { Button } from '../atoms';

/**
 * Tool selection button with icon
 */
export const ToolButton = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <Button
      onClick={onClick}
      active={isActive}
      title={label}
      className="px-3 py-2"
    >
      <Icon size={20} />
    </Button>
  );
};

/**
 * Tool button with text label
 */
export const TextToolButton = ({ label, isActive, onClick, title }) => {
  return (
    <Button
      onClick={onClick}
      active={isActive}
      title={title}
    >
      {label}
    </Button>
  );
};
