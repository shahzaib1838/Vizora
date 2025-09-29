import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, TrendingUp, TrendingDown, Filter, Calendar, DollarSign } from "lucide-react";
import { RevenueChart } from "./charts/RevenueChart";
import { CategoryChart } from "./charts/CategoryChart";
import { TrendChart } from "./charts/TrendChart";
import { FilterPanel } from "./FilterPanel";
import { FileUpload } from "./FileUpload";
import analyticsHero from "@/assets/analytics-hero.jpg";

// Mock data for demonstration
const mockData = [
  { id: 1, name: 'Premium Laptop', category: 'Electronics', unitsSold: 245, revenue: 122500, profitMargin: 0.25, date: '2024-01-15' },
  { id: 2, name: 'Wireless Headphones', category: 'Electronics', unitsSold: 890, revenue: 89000, profitMargin: 0.35, date: '2024-01-20' },
  { id: 3, name: 'Office Chair', category: 'Furniture', unitsSold: 156, revenue: 46800, profitMargin: 0.18, date: '2024-02-10' },
  { id: 4, name: 'Smart Watch', category: 'Electronics', unitsSold: 432, revenue: 129600, profitMargin: 0.42, date: '2024-02-15' },
  { id: 5, name: 'Desk Lamp', category: 'Furniture', unitsSold: 278, revenue: 13900, profitMargin: 0.28, date: '2024-03-05' },
  { id: 6, name: 'Gaming Mouse', category: 'Electronics', unitsSold: 567, revenue: 34020, profitMargin: 0.32, date: '2024-03-12' },
  { id: 7, name: 'Coffee Table', category: 'Furniture', unitsSold: 98, revenue: 39200, profitMargin: 0.15, date: '2024-03-20' },
  { id: 8, name: 'Bluetooth Speaker', category: 'Electronics', unitsSold: 334, revenue: 50100, profitMargin: 0.38, date: '2024-04-02' }
];

export interface ProductData {
  id: number;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  profitMargin: number;
  date: string;
}

export interface FilterOptions {
  category: string;
  dateRange: { start: string; end: string };
  minProfitMargin: number;
}

export const Dashboard = () => {
  const [data, setData] = useState<ProductData[]>(mockData);
  const [showUpload, setShowUpload] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    dateRange: { start: '', end: '' },
    minProfitMargin: 0
  });

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const categoryMatch = filters.category === 'All' || item.category === filters.category;
      const profitMatch = item.profitMargin >= filters.minProfitMargin;
      const dateMatch = (!filters.dateRange.start || item.date >= filters.dateRange.start) &&
                       (!filters.dateRange.end || item.date <= filters.dateRange.end);
      return categoryMatch && profitMatch && dateMatch;
    });
  }, [data, filters]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    if (filteredData.length === 0) return null;

    const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
    const totalUnits = filteredData.reduce((sum, item) => sum + item.unitsSold, 0);
    const avgProfitMargin = filteredData.reduce((sum, item) => sum + item.profitMargin, 0) / filteredData.length;

    const bestProduct = filteredData.reduce((best, item) => 
      item.revenue > best.revenue ? item : best
    );

    const worstProduct = filteredData.reduce((worst, item) => 
      item.revenue < worst.revenue ? item : worst
    );

    const bestSeller = filteredData.reduce((best, item) => 
      item.unitsSold > best.unitsSold ? item : best
    );

    return {
      totalRevenue,
      totalUnits,
      avgProfitMargin,
      bestProduct,
      worstProduct,
      bestSeller
    };
  }, [filteredData]);

  const handleFileUpload = (uploadedData: ProductData[]) => {
    setData(uploadedData);
    setShowUpload(false);
  };

  if (showUpload) {
    return <FileUpload onUpload={handleFileUpload} onCancel={() => setShowUpload(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Product Performance Analyzer
            </h1>
            <p className="text-muted-foreground mt-2">
              Advanced analytics dashboard for product sales performance
            </p>
          </div>
          <Button 
            onClick={() => setShowUpload(true)}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Data
          </Button>
        </div>

        {/* Filters */}
        <FilterPanel filters={filters} onFiltersChange={setFilters} data={data} />

        {/* Key Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="analytics-card animate-scale-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="analytics-metric">${metrics.totalRevenue.toLocaleString()}</div>
                <Badge className="performance-positive mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </CardContent>
            </Card>

            <Card className="analytics-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Units Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="analytics-metric">{metrics.totalUnits.toLocaleString()}</div>
                <Badge className="performance-positive mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {metrics.totalUnits > 2000 ? 'High Volume' : 'Standard'}
                </Badge>
              </CardContent>
            </Card>

            <Card className="analytics-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="analytics-metric">{(metrics.avgProfitMargin * 100).toFixed(1)}%</div>
                <Badge className={metrics.avgProfitMargin > 0.25 ? "performance-positive" : "performance-negative"}>
                  {metrics.avgProfitMargin > 0.25 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {metrics.avgProfitMargin > 0.25 ? 'Healthy' : 'Below Target'}
                </Badge>
              </CardContent>
            </Card>

            <Card className="analytics-card animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Products Analyzed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="analytics-metric">{filteredData.length}</div>
                <Badge className="performance-positive mt-2">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Filtered
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Performance Highlights */}
        {metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="analytics-card animate-slide-up">
              <CardHeader>
                <CardTitle className="text-lg text-success flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Top Performer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg">{metrics.bestProduct.name}</h3>
                <p className="text-sm text-muted-foreground">{metrics.bestProduct.category}</p>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Revenue:</span>
                    <span className="font-semibold">${metrics.bestProduct.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Profit Margin:</span>
                    <span className="font-semibold">{(metrics.bestProduct.profitMargin * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="analytics-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Best Seller
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg">{metrics.bestSeller.name}</h3>
                <p className="text-sm text-muted-foreground">{metrics.bestSeller.category}</p>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Units Sold:</span>
                    <span className="font-semibold">{metrics.bestSeller.unitsSold.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Revenue:</span>
                    <span className="font-semibold">${metrics.bestSeller.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="analytics-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-lg text-destructive flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg">{metrics.worstProduct.name}</h3>
                <p className="text-sm text-muted-foreground">{metrics.worstProduct.category}</p>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm">Revenue:</span>
                    <span className="font-semibold">${metrics.worstProduct.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Profit Margin:</span>
                    <span className="font-semibold">{(metrics.worstProduct.profitMargin * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={filteredData} />
          <CategoryChart data={filteredData} />
        </div>

        <div className="w-full">
          <TrendChart data={filteredData} />
        </div>
      </div>
    </div>
  );
};