
import React from 'react';
import { Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface RecipeTypeFilterProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
}

const RecipeTypeFilter: React.FC<RecipeTypeFilterProps> = ({ 
  selectedType, 
  setSelectedType 
}) => {
  const recipeTypes = [
    { id: 'sourdough', label: 'Sourdough' },
    { id: 'whole-wheat', label: 'Whole Wheat' },
    { id: 'artisan', label: 'Artisan' },
    { id: 'quick-bread', label: 'Quick Bread' },
    { id: 'flatbread', label: 'Flatbread' },
    { id: 'sweet', label: 'Sweet Breads' },
  ];

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="border-bread-200 text-bread-800 h-auto px-4 py-2 transition-all duration-300 hover:bg-bread-100 hover:border-bread-300"
            aria-label="Filter recipes by type"
          >
            <Tag className="h-4 w-4 mr-2" />
            <span>Filter by Type</span>
            {selectedType && (
              <Badge variant="secondary" className="ml-2 font-normal">
                {recipeTypes.find(t => t.id === selectedType)?.label || selectedType}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Recipe Types</h4>
              {selectedType && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => setSelectedType('')}
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            
            <ToggleGroup 
              type="single" 
              value={selectedType}
              onValueChange={(value) => setSelectedType(value)}
              className="flex flex-wrap gap-2"
            >
              {recipeTypes.map((type) => (
                <ToggleGroupItem
                  key={type.id}
                  value={type.id}
                  aria-label={`Filter by ${type.label}`}
                  className="border border-bread-200 data-[state=on]:bg-bread-100 data-[state=on]:text-bread-800 data-[state=on]:border-bread-300"
                >
                  {type.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RecipeTypeFilter;
