"use client";
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ValueStructurePieChart from './ValueStructurePieChart'; 
import ProfitTrendChart from './ProfitTrendChart'; 
import StatCard, { StatCardProps } from './StatCard';
import SocialImpactChart from './SocialImpactChart';
import FutureScenariosChart from './FutureScenariosChart';
import ProfitCompositionChart from './ProfitCompositionChart';
import LaborSkillChart from './LaborSkillChart';

// --- THÊM IMPORT CHO CÁC CHART MỚI NHẤT ---
import CapitalConcentrationChart from './CapitalConcentrationChart';
import WagePressureChart from './WagePressureChart';

interface MainGridProps {
  metrics: {
    c: number;
    v: number;
    m: number;
    pRate: number;
    unemploymentRate: number;
    gini: number;
  };
  trendChartData: any[];
  aiLevel: number;
  profitCompositionData: any[];
  laborSkillData: any[];
  // --- THÊM PROPS CHO DỮ LIỆU MỚI NHẤT ---
  capitalConcentrationData: any[];
  wagePressureData: any[];
}

export default function MainGrid({ metrics, trendChartData, aiLevel, profitCompositionData, laborSkillData, capitalConcentrationData, wagePressureData }: MainGridProps) {
  const kpiData: StatCardProps[] = [
    {
      title: 'Tư bản Bất biến (C)', value: `${metrics.c}$`,
      interval: 'Chi phí máy móc, AI', trend: 'up', data: [],
    },
    {
      title: 'Tư bản Khả biến (V)', value: `${metrics.v}$`,
      interval: 'Chi phí lao động sống', trend: 'down', data: [],
    },
    {
      title: 'Giá trị Thặng dư (M)', value: `${metrics.m}$`,
      interval: 'Lao động không công', trend: 'neutral', data: [],
    },
    {
      title: "Tỷ suất Lợi nhuận (p')", value: `${metrics.pRate}%`,
      interval: 'Xu hướng chung của CNTB', trend: 'down', data: [],
    },
  ];

  const pieChartData = [
    { label: 'Tư bản Bất biến (C)', value: metrics.c, color: '#ff9800' },
    { label: 'Tư bản Khả biến (V)', value: metrics.v, color: '#4caf50' },
    { label: 'Giá trị Thặng dư (M)', value: metrics.m, color: '#f44336' },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Bảng điều khiển Kinh tế vĩ mô
      </Typography>
      <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
        {kpiData.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>
       
      <Typography component="h2" variant="h6" sx={{ mb: 2, mt: 4 }}>
        Quy luật Vận động & Tác động Xã hội
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ProfitTrendChart data={trendChartData} aiLevel={aiLevel} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ValueStructurePieChart data={pieChartData} mRate={(metrics.m / metrics.v) * 100} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 7 }} sx={{ mt: 2 }}>
            <SocialImpactChart unemploymentRate={metrics.unemploymentRate} gini={metrics.gini} />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 5 }} sx={{ mt: 2 }}>
            <FutureScenariosChart surplusValue={metrics.m} />
        </Grid>
      </Grid>

      <Typography component="h2" variant="h6" sx={{ mb: 2, mt: 4 }}>
        Phân Tích Chuyên Sâu & Xu Hướng Tương Lai
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ProfitCompositionChart data={profitCompositionData} aiLevel={aiLevel} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <LaborSkillChart data={laborSkillData} />
        </Grid>
        {/* --- THÊM GRID MỚI CHO CÁC BIỂU ĐỒ XUẤT SẮC --- */}
        <Grid size={{ xs: 12, lg: 6 }} sx={{ mt: 2 }}>
          <CapitalConcentrationChart data={capitalConcentrationData} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }} sx={{ mt: 2 }}>
          <WagePressureChart data={wagePressureData} />
        </Grid>
      </Grid>
    </Box>
  );
}