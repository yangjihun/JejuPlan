
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-jeju-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-jeju-blue/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 animate-fade-in">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
          <span className="inline-block bg-clip-text text-transparent bg-jeju-gradient">제주도</span>로<br/>
          떠나는 여행
        </h1>
        <p className="max-w-md mx-auto text-muted-foreground mb-10">
          나만의 특별한 제주도 여행 계획을 세워보세요. 아름다운 자연과 맛있는 음식, 독특한 문화를 
          경험할 수 있는 최적의 일정을 만들어 드립니다.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto bg-jeju-gradient hover:opacity-90">
            일정 만들기 <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            여행지 둘러보기
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <a href="#destinations" className="animate-bounce p-2">
          <ArrowRight className="rotate-90 w-5 h-5 opacity-50" />
        </a>
      </div>
    </div>
  );
};

export default Hero;
