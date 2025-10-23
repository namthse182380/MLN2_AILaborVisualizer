"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';

interface ProfitCompositionChartProps {
  data: any[];
  aiLevel: number;
}

export default function ProfitCompositionChart({ data, aiLevel }: ProfitCompositionChartProps) {
  // Chỉ lấy dữ liệu đến mức AI hiện tại để biểu đồ trông "động"
  const chartData = data.filter(d => d.aiLevel <= aiLevel);

  return (
    <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Phân Rã Tỷ Suất Lợi Nhuận & Các Lực Lượng Đối Trọng
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Tỷ suất lợi nhuận thực tế = (p' cơ bản) + (Bóc lột tăng) + (C rẻ đi).
        </Typography>
        <BarChart
          dataset={chartData}
          xAxis={[{ scaleType: 'band', dataKey: 'aiLevel', label: 'Mức độ AI (%)' }]}
          series={[
            { dataKey: 'basePRate', label: "p' Cơ bản (Xu hướng giảm)", stack: 'A', color: '#f44336' },
            { dataKey: 'exploitationBoost', label: 'Tăng cường bóc lột (m\')', stack: 'A', color: '#ff9800' },
            { dataKey: 'cheapeningCBoost', label: 'Tư bản bất biến rẻ đi', stack: 'A', color: '#4caf50' },
          ]}
          height={300}
          margin={{ left: 50, right: 20, top: 40, bottom: 40 }}
          grid={{ horizontal: true }}
        />
      </CardContent>
    </Card>
  );
}