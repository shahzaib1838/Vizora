import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign } from "lucide-react";
import { ProductData } from '../Dashboard';

interface RevenueChartProps {
  data: ProductData[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  // Sort by revenue and take top 8 for better visualization
  const chartData = data
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)
    .map(item => ({
      name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
      fullName: item.name,
      revenue: item.revenue,
      unitsSold: item.unitsSold,
      profitMargin: item.profitMargin
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="analytics-card p-3">
          <p className="font-semibold">{data.fullName}</p>
          <p className="text-primary">
            Revenue: ${data.revenue.toLocaleString()}
          </p>
          <p className="text-muted-foreground text-sm">
            Units: {data.unitsSold.toLocaleString()}
          </p>
          <p className="text-muted-foreground text-sm">
            Profit: {(data.profitMargin * 100).toFixed(1)}%
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
          <DollarSign className="w-5 h-5 mr-2 text-primary" />
          Revenue by Product
        </CardTitle>
        <CardDescription>
          Top performing products by total revenue generated
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="revenue" 
              fill="hsl(var(--chart-primary))"
              radius={[4, 4, 0, 0]}
              className="animate-chart-draw"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};