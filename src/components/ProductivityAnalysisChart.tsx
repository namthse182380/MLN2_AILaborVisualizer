// src/components/ProductivityAnalysisChart.tsx
"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box } from '@mui/material';

export default function ProductivityAnalysisChart({ data }: { data: any[] }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="h6" gutterBottom>
          Phân tích Hiệu quả & Giá trị
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
          AI giúp tăng sản lượng nhưng làm giảm giá trị của mỗi đơn vị sản phẩm.
        </Typography>
        <Box sx={{ height: 250 }}>
           <BarChart
              dataset={data}
              xAxis={[{ scaleType: 'band', dataKey: 'scenario' }]}
              series={[
                { dataKey: 'output', label: 'Sản lượng (sản phẩm/tháng)', color: '#4caf50' },
                { dataKey: 'valuePerItem', label: 'Giá trị / Sản phẩm (V+M)', color: '#ff9800' },
              ]}
              margin={{ top: 20, bottom: 30, left: 50, right: 20 }}
              grid={{ horizontal: true }}
            />
        </Box>
      </CardContent>
    </Card>
  );
}