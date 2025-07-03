import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Clock, ArrowRight } from 'lucide-react';
import { TravelPlan } from './planner/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const RecentPlansSection = () => {
  const navigate = useNavigate();
  const [recentPlans, setRecentPlans] = useState<TravelPlan[]>([]);

  useEffect(() => {
    // localStorage에서 최근 플랜 3개 가져오기
    const savedPlans = localStorage.getItem('jeju-travel-plans');
    if (savedPlans) {
      const plans = JSON.parse(savedPlans);
      const plansWithDates = plans.map((plan: any) => ({
        ...plan,
        startDate: new Date(plan.startDate),
        endDate: new Date(plan.endDate),
        createdAt: new Date(plan.createdAt),
        updatedAt: new Date(plan.updatedAt),
      }));
      
      // 최근 3개 플랜만 가져오기
      const recent = plansWithDates
        .sort((a: TravelPlan, b: TravelPlan) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, 3);
      
      setRecentPlans(recent);
    }
  }, []);

  if (recentPlans.length === 0) {
    return (
      <div className="py-20 px-6 md:px-12">
        <div className="mb-12 text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">나만의 제주 여행 계획</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            아직 여행 계획이 없으시군요! 첫 번째 제주도 여행 계획을 만들어보세요.
          </p>
          <Button 
            size="lg" 
            className="bg-jeju-gradient hover:opacity-90"
            onClick={() => navigate('/plans')}
          >
            첫 여행 계획 만들기 <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-6 md:px-12">
      <div className="mb-12 text-center animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">최근 여행 계획</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          최근에 만든 여행 계획들을 확인하고 계속해서 계획을 세워보세요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {recentPlans.map((plan, index) => (
          <Card 
            key={plan.id} 
            className="glass border-white/10 hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer"
            onClick={() => navigate(`/plans/${plan.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-medium line-clamp-2">{plan.title}</CardTitle>
                <Badge variant={plan.isPublic ? "default" : "secondary"} className="text-xs">
                  {plan.isPublic ? '공개' : '비공개'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {plan.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>
                  {format(plan.startDate, 'MM.dd', { locale: ko })} - {format(plan.endDate, 'MM.dd', { locale: ko })}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{plan.totalDays}박 {plan.totalDays + 1}일</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{plan.planItems.length}개 일정</span>
              </div>
              
              {plan.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {plan.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
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
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/plans/${plan.id}`);
                }}
              >
                계속 편집하기
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => navigate('/plans')}
        >
          모든 플랜 보기 <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RecentPlansSection; 