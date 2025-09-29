import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from "lucide-react";
import { ProductData } from '../Dashboard';

interface TrendChartProps {
  data: ProductData[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  // Group data by month and sum values
  const monthlyData = data.reduce((acc, item) => {
    const date = new Date(item.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthName,
        revenue: 0,
        units: 0,
        products: 0,
        totalProfit: 0,
        date: monthKey
      };
    }
    
    acc[monthKey].revenue += item.revenue;
    acc[monthKey].units += item.unitsSold;
    acc[monthKey].products += 1;
    acc[monthKey].totalProfit += item.revenue * item.profitMargin;
    
    return acc;
  }, {} as Record<string, {
    month: string;
    revenue: number;
    units: number;
    products: number;
    totalProfit: number;
    date: string;
  }>);

  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(item => ({
      ...item,
      avgProfitMargin: item.revenue > 0 ? (item.totalProfit / item.revenue) * 100 : 0
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="analytics-card p-3">
          <p className="font-semibold">{label}</p>
          <p className="text-primary">
            Revenue: ${data.revenue.toLocaleString()}
          </p>
          <p className="text-chart-secondary">
            Units Sold: {data.units.toLocaleString()}
          </p>
          <p className="text-chart-tertiary">
            Products: {data.products}
          </p>
          <p className="text-muted-foreground text-sm">
            Avg Profit Margin: {data.avgProfitMargin.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <TrendingUp className="w-5 h-5 mr-2 text-primary" />
          Performance Trends Over Time
        </CardTitle>
        <CardDescription>
          Monthly revenue and units sold trends showing business growth patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="unitsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-secondary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-secondary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="revenue"
              orientation="left"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <YAxis 
              yAxisId="units"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--chart-primary))"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              className="animate-fade-in"
            />
            
            <Line
              yAxisId="units"
              type="monotone"
              dataKey="units"
              stroke="hsl(var(--chart-secondary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--chart-secondary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--chart-secondary))' }}
              className="animate-fade-in"
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Chart Legend */}
        <div className="flex justify-center space-x-6 mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-chart-primary"></div>
            <span className="text-sm font-medium">Revenue (Left Axis)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-chart-secondary"></div>
            <span className="text-sm font-medium">Units Sold (Right Axis)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};