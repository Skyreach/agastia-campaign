import { Mountain, Trees, Home, Castle, Circle, MapPin, Shield, Flag } from 'lucide-react';

export const ICON_TYPES = {
  mountain: { icon: Mountain, label: 'Mountain', emoji: '⛰️' },
  hills: { icon: Mountain, label: 'Hills', emoji: '🏞️' },
  forest: { icon: Trees, label: 'Forest', emoji: '🌲' },
  swamps: { icon: Trees, label: 'Swamps', emoji: '🌿' },
  village: { icon: Home, label: 'Village', emoji: '🏘️' },
  town: { icon: Home, label: 'Town', emoji: '🏛️' },
  city: { icon: Castle, label: 'City', emoji: '🏙️' },
  castle: { icon: Castle, label: 'Castle', emoji: '🏰' },
  outpost: { icon: Shield, label: 'Outpost', emoji: '🛡️' },
  dungeon: { icon: Circle, label: 'Dungeon', emoji: '🕳️' },
  poi: { icon: MapPin, label: 'POI', emoji: '📍' },
  contested: { icon: Flag, label: 'Contested', emoji: '🚩' }
};
