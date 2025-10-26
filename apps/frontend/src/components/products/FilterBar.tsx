import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface FilterBarProps {
  searchValue: string;
  categoryValue: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function FilterBar({
  searchValue,
  categoryValue,
  onSearchChange,
  onCategoryChange,
  onClearFilters,
  hasActiveFilters,
}: FilterBarProps) {
  const activeFilterCount = [
    searchValue,
    categoryValue,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
          />
        </div>
        <CategoryFilter
          value={categoryValue}
          onChange={onCategoryChange}
        />
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="h-8"
          >
            <X className="h-3 w-3 mr-1" />
            Clear Filters
          </Button>
          <Badge variant="secondary" className="h-8 px-2">
            {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
          </Badge>
        </div>
      )}
    </div>
  );
}
