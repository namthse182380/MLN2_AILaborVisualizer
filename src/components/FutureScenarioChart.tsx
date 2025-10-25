// src/components/FutureScenarioChart.tsx
"use client";
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';

// --- THÊM "export" ĐỂ CHIA SẺ INTERFACE NÀY ---
export interface ChartData {
  type: 'pie' | 'investment_bar' | 'value_distribution';
  title: string;
  description?: string;
  data: any;
}

export default function FutureScenarioChart({ chartData }: { chartData: ChartData }) {
  if (!chartData || !chartData.data) return null;

  const renderChart = () => {
    switch (chartData.type) {
      case 'pie':
        return (
          <Box sx={{ width: '100%', height: 250 }}>
            <PieChart
              series={[{ data: chartData.data, innerRadius: 30, cx: '50%' }]}
              margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
            />
          </Box>
        );

      case 'investment_bar':
        return (
          <Box sx={{ width: '100%', height: 250 }}>
            <BarChart
              dataset={chartData.data}
              xAxis={[{ scaleType: 'band', dataKey: 'category' }]}
              series={[{ dataKey: 'value', label: 'Giá trị Đầu tư' }]}
              margin={{ top: 40, bottom: 30, left: 50, right: 20 }}
            />
          </Box>
        );

      case 'value_distribution':
        const seriesKeys = Object.keys(chartData.data[0]).filter(key => key !== 'scenario');
        return (
          <Box sx={{ width: '100%', height: 250 }}>
            <BarChart
              dataset={chartData.data}
              xAxis={[{ scaleType: 'band', dataKey: 'scenario' }]}
              series={seriesKeys.map(key => ({ dataKey: key, stack: 'total', label: key }))}
              layout="vertical"
              margin={{ top: 40, bottom: 30, left: 20, right: 20 }}
            />
          </Box>
        );

      default:
        return <Typography>Loại biểu đồ không được hỗ trợ.</Typography>;
    }
  };

  return (
    <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="h6" align="center" gutterBottom>
          {chartData.title}
        </Typography>
        {chartData.description && (
          <Typography variant="caption" align="center" display="block" color="text.secondary" sx={{ mb: 1 }}>
            {chartData.description}
          </Typography>
        )}
        {renderChart()}
      </CardContent>
    </Card>
  );
}