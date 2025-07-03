export interface PlanItem {
  id: string;
  title: string;
  location: string;
  time: Date;
  category: string;
  description: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Category {
  value: string;
  label: string;
  icon: any;
  color: string;
}

export interface TimeSlot {
  value: string;
  label: string;
}

export interface NewPlanData {
  title: string;
  location: string;
  time: Date;
  category: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

// 새로운 플랜 카드 관련 타입들
export interface TravelPlan {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  planItems: PlanItem[];
  coverImage?: string;
  tags: string[];
  totalDays: number;
}

export interface NewTravelPlan {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isPublic: boolean;
  tags: string[];
}

export interface PlanCardProps {
  plan: TravelPlan;
  onEdit: (plan: TravelPlan) => void;
  onDelete: (plan: TravelPlan) => void;
  onDuplicate: (plan: TravelPlan) => void;
} 