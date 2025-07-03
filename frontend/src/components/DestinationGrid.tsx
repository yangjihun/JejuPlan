import React, { useState } from 'react';
import DestinationCard from './DestinationCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mountain, Waves, Coffee, Camera, Utensils, ShoppingBag } from 'lucide-react';

const destinations = [
  // 자연/관광지
  {
    name: '성산일출봉',
    image: 'https://api.cdn.visitjeju.net/photomng/imgpath/202409/20/c8df320a-80df-47d9-a541-bf86631e5d51.png',
    description: '제주도의 상징적인 명소로, 유네스코 세계자연유산으로 지정된 화산 분화구입니다.',
    tags: ['유네스코', '자연', '일출'],
    category: 'nature'
  },
  {
    name: '한라산',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/KOCIS_Halla_Mountain_in_Jeju-do_%286387785543%29.jpg',
    description: '제주도 중앙에 위치한 한국에서 가장 높은 산으로, 사계절 내내 아름다운 풍경을 자랑합니다.',
    tags: ['등산', '국립공원', '자연'],
    category: 'nature'
  },
  {
    name: '만장굴',
    image: 'https://api.cdn.visitjeju.net/photomng/imgpath/202110/28/a8c617a7-0b5e-4771-825b-c68d96904443.jpg',
    description: '세계에서 가장 긴 용암 동굴 중 하나로, 독특한 용암 생성물을 볼 수 있습니다.',
    tags: ['동굴', '유네스코', '자연'],
    category: 'nature'
  },
  {
    name: '천지연폭포',
    image: 'https://api.cdn.visitjeju.net/photomng/imgpath/202110/28/b8c617a7-0b5e-4771-825b-c68d96904444.jpg',
    description: '제주도 서귀포시에 위치한 아름다운 폭포로, 주변의 울창한 숲과 어우러져 환상적인 풍경을 연출합니다.',
    tags: ['폭포', '자연', '산책'],
    category: 'nature'
  },
  
  // 해변/바다
  {
    name: '우도',
    image: 'https://img7.yna.co.kr/etc/inner/KR/2024/01/10/AKR20240110067400542_02_i_P4.jpg',
    description: '제주도 동쪽에 위치한 작은 섬으로, 아름다운 해변과 목가적인 풍경이 매력적인 곳입니다.',
    tags: ['섬', '해변', '자전거'],
    category: 'beach'
  },
  {
    name: '월정리 해변',
    image: 'https://api.cdn.visitjeju.net/photomng/imgpath/202407/10/522c3966-0208-490e-8f10-66cddb778421.jpg',
    description: '하얀 모래와 에메랄드빛 바다가 어우러진 아름다운 해변으로, 서핑 명소로도 유명합니다.',
    tags: ['해변', '서핑', '일몰'],
    category: 'beach'
  },
  {
    name: '협재해변',
    image: 'https://api.cdn.visitjeju.net/photomng/imgpath/202110/28/c8c617a7-0b5e-4771-825b-c68d96904445.jpg',
    description: '투명한 바다와 하얀 모래사장이 조화를 이루는 아름다운 해변으로, 제주도 최고의 해수욕장 중 하나입니다.',
    tags: ['해변', '해수욕', '수영'],
    category: 'beach'
  },
  
  // 카페/휴식
  {
    name: '카페거리',
    image: 'https://mblogthumb-phinf.pstatic.net/MjAyMzAxMjRfMTYw/MDAxNjc0NTcwNDQ5NjU5.uKZVtvfNVt1TyU-KZNi-k5NIoVqViMb9BrnbBWlfHvQg._M_-_iXzjNXn8-i9HH4SkPDw7znTbMXtN17wtD7XXasg.JPEG.ka8564/%EC%95%A0%EC%9B%94%EC%B9%B4%ED%8E%98-254.jpg?type=w800',
    description: '아름다운 해안선과 감각적인 카페들이 모여있는 제주의 유명한 휴식 공간입니다.',
    tags: ['카페', '휴식', '바다뷰'],
    category: 'cafe'
  },
  {
    name: '애월카페거리',
    image: 'https://api.cdn.visitjeju.net/photomng/imgpath/202110/28/d8c617a7-0b5e-4771-825b-c68d96904446.jpg',
    description: '제주도 애월읍의 유명한 카페거리로, 바다를 바라보며 즐길 수 있는 다양한 카페들이 모여있습니다.',
    tags: ['카페', '바다뷰', '휴식'],
    category: 'cafe'
  },
  
  // 맛집
  {
    name: '흑돼지 맛집',
    image: 'https://api.cdn.visitjeju.net/photomng/imgpath/202110/28/e8c617a7-0b5e-4771-825b-c68d96904447.jpg',
    description: '제주도 특산품인 흑돼지를 맛볼 수 있는 유명한 맛집들로, 제주 여행의 필수 코스입니다.',
    tags: ['흑돼지', '맛집', '제주특산'],
    category: 'food'
  },
  {
    name: '해산물 맛집',
    image: 'https://api.cdn.visitjeju.net/photomng/imgpath/202110/28/f8c617a7-0b5e-4771-825b-c68d96904448.jpg',
    description: '신선한 제주 해산물을 맛볼 수 있는 곳으로, 회, 해물탕 등 다양한 해산물 요리를 즐길 수 있습니다.',
    tags: ['해산물', '회', '해물탕'],
    category: 'food'
  },
  
  // 쇼핑
  {
    name: '제주공항면세점',
    image: 'https://api.cdn.visitjeju.net/photomng/imgpath/202110/28/g8c617a7-0b5e-4771-825b-c68d96904449.jpg',
    description: '제주공항 내 면세점으로, 여행 마무리와 함께 쇼핑을 즐길 수 있는 편리한 공간입니다.',
    tags: ['면세점', '쇼핑', '공항'],
    category: 'shopping'
  },
  {
    name: '제주올레시장',
    image: 'https://api.cdn.visitjeju.net/photomng/imgpath/202110/28/h8c617a7-0b5e-4771-825b-c68d96904450.jpg',
    description: '제주도의 전통시장으로, 현지인들의 생활과 제주 특산품을 구경할 수 있는 곳입니다.',
    tags: ['전통시장', '특산품', '현지생활'],
    category: 'shopping'
  }
];

