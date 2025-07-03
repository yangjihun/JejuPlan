import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format, setHours } from 'date-fns';
import { PlanItem } from './types';
import { categories, timeSlots } from './constants';

interface EditItemDialogProps {
  plan: PlanItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<PlanItem>) => void;
}

const EditItemDialog: React.FC<EditItemDialogProps> = ({
  plan,
  isOpen,
  onOpenChange,
  onSave,
}) => {
  const [editData, setEditData] = useState<Partial<PlanItem>>({});

  useEffect(() => {
    if (plan) {
      setEditData({
        title: plan.title,
        location: plan.location,
        time: plan.time,
        category: plan.category,
        description: plan.description,
        priority: plan.priority,
      });
    }
  }, [plan]);

  const handleSave = () => {
    if (plan && editData) {
      onSave(plan.id, editData);
      onOpenChange(false);
    }
  };

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>일정 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          <div>
            <label className="text-sm font-medium">제목</label>
            <Input
              placeholder="일정 제목"
              value={editData.title || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">장소</label>
            <Input
              placeholder="방문할 장소"
              value={editData.location || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">시간</label>
              <Select
                value={editData.time ? format(editData.time, 'HH') : '00'}
                onValueChange={(value) => {
                  const newTime = setHours(editData.time || new Date(), parseInt(value));
                  setEditData(prev => ({ ...prev, time: newTime }));
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
                value={editData.priority || 'medium'}
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setEditData(prev => ({ ...prev, priority: value }))
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
              value={editData.category || 'attraction'}
              onValueChange={(value) => setEditData(prev => ({ ...prev, category: value }))}
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
              value={editData.description || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              취소
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-jeju-gradient">
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog; 