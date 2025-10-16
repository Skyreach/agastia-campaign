import { FACTIONS } from '../../constants/factions';

/**
 * Faction color palette selector
 */
export const FactionPalette = ({ selectedFaction, onSelectFaction }) => {
  return (
    <div className="flex gap-1">
      {FACTIONS.map((faction, idx) => (
        <button
          key={idx}
          onClick={() => onSelectFaction(idx)}
          className={`w-8 h-8 rounded border-2 ${
            selectedFaction === idx ? 'border-black' : 'border-gray-300'
          }`}
          style={{ backgroundColor: faction.color.replace('0.3', '0.7') }}
          title={faction.name}
        />
      ))}
    </div>
  );
};
