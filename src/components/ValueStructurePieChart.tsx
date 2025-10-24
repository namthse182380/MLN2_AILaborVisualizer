'use client'
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// Giữ StyledText đơn giản, không định nghĩa màu sắc
const StyledText = styled('text')({
  textAnchor: 'middle',
  dominantBaseline: 'central',
});

function PieCenterLabel({ primaryText, secondaryText }: { primaryText: string, secondaryText: string }) {
  const { width, height, left, top } = useDrawingArea();

  return (
    <React.Fragment>
      {/* --- GIẢI PHÁP TRIỆT ĐỂ: SỬ DỤNG TRỰC TIẾP BIẾN CSS TỪ THEME --- */}
      <StyledText
        x={left + width / 2}
        y={top + height / 2 - 12}
        sx={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          // Sử dụng biến CSS cho màu văn bản chính.
          // Đây là cách đáng tin cậy nhất để lấy đúng màu.
          fill: 'var(--template-palette-text-primary)',
        }}
      >
        {primaryText}
      </StyledText>
      <StyledText
        x={left + width / 2}
        y={top + height / 2 + 18}
        sx={{
          // Sử dụng biến CSS cho màu văn bản phụ.
          fill: 'var(--template-palette-text-secondary)',
        }}
      >
        {secondaryText}
      </StyledText>
    </React.Fragment>
  );
}

// Component Chú thích (Legend) Tự tạo
function CustomLegend({ data }: { data: Array<{ label: string, color: string }> }) {
  return (
    <Stack 
      direction="row" 
      justifyContent="center" 
      spacing={2} 
      mt={2}
      flexWrap="wrap" // Cho phép xuống dòng trên màn hình nhỏ
    >
      {data.map((item) => (
        <Stack direction="row" key={item.label} spacing={1} alignItems="center">
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
          <Typography variant="body2">{item.label}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}


export default function ValueStructurePieChart({ data, mRate }: { data: any[], mRate: number }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Cơ cấu Giá trị & Tỷ suất Bóc lột
        </Typography>
        
        <Box sx={{ height: 350, width: '100%' }}>
          <PieChart
            series={[
              {
                data,
                innerRadius: '40%',
                outerRadius: '90%',
                paddingAngle: 2,
                highlightScope: { fade: 'global', highlight: 'item' },
              },
            ]}
            hideLegend={true} 
            margin={{ top: 20, bottom: 20, left: 10, right: 10 }}
          >
            <PieCenterLabel primaryText={`${mRate.toFixed(0)}%`} secondaryText="Tỷ suất m'" />
          </PieChart>
        </Box>

        <CustomLegend data={data} />
      </CardContent>
    </Card>
  );
}