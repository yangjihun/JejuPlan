import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Plus, 
  Settings,
  Trash2,
  Copy
} from 'lucide-react';
import { TravelPlan, NewTravelPlan } from '@/components/planner/types';
import PlanCardGrid from '@/components/planner/PlanCardGrid';
import EditPlanDialog from '@/components/planner/EditPlanDialog';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const PlanManager: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<TravelPlan | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<TravelPlan | null>(null);

  // localStorage에서 플랜 불러오기
  useEffect(() => {
    const savedPlans = localStorage.getItem('jeju-travel-plans');
    if (savedPlans) {
      const parsedPlans = JSON.parse(savedPlans);
      // Date 객체로 변환
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
  }, []);

  // 플랜 저장
  const savePlans = useCallback(() => {
    localStorage.setItem('jeju-travel-plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    savePlans();
  }, [plans, savePlans]);

  // 새 플랜 생성
  const createPlan = useCallback((newPlanData: NewTravelPlan) => {
    const newPlan: TravelPlan = {
      id: Date.now().toString(),
      ...newPlanData,
      createdAt: new Date(),
      updatedAt: new Date(),
      planItems: [],
      totalDays: Math.ceil((newPlanData.endDate.getTime() - newPlanData.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    };
    
    // 새 플랜을 상태와 localStorage에 즉시 저장
    const updatedPlans = [...plans, newPlan];
    setPlans(updatedPlans);
    localStorage.setItem('jeju-travel-plans', JSON.stringify(updatedPlans));
    
    toast.success('새 플랜이 생성되었습니다!');
    
    // 새로 생성된 플랜의 상세 페이지로 이동
    navigate(`/plans/${newPlan.id}`);
  }, [navigate, plans]);

  // 플랜 편집
  const editPlan = useCallback((plan: TravelPlan) => {
    setEditingPlan(plan);
    setIsEditDialogOpen(true);
  }, []);

  // 플랜 삭제
  const deletePlan = useCallback((plan: TravelPlan) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  }, []);

  // 플랜 복제
  const duplicatePlan = useCallback((plan: TravelPlan) => {
    const duplicatedPlan: TravelPlan = {
      ...plan,
      id: Date.now().toString(),
      title: `${plan.title} (복사본)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      planItems: plan.planItems.map(item => ({
        ...item,
        id: Date.now().toString() + Math.random(),
        isCompleted: false,
      })),
    };
    
    // 복제된 플랜을 상태와 localStorage에 즉시 저장
    const updatedPlans = [...plans, duplicatedPlan];
    setPlans(updatedPlans);
    localStorage.setItem('jeju-travel-plans', JSON.stringify(updatedPlans));
    
    toast.success('플랜이 복제되었습니다!');
    
    // 복제된 플랜의 상세 페이지로 이동
    navigate(`/plans/${duplicatedPlan.id}`);
  }, [navigate, plans]);

  // 플랜 편집 저장
  const saveEditedPlan = useCallback((updatedPlan: TravelPlan) => {
    setPlans(prev => prev.map(plan => 
      plan.id === updatedPlan.id ? updatedPlan : plan
    ));
    setEditingPlan(null);
    setIsEditDialogOpen(false);
    toast.success('플랜이 수정되었습니다!');
  }, []);

  // 실제 삭제 실행
  const confirmDelete = useCallback(() => {
    if (planToDelete) {
      setPlans(prev => prev.filter(plan => plan.id !== planToDelete.id));
      setPlanToDelete(null);
      setDeleteDialogOpen(false);
      toast.success('플랜이 삭제되었습니다!');
    }
  }, [planToDelete]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-white/10 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* 상단 행: 뒤로가기 버튼과 설정 버튼 */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size={isMobile ? "default" : "sm"}
                onClick={() => navigate('/')}
                className="h-10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                홈으로
              </Button>
              
              {isMobile && (
                <Button variant="outline" size="sm" className="h-10">
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* 제목 영역 */}
            <div className={isMobile ? "text-center" : ""}>
              <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                제주 여행 플랜 관리
              </h1>
              {!isMobile && (
                <p className="text-sm text-muted-foreground">
                  나만의 제주도 여행 플랜을 만들고 관리하세요
                </p>
              )}
            </div>
            
            {/* 데스크톱 설정 버튼 */}
            {!isMobile && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  설정
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <PlanCardGrid
            plans={plans}
            onEditPlan={editPlan}
            onDeletePlan={deletePlan}
            onDuplicatePlan={duplicatePlan}
            onCreatePlan={createPlan}
          />
        </div>
      </div>

      {/* 플랜 편집 다이얼로그 */}
      <EditPlanDialog
        plan={editingPlan}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={saveEditedPlan}
      />

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className={isMobile ? "mx-4 max-w-sm" : ""}>
          <DialogHeader>
            <DialogTitle>플랜 삭제</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              <strong>{planToDelete?.title}</strong> 플랜을 삭제하시겠습니까?
            </p>
            <p className="text-sm text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 플랜과 모든 일정이 영구적으로 삭제됩니다.
            </p>
            <div className={`flex gap-2 pt-4 ${isMobile ? 'flex-col' : ''}`}>
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialogOpen(false)} 
                className="flex-1"
                size={isMobile ? "lg" : "default"}
              >
                취소
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete} 
                className="flex-1"
                size={isMobile ? "lg" : "default"}
              >
                삭제
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanManager; 