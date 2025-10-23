// src/components/FutureScenariosChart.tsx
"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { PieChart } from '@mui/x-charts/PieChart';
import { Stack, Box } from '@mui/material';

interface FutureScenariosChartProps {
  surplusValue: number; // Giá trị thặng dư (M)
}

// --- HỌC HỎI TỪ COMPONENT CÓ SẴN ---
// Tái sử dụng ý tưởng CustomLegend từ ValueStructurePieChart.tsx để tạo chú thích tùy chỉnh
// Điều này giúp tránh các lỗi TypeScript và đảm bảo giao diện nhất quán.
const CustomLegend = ({ data }: { data: Array<{ label: string, color: string }> }) => (
  <Stack spacing={1.5} mt={2} alignItems="center">
    {data.map((item) => (
      <Stack direction="row" key={item.label} spacing={1} alignItems="center" sx={{ width: '100%', justifyContent: 'center' }}>
        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
        <Typography variant="caption" sx={{ textAlign: 'center' }}>{item.label}</Typography>
      </Stack>
    ))}
  </Stack>
);

export default function FutureScenariosChart({ surplusValue }: FutureScenariosChartProps) {
  // Bảng màu cho biểu đồ
  const colors = ['#4caf50', '#2196f3', '#ff9800', '#f44336'];

  // Kịch bản phân bổ giá trị thặng dư do AI tạo ra, thêm màu sắc
  const data = [
    { id: 0, value: surplusValue * 0.4, label: 'Phúc lợi & Đào tạo lại cho LĐ', color: colors[0] },
    { id: 1, value: surplusValue * 0.3, label: 'Giảm giá thành sản phẩm', color: colors[1] },
    { id: 2, value: surplusValue * 0.2, label: 'Đầu tư cho R&D công', color: colors[2] },
    { id: 3, value: surplusValue * 0.1, label: 'Tích lũy tư bản', color: colors[3] },
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h2" variant="subtitle2" gutterBottom align="center">
          Kịch bản Tương lai: Tái phân bổ Thặng dư
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          Gợi ý các phương án sử dụng giá trị thặng dư vì mục tiêu xã hội.
        </Typography>
        <Box sx={{ width: '100%', height: 200 }}>
          <PieChart
            colors={colors} // Sử dụng bảng màu đã định nghĩa
            series={[
              {
                data,
                innerRadius: 40,
                outerRadius: 80,
                paddingAngle: 2,
                cornerRadius: 5,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              },
            ]}
            height={200}
            // --- SỬA LỖI TẠI ĐÂY ---
            // Xóa bỏ hoàn toàn `slotProps` gây lỗi và chuyển sang dùng chú thích tùy chỉnh
            hideLegend={true} 
            margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
          />
        </Box>
        {/* Sử dụng Chú thích tùy chỉnh, tương tự như component có sẵn trong dự án */}
        <CustomLegend data={data} />
      </CardContent>
    </Card>
  );
}