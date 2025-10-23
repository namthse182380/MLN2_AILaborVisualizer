'use client'
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

const StyledText = styled('text')(({ theme }) => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fill: theme.palette.text.primary,
}));

function PieCenterLabel({ primaryText, secondaryText }: { primaryText: string, secondaryText: string }) {
  const { width, height, left, top } = useDrawingArea();
  const theme = useTheme(); 

  return (
    <React.Fragment>
      {/* UPDATE: Tăng kích thước font chữ cho dễ đọc hơn */}
      <StyledText x={left + width / 2} y={top + height / 2 - 12} style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
        {primaryText}
      </StyledText>
      <StyledText x={left + width / 2} y={top + height / 2 + 18} style={{ fill: theme.palette.text.secondary }}>
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
        
        {/* UPDATE: Tăng chiều cao vùng chứa để biểu đồ lớn hơn */}
        <Box sx={{ height: 350, width: '100%' }}>
          <PieChart
            series={[
              {
                data,
                // UPDATE: Điều chỉnh bán kính để biểu đồ to và đẹp hơn
                innerRadius: '40%',
                outerRadius: '90%',
                paddingAngle: 2,
                highlightScope: { fade: 'global', highlight: 'item' },
              },
            ]}
            // ẨN HOÀN TOÀN LEGEND GỐC
            hideLegend={true} 
            margin={{ top: 20, bottom: 20, left: 10, right: 10 }}
          >
            <PieCenterLabel primaryText={`${mRate.toFixed(0)}%`} secondaryText="Tỷ suất m'" />
          </PieChart>
        </Box>

        {/* CHÚ THÍCH TỰ TẠO - ĐẶT BÊN NGOÀI BIỂU ĐỒ */}
        <CustomLegend data={data} />
      </CardContent>
    </Card>
  );
}
