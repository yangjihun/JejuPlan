import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Copy, Share2 } from 'lucide-react';
import { TravelPlan } from '@/components/planner/types';
import PlannerSection from '@/components/planner/PlannerSection';
import EditPlanDialog from '@/components/planner/EditPlanDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import NavBar from '@/components/NavBar';

const PlanDetail: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (planId) {
      loadPlan(planId);
    }
  }, [planId]);

  const loadPlan = (id: string) => {
    setIsLoading(true);
    try {
      const savedPlans = localStorage.getItem('jeju-travel-plans');
      if (savedPlans) {
        const plans = JSON.parse(savedPlans);
        const planWithDates = plans.find((p: any) => p.id === id);
        
        if (planWithDates) {
          const loadedPlan: TravelPlan = {
            ...planWithDates,
            startDate: new Date(planWithDates.startDate),
            endDate: new Date(planWithDates.endDate),
            createdAt: new Date(planWithDates.createdAt),
            updatedAt: new Date(planWithDates.updatedAt),
            planItems: planWithDates.planItems.map((item: any) => ({
              ...item,
              time: new Date(item.time)
            }))
          };
          setPlan(loadedPlan);
        } else {
          toast.error('플랜을 찾을 수 없습니다.');
          navigate('/plans');
        }
      } else {
        toast.error('저장된 플랜이 없습니다.');
        navigate('/plans');
      }
    } catch (error) {
      toast.error('플랜을 불러오는 중 오류가 발생했습니다.');
      navigate('/plans');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePlan = (updatedPlan: TravelPlan) => {
    setPlan(updatedPlan);
    
    // localStorage 업데이트
    const savedPlans = localStorage.getItem('jeju-travel-plans');
    if (savedPlans) {
      const plans = JSON.parse(savedPlans);
      const updatedPlans = plans.map((p: any) => 
        p.id === updatedPlan.id ? updatedPlan : p
      );
      localStorage.setItem('jeju-travel-plans', JSON.stringify(updatedPlans));
    }
  };

  const handleEditPlan = () => {
    setIsEditDialogOpen(true);
  };

  const handleSaveEditedPlan = (updatedPlan: TravelPlan) => {
    setPlan(updatedPlan);
    setIsEditDialogOpen(false);
    
    // localStorage 업데이트
    const savedPlans = localStorage.getItem('jeju-travel-plans');
    if (savedPlans) {
      const plans = JSON.parse(savedPlans);
      const updatedPlans = plans.map((p: any) => 
        p.id === updatedPlan.id ? updatedPlan : p
      );
      localStorage.setItem('jeju-travel-plans', JSON.stringify(updatedPlans));
    }
    
    toast.success('플랜이 수정되었습니다!');
  };

  const handleDeletePlan = () => {
    if (plan) {
      const savedPlans = localStorage.getItem('jeju-travel-plans');
      if (savedPlans) {
        const plans = JSON.parse(savedPlans);
        const updatedPlans = plans.filter((p: any) => p.id !== plan.id);
        localStorage.setItem('jeju-travel-plans', JSON.stringify(updatedPlans));
      }
      toast.success('플랜이 삭제되었습니다!');
      navigate('/plans');
    }
  };

  const handleDuplicatePlan = () => {
    if (plan) {
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
      
      // localStorage에 추가
      const savedPlans = localStorage.getItem('jeju-travel-plans');
      if (savedPlans) {
        const plans = JSON.parse(savedPlans);
        plans.push(duplicatedPlan);
        localStorage.setItem('jeju-travel-plans', JSON.stringify(plans));
      }
      
      toast.success('플랜이 복제되었습니다!');
      navigate(`/plans/${duplicatedPlan.id}`);
    }
  };

  const handleSharePlan = async () => {
    if (plan) {
      try {
        if (navigator.share) {
          await navigator.share({
            title: plan.title,
            text: `${plan.title} - 제주 여행 계획`,
            url: window.location.href,
          });
          toast.success('플랜이 공유되었습니다!');
        } else {
          // 클립보드에 복사
          await navigator.clipboard.writeText(window.location.href);
          toast.success('플랜 링크가 클립보드에 복사되었습니다!');
        }
      } catch (error) {
        toast.error('공유에 실패했습니다.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jeju-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">플랜을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">플랜을 찾을 수 없습니다.</p>
          <Button onClick={() => navigate('/plans')}>
            플랜 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      {/* 헤더 */}
      <div className="sticky top-[72px] z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/plans')}
                className="hover:bg-jeju-purple/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                목록으로
              </Button>
              <div>
                <h1 className="text-xl font-bold">{plan.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {plan.description || '설명이 없습니다.'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSharePlan}
                className="hover:bg-jeju-purple/10"
              >
                <Share2 className="h-4 w-4 mr-2" />
                공유
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDuplicatePlan}
                className="hover:bg-jeju-purple/10"
              >
                <Copy className="h-4 w-4 mr-2" />
                복제
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditPlan}
                className="hover:bg-jeju-purple/10"
              >
                <Edit className="h-4 w-4 mr-2" />
                편집
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="hover:bg-red-500/10 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PlannerSection
          selectedPlan={plan}
          onUpdatePlan={handleUpdatePlan}
          onClose={() => navigate('/plans')}
        />
      </div>

      {/* 플랜 편집 다이얼로그 */}
      <EditPlanDialog
        plan={plan}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveEditedPlan}
      />

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>플랜 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>정말로 "{plan.title}" 플랜을 삭제하시겠습니까?</p>
            <p className="text-sm text-muted-foreground mt-2">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePlan}
            >
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanDetail; 