
import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Star, Clock } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-jeju-purple" />,
      title: "인기 여행지 탐색",
      description: "제주도 내 인기 있는 다양한 여행지들을 쉽게 둘러보고 정보를 얻을 수 있습니다."
    },
    {
      icon: <Calendar className="h-8 w-8 text-jeju-purple" />,
      title: "맞춤형 일정 계획",
      description: "날짜와 장소, 시간을 설정하여 나만의 맞춤형 제주도 여행 일정을 계획할 수 있습니다."
    },
    {
      icon: <Clock className="h-8 w-8 text-jeju-purple" />,
      title: "시간 관리",
      description: "효율적인 동선을 고려한 최적의 일정을 생성하여 여행의 효율을 극대화합니다."
    },
    {
      icon: <Star className="h-8 w-8 text-jeju-purple" />,
      title: "추천 코스",
      description: "테마별, 계절별 다양한 추천 여행 코스를 참고하여 더 특별한 여행을 계획하세요."
    }
  ];

  return (
    <div id="about" className="py-20 px-6 md:px-12 bg-secondary/30">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">제주 플래너 소개</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in">
          제주 플래너는 제주도 여행을 계획하는 여행자들을 위한 최고의 도구입니다.
          손쉽게 여행 일정을 만들고 관리할 수 있어요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="glass border-white/10 p-6 text-center animate-fade-in">
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
