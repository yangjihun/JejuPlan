import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import { PlanItem as PlanItemType } from './types';
import PlanItem from './PlanItem';
import { format, isSameDay, startOfDay, compareAsc } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface PlanListProps {
  plans: PlanItemType[];
  onToggleComplete: (id: string) => void;
  onEdit: (plan: PlanItemType) => void;
  onDelete: (id: string) => void;
  onReorder?: (plans: PlanItemType[]) => void;
}

const PlanList: React.FC<PlanListProps> = ({
  plans,
  onToggleComplete,
  onEdit,
  onDelete,
  onReorder,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 날짜별로 일정 그룹화
  const groupPlansByDate = (plans: PlanItemType[]) => {
    const groups = new Map<string, PlanItemType[]>();
    
    plans.forEach(plan => {
      const dateKey = startOfDay(plan.time).toISOString();
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(plan);
    });

    // 날짜순으로 정렬
    const sortedEntries = Array.from(groups.entries()).sort(([dateA], [dateB]) => 
      compareAsc(new Date(dateA), new Date(dateB))
    );

    // 각 날짜 내에서 시간순으로 정렬
    return sortedEntries.map(([date, plans]) => ({
      date: new Date(date),
      plans: plans.sort((a, b) => compareAsc(a.time, b.time))
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = plans.findIndex(plan => plan.id === active.id);
      const newIndex = plans.findIndex(plan => plan.id === over?.id);
      
      const newPlans = arrayMove(plans, oldIndex, newIndex);
      onReorder?.(newPlans);
    }
  };

  const groupedPlans = groupPlansByDate(plans);

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          일정 목록
        </CardTitle>
      </CardHeader>
      <CardContent>
        {plans.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={plans.map(plan => plan.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-6">
                {groupedPlans.map(({ date, plans: dayPlans }) => (
                  <div key={date.toISOString()} className="space-y-3">
                    {/* 날짜 헤더 */}
                    <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-jeju-purple" />
                        <h3 className="font-semibold text-lg">
                          {format(date, 'MM월 dd일 (EEE)', { locale: ko })}
                        </h3>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {dayPlans.length}개 일정
                      </Badge>
                    </div>
                    
                    {/* 해당 날짜의 일정들 */}
                    <div className="space-y-3 pl-6">
                      {dayPlans.map((plan) => (
                        <PlanItem
                          key={plan.id}
                          plan={plan}
                          onToggleComplete={onToggleComplete}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>아직 계획된 일정이 없습니다.</p>
            <p className="text-sm">일정 추가 버튼을 눌러 여행 계획을 시작해보세요!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanList; 