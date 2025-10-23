"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';

interface WagePressureChartProps {
  data: any[];
}

export default function WagePressureChart({ data }: WagePressureChartProps) {
  return (
    <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Đội Quân Lao Động Dự Bị & Sức Ép Tiền Lương
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Tỷ lệ thất nghiệp tăng làm giảm sức thương lượng và tiền lương trung bình.
        </Typography>
        
        <ChartContainer
        dataset={data}
        series={[
            { type: 'bar', dataKey: 'unemployment', label: 'Tỷ lệ thất nghiệp (%)', yAxisId: 'barAxis' },
            { type: 'line', dataKey: 'avgWage', label: 'Mức lương trung bình ($)', color: '#d32f2f', yAxisId: 'lineAxis' },
        ]}
        xAxis={[{ dataKey: 'aiLevel', scaleType: 'band', label: 'Mức độ AI (%)' }]}
        yAxis={[
            { id: 'barAxis', scaleType: 'linear', max: 100, label: 'Tỷ lệ thất nghiệp (%)', position: 'left' },
            { id: 'lineAxis', scaleType: 'linear', min: 0, label: 'Mức lương TB ($)', position: 'right' },
        ]}
        height={300}
        margin={{ left: 60, right: 60, top: 40, bottom: 40 }}
        sx={{
            [`.${axisClasses.left} .${axisClasses.label}`]: { transform: 'translateX(-20px)' },
            [`.${axisClasses.right} .${axisClasses.label}`]: { transform: 'translateX(20px)' },
        }}
        >
        <ChartsGrid horizontal />
        <BarPlot />
        <LinePlot />
        <ChartsLegend />
        <ChartsXAxis />
        <ChartsYAxis axisId="barAxis" />
        <ChartsYAxis axisId="lineAxis" />
        </ChartContainer>
      </CardContent>
    </Card>
  );
}