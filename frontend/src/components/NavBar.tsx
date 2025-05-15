
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Menu } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center glass">
      <div className="flex items-center space-x-2">
        <MapPin className="text-jeju-purple w-6 h-6" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-jeju-gradient">
          제주 플래너
        </span>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <a href="#destinations" className="text-sm hover:text-jeju-purple transition-colors">
          여행지
        </a>
        <a href="#planner" className="text-sm hover:text-jeju-purple transition-colors">
          일정 만들기
        </a>
        <a href="#about" className="text-sm hover:text-jeju-purple transition-colors">
          소개
        </a>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
          <CalendarDays className="h-4 w-4" /> 일정 보기
        </Button>
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