const categories = [
  { id: 'all', name: '전체', icon: Camera },
  { id: 'nature', name: '자연/관광지', icon: Mountain },
  { id: 'beach', name: '해변/바다', icon: Waves },
  { id: 'cafe', name: '카페/휴식', icon: Coffee },
  { id: 'food', name: '맛집', icon: Utensils },
  { id: 'shopping', name: '쇼핑', icon: ShoppingBag },
];

const DestinationGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredDestinations = selectedCategory === 'all' 
    ? destinations.slice(0, 6) // 전체 카테고리에서는 최대 6개만 표시
    : destinations.filter(dest => dest.category === selectedCategory).slice(0, 6); // 각 카테고리에서도 최대 6개만 표시

  return (
    <div id="destinations" className="py-20 px-6 md:px-12">
      <div className="mb-12 text-center animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">인기 여행지</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          제주도의 아름다운 자연과 독특한 문화를 경험할 수 있는 인기 여행지를 둘러보세요.
          당신만의 특별한 여행 계획을 만들어보세요.
        </p>
        
        {/* 카테고리 필터 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`transition-all duration-200 ${
                  selectedCategory === category.id 
                    ? 'bg-jeju-gradient text-white border-none' 
                    : 'hover:bg-jeju-purple/10'
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((destination, index) => (
          <div key={destination.name} className={`transition-all duration-500 delay-${index*100} animate-fade-in`}>
            <DestinationCard {...destination} />
          </div>
        ))}
      </div>
      
      {filteredDestinations.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Camera className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>선택한 카테고리에 해당하는 여행지가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default DestinationGrid;
