import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Copy, Share2, MoreVertical } from 'lucide-react';
import { TravelPlan } from '@/components/planner/types';
import PlannerSection from '@/components/planner/PlannerSection';
import EditPlanDialog from '@/components/planner/EditPlanDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import NavBar from '@/components/NavBar';
import { useIsMobile } from '@/hooks/use-mobile';

const PlanDetail: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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
      const plans = savedPlans ? JSON.parse(savedPlans) : [];
      plans.push(duplicatedPlan);
      localStorage.setItem('jeju-travel-plans', JSON.stringify(plans));
      
      toast.success('플랜이 복제되었습니다!');
      navigate(`/plans/${duplicatedPlan.id}`);
    }
  };

  const handleSharePlan = async () => {
    if (plan) {
      try {
        if (navigator.share && isMobile) {
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
        <div className="text-center px-4">
          <p className="text-muted-foreground mb-4">플랜을 찾을 수 없습니다.</p>
          <Button onClick={() => navigate('/plans')} size={isMobile ? "lg" : "default"}>
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
      <div className="sticky top-[70px] z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* 상단 행: 뒤로가기와 메뉴 */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size={isMobile ? "default" : "sm"}
                onClick={() => navigate('/plans')}
                className="hover:bg-jeju-purple/10 h-10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                목록으로
              </Button>
              
              {isMobile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleEditPlan}>
                      <Edit className="h-4 w-4 mr-2" />
                      플랜 편집
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDuplicatePlan}>
                      <Copy className="h-4 w-4 mr-2" />
                      플랜 복제
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSharePlan}>
                      <Share2 className="h-4 w-4 mr-2" />
                      플랜 공유
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      플랜 삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            {/* 제목과 정보 */}
            <div className={isMobile ? "text-center" : "flex-1 min-w-0 mx-6"}>
              <h1 className={`font-bold truncate ${isMobile ? 'text-lg' : 'text-xl'}`}>
                {plan.title}
              </h1>
              <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
                {plan.startDate.toLocaleDateString('ko-KR')} - {plan.endDate.toLocaleDateString('ko-KR')}
                {isMobile && ` • ${plan.totalDays}일`}
              </p>
            </div>
            
            {/* 데스크톱 액션 버튼들 */}
            {!isMobile && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSharePlan}
                  className="border-white/10 hover:bg-white/5"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  공유
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDuplicatePlan}
                  className="border-white/10 hover:bg-white/5"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  복제
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditPlan}
                  className="border-white/10 hover:bg-white/5"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  편집
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="border-destructive/20 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  삭제
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1">
        <PlannerSection
          selectedPlan={plan}
          onUpdatePlan={handleUpdatePlan}
        />
      </div>

      {/* 편집 다이얼로그 */}
      <EditPlanDialog
        plan={plan}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveEditedPlan}
      />

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className={isMobile ? "mx-4 max-w-sm" : ""}>
          <DialogHeader>
            <DialogTitle>플랜 삭제</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              <strong>{plan.title}</strong> 플랜을 삭제하시겠습니까?
            </p>
            <p className="text-sm text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 플랜과 모든 일정이 영구적으로 삭제됩니다.
            </p>
            <div className={`flex gap-2 pt-4 ${isMobile ? 'flex-col' : ''}`}>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)} 
                className="flex-1"
                size={isMobile ? "lg" : "default"}
              >
                취소
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeletePlan} 
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

export default PlanDetail; 