import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Edit, 
  Trash2, 
  Copy, 
  Eye,
  MoreHorizontal,
  Users,
  Lock
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { TravelPlan, PlanCardProps } from './types';
import { categories } from './constants';

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const navigate = useNavigate();
  const totalDays = differenceInDays(plan.endDate, plan.startDate) + 1;
  const completedItems = plan.planItems.filter(item => item.isCompleted).length;
  const totalItems = plan.planItems.length;
  const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // 카테고리별 일정 개수 계산
  const categoryCounts = categories.map(category => ({
    ...category,
    count: plan.planItems.filter(item => item.category === category.value).length
  })).filter(cat => cat.count > 0).slice(0, 3); // 상위 3개만 표시

  const handleCardClick = () => {
    // 개별 플랜 페이지로 이동
    navigate(`/plans/${plan.id}`);
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-white/5 to-white/10 border-white/10 hover:border-white/20">
      <div onClick={handleCardClick}>
        {/* 카드 헤더 */}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate mb-1">{plan.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(plan);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(plan);
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(plan);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* 카드 컨텐츠 */}
        <CardContent className="space-y-4">
          {/* 날짜 정보 */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-jeju-purple" />
              <span>{format(plan.startDate, 'MM.dd', { locale: ko })} - {format(plan.endDate, 'MM.dd', { locale: ko })}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {totalDays}박 {totalDays + 1}일
            </Badge>
            {plan.isPublic ? (
              <div className="flex items-center gap-1 text-green-500">
                <Users className="h-3 w-3" />
                <span className="text-xs">공개</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span className="text-xs">비공개</span>
              </div>
            )}
          </div>

          {/* 진행률 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>진행률</span>
              <span className="font-medium">{completionRate}%</span>
            </div>
            <div className="w-full bg-secondary/50 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>완료: {completedItems}개</span>
              <span>전체: {totalItems}개</span>
            </div>
          </div>

          {/* 카테고리별 일정 */}
          {categoryCounts.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">주요 일정</p>
              <div className="flex flex-wrap gap-1">
                {categoryCounts.map(category => (
                  <Badge 
                    key={category.value} 
                    variant="secondary" 
                    className="text-xs"
                    style={{ backgroundColor: category.color.replace('bg-', '') }}
                  >
                    {category.label} {category.count}개
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 태그 */}
          {plan.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {plan.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {plan.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{plan.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* 생성일 */}
          <div className="text-xs text-muted-foreground">
            생성일: {format(plan.createdAt, 'yyyy년 MM월 dd일', { locale: ko })}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default PlanCard; 