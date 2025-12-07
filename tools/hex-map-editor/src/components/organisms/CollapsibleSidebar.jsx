import { useState } from 'react';
import { ChevronLeft, ChevronRight, Hash, Mountain, Waves, Trees, Droplets, Home, Building, Building2, Castle, Shield, Circle, MapPin, Flag, FileText, Trash2, Droplet as River, Route as Road, Palette } from 'lucide-react';
import { Button } from '../atoms/Button';
import { ICON_TYPES } from '../../constants/icons';

/**
 * Collapsible sidebar for tablet devices
 * Can expand to show labels or collapse to icon-only view
 */
export const CollapsibleSidebar = ({
  selectedTool,
  onToolSelect
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const ToolGroup = ({ title, children }) => (
    <div className="mb-6">
      <div className={`text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide ${isExpanded ? 'px-2' : 'text-center'}`}>
        {isExpanded ? title : title[0]}
      </div>
      <div className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-50 border-r border-gray-200 p-3 flex flex-col gap-4 overflow-y-auto transition-all duration-300 ${isExpanded ? 'w-48' : 'w-20'}`}>
      {/* Toggle button */}
      <Button
        icon={isExpanded ? ChevronLeft : ChevronRight}
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        size="md"
        className="w-full mb-2"
      />

      <ToolGroup title="Draw">
        <Button
          icon={Hash}
          onClick={() => onToolSelect('number')}
          active={selectedTool === 'number'}
          title="Add numbered hex"
          size="md"
          className="w-full"
        >
          {isExpanded && 'Number'}
        </Button>
        {Object.entries(ICON_TYPES).map(([key, data]) => (
          <Button
            key={key}
            icon={iconMap[key]}
            onClick={() => onToolSelect(key)}
            active={selectedTool === key}
            title={data.label}
            size="md"
            className="w-full"
          >
            {isExpanded && data.label}
          </Button>
        ))}
        <Button
          icon={FileText}
          onClick={() => onToolSelect('edit')}
          active={selectedTool === 'edit'}
          title="Edit hex (label + events)"
          size="md"
          className="w-full"
        >
          {isExpanded && 'Edit'}
        </Button>
      </ToolGroup>

      <ToolGroup title="Territory">
        <Button
          icon={Palette}
          onClick={() => onToolSelect('faction')}
          active={selectedTool === 'faction'}
          title="Paint faction territory"
          size="md"
          className="w-full"
        >
          {isExpanded && 'Faction'}
        </Button>
        <Button
          icon={River}
          onClick={() => onToolSelect('river')}
          active={selectedTool === 'river'}
          title="Draw river"
          size="md"
          className="w-full"
        >
          {isExpanded && 'River'}
        </Button>
        <Button
          icon={Road}
          onClick={() => onToolSelect('road')}
          active={selectedTool === 'road'}
          title="Draw road"
          size="md"
          className="w-full"
        >
          {isExpanded && 'Road'}
        </Button>
      </ToolGroup>

      <ToolGroup title="Edit">
        <Button
          icon={Trash2}
          onClick={() => onToolSelect('erase')}
          active={selectedTool === 'erase'}
          title="Erase hex"
          size="md"
          className="w-full"
        >
          {isExpanded && 'Erase'}
        </Button>
      </ToolGroup>
    </div>
  );
};
