// src/components/WorkforceCompositionChart.tsx
"use client";
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Stack, Box } from '@mui/material';

const colors = ['#1976d2', '#ef5350']; // Xanh cho Người, Đỏ cho AI

const CustomLegend = ({ data }: { data: Array<{ label: string, color: string }> }) => (
  <Stack direction="row" spacing={2} mt={2} justifyContent="center">
    {data.map((item) => (
      <Stack direction="row" key={item.label} spacing={1} alignItems="center">
        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
        <Typography variant="body2">{item.label}</Typography>
      </Stack>
    ))}
  </Stack>
);

export default function WorkforceCompositionChart({ data }: { data: any[] }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="h6" gutterBottom align="center">
          Sự Chuyển dịch Lực lượng Lao động
        </Typography>
        <Box sx={{ height: 250 }}>
          <PieChart
            colors={colors}
            series={[{ data, innerRadius: 80 }]}
            margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
            // --- SỬA LỖI TẠI ĐÂY ---
            // Thay thế slotProps.legend.hidden bằng hideLegend
            hideLegend 
          />
        </Box>
        <CustomLegend data={data.map((d, i) => ({ label: d.label, color: colors[i] }))} />
      </CardContent>
    </Card>
  );
}