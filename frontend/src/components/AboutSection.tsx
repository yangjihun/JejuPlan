import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Star, Clock, Share2, Download, Heart } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-jeju-purple" />,
      title: "다양한 여행지 정보",
      description: "제주도의 인기 여행지들을 둘러보고 여행 계획에 영감을 얻을 수 있습니다."
    },
    {
      icon: <Calendar className="h-8 w-8 text-jeju-purple" />,
      title: "드래그 앤 드롭 일정 관리",
      description: "직관적인 드래그 앤 드롭으로 일정 순서를 자유롭게 조정할 수 있습니다."
    },
    {
      icon: <Clock className="h-8 w-8 text-jeju-purple" />,
      title: "카테고리별 일정 분류",
      description: "관광지, 맛집, 카페 등 카테고리별로 일정을 정리하여 효율적인 여행을 계획하세요."
    },
    {
      icon: <Share2 className="h-8 w-8 text-jeju-purple" />,
      title: "일정 공유 및 내보내기",
      description: "만든 일정을 공유하거나 JSON 파일로 내보내서 다른 사람과 함께 사용할 수 있습니다."
    },
    {
      icon: <Download className="h-8 w-8 text-jeju-purple" />,
      title: "로컬 저장 및 동기화",
      description: "브라우저에 안전하게 저장되어 언제든지 이어서 계획을 세울 수 있습니다."
    },
    {
      icon: <Heart className="h-8 w-8 text-jeju-purple" />,
      title: "즐겨찾기 및 복제",
      description: "마음에 드는 플랜을 즐겨찾기에 추가하거나 복제하여 다양한 버전을 만들어보세요."
    }
  ];

  return (
    <div id="about" className="py-20 px-6 md:px-12 bg-secondary/30">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">제주 플래너의 특별한 기능</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in">
          제주 플래너는 제주도 여행을 계획하는 여행자들을 위한 최고의 도구입니다.
          직관적이고 강력한 기능으로 완벽한 여행 계획을 만들어보세요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="glass border-white/10 p-6 text-center animate-fade-in hover:shadow-lg transition-all duration-300">
            <div className="flex justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AboutSection;
