import { useState } from 'react';
import { Menu, X, Hash, Mountain, Waves, Trees, Droplets, Home, Building, Building2, Castle, Shield, Circle, MapPin, Flag, FileText, Trash2, Droplet as River, Route as Road, Palette } from 'lucide-react';
import { Button } from '../atoms/Button';
import { ICON_TYPES } from '../../constants/icons';

/**
 * Floating toolbar for mobile devices
 * Shows selected tool + hamburger menu to open tool palette
 */
export const FloatingToolbar = ({
  selectedTool,
  onToolSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const iconMap = {
    number: Hash,
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
    contested: Flag,
    edit: FileText,
    faction: Palette,
    river: River,
    road: Road,
    erase: Trash2
  };

  const tools = [
    { id: 'number', label: 'Number', group: 'Draw' },
    ...Object.entries(ICON_TYPES).map(([key, data]) => ({
      id: key,
      label: data.label,
      group: 'Draw'
    })),
    { id: 'edit', label: 'Edit', group: 'Draw' },
    { id: 'faction', label: 'Faction', group: 'Territory' },
    { id: 'river', label: 'River', group: 'Territory' },
    { id: 'road', label: 'Road', group: 'Territory' },
    { id: 'erase', label: 'Erase', group: 'Edit' }
  ];

  const handleToolSelect = (tool) => {
    onToolSelect(tool);
    setIsOpen(false);
  };

  const SelectedIcon = selectedTool ? iconMap[selectedTool] : Menu;

  return (
    <>
      {/* Floating bottom bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-3 z-40">
        {/* Currently selected tool */}
        <Button
          icon={SelectedIcon}
          active={true}
          size="lg"
          title={selectedTool ? tools.find(t => t.id === selectedTool)?.label : 'Select tool'}
        >
          {selectedTool ? tools.find(t => t.id === selectedTool)?.label : 'Tools'}
        </Button>

        {/* Menu toggle */}
        <Button
          icon={isOpen ? X : Menu}
          onClick={() => setIsOpen(!isOpen)}
          variant="primary"
          size="lg"
          title={isOpen ? 'Close menu' : 'Open menu'}
        />
      </div>

      {/* Tool palette overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Bottom sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[70vh] overflow-y-auto">
            <div className="p-6">
              {/* Handle bar */}
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

              {/* Tool groups */}
              {['Draw', 'Territory', 'Edit'].map(group => {
                const groupTools = tools.filter(t => t.group === group);
                return (
                  <div key={group} className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                      {group}
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {groupTools.map(tool => (
                        <Button
                          key={tool.id}
                          icon={iconMap[tool.id]}
                          onClick={() => handleToolSelect(tool.id)}
                          active={selectedTool === tool.id}
                          size="lg"
                          className="flex-col h-20"
                        >
                          <span className="text-xs mt-1">{tool.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};
