
import React from 'react';
import DestinationCard from './DestinationCard';

const destinations = [
  {
    name: '성산일출봉',
    image: 'https://api.cdn.visitjeju.net/photomng/imgpath/202409/20/c8df320a-80df-47d9-a541-bf86631e5d51.png',
    description: '제주도의 상징적인 명소로, 유네스코 세계자연유산으로 지정된 화산 분화구입니다.',
    tags: ['유네스코', '자연', '일출'],
  },
  {
    name: '한라산',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/KOCIS_Halla_Mountain_in_Jeju-do_%286387785543%29.jpg',
    description: '제주도 중앙에 위치한 한국에서 가장 높은 산으로, 사계절 내내 아름다운 풍경을 자랑합니다.',
    tags: ['등산', '국립공원', '자연'],
  },
  {
    name: '우도',
    image: 'https://img7.yna.co.kr/etc/inner/KR/2024/01/10/AKR20240110067400542_02_i_P4.jpg',
    description: '제주도 동쪽에 위치한 작은 섬으로, 아름다운 해변과 목가적인 풍경이 매력적인 곳입니다.',
    tags: ['섬', '해변', '자전거'],
  },
  {
    name: '카페거리',
    image: 'https://mblogthumb-phinf.pstatic.net/MjAyMzAxMjRfMTYw/MDAxNjc0NTcwNDQ5NjU5.uKZVtvfNVt1TyU-KZNi-k5NIoVqViMb9BrnbBWlfHvQg._M_-_iXzjNXn8-i9HH4SkPDw7znTbMXtN17wtD7XXasg.JPEG.ka8564/%EC%95%A0%EC%9B%94%EC%B9%B4%ED%8E%98-254.jpg?type=w800',
    description: '아름다운 해안선과 감각적인 카페들이 모여있는 제주의 유명한 휴식 공간입니다.',
    tags: ['카페', '휴식', '바다뷰'],
  },
  {
    name: '만장굴',
    image: 'https://api.cdn.visitjeju.net/photomng/imgpath/202110/28/a8c617a7-0b5e-4771-825b-c68d96904443.jpg',
    description: '세계에서 가장 긴 용암 동굴 중 하나로, 독특한 용암 생성물을 볼 수 있습니다.',
    tags: ['동굴', '유네스코', '자연'],
  },
  {
    name: '월정리 해변',
    image: 'https://api.cdn.visitjeju.net/photomng/imgpath/202407/10/522c3966-0208-490e-8f10-66cddb778421.jpg',
    description: '하얀 모래와 에메랄드빛 바다가 어우러진 아름다운 해변으로, 서핑 명소로도 유명합니다.',
    tags: ['해변', '서핑', '일몰'],
  }
];

const DestinationGrid = () => {
  return (
    <div id="destinations" className="py-20 px-6 md:px-12">
      <div className="mb-12 text-center animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">인기 여행지</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          제주도의 아름다운 자연과 독특한 문화를 경험할 수 있는 인기 여행지를 둘러보세요.
          당신만의 특별한 여행 계획을 만들어보세요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination, index) => (
          <div key={destination.name} className={`transition-all duration-500 delay-${index*100} animate-fade-in`}>
            <DestinationCard {...destination} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationGrid;
