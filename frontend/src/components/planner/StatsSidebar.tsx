import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Heart, 
  Share2, 
  Copy 
} from 'lucide-react';
import { toast } from 'sonner';
import { PlanItem, TravelPlan } from './types';
import { categories } from './constants';
import { format, eachDayOfInterval, isSameDay, isPast, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface StatsSidebarProps {
  plans: PlanItem[];
  selectedPlan?: TravelPlan | null;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const StatsSidebar: React.FC<StatsSidebarProps> = ({ 
  plans, 
  selectedPlan,
  selectedDate,
  onDateSelect 
}) => {
  const completedCount = plans.filter(p => p.isCompleted).length;
  const totalCount = plans.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // 컴팩트 타임라인을 위한 함수들
  const getItemsForDate = (date: Date): PlanItem[] => {
    return plans.filter(item => isSameDay(item.time, date));
  };

  const getDotClassName = (date: Date, itemCount: number): string => {
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isPastDate = isPast(date) && !isToday(date);
    const isTodayDate = isToday(date);

    let baseClasses = "w-3 h-3 rounded-full transition-all duration-300 cursor-pointer hover:scale-110 shadow-sm";
    
          if (isPastDate) {
        // 지난 날짜
        if (itemCount === 0) {
          return cn(baseClasses, "bg-gray-600 border border-gray-500 hover:bg-gray-500");
        } else {
          return cn(baseClasses, "bg-gray-500 hover:bg-gray-400");
        }
      }
    
    if (isTodayDate) {
      // 오늘
      if (itemCount === 0) {
        return cn(baseClasses, "bg-green-300 border-2 border-green-400 ring-2 ring-green-200 hover:bg-green-400");
      } else {
        return cn(baseClasses, "bg-green-500 border-2 border-green-600 ring-2 ring-green-200 hover:bg-green-600");
      }
    }
    
    // 미래 날짜
    if (itemCount === 0) {
      return cn(baseClasses, "bg-slate-700 border-2 border-slate-600 hover:bg-slate-600 hover:border-slate-500");
    } else if (itemCount === 1) {
      return cn(baseClasses, "bg-gradient-to-br from-green-300 to-green-400 hover:from-jeju-blue/80 hover:to-green-500 ring-2 ring-green-200");
    } else if (itemCount === 2) {
      return cn(baseClasses, "bg-gradient-to-br from-green-400 to-green-500 hover:from-jeju-purple/80 hover:to-green-600 ring-2 ring-green-200" );
    } else {
      return cn(baseClasses, "bg-gradient-to-br from-green-500 to-green-700 hover:to-green-600 ring-2 ring-green-200");
    }
  };

  const handleShare = async () => {
    const data = {
      plans: plans,
      exportDate: new Date().toISOString(),
    };
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: '제주 여행 일정',
          text: `제주 여행 일정 (${totalCount}개 일정, 완료율 ${completionRate}%)`,
          url: window.location.href,
        });
        toast.success('일정이 공유되었습니다!');
      } else {
        // 클립보드에 복사
        const text = `제주 여행 일정\n총 ${totalCount}개 일정, 완료율 ${completionRate}%\n\n${plans.map(plan => `- ${plan.title} (${plan.location})`).join('\n')}`;
        await navigator.clipboard.writeText(text);
        toast.success('일정이 클립보드에 복사되었습니다!');
      }
    } catch (error) {
      toast.error('공유에 실패했습니다.');
    }
  };

  const handleCopy = async () => {
    const data = {
      plans: plans,
      exportDate: new Date().toISOString(),
    };
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast.success('일정이 클립보드에 복사되었습니다!');
    } catch (error) {
      toast.error('복사에 실패했습니다.');
    }
  };

  const handleFavorite = () => {
    // 즐겨찾기 기능 (로컬 스토리지에 저장)
    const favorites = JSON.parse(localStorage.getItem('jeju-favorites') || '[]');
    const currentPlan = {
      id: Date.now().toString(),
      plans: plans,
      createdAt: new Date().toISOString(),
      name: `제주 여행 일정 (${new Date().toLocaleDateString()})`,
    };
    
    favorites.push(currentPlan);
    localStorage.setItem('jeju-favorites', JSON.stringify(favorites));
    toast.success('즐겨찾기에 추가되었습니다!');
  };

  return (
    <div className="space-y-6">
      {/* 컴팩트 타임라인 */}
      {selectedPlan && (
        <Card className="glass border-0 bg-gradient-to-br from-gray-800/80 to-gray-900/40 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold bg-gradient-to-r from-jeju-blue to-jeju-purple bg-clip-text text-transparent">
              ✈️ 여행 일정
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {format(selectedPlan.startDate, 'MM.dd', { locale: ko })} - {format(selectedPlan.endDate, 'MM.dd', { locale: ko })} 
              ({eachDayOfInterval({ start: selectedPlan.startDate, end: selectedPlan.endDate }).length - 1}박
              {eachDayOfInterval({ start: selectedPlan.startDate, end: selectedPlan.endDate }).length}일)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-7 gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
              {eachDayOfInterval({
                start: selectedPlan.startDate,
                end: selectedPlan.endDate,
              }).map((date, index) => {
                const itemsForDate = getItemsForDate(date);
                const itemCount = itemsForDate.length;
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                
                return (
                  <div key={date.toISOString()} className="flex flex-col items-center gap-1.5">
                    <div className="text-xs font-medium text-muted-foreground">
                      {format(date, 'EEE', { locale: ko })}
                    </div>
                    <div className="relative">
                      <div
                        className={getDotClassName(date, itemCount)}
                        onClick={() => onDateSelect?.(date)}
                        title={`${format(date, 'MM.dd (EEE)', { locale: ko })} - ${itemCount}개 일정`}
                      />
                      {/* 선택된 날짜 표시 */}
                      {isSelected && (
                        <div className="absolute inset-0 rounded-full border-2 border-gray-200 shadow-lg animate-pulse" />
                      )}
                    </div>
                    <div className="text-xs font-medium text-center min-w-[16px]">
                      {format(date, 'dd', { locale: ko })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 통계 카드 */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">일정 통계</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <div className="text-2xl font-bold text-jeju-purple">{totalCount}</div>
              <div className="text-sm text-muted-foreground">전체 일정</div>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <div className="text-2xl font-bold text-green-500">{completionRate}%</div>
              <div className="text-sm text-muted-foreground">완료율</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>완료된 일정</span>
              <span className="font-medium">{completedCount}개</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>남은 일정</span>
              <span className="font-medium">{totalCount - completedCount}개</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 카테고리별 통계 */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">카테고리별</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map(category => {
              const count = plans.filter(p => p.category === category.value).length;
              if (count === 0) return null;
              
              const Icon = category.icon;
              return (
                <div key={category.value} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{category.label}</span>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 빠른 액션 */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">빠른 액션</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            일정 공유
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            일정 복사
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleFavorite}>
            <Heart className="mr-2 h-4 w-4" />
            즐겨찾기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSidebar; 