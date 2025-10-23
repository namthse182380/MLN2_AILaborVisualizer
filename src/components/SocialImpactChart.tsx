// src/components/SocialImpactChart.tsx
"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';

interface SocialImpactChartProps {
  unemploymentRate: number;
  gini: number;
}

export default function SocialImpactChart({ unemploymentRate, gini }: SocialImpactChartProps) {
  const dataset = [
    { value: unemploymentRate, label: 'Tỷ lệ Thất nghiệp (%)' },
    { value: gini * 100, label: 'Bất bình đẳng (Gini*100)' }, // Nhân 100 để cùng thang đo
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Phân tích Tác động Xã hội
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Hệ quả của việc thay thế lao động sống bằng lao động máy hóa.
        </Typography>
        <BarChart
          dataset={dataset}
          yAxis={[{ scaleType: 'band', dataKey: 'label' }]}
          series={[{ dataKey: 'value', label: 'Chỉ số' }]}
          layout="horizontal"
          height={200}
          margin={{ left: 160, right: 20, top: 40, bottom: 20 }}
          grid={{ vertical: true }}
          colors={['#ef5350']}
        />
      </CardContent>
    </Card>
  );
}