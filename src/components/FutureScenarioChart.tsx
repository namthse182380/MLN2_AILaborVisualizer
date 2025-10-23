// src/components/FutureScenarioChart.tsx
"use client";
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, PieChart } from '@mui/x-charts';

// Một component đa năng để render các biểu đồ tương lai
export default function FutureScenarioChart({ chartData }: { chartData: any }) {
  if (!chartData || !chartData.data) return null;

  const renderChart = () => {
    switch (chartData.type) {
      case 'pie':
        return (
          <PieChart
            series={[{ data: chartData.data, innerRadius: 30, cx: '50%' }]}
            height={200}
            margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
          />
        );
      case 'investment_bar':
        return (
           <BarChart
              dataset={chartData.data}
              xAxis={[{ scaleType: 'band', dataKey: 'category' }]}
              series={[{ dataKey: 'value', label: 'Giá trị Đầu tư' }]}
              height={200}
              margin={{ top: 40, bottom: 30, left: 50, right: 20 }}
            />
        );
      case 'value_distribution':
         const seriesKeys = Object.keys(chartData.data[0]).filter(key => key !== 'scenario');
         return (
            // --- SỬA LỖI TẠI ĐÂY ---
            <BarChart
                dataset={chartData.data}
                // Vì layout là 'horizontal', trục danh mục phải là yAxis.
                yAxis={[{ scaleType: 'band', dataKey: 'scenario' }]} 
                series={seriesKeys.map(key => ({ dataKey: key, stack: 'total', label: key }))}
                height={200}
                layout="horizontal" // Giữ nguyên vì chúng ta muốn biểu đồ ngang
                margin={{ top: 40, bottom: 30, left: 120, right: 20 }}
            />
            // --- KẾT THÚC SỬA LỖI ---
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
        <Box sx={{ width: '100%' }}>
          {renderChart()}
        </Box>
      </CardContent>
    </Card>
  );
}