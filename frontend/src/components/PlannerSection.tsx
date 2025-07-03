import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays, Clock, MapPin, Plus, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const PlannerSection = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [plans, setPlans] = useState<string[]>([]);
  const [newPlan, setNewPlan] = useState('');
  const navigate = useNavigate();

  const addPlan = () => {
    if (newPlan.trim()) {
      setPlans([...plans, newPlan]);
      setNewPlan('');
    }
  };

  const goToPlanner = () => {
    navigate('/planner');
  };

  return (
    <div id="planner" className="min-h-screen py-20 px-6 md:px-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-jeju-purple/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-jeju-blue/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="mb-12 text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">나만의 일정 만들기</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            원하는 날짜와 장소를 선택하여 당신만의 제주도 여행 계획을 만들어보세요.
            장소, 시간, 메모까지 한눈에 확인할 수 있습니다.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass p-6 animate-fade-in">
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-jeju-purple" /> 여행 날짜 선택
            </h3>
            
            <div className="border border-white/10 rounded-lg p-4 bg-secondary/50">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="mx-auto"
              />
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-jeju-purple" />
                <Input 
                  placeholder="방문할 장소" 
                  className="bg-secondary/50 border-white/10"
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-jeju-purple" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-secondary/50 border-white/10",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? format(date, "PPP") : <span>날짜 선택</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <Button className="w-full bg-jeju-gradient" onClick={addPlan}>
                <Plus className="mr-2 h-4 w-4" /> 일정에 추가
              </Button>
            </div>
          </div>
          
          <div className="glass p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium">
                {date ? format(date, "yyyy년 MM월 dd일") : "날짜"} 여행 계획
              </h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToPlanner}
                className="bg-jeju-gradient text-white border-none hover:opacity-90"
              >
                상세 플래너
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {plans.length > 0 ? (
              <ul className="space-y-3">
                {plans.map((plan, idx) => (
                  <li key={idx} className="bg-secondary/50 p-3 rounded-lg border border-white/10 animate-slide-in">
                    <div className="flex items-start">
                      <span className="flex items-center justify-center bg-jeju-purple h-6 w-6 rounded-full text-xs text-white mr-3 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-medium">{plan}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(date || new Date(), "HH:mm")}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>아직 계획된 일정이 없습니다.</p>
                <p className="text-sm">왼쪽에서 장소를 추가해 보세요!</p>
                <Button 
                  variant="outline" 
                  className="mt-4 bg-jeju-gradient text-white border-none hover:opacity-90"
                  onClick={goToPlanner}
                >
                  상세 플래너로 이동
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerSection;
