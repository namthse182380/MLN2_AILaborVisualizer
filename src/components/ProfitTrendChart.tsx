// src/components/ProfitTrendChart.tsx

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
// --- SỬA LỖI IMPORT TẠI ĐÂY ---
// ReferenceLine được export trực tiếp từ thư viện gốc '@mui/x-charts'.
import { LineChart, ChartsReferenceLine } from '@mui/x-charts';
import { red, green } from '@mui/material/colors';

// Prop `aiLevel` được thêm vào để nhận giá trị từ thanh trượt
export default function ProfitTrendChart({ data, aiLevel }: { data: any[], aiLevel: number }) {
  return (
    <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Xu hướng Lợi nhuận & Cấu tạo Hữu cơ
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Minh họa quy luật tỷ suất lợi nhuận có xu hướng giảm
        </Typography>
        <LineChart
          dataset={data}
          xAxis={[{ 
            dataKey: 'aiLevel', 
            label: 'Mức độ Ứng dụng AI (%)',
            valueFormatter: (value: number | null) => (value === null ? '' : `${value}%`)
          }]}
          series={[
            {
              dataKey: 'pRate',
              label: "Tỷ suất Lợi nhuận (p')",
              color: green[500],
              showMark: false,
              valueFormatter: (value: number | null) => (value === null ? '' : `${value}%`),
            },
            {
              dataKey: 'organicComp',
              label: 'Cấu tạo Hữu cơ (c/v)',
              color: red[500],
              showMark: false,
            },
          ]}
          height={300}
          margin={{ left: 70, right: 20, top: 40, bottom: 40 }}
          grid={{ horizontal: true }}
        >
          {/* Component này giờ sẽ hoạt động bình thường với import đúng */}
          <ChartsReferenceLine 
            x={aiLevel} 
            lineStyle={{ stroke: '#0288d1', strokeDasharray: '4 4' }} 
            labelStyle={{ fill: '#0288d1', fontSize: 12 }}
            label={`Hiện tại: ${aiLevel}%`}
            labelAlign="end"
          />
        </LineChart>
      </CardContent>
    </Card>
  );
}