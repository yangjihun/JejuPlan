import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarDays, 
  X,
  Tag,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { TravelPlan, NewTravelPlan } from './types';

interface EditPlanDialogProps {
  plan?: TravelPlan | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (plan: TravelPlan) => void;
  onCreate?: (plan: NewTravelPlan) => void;
  mode?: 'create' | 'edit';
  trigger?: React.ReactNode;
}

const EditPlanDialog: React.FC<EditPlanDialogProps> = ({
  plan,
  isOpen,
  onOpenChange,
  onSave,
  onCreate,
  mode = 'edit',
  trigger,
}) => {
  const [editData, setEditData] = useState<Partial<TravelPlan>>({});
  const [newTag, setNewTag] = useState('');

  const isCreateMode = mode === 'create';

  useEffect(() => {
    if (plan && !isCreateMode) {
      // 편집 모드: 기존 플랜 데이터로 초기화
      setEditData({
        title: plan.title,
        description: plan.description,
        startDate: plan.startDate,
        endDate: plan.endDate,
        isPublic: plan.isPublic,
        tags: plan.tags,
      });
    } else if (isCreateMode) {
      // 생성 모드: 기본값으로 초기화
      setEditData({
        title: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 내일
        isPublic: false,
        tags: [],
      });
    }
  }, [plan, isCreateMode]);

  const handleSave = () => {
    if (editData.title?.trim()) {
      if (isCreateMode && onCreate) {
        // 생성 모드
        const newPlanData: NewTravelPlan = {
          title: editData.title,
          description: editData.description || '',
          startDate: editData.startDate || new Date(),
          endDate: editData.endDate || new Date(),
          isPublic: editData.isPublic || false,
          tags: editData.tags || [],
        };
        onCreate(newPlanData);
      } else if (plan && !isCreateMode) {
        // 편집 모드
        const updatedPlan: TravelPlan = {
          ...plan,
          ...editData,
          updatedAt: new Date(),
        };
        onSave(updatedPlan);
      }
      onOpenChange(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !editData.tags?.includes(newTag.trim())) {
      setEditData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const dialogTitle = isCreateMode ? '새로운 제주 여행 플랜 만들기' : '플랜 수정';
  const saveButtonText = isCreateMode ? '플랜 만들기' : '저장';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          <div>
            <label className="text-sm font-medium">플랜 제목</label>
            <Input
              placeholder="플랜 제목을 입력하세요"
              value={editData.title || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">설명 (선택사항)</label>
            <Textarea
              placeholder="플랜에 대한 설명을 입력하세요 (선택사항)"
              value={editData.description || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">시작일</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {editData.startDate ? format(editData.startDate, "PPP", { locale: ko }) : <span>날짜 선택</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editData.startDate}
                    onSelect={(date) => date && setEditData(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium">종료일</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editData.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {editData.endDate ? format(editData.endDate, "PPP", { locale: ko }) : <span>날짜 선택</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editData.endDate}
                    onSelect={(date) => date && setEditData(prev => ({ ...prev, endDate: date }))}
                    initialFocus
                    disabled={(date) => date < (editData.startDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">태그</label>
            <div className="flex gap-2">
              <Input
                placeholder="태그 입력 후 Enter"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button variant="outline" size="sm" onClick={addTag}>
                <Tag className="h-4 w-4" />
              </Button>
            </div>
            {editData.tags && editData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {editData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={editData.isPublic || false}
              onCheckedChange={(checked) => setEditData(prev => ({ ...prev, isPublic: checked }))}
            />
            <label htmlFor="public" className="text-sm font-medium">
              공개 플랜
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              취소
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-jeju-gradient">
              {saveButtonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlanDialog; 