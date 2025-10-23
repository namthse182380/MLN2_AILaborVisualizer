"use client";
import React from 'react';
import NextLink from 'next/link';
import { Box, Container, Typography, Button, Stack, CssBaseline, Grid } from '@mui/material';
import AppTheme from '@/theme/AppTheme';
import SideMenu from '@/components/SideMenu';
import AppNavbar from '@/components/AppNavbar';
import Header from '@/components/Header';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ScienceIcon from '@mui/icons-material/Science';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { Paper } from '@mui/material';

export default function LandingPage() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <SideMenu />
        <AppNavbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
          <Header />
          <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: { xs: 8, md: 2 } }}>
            <Stack spacing={4} alignItems="center" sx={{ textAlign: 'center' }}>
              <Typography variant="h2" component="h1" fontWeight="bold">
                AI Labor Visualizer
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '700px' }}>
                Một phòng thí nghiệm ảo, trực quan hóa tác động của Trí tuệ Nhân tạo lên các quy luật Kinh tế Chính trị Mác-Lênin.
              </Typography>
              <Paper variant="outlined" sx={{ p: 4, mt: 4, borderRadius: 4 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Bắt đầu Khám phá</Typography>
                <Grid container spacing={3} justifyContent="center">
                  <Grid size={{xs:12, md:4}}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      component={NextLink}
                      href="/simulation"
                      startIcon={<AnalyticsIcon />}
                    >
                      Trạm Mô phỏng
                    </Button>
                  </Grid>
                  <Grid size={{xs:12, md:5}}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      component={NextLink}
                      href="/lab"
                      startIcon={<ScienceIcon />}
                    >
                      Phòng Thí nghiệm
                    </Button>
                  </Grid>
                  <Grid size={{xs:12, md:4}}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      component={NextLink}
                      href="/chat"
                      startIcon={<QuestionAnswerIcon />}
                    >
                      Trợ lý Phân tích
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          </Container>
        </Box>
      </Box>
    </AppTheme>
  );
}