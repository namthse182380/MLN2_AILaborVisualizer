// src/components/CapitalConcentrationChart.tsx
"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';

interface CapitalConcentrationChartProps {
  data: any[];
}

export default function CapitalConcentrationChart({ data }: CapitalConcentrationChartProps) {
  return (
    <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Xu Hướng Tương Lai: Sự Tập Trung & Tích Tụ Tư Bản
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          AI làm tăng rào cản gia nhập, khiến các doanh nghiệp nhỏ bị thâu tóm.
        </Typography>
        <LineChart
          dataset={data}
          xAxis={[{ dataKey: 'aiLevel', label: 'Mức độ AI (%)' }]}
          series={[
            { dataKey: 'largeCapital', label: 'Thị phần Tư bản lớn', area: true, stack: 'total', showMark: false, color: '#d32f2f' },
            { dataKey: 'smallCapital', label: 'Thị phần Tư bản nhỏ', area: true, stack: 'total', showMark: false, color: '#1976d2' },
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