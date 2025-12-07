import { Hash, Mountain, Waves, Trees, Droplets, Home, Building, Building2, Castle, Shield, Circle, MapPin, Flag, FileText, Trash2, Droplet as River, Route as Road, Palette } from 'lucide-react';
import { Button } from '../atoms/Button';
import { ICON_TYPES } from '../../constants/icons';

/**
 * Desktop sidebar with grouped tool icons
 * Optimized for mouse interaction with compact spacing
 */
export const DesktopSidebar = ({
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
        <Button
          icon={Hash}
          onClick={() => onToolSelect('number')}
          active={selectedTool === 'number'}
          title="Add numbered hex"
          size="md"
          className="w-full"
        />
        {Object.entries(ICON_TYPES).map(([key, data]) => (
          <Button
            key={key}
            icon={iconMap[key]}
            onClick={() => onToolSelect(key)}
            active={selectedTool === key}
            title={data.label}
            size="md"
            className="w-full"
          />
        ))}
        <Button
          icon={FileText}
          onClick={() => onToolSelect('edit')}
          active={selectedTool === 'edit'}
          title="Edit hex (label + events)"
          size="md"
          className="w-full"
        />
      </ToolGroup>

      <ToolGroup title="Territory">
        <Button
          icon={Palette}
          onClick={() => onToolSelect('faction')}
          active={selectedTool === 'faction'}
          title="Paint faction territory"
          size="md"
          className="w-full"
        />
        <Button
          icon={River}
          onClick={() => onToolSelect('river')}
          active={selectedTool === 'river'}
          title="Draw river"
          size="md"
          className="w-full"
        />
        <Button
          icon={Road}
          onClick={() => onToolSelect('road')}
          active={selectedTool === 'road'}
          title="Draw road"
          size="md"
          className="w-full"
        />
      </ToolGroup>

      <ToolGroup title="Edit">
        <Button
          icon={Trash2}
          onClick={() => onToolSelect('erase')}
          active={selectedTool === 'erase'}
          title="Erase hex"
          size="md"
          className="w-full"
        />
      </ToolGroup>
    </div>
  );
};
