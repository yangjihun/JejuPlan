import { 
  Camera, 
  Utensils, 
  Car, 
  Hotel, 
  ShoppingBag, 
  Mountain, 
  Waves 
} from 'lucide-react';
import { Category, TimeSlot } from './types';

export const categories: Category[] = [
  { value: 'attraction', label: '관광지', icon: Camera, color: 'bg-blue-500' },
  { value: 'food', label: '맛집', icon: Utensils, color: 'bg-orange-500' },
  { value: 'transport', label: '교통', icon: Car, color: 'bg-green-500' },
  { value: 'accommodation', label: '숙박', icon: Hotel, color: 'bg-purple-500' },
  { value: 'shopping', label: '쇼핑', icon: ShoppingBag, color: 'bg-pink-500' },
  { value: 'nature', label: '자연', icon: Mountain, color: 'bg-emerald-500' },
  { value: 'beach', label: '해변', icon: Waves, color: 'bg-cyan-500' },
];

export const timeSlots: TimeSlot[] = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return { value: hour, label: `${hour}:00` };
});

export const getCategoryIcon = (category: string) => {
  const cat = categories.find(c => c.value === category);
  return cat ? cat.icon : Camera;
};

export const getCategoryColor = (category: string) => {
  const cat = categories.find(c => c.value === category);
  return cat ? cat.color : 'bg-gray-500';
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
}; 