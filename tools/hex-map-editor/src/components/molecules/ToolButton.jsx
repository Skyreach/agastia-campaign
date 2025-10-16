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
      className="px-2 py-2"
    >
      <Icon size={16} />
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
