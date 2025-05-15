
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DestinationCardProps {
  name: string;
  image: string;
  description: string;
  tags: string[];
}

const DestinationCard = ({ name, image, description, tags }: DestinationCardProps) => {
  return (
    <Card className="card-gradient overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-jeju-purple/10">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jeju-dark/80 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-white text-xl font-bold">{name}</h3>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="px-2 py-1 text-xs bg-jeju-purple/10 text-jeju-purple rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="w-full group-hover:bg-jeju-gradient group-hover:text-white transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" /> 일정에 추가
        </Button>
      </div>
    </Card>
  );
};

export default DestinationCard;
