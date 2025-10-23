// src/components/KeyMetricsTrendChart.tsx
"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box } from '@mui/material';

interface KeyMetricsTrendChartProps {
  data: {
    metric: string;
    before: number;
    after: number;
    unit: string;
  }[];
}

export default function KeyMetricsTrendChart({ data }: KeyMetricsTrendChartProps) {
  return (
    <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="h6" gutterBottom>
          Chỉ số Cốt lõi: c/v & p'
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Trực quan hóa sự thay đổi của các quy luật kinh tế.
        </Typography>
        <Box sx={{ height: 250, mt: 2 }}>
            <BarChart
                dataset={data}
                yAxis={[{ scaleType: 'band', dataKey: 'metric' }]}
                series={[
                    // --- SỬA LỖI TẠI ĐÂY ---
                    { 
                        dataKey: 'before', 
                        label: 'Trước AI', 
                        valueFormatter: (value: number | null, { dataIndex }) => {
                            if (value === null) return '';
                            return `${value.toFixed(2)}${data[dataIndex].unit}`;
                        } 
                    },
                    { 
                        dataKey: 'after', 
                        label: 'Sau AI', 
                        valueFormatter: (value: number | null, { dataIndex }) => {
                            if (value === null) return '';
                            return `${value.toFixed(2)}${data[dataIndex].unit}`;
                        }
                    },
                    // --- KẾT THÚC SỬA LỖI ---
                ]}
                layout="horizontal"
                margin={{ left: 150, right: 20, top: 40, bottom: 30 }}
                grid={{ vertical: true }}
            />
        </Box>
      </CardContent>
    </Card>
  );
}