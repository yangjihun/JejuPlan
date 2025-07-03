import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  MapPin, 
  Clock, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Circle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { PlanItem as PlanItemType } from './types';
import { categories, getCategoryColor, getPriorityColor } from './constants';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PlanItemProps {
  plan: PlanItemType;
  onToggleComplete: (id: string) => void;
  onEdit: (plan: PlanItemType) => void;
  onDelete: (id: string) => void;
}

const PlanItem: React.FC<PlanItemProps> = ({
  plan,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: plan.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative p-4 rounded-lg border transition-all duration-200 hover:shadow-lg",
        plan.isCompleted 
          ? "bg-gray-800/70 border-gray-700/50 opacity-75" 
          : "bg-secondary/50 border-white/10 hover:border-white/20",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 mt-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-move hover:bg-secondary/50 p-1 rounded"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className={cn(
            "w-2 h-2 rounded-full",
            getPriorityColor(plan.priority)
          )} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={cn(
                  "font-medium truncate",
                  plan.isCompleted && "line-through text-gray-500"
                )}>
                  {plan.title}
                </h4>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", getCategoryColor(plan.category))}
                >
                  {categories.find(c => c.value === plan.category)?.label}
                </Badge>
              </div>
              
              <div className={cn(
                "flex items-center gap-4 text-sm",
                plan.isCompleted ? "text-gray-600" : "text-muted-foreground"
              )}>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{plan.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{format(plan.time, 'HH:mm')}</span>
                </div>
              </div>

              {plan.description && (
                <p className={cn(
                  "text-sm mt-2 line-clamp-2",
                  plan.isCompleted ? "text-gray-600" : "text-muted-foreground"
                )}>
                  {plan.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleComplete(plan.id)}
              >
                {plan.isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground hover:text-green-500 transition-colors" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(plan)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(plan.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanItem; 