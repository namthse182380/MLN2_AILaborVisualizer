// src/app/visualize/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Grid, Paper, Typography, Box, CssBaseline, Button, Stack, Divider, Alert, Card } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import ReactMarkdown from 'react-markdown';

import AppTheme from '@/theme/AppTheme';
import AppNavbar from '@/components/AppNavbar';
import SideMenu from '@/components/SideMenu';
import Header from '@/components/Header';
import Loading from '@/app/loading'; 
import { chartsCustomizations } from '@/theme/customizations';
import KeyMetricsTrendChart from '@/components/KeyMetricsTrendChart';
import FutureScenarioChart from '@/components/FutureScenarioChart';
// --- THÊM IMPORT "type" TỪ COMPONENT ---
import { type ChartData } from '@/components/FutureScenarioChart';
import { BarChart } from '@mui/x-charts';

const xThemeComponents = { ...chartsCustomizations };

interface AnalysisResult { c: number; v: number; m: number; organicComp: number; pRate: number; }
interface VisualizationData { before: AnalysisResult; after: AnalysisResult; analysis: string; }

// --- XÓA BỎ INTERFACE CŨ, GÂY XUNG ĐỘT ---
// interface ChartData { type: string; title: string; description?: string; data: any; }

interface AISuggestion { adviceText: string; suggestedCharts: ChartData[]; } // Dòng này giờ sẽ sử dụng ChartData được import
interface FinalPayload { analysisData: VisualizationData; suggestionData?: AISuggestion; } 

export default function VisualizePage() {
    const [payload, setPayload] = useState<FinalPayload | null>(null);
    const [originChatId, setOriginChatId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedPayload = sessionStorage.getItem('visualizationPayload');
        if (storedPayload) {
            try {
                const { data, chatId } = JSON.parse(storedPayload);
                if (data && data.analysisData) {
                    setPayload(data);
                    setOriginChatId(chatId);
                } else router.push('/chat');
            } catch (error) {
                console.error("Failed to parse payload:", error);
                router.push('/chat');
            }
        } else router.push('/chat');
    }, [router]);

    if (!payload) return <Loading />;

    const { analysisData, suggestionData } = payload;
    
    const barChartData = [
        { type: 'Trước AI', C: analysisData.before.c, V: analysisData.before.v, M: analysisData.before.m },
        { type: 'Sau AI', C: analysisData.after.c, V: analysisData.after.v, M: analysisData.after.m },
    ];
    
    const keyMetricsData = [
        { metric: 'Cấu tạo hữu cơ (c/v)', before: analysisData.before.organicComp, after: analysisData.after.organicComp, unit: '' },
        { metric: "Tỷ suất Lợi nhuận (p')", before: analysisData.before.pRate, after: analysisData.after.pRate, unit: '%' },
    ];

    return (
        <AppTheme themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <SideMenu /> <AppNavbar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Header />
                    <Container maxWidth="xl" sx={{ flexGrow: 1, mt: { xs: 8, md: 2 } }}>
                        {originChatId && <Button startIcon={<ArrowBackIcon />} onClick={() => router.push(`/chat/${originChatId}`)} sx={{ mb: 2 }}>Quay lại Cuộc trò chuyện</Button>}
                        <Typography variant="h4" component="h1" gutterBottom>Dashboard Phân tích & Tầm nhìn Chiến lược</Typography>
                        
                        <Grid container spacing={3}>
                            <Grid size={12}><Divider>PHÂN TÍCH HIỆN TRẠNG (DỮ LIỆU CỦA BẠN)</Divider></Grid>
                            <Grid size={{ xs: 12, lg: 6 }}>
                                <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom>So sánh Cấu trúc Tư bản (C-V-M)</Typography>
                                    <Box sx={{ height: 300, width: '100%' }}>
                                        <BarChart 
                                            dataset={barChartData} 
                                            xAxis={[{ scaleType: 'band', dataKey: 'type' }]} 
                                            series={[{ dataKey: 'C', label: 'Tư bản Bất biến' }, { dataKey: 'V', label: 'Tư bản Khả biến' }, { dataKey: 'M', label: 'Giá trị Thặng dư' }]} 
                                        />
                                    </Box>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, lg: 6 }}><KeyMetricsTrendChart data={keyMetricsData} /></Grid>

                            <Grid size={12}><Divider sx={{mt: 3}}>LỘ TRÌNH TƯƠNG LAI TỪ TRỢ LÝ AI</Divider></Grid>
                            
                            <Grid size={12}>
                                {suggestionData?.adviceText ? (
                                    <Card variant="outlined" sx={{ p: 2.5 }}>
                                        <Stack direction="row" spacing={1} alignItems="center" mb={2}><ModelTrainingIcon color="primary"/><Typography variant="h6">Thư ngỏ từ Người bạn Chiến lược</Typography></Stack>
                                        <ReactMarkdown components={{
                                            h3: ({node, ...props}) => <Typography variant="h6" mt={3} mb={1} {...props}/>,
                                            p: ({node, ...props}) => <Typography variant="body1" paragraph {...props}/>,
                                            li: ({node, ...props}) => <li style={{fontSize: '1rem', marginLeft: '20px'}}><Typography variant="body1" component="span" {...props} /></li>,
                                            strong: ({node, ...props}) => <strong style={{color: 'primary.main'}} {...props} />,
                                        }}>
                                            {suggestionData.adviceText}
                                        </ReactMarkdown>
                                    </Card>
                                ) : (
                                    <Alert severity="info">AI đang xử lý hoặc không có dữ liệu tư vấn.</Alert>
                                )}
                            </Grid>

                            {suggestionData?.suggestedCharts && suggestionData.suggestedCharts.length > 0 && (
                                <Grid size={12}>
                                    <Typography variant="h6" sx={{ mt: 3, mb: 2}}>Trực quan hóa Lộ trình Tương lai</Typography>
                                    <Grid container spacing={3}>
                                        {suggestionData.suggestedCharts.map((chart, index) => (
                                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                                                <FutureScenarioChart chartData={chart} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </AppTheme>
    );
}