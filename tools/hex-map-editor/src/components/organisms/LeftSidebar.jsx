import { Hash, Mountain, Waves, Trees, Droplets, Home, Building, Building2, Castle, Shield, Circle, MapPin, Flag, FileText, Trash2, Droplet as River, Route as Road, Palette } from 'lucide-react';
import { ICON_TYPES } from '../../constants/icons';

/**
 * Left sidebar with grouped tool icons
 */
export const LeftSidebar = ({
  selectedTool,
  onToolSelect
}) => {
  const iconMap = {
    mountain: Mountain,
    hills: Waves,
    forest: Trees,
    swamps: Droplets,
    village: Home,
    town: Building,
    city: Building2,
    castle: Castle,
    outpost: Shield,
    dungeon: Circle,
    poi: MapPin,
    contested: Flag
  };

  const ToolButton = ({ tool, icon: Icon, label, group }) => (
    <button
      onClick={() => onToolSelect(tool)}
      className={`
        p-3 rounded-lg transition-all
        ${selectedTool === tool
          ? 'bg-blue-500 text-white shadow-lg scale-110'
          : 'bg-white hover:bg-gray-100 text-gray-700'}
      `}
      title={label}
    >
      <Icon size={20} />
    </button>
  );

  const ToolGroup = ({ title, children }) => (
    <div className="mb-6">
      <div className="text-xs font-semibold text-gray-500 mb-2 px-2 uppercase tracking-wide">
        {title}
      </div>
      <div className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-20 bg-gray-50 border-r border-gray-200 p-3 flex flex-col gap-4 overflow-y-auto">
      <ToolGroup title="Draw">
        <ToolButton tool="number" icon={Hash} label="Add numbered hex" />
        {Object.entries(ICON_TYPES).map(([key, data]) => (
          <ToolButton
            key={key}
            tool={key}
            icon={iconMap[key]}
            label={data.label}
          />
        ))}
        <ToolButton tool="edit" icon={FileText} label="Edit hex (label + events)" />
      </ToolGroup>

      <ToolGroup title="Territory">
        <ToolButton tool="faction" icon={Palette} label="Paint faction territory" />
        <ToolButton tool="river" icon={River} label="Draw river" />
        <ToolButton tool="road" icon={Road} label="Draw road" />
      </ToolGroup>

      <ToolGroup title="Edit">
        <ToolButton tool="erase" icon={Trash2} label="Erase hex" />
      </ToolGroup>
    </div>
  );
};
