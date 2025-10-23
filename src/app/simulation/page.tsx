// src/app/simulation/page.tsx
"use client";
import * as React from 'react';
import { alpha } from '@mui/material/styles';
import { Box, Slider, Typography, Paper, Stack, CssBaseline } from '@mui/material';
import AppNavbar from '@/components/AppNavbar';
import Header from '@/components/Header';
import MainGrid from '@/components/MainGrid';
import SideMenu from '@/components/SideMenu';
import AppTheme from '@/theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '@/theme/customizations';

const V_BASE = 1000;
const C_BASE = 800;

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function SimulationPage(props: { disableCustomTheme?: boolean }) {
  const [aiLevel, setAiLevel] = React.useState(0);

  const metrics = React.useMemo(() => {
    const mRate = 1.0 + (aiLevel / 100) * 0.8;
    const c = C_BASE + (aiLevel * 30);
    const v = V_BASE - (aiLevel * 8);
    const m = v * mRate;
    const pRate = (m / (c + v)) * 100;
    const organicComp = c / v;
    const unemploymentRate = ((V_BASE - v) / V_BASE) * 100;
    const gini = m / (m + v);

    return {
      c: Math.round(c), v: Math.round(v), m: Math.round(m),
      pRate: parseFloat(pRate.toFixed(2)), organicComp: parseFloat(organicComp.toFixed(2)),
      unemploymentRate: parseFloat(unemploymentRate.toFixed(2)), gini: parseFloat(gini.toFixed(2)),
    };
  }, [aiLevel]);
  
  const trendChartData = React.useMemo(() => {
    return Array.from({ length: 101 }, (_, i) => {
        const mRate = 1.0 + (i / 100) * 0.8;
        const c = C_BASE + (i * 30);
        const v = V_BASE - (i * 8);
        const m = v * mRate;
        const pRate = (m / (c + v)) * 100;
        const organicComp = c / v;
        return { aiLevel: i, pRate: parseFloat(pRate.toFixed(2)), organicComp: parseFloat(organicComp.toFixed(2)) };
    });
  }, []);

  // --- TẠO DỮ LIỆU CHO CÁC BIỂU ĐỒ NÂNG CAO ---
  const { profitCompositionData, laborSkillData, capitalConcentrationData, wagePressureData } = React.useMemo(() => {
    // Dữ liệu cho biểu đồ Phân rã Lợi nhuận
    const profitData = Array.from({ length: 101 }, (_, i) => {
      const c = C_BASE + (i * 30);
      const v = V_BASE - (i * 8);
      const mRate = 1.0 + (i / 100) * 1.5; 
      const m = v * mRate;
      const basePRate = (v * 1.0 / (c + v)) * 100;
      const exploitationBoost = ((m - v) / (c + v)) * 100;
      const cheapeningCBoost = (i / 100) * 5;
      return { aiLevel: i, basePRate, exploitationBoost, cheapeningCBoost };
    });

    // Dữ liệu cho biểu đồ Phân cực Kỹ năng
    const skillData = Array.from({ length: 101 }, (_, i) => {
      const aiFactor = i / 100;
      const midSkill = 60 - (aiFactor * 50);
      const highSkill = 15 + (aiFactor * 30);
      const lowSkill = 100 - midSkill - highSkill;
      return { aiLevel: i, highSkill, midSkill, lowSkill };
    });

    // Dữ liệu cho biểu đồ Tập trung Tư bản
    const concentrationData = Array.from({ length: 101 }, (_, i) => {
        const aiFactor = i / 100;
        const largeCapital = 30 + (aiFactor * 65); // Bắt đầu 30%, tăng lên 95%
        const smallCapital = 100 - largeCapital;
        return { aiLevel: i, largeCapital, smallCapital };
    });

    // Dữ liệu cho biểu đồ Sức ép Tiền lương
    const wageData = Array.from({ length: 11 }, (_, i) => {
        const aiLevel = i * 10;
        const v = V_BASE - (aiLevel * 8);
        const unemployment = parseFloat((((V_BASE - v) / V_BASE) * 100).toFixed(2));
        const avgWage = 50 - (unemployment * 0.4); // Giả định lương giảm 0.4$ cho mỗi % thất nghiệp
        return { aiLevel, unemployment, avgWage: parseFloat(avgWage.toFixed(2)) };
    });

    return { 
        profitCompositionData: profitData, 
        laborSkillData: skillData,
        capitalConcentrationData: concentrationData,
        wagePressureData: wageData
    };
  }, []);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setAiLevel(newValue as number);
  };

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        <Box component="main" sx={(theme) => ({ flexGrow: 1, backgroundColor: alpha(theme.palette.background.default, 1), overflow: 'auto' })}>
          <Stack spacing={2} sx={{ alignItems: 'center', mx: 3, pb: 5, mt: { xs: 8, md: 0 } }}>
            <Header />
            <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
                <Typography variant="h3" component="h1" fontWeight="bold">Trạm Mô phỏng Động học Tư bản</Typography>
                <Typography color="text.secondary">Quan sát sự vận động của các quy luật kinh tế khi mức độ ứng dụng AI thay đổi.</Typography>
            </Box>
            <Paper variant="outlined" sx={{ p: 2, width: '100%', maxWidth: { sm: '100%', md: '1700px' }, mt: 2 }}>
              <Typography gutterBottom id="ai-slider-label" component="div" fontWeight="bold">
                Điều chỉnh Mức độ Ứng dụng AI ({aiLevel}%)
              </Typography>
              <Slider value={aiLevel} onChange={handleSliderChange} aria-labelledby="ai-slider-label" valueLabelDisplay="auto" step={1} min={0} max={100} />
            </Paper>
            <MainGrid 
              metrics={metrics} 
              trendChartData={trendChartData} 
              aiLevel={aiLevel} 
              profitCompositionData={profitCompositionData}
              laborSkillData={laborSkillData}
              capitalConcentrationData={capitalConcentrationData}
              wagePressureData={wagePressureData}
            />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}