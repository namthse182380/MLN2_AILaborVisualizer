// src/components/LaborSkillChart.tsx
"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';

interface LaborSkillChartProps {
  data: any[];
}

export default function LaborSkillChart({ data }: LaborSkillChartProps) {
  return (
    <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Xu Hướng Tương Lai: Phân Cực Kỹ Năng Lao Động
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          AI làm "rỗng" tầng lớp lao động kỹ năng trung bình.
        </Typography>
        <LineChart
          dataset={data}
          xAxis={[{ dataKey: 'aiLevel', label: 'Mức độ AI (%)' }]}
          series={[
            { dataKey: 'highSkill', label: 'Kỹ năng cao', area: true, stack: 'total', showMark: false, color: '#4caf50' },
            { dataKey: 'midSkill', label: 'Kỹ năng trung bình', area: true, stack: 'total', showMark: false, color: '#ff9800' },
            { dataKey: 'lowSkill', label: 'Kỹ năng thấp', area: true, stack: 'total', showMark: false, color: '#f44336' },
          ]}
          yAxis={[{
            min: 0,
            max: 100,
            // --- CẢI TIẾN TẠI ĐÂY ---
            valueFormatter: (value: number | null) => (value === null ? '' : `${value}%`),
          }]}
          height={300}
          margin={{ left: 50, right: 20, top: 40, bottom: 40 }}
          grid={{ horizontal: true }}
        />
      </CardContent>
    </Card>
  );
}