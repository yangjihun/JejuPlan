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

  return (
    <div className="glass p-6 mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-secondary/50 border-white/10">
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
          
          <Badge variant="secondary" className="text-sm">
            총 {plans.length}개 일정
          </Badge>
          
          <Badge variant="outline" className="text-sm">
            완료: {completedCount}개
          </Badge>
        </div>

        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onSave}>
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>일정 저장</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onLoad}>
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>일정 불러오기</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>파일에서 불러오기</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onExport}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>일정 내보내기</TooltipContent>
            </Tooltip>
          </TooltipProvider>

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