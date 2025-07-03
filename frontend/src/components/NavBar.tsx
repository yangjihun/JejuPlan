
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Menu } from "lucide-react";
import GradientText from '@/components/ui/GradientText';
import { useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center glass">
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-xl font-bold bg-clip-text text-transparent bg-jeju-gradient transition-colors hover:text-jeju-purple flex items-center gap-2"
        >
          <MapPin className="w-6 h-6 text-jeju-purple" />
          <GradientText
            colors={["#8B5CF6", "#4079ff", "#8B5CF6", "#4079ff", "#8B5CF6"]}
            animationSpeed={2}
            showBorder={false}
            className="custom-class"
          >
            JejuPlan
          </GradientText>
        </button>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        {isHomePage && (
          <>
        <a href="#destinations" className="text-sm hover:text-jeju-purple transition-colors">
          여행지
        </a>
        <a href="#planner" className="text-sm hover:text-jeju-purple transition-colors">
          일정 만들기
        </a>
        <a href="#about" className="text-sm hover:text-jeju-purple transition-colors">
          소개
        </a>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {isHomePage && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex items-center gap-2"
              onClick={() => navigate('/plans')}
            >
              <CalendarDays className="h-4 w-4" /> 플랜 관리
            </Button>
          </>
        )}
        {!isHomePage && (
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            홈으로
        </Button>
        )}
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
