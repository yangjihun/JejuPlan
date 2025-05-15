
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 px-6 md:px-12 glass">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <MapPin className="text-jeju-purple w-6 h-6" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-jeju-gradient">
              제주 플래너
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#destinations" className="text-sm hover:text-jeju-purple transition-colors">
              여행지
            </a>
            <a href="#planner" className="text-sm hover:text-jeju-purple transition-colors">
              일정 만들기
            </a>
            <a href="#about" className="text-sm hover:text-jeju-purple transition-colors">
              소개
            </a>
            <Button variant="link" size="sm" className="text-sm p-0">
              문의하기
            </Button>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2025 제주 플래너. 모든 권리 보유.
          </p>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              이용약관
            </Button>
            <Button variant="ghost" size="sm">
              개인정보처리방침
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
