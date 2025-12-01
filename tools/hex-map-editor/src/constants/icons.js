import { Mountain, Waves, Trees, Droplets, Home, Building, Building2, Castle, Circle, MapPin, Shield, Flag } from 'lucide-react';

export const ICON_TYPES = {
  mountain: { icon: Mountain, label: 'Mountain', emoji: '⛰️' },
  hills: { icon: Waves, label: 'Hills', emoji: '🏞️' },
  forest: { icon: Trees, label: 'Forest', emoji: '🌲' },
  swamps: { icon: Droplets, label: 'Swamps', emoji: '🌿' },
  village: { icon: Home, label: 'Village', emoji: '🏘️' },
  town: { icon: Building, label: 'Town', emoji: '🏛️' },
  city: { icon: Building2, label: 'City', emoji: '🏙️' },
  castle: { icon: Castle, label: 'Castle', emoji: '🏰' },
  outpost: { icon: Shield, label: 'Outpost', emoji: '🛡️' },
  dungeon: { icon: Circle, label: 'Dungeon', emoji: '🕳️' },
  poi: { icon: MapPin, label: 'POI', emoji: '📍' },
  contested: { icon: Flag, label: 'Contested', emoji: '🚩' }
};
