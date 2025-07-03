import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  SortAsc,
  SortDesc,
  Plus
} from 'lucide-react';
import { TravelPlan, NewTravelPlan } from './types';
import PlanCard from './PlanCard';
import EditPlanDialog from './EditPlanDialog';
import { cn } from '@/lib/utils';

interface PlanCardGridProps {
  plans: TravelPlan[];
  onEditPlan: (plan: TravelPlan) => void;
  onDeletePlan: (plan: TravelPlan) => void;
  onDuplicatePlan: (plan: TravelPlan) => void;
  onCreatePlan: (plan: NewTravelPlan) => void;
}

const PlanCardGrid: React.FC<PlanCardGridProps> = ({
  plans,
  onEditPlan,
  onDeletePlan,
  onDuplicatePlan,
  onCreatePlan,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState('createdAt');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  const [filterPublic, setFilterPublic] = React.useState<'all' | 'public' | 'private'>('all');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [isCreatingPlan, setIsCreatingPlan] = React.useState(false);

  // 필터링 및 정렬
  const filteredAndSortedPlans = React.useMemo(() => {
    let filtered = plans.filter(plan => {
      const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterPublic === 'all' || 
                           (filterPublic === 'public' && plan.isPublic) ||
                           (filterPublic === 'private' && !plan.isPublic);
      
      return matchesSearch && matchesFilter;
    });

    // 정렬
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'startDate':
          aValue = a.startDate;
          bValue = b.startDate;
          break;
        case 'createdAt':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        case 'completion':
          aValue = a.planItems.filter(item => item.isCompleted).length / Math.max(a.planItems.length, 1);
          bValue = b.planItems.filter(item => item.isCompleted).length / Math.max(b.planItems.length, 1);
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [plans, searchTerm, sortBy, sortOrder, filterPublic]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      {/* 상단 컨트롤 */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-2">
          <EditPlanDialog
            isOpen={isCreatingPlan}
            onOpenChange={setIsCreatingPlan}
            onCreate={onCreatePlan}
            onSave={() => {}} // 생성 모드에서는 사용하지 않음
            mode="create"
            trigger={
              <Button className="bg-jeju-gradient">
                <Plus className="mr-2 h-4 w-4" /> 새 플랜 만들기
              </Button>
            }
          />
          <Badge variant="secondary" className="text-sm">
            총 {plans.length}개 플랜
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          {/* 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="플랜 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>

          {/* 필터 */}
          <Select value={filterPublic} onValueChange={(value: 'all' | 'public' | 'private') => setFilterPublic(value)}>
            <SelectTrigger className="w-full sm:w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="public">공개</SelectItem>
              <SelectItem value="private">비공개</SelectItem>
            </SelectContent>
          </Select>

          {/* 정렬 */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">생성일</SelectItem>
              <SelectItem value="title">제목</SelectItem>
              <SelectItem value="startDate">시작일</SelectItem>
              <SelectItem value="completion">완료율</SelectItem>
            </SelectContent>
          </Select>

          {/* 정렬 순서 */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="w-full sm:w-auto"
          >
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>

          {/* 뷰 모드 */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 플랜 카드 그리드 */}
      {filteredAndSortedPlans.length > 0 ? (
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        )}>
          {filteredAndSortedPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={onEditPlan}
              onDelete={onDeletePlan}
              onDuplicate={onDuplicatePlan}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {searchTerm || filterPublic !== 'all' ? '검색 결과가 없습니다.' : '아직 플랜이 없습니다.'}
          </div>
          {!searchTerm && filterPublic === 'all' && (
            <EditPlanDialog
              isOpen={isCreatingPlan}
              onOpenChange={setIsCreatingPlan}
              onCreate={onCreatePlan}
              onSave={() => {}}
              mode="create"
              trigger={
                <Button className="bg-jeju-gradient">
                  <Plus className="mr-2 h-4 w-4" /> 첫 플랜 만들기
                </Button>
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PlanCardGrid; 