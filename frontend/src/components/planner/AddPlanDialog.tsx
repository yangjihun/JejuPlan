import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, CalendarDays } from 'lucide-react';
import { format, setHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import { NewPlanData, TravelPlan } from './types';
import { categories, timeSlots } from './constants';

interface AddPlanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newPlan: NewPlanData;
  onNewPlanChange: (plan: NewPlanData) => void;
  onAddPlan: () => void;
  selectedPlan?: TravelPlan | null;
}

const AddPlanDialog: React.FC<AddPlanDialogProps> = ({
  isOpen,
  onOpenChange,
  newPlan,
  onNewPlanChange,
  onAddPlan,
  selectedPlan,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-jeju-gradient">
          <Plus className="mr-2 h-4 w-4" /> 일정 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>새 일정 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">제목</label>
            <Input
              placeholder="일정 제목"
              value={newPlan.title}
              onChange={(e) => onNewPlanChange({ ...newPlan, title: e.target.value })}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">장소</label>
            <Input
              placeholder="방문할 장소"
              value={newPlan.location}
              onChange={(e) => onNewPlanChange({ ...newPlan, location: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">날짜</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {format(newPlan.time, 'yyyy년 MM월 dd일', { locale: ko })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newPlan.time}
                  onSelect={(date) => {
                    if (date) {
                      // 시간은 유지하고 날짜만 변경
                      const newDate = new Date(date);
                      newDate.setHours(newPlan.time.getHours());
                      newDate.setMinutes(newPlan.time.getMinutes());
                      onNewPlanChange({ ...newPlan, time: newDate });
                    }
                  }}
                  disabled={(date) => {
                    if (!selectedPlan) {
                      console.log('No selectedPlan, all dates enabled');
                      return false;
                    }
                    const isDisabled = date < selectedPlan.startDate || date > selectedPlan.endDate;
                    console.log(`Date ${date.toISOString().split('T')[0]} is ${isDisabled ? 'disabled' : 'enabled'}. Travel period: ${selectedPlan.startDate.toISOString().split('T')[0]} - ${selectedPlan.endDate.toISOString().split('T')[0]}`);
                    return isDisabled;
                  }}
                  fromDate={selectedPlan?.startDate}
                  toDate={selectedPlan?.endDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">시간</label>
              <Select
                value={format(newPlan.time, 'HH')}
                onValueChange={(value) => {
                  const newTime = setHours(newPlan.time, parseInt(value));
                  onNewPlanChange({ ...newPlan, time: newTime });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(slot => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">우선순위</label>
              <Select
                value={newPlan.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  onNewPlanChange({ ...newPlan, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">낮음</SelectItem>
                  <SelectItem value="medium">보통</SelectItem>
                  <SelectItem value="high">높음</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">카테고리</label>
            <Select
              value={newPlan.category}
              onValueChange={(value) => onNewPlanChange({ ...newPlan, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">메모</label>
            <Textarea
              placeholder="추가 메모..."
              value={newPlan.description}
              onChange={(e) => onNewPlanChange({ ...newPlan, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              취소
            </Button>
            <Button onClick={onAddPlan} className="flex-1 bg-jeju-gradient">
              추가
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlanDialog; 