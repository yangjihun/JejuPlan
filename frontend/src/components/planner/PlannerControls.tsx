import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { 
  CalendarDays, 
  Save, 
  Download, 
  Upload 
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PlanItem } from './types';
import AddPlanDialog from './AddPlanDialog';
import { useIsMobile } from '@/hooks/use-mobile';

import { TravelPlan } from './types';

interface PlannerControlsProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  plans: PlanItem[];
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  isAddingPlan: boolean;
  onAddingPlanChange: (open: boolean) => void;
  newPlan: any;
  onNewPlanChange: (plan: any) => void;
  onAddPlan: () => void;
  onImportPlans?: (plans: PlanItem[]) => void;
  selectedPlan?: TravelPlan | null;
}

const PlannerControls: React.FC<PlannerControlsProps> = ({
  selectedDate,
  onDateChange,
  plans,
  onSave,
  onLoad,
  onExport,
  isAddingPlan,
  onAddingPlanChange,
  newPlan,
  onNewPlanChange,
  onAddPlan,
  onImportPlans,
  selectedPlan,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const completedCount = plans.filter(p => p.isCompleted).length;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (data.plans && Array.isArray(data.plans)) {
          // Date 객체로 변환
          const importedPlans = data.plans.map((plan: any) => ({
            ...plan,
            time: new Date(plan.time)
          }));
          
          onImportPlans?.(importedPlans);
          toast.success('일정을 성공적으로 불러왔습니다!');
        } else {
          toast.error('올바른 일정 파일이 아닙니다.');
        }
      } catch (error) {
        toast.error('파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
    
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const ControlButton = ({ 
    onClick, 
    icon: Icon, 
    tooltip, 
    children 
  }: { 
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
    tooltip: string;
    children?: React.ReactNode;
  }) => {
    const buttonContent = (
      <Button 
        variant="outline" 
        size={isMobile ? "default" : "sm"} 
        onClick={onClick}
        className={isMobile ? "min-h-[44px] px-4" : ""}
      >
        <Icon className="h-4 w-4" />
        {isMobile && children && <span className="ml-2">{children}</span>}
      </Button>
    );

    if (isMobile) {
      return buttonContent;
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {buttonContent}
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="glass mt-[72px] p-4 md:p-6 mb-6 md:mb-8 animate-fade-in border-2 border-white/10">
      <div className="flex flex-col gap-4">
        {/* 상단: 날짜 선택과 통계 */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={`bg-secondary/50 border-white/10 justify-start ${isMobile ? 'min-h-[44px]' : ''}`}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {format(selectedDate, 'yyyy년 MM월 dd일', { locale: ko })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && onDateChange(date)}
                disabled={(date) => {
                  if (!selectedPlan) return false;
                  return date < selectedPlan.startDate || date > selectedPlan.endDate;
                }}
                fromDate={selectedPlan?.startDate}
                toDate={selectedPlan?.endDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className={`text-sm ${isMobile ? 'px-3 py-1' : ''}`}>
              총 {plans.length}개 일정
            </Badge>
            
            <Badge variant="outline" className={`text-sm ${isMobile ? 'px-3 py-1' : ''}`}>
              완료: {completedCount}개
            </Badge>
          </div>
        </div>

        {/* 하단: 액션 버튼들 */}
        <div className={`flex gap-2 ${isMobile ? 'flex-col sm:flex-row' : ''}`}>
          {/* 모바일에서는 텍스트와 함께 표시되는 버튼들 */}
          {isMobile ? (
            <>
              <div className="flex gap-2">
                <ControlButton onClick={onSave} icon={Save} tooltip="일정 저장">
                  저장
                </ControlButton>
                <ControlButton onClick={onLoad} icon={Upload} tooltip="일정 불러오기">
                  불러오기
                </ControlButton>
              </div>
              <div className="flex gap-2">
                <ControlButton 
                  onClick={() => fileInputRef.current?.click()} 
                  icon={Upload} 
                  tooltip="파일에서 불러오기"
                >
                  파일 불러오기
                </ControlButton>
                <ControlButton onClick={onExport} icon={Download} tooltip="일정 내보내기">
                  내보내기
                </ControlButton>
              </div>
            </>
          ) : (
            // 데스크톱에서는 아이콘만 표시
            <>
              <ControlButton onClick={onSave} icon={Save} tooltip="일정 저장" />
              <ControlButton onClick={onLoad} icon={Upload} tooltip="일정 불러오기" />
              <ControlButton 
                onClick={() => fileInputRef.current?.click()} 
                icon={Upload} 
                tooltip="파일에서 불러오기" 
              />
              <ControlButton onClick={onExport} icon={Download} tooltip="일정 내보내기" />
            </>
          )}

          {/* 일정 추가 다이얼로그 */}
          <div className={isMobile ? "mt-2" : ""}>
            <AddPlanDialog
              isOpen={isAddingPlan}
              onOpenChange={onAddingPlanChange}
              newPlan={newPlan}
              onNewPlanChange={onNewPlanChange}
              onAddPlan={onAddPlan}
              selectedPlan={selectedPlan}
            />
          </div>
        </div>
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default PlannerControls; 