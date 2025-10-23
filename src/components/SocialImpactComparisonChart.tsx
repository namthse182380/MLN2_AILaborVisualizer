// src/components/SocialImpactComparisonChart.tsx
"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box } from '@mui/material';

export default function SocialImpactComparisonChart({ chartData }: { chartData: any }) {
  if (!chartData || !chartData.data) return null;

  return (
    <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="h6" align="center" gutterBottom>
          {chartData.title}
        </Typography>
        <Box sx={{ height: 200, mt: 2 }}>
          <BarChart
            dataset={chartData.data}
            yAxis={[{ scaleType: 'band', dataKey: 'metric' }]}
            series={[
              { dataKey: 'Hiện tại', label: 'Hiện tại (Sau AI)' },
              { dataKey: 'Tương lai', label: 'Tương lai (Đề xuất)' },
            ]}
            layout="horizontal"
            margin={{ left: 180, right: 20, top: 40, bottom: 30 }}
            grid={{ vertical: true }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}