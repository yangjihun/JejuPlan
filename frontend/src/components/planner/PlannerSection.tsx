import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { PlanItem, NewPlanData, TravelPlan } from './types';
import PlannerControls from './PlannerControls';
import PlanList from './PlanList';
import StatsSidebar from './StatsSidebar';
import EditItemDialog from './EditItemDialog';

interface PlannerSectionProps {
  selectedPlan?: TravelPlan | null;
  onUpdatePlan?: (plan: TravelPlan) => void;
  onClose?: () => void;
}

const PlannerSection: React.FC<PlannerSectionProps> = ({
  selectedPlan,
  onUpdatePlan,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState<NewPlanData>({
    title: '',
    location: '',
    time: selectedDate,
    category: 'attraction',
    description: '',
    priority: 'medium',
  });

  // 선택된 플랜이 있으면 해당 플랜의 데이터로 초기화
  useEffect(() => {
    if (selectedPlan) {
      setSelectedDate(selectedPlan.startDate);
      setPlans(selectedPlan.planItems);
    }
  }, [selectedPlan]);

  // 선택된 날짜가 변경되면 새 일정의 기본 날짜도 업데이트
  useEffect(() => {
    setNewPlan(prev => ({
      ...prev,
      time: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), prev.time.getHours(), prev.time.getMinutes())
    }));
  }, [selectedDate]);

  // 플랜 업데이트 함수
  const updateTravelPlan = useCallback((updatedPlans: PlanItem[]) => {
    if (selectedPlan && onUpdatePlan) {
      const updatedTravelPlan: TravelPlan = {
        ...selectedPlan,
        planItems: updatedPlans,
        updatedAt: new Date(),
      };
      onUpdatePlan(updatedTravelPlan);
    }
  }, [selectedPlan, onUpdatePlan]);

  const addPlan = useCallback(() => {
    if (newPlan.title.trim() && newPlan.location.trim()) {
      const plan: PlanItem = {
        id: Date.now().toString(),
        ...newPlan,
        isCompleted: false,
      };
      const updatedPlans = [...plans, plan];
      setPlans(updatedPlans);
      updateTravelPlan(updatedPlans);
      setNewPlan({
        title: '',
        location: '',
        time: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 9, 0), // 기본 시간 9시
        category: 'attraction',
        description: '',
        priority: 'medium',
      });
      setIsAddingPlan(false);
      toast.success('일정이 추가되었습니다!');
    } else {
      toast.error('제목과 장소를 입력해주세요.');
    }
  }, [newPlan, plans, updateTravelPlan]);

  const updatePlan = useCallback((id: string, updates: Partial<PlanItem>) => {
    const updatedPlans = plans.map(plan => 
      plan.id === id ? { ...plan, ...updates } : plan
    );
    setPlans(updatedPlans);
    updateTravelPlan(updatedPlans);
    toast.success('일정이 수정되었습니다!');
  }, [plans, updateTravelPlan]);

  const deletePlan = useCallback((id: string) => {
    const updatedPlans = plans.filter(plan => plan.id !== id);
    setPlans(updatedPlans);
    updateTravelPlan(updatedPlans);
    toast.success('일정이 삭제되었습니다!');
  }, [plans, updateTravelPlan]);

  const reorderPlans = useCallback((newPlans: PlanItem[]) => {
    setPlans(newPlans);
    updateTravelPlan(newPlans);
  }, [updateTravelPlan]);

  const toggleComplete = useCallback((id: string) => {
    updatePlan(id, { isCompleted: !plans.find(p => p.id === id)?.isCompleted });
  }, [updatePlan, plans]);

  const savePlans = useCallback(() => {
    const data = {
      date: selectedDate,
      plans: plans,
    };
    localStorage.setItem('jeju-plans', JSON.stringify(data));
    toast.success('일정이 저장되었습니다!');
  }, [selectedDate, plans]);

  const loadPlans = useCallback(() => {
    const saved = localStorage.getItem('jeju-plans');
    if (saved) {
      const data = JSON.parse(saved);
      setSelectedDate(new Date(data.date));
      setPlans(data.plans);
      toast.success('일정을 불러왔습니다!');
    } else {
      toast.error('저장된 일정이 없습니다.');
    }
  }, []);

  const importPlans = useCallback((importedPlans: PlanItem[]) => {
    setPlans(importedPlans);
    updateTravelPlan(importedPlans);
  }, [updateTravelPlan]);

  const exportPlans = useCallback(() => {
    const data = {
      date: selectedDate,
      plans: plans,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jeju-plan-${selectedDate.toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('일정이 내보내기되었습니다!');
  }, [selectedDate, plans]);

  // 타임라인 날짜 선택 핸들러
  const handleTimelineeDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    // 해당 날짜로 스크롤하거나 필터링하는 로직을 추가할 수 있음
  }, []);

  return (
    <div id="planner" className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-6 relative">
        {/* Background effects */}
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-jeju-purple/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-jeju-blue/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="mb-6 text-center animate-fade-in">
          </div>

          <div className="max-w-7xl mx-auto space-y-8">
            {/* 상단 컨트롤 */}
            <PlannerControls
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              plans={plans}
              onSave={savePlans}
              onLoad={loadPlans}
              onExport={exportPlans}
              isAddingPlan={isAddingPlan}
              onAddingPlanChange={setIsAddingPlan}
              newPlan={newPlan}
              onNewPlanChange={setNewPlan}
              onAddPlan={addPlan}
              onImportPlans={importPlans}
              selectedPlan={selectedPlan}
            />

            {/* 메인 컨텐츠 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 일정 목록 */}
              <div className="lg:col-span-2">
                <PlanList
                  plans={plans}
                  onToggleComplete={toggleComplete}
                  onEdit={setEditingPlan}
                  onDelete={deletePlan}
                  onReorder={reorderPlans}
                />
              </div>

              {/* 사이드바 - 통계 및 필터 */}
              <StatsSidebar 
                plans={plans} 
                selectedPlan={selectedPlan}
                selectedDate={selectedDate}
                onDateSelect={handleTimelineeDateSelect}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 일정 편집 다이얼로그 */}
      <EditItemDialog
        plan={editingPlan}
        isOpen={!!editingPlan}
        onOpenChange={(open) => !open && setEditingPlan(null)}
        onSave={updatePlan}
      />
    </div>
  );
};

export default PlannerSection; 