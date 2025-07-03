import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Clock, Plus } from 'lucide-react';
import { TravelPlan, PlanItem } from './types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from 'sonner';

interface SelectPlanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  destination: {
    name: string;
    description: string;
    tags: string[];
  };
}

const SelectPlanDialog: React.FC<SelectPlanDialogProps> = ({
  isOpen,
  onOpenChange,
  destination,
}) => {
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // localStorage에서 플랜 불러오기
      const savedPlans = localStorage.getItem('jeju-travel-plans');
      if (savedPlans) {
        const parsedPlans = JSON.parse(savedPlans);
        const plansWithDates = parsedPlans.map((plan: any) => ({
          ...plan,
          startDate: new Date(plan.startDate),
          endDate: new Date(plan.endDate),
          createdAt: new Date(plan.createdAt),
          updatedAt: new Date(plan.updatedAt),
          planItems: plan.planItems.map((item: any) => ({
            ...item,
            time: new Date(item.time)
          }))
        }));
        setPlans(plansWithDates);
      }
    }
  }, [isOpen]);

  const handleAddToPlan = () => {
    if (!selectedPlanId) {
      toast.error('플랜을 선택해주세요.');
      return;
    }

    const selectedPlan = plans.find(plan => plan.id === selectedPlanId);
    if (!selectedPlan) {
      toast.error('선택된 플랜을 찾을 수 없습니다.');
      return;
    }

    // 새로운 일정 아이템 생성
    const newPlanItem: PlanItem = {
      id: Date.now().toString(),
      title: destination.name,
      location: destination.name,
      time: new Date(),
      category: 'attraction',
      description: destination.description,
      priority: 'medium',
      isCompleted: false,
    };

    // 플랜에 일정 추가
    const updatedPlan = {
      ...selectedPlan,
      planItems: [...selectedPlan.planItems, newPlanItem],
      updatedAt: new Date(),
    };

    // localStorage 업데이트
    const updatedPlans = plans.map(plan => 
      plan.id === selectedPlanId ? updatedPlan : plan
    );
    localStorage.setItem('jeju-travel-plans', JSON.stringify(updatedPlans));

    toast.success(`${destination.name}이(가) "${selectedPlan.title}" 플랜에 추가되었습니다!`);
    onOpenChange(false);
    setSelectedPlanId(null);
  };

  const handleCreateNewPlan = () => {
    // 새 플랜 생성 페이지로 이동
    window.location.href = '/plans';
  };

  if (plans.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>플랜에 추가하기</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <CalendarDays className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              아직 생성된 플랜이 없습니다.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              "{destination.name}"을(를) 추가할 새 플랜을 만들어보세요.
            </p>
            <Button 
              onClick={handleCreateNewPlan}
              className="bg-jeju-gradient hover:opacity-90"
            >
              새 플랜 만들기 <Plus className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>플랜에 추가하기</DialogTitle>
          <p className="text-sm text-muted-foreground">
            "{destination.name}"을(를) 추가할 플랜을 선택해주세요.
          </p>
        </DialogHeader>
        
        <div className="space-y-4">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedPlanId === plan.id 
                  ? 'ring-2 ring-jeju-purple bg-jeju-purple/5' 
                  : 'hover:bg-secondary/50'
              }`}
              onClick={() => setSelectedPlanId(plan.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-medium line-clamp-2">
                    {plan.title}
                  </CardTitle>
                  <Badge variant={plan.isPublic ? "default" : "secondary"} className="text-xs">
                    {plan.isPublic ? '공개' : '비공개'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {plan.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {format(plan.startDate, 'MM.dd', { locale: ko })} - {format(plan.endDate, 'MM.dd', { locale: ko })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{plan.totalDays}박 {plan.totalDays + 1}일</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{plan.planItems.length}개 일정</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={handleCreateNewPlan}
          >
            새 플랜 만들기 <Plus className="ml-2 h-4 w-4" />
          </Button>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button 
              onClick={handleAddToPlan}
              disabled={!selectedPlanId}
              className="bg-jeju-gradient hover:opacity-90"
            >
              추가하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectPlanDialog; 