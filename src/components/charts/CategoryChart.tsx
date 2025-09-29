import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChartIcon } from "lucide-react";
import { ProductData } from '../Dashboard';

interface CategoryChartProps {
  data: ProductData[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  // Group data by category and sum revenue
  const categoryData = data.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = {
        name: item.category,
        revenue: 0,
        units: 0,
        products: 0
      };
    }
    acc[item.category].revenue += item.revenue;
    acc[item.category].units += item.unitsSold;
    acc[item.category].products += 1;
    return acc;
  }, {} as Record<string, { name: string; revenue: number; units: number; products: number; }>);

  const chartData = Object.values(categoryData).sort((a, b) => b.revenue - a.revenue);

  const colors = [
    'hsl(var(--chart-primary))',
    'hsl(var(--chart-secondary))',
    'hsl(var(--chart-tertiary))',
    'hsl(var(--chart-quaternary))',
    'hsl(var(--chart-quinary))'
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = chartData.reduce((sum, item) => sum + item.revenue, 0);
      const percentage = ((data.revenue / total) * 100).toFixed(1);
      
      return (
        <div className="analytics-card p-3">
          <p className="font-semibold">{data.name}</p>
          <p className="text-primary">
            Revenue: ${data.revenue.toLocaleString()}
          </p>
          <p className="text-muted-foreground text-sm">
            Share: {percentage}%
          </p>
          <p className="text-muted-foreground text-sm">
            Products: {data.products}
          </p>
          <p className="text-muted-foreground text-sm">
            Units: {data.units.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <PieChartIcon className="w-5 h-5 mr-2 text-primary" />
          Revenue by Category
        </CardTitle>
        <CardDescription>
          Distribution of total revenue across product categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="revenue"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};