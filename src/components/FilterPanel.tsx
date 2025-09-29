import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Filter, Calendar, Percent, RotateCcw } from "lucide-react";
import { FilterOptions, ProductData } from './Dashboard';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  data: ProductData[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, data }) => {
  const categories = ['All', ...new Set(data.map(item => item.category))];
  
  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: { ...filters.dateRange, [field]: value }
    });
  };

  const handleProfitMarginChange = (value: string) => {
    onFiltersChange({ ...filters, minProfitMargin: parseFloat(value) || 0 });
  };

  const resetFilters = () => {
    onFiltersChange({
      category: 'All',
      dateRange: { start: '', end: '' },
      minProfitMargin: 0
    });
  };

  const hasActiveFilters = filters.category !== 'All' || 
                          filters.dateRange.start || 
                          filters.dateRange.end || 
                          filters.minProfitMargin > 0;

  return (
    <Card className="analytics-card animate-slide-up">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-primary" />
            <h3 className="text-lg font-semibold">Filters</h3>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                Active
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <Select value={filters.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filters */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Start Date
            </Label>
            <Input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              End Date
            </Label>
            <Input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              min={filters.dateRange.start}
              className="w-full"
            />
          </div>

          {/* Profit Margin Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Percent className="w-4 h-4 mr-1" />
              Min Profit Margin
            </Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={filters.minProfitMargin}
                onChange={(e) => handleProfitMarginChange(e.target.value)}
                className="w-full pr-8"
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-6 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-3">Active filters:</p>
            <div className="flex flex-wrap gap-2">
              {filters.category !== 'All' && (
                <Badge variant="secondary" className="animate-fade-in">
                  Category: {filters.category}
                </Badge>
              )}
              {filters.dateRange.start && (
                <Badge variant="secondary" className="animate-fade-in">
                  From: {filters.dateRange.start}
                </Badge>
              )}
              {filters.dateRange.end && (
                <Badge variant="secondary" className="animate-fade-in">
                  To: {filters.dateRange.end}
                </Badge>
              )}
              {filters.minProfitMargin > 0 && (
                <Badge variant="secondary" className="animate-fade-in">
                  Min Profit: {(filters.minProfitMargin * 100).toFixed(1)}%
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};