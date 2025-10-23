// src/components/AnalysisPanel.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, IconButton, Button, Select, MenuItem, FormControl, InputLabel, Divider, Stack, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { BarChart } from '@mui/x-charts/BarChart';
import { AnalysisData } from '../app/chat/[chatId]/page';

interface AnalysisPanelProps {
  analyses: AnalysisData[];
  currentAnalysis?: AnalysisData | null;
  onSelectAnalysis: (id: string) => void;
  onNavigateToDashboard: (data: AnalysisData) => void;
  isOpen: boolean;
  onClose: () => void;
}

const StatDisplay = ({ title, value }: { title: string, value: string | number }) => (
    <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', height: '100%', width: '100%' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{title}</Typography>
        <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>{value}</Typography>
    </Paper>
);

const EmptyState = ({ onClose }: { onClose: () => void }) => (
    <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="h2">Bảng điều khiển Phân tích</Typography>
            <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Stack>
        <Stack flexGrow={1} justifyContent="center" alignItems="center" spacing={2} sx={{ textAlign: 'center', color: 'text.secondary' }}>
            <InfoOutlinedIcon sx={{ fontSize: 40 }} />
            <Typography variant="subtitle1" fontWeight="medium">Chưa có phân tích nào</Typography>
            <Typography variant="body2">Đây là nơi các phân tích trực quan sẽ xuất hiện.</Typography>
             <Typography variant="body2">Hãy thử yêu cầu chatbot phân tích một kịch bản và đề xuất vẽ biểu đồ!</Typography>
        </Stack>
    </Paper>
);

export default function AnalysisPanel({ analyses, currentAnalysis, onSelectAnalysis, onNavigateToDashboard, isOpen, onClose }: AnalysisPanelProps) {
    
    const [canRenderChart, setCanRenderChart] = useState(false);
    const TRANSITION_DURATION = 300; 

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => { setCanRenderChart(true); }, TRANSITION_DURATION);
            return () => clearTimeout(timer);
        } else {
            setCanRenderChart(false);
        }
    }, [isOpen]);

    if (!isOpen || !analyses || analyses.length === 0) {
        return <EmptyState onClose={onClose} />;
    }

    if (!currentAnalysis) {
        return <EmptyState onClose={onClose} />;
    }

    const barChartData = [
        { type: 'Trước AI', C: currentAnalysis.before.c, V: currentAnalysis.before.v },
        { type: 'Sau AI', C: currentAnalysis.after.c, V: currentAnalysis.after.v },
    ];

    return (
        <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflowY: 'auto' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="h2" noWrap>Bảng Phân tích</Typography>
                <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
            </Stack>

            <FormControl fullWidth variant="outlined" size="small">
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary', letterSpacing: '0.5px', pl: 0.5 }}>
                    Phiên bản Phân tích
                </Typography>
                <Select value={currentAnalysis.id} onChange={(e) => onSelectAnalysis(e.target.value)} label="Phiên bản Phân tích">
                    {analyses.map(a => (<MenuItem key={a.id} value={a.id}>{a.title}</MenuItem>))}
                </Select>
            </FormControl>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Tóm tắt Kết quả</Typography>
            
            {/* --- NÂNG CẤP TẠI ĐÂY --- */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, width: '100%' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <StatDisplay title="Cấu tạo hữu cơ (c/v)" value={`${currentAnalysis.before.organicComp.toFixed(2)} → ${currentAnalysis.after.organicComp.toFixed(2)}`} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <StatDisplay title="Tỷ suất lợi nhuận (p')" value={`${currentAnalysis.before.pRate.toFixed(1)}% → ${currentAnalysis.after.pRate.toFixed(1)}%`} />
                </Box>
            </Box>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Biểu đồ Cơ cấu Tư bản (C & V)</Typography>
            <Box sx={{ height: 250, width: '100%', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {canRenderChart ? (
                    <BarChart
                        dataset={barChartData}
                        xAxis={[{ scaleType: 'band', dataKey: 'type' }]}
                        series={[ { dataKey: 'C', label: 'Tư bản Bất biến' }, { dataKey: 'V', label: 'Tư bản Khả biến' } ]}
                        margin={{ top: 20, bottom: 30, left: 40, right: 10 }} 
                        grid={{ horizontal: true }}
                        hideLegend
                    />
                ) : (
                    <CircularProgress size={30} /> 
                )}
            </Box>
            
            <Box sx={{ mt: 'auto', flexShrink: 0, width: '100%' }}>
                <Button variant="contained" fullWidth startIcon={<OpenInNewIcon />} onClick={() => onNavigateToDashboard(currentAnalysis)} sx={{ mt: 2 }}>
                    Xem Dashboard Đầy đủ
                </Button>
            </Box>
        </Paper>
    );
}