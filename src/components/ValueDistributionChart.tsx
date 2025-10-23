// src/components/ValueDistributionChart.tsx
"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box } from '@mui/material';

export default function ValueDistributionChart({ chartData }: { chartData: any }) {
  if (!chartData || !chartData.data) return null;
  
  // Lấy danh sách các key series tự động, trừ 'scenario'
  const seriesKeys = Object.keys(chartData.data[0]).filter(key => key !== 'scenario');

  return (
    <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="h6" align="center" gutterBottom>
          {chartData.title}
        </Typography>
        <Box sx={{ height: 200, mt: 2 }}>
          <BarChart
            dataset={chartData.data}
            xAxis={[{ scaleType: 'band', dataKey: 'scenario' }]}
            series={seriesKeys.map(key => ({
                dataKey: key,
                stack: 'total',
                label: key
            }))}
            margin={{ left: 50, right: 20, top: 40, bottom: 30 }}
            grid={{ horizontal: true }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}