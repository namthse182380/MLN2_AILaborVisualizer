"use client";
import React, { useState, useEffect, useRef } from 'react';
import { alpha } from '@mui/material/styles';
import { 
  Container, Grid, Paper, TextField, Button, Typography, Box, 
  CircularProgress, Alert, Stack, CssBaseline 
} from '@mui/material';
import ReactMarkdown from 'react-markdown';

// Import các component layout và theme
import AppNavbar from '@/components/AppNavbar';
import Header from '@/components/Header';
import SideMenu from '@/components/SideMenu';
import AppTheme from '@/theme/AppTheme';
import StatCard from '@/components/StatCard';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '@/theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const TIMER_INTERVAL = 51; // ms

export default function LabPage() {
  const [prompt, setPrompt] = useState('Phân tích sự khác biệt về giá trị khi một lập trình viên code thủ công trong 8 giờ so với dùng Copilot chỉ trong 1 giờ');
  const [humanText, setHumanText] = useState('');
  
  const [time, setTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [aiResponse, setAiResponse] = useState('');
  const [aiTime, setAiTime] = useState(0); 
  const [displayAiTime, setDisplayAiTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [error, setError] = useState('');
  const [hasCalledApi, setHasCalledApi] = useState(false);

  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => setTime(prevTime => prevTime + TIMER_INTERVAL), TIMER_INTERVAL);
    } else if (!isTimerActive && time !== 0) {
      if(timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if(timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive]);

  useEffect(() => {
    if (isLoading) {
      aiTimerRef.current = setInterval(() => {
        setDisplayAiTime(prev => prev + TIMER_INTERVAL);
      }, TIMER_INTERVAL);
    } else {
      if (aiTimerRef.current) {
        clearInterval(aiTimerRef.current);
      }
    }
    return () => {
      if (aiTimerRef.current) {
        clearInterval(aiTimerRef.current);
      }
    };
  }, [isLoading]);

  const handleHumanTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setHumanText(value);
    if (!isTimerActive && !hasCalledApi) {
      setIsTimerActive(true);
      handleApiCall();
      setHasCalledApi(true);
    }
  };
  
  const handleStopTimer = () => setIsTimerActive(false);

  function formatAiResponse(raw: string) {
    if (!raw) return '';
    return raw.replace(/<\/?markdown>|<s>|<\/s>|\[BOS\]|\[EOS\]/g, '').trim();
  }

  const handleResetHuman = () => {
    setIsTimerActive(false);
    setTime(0);
    setHumanText('');
    setHasCalledApi(false);
    setAiResponse('');
    setAiTime(0);
    setDisplayAiTime(0);
    setError('');
    setIsLoading(false);
  }

  const handleApiCall = async () => {
    setAiResponse('');
    setAiTime(0);
    setDisplayAiTime(0);
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unknown API error occurred.');
      }
      const data = await response.json();
      setAiResponse(data.text);
      setAiTime(data.timeMs);
    } catch (err: any) {
      setError(err.message);
      setAiTime(0);
    } finally {
      setIsLoading(false);
    }
  };
  
  const productivityFactor = time > 0 && aiTime > 0 ? (time / aiTime) : 0;
  
  const aiTimeValue = isLoading 
      ? `${(displayAiTime / 1000).toFixed(2)}s`
      : aiTime > 0 
      ? `${(aiTime / 1000).toFixed(2)}s`
      : '---';

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <SideMenu />
        <AppNavbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
          <Header />
          <Container maxWidth="lg" sx={{ flexGrow: 1, mt: { xs: 8, md: 2 } }}>
              <Typography variant="h3" component="h1" fontWeight="bold">Phòng Thí nghiệm Năng suất</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>So sánh trực tiếp giữa "Lao động Sống" (con người) và "Lao động Máy hóa" (AI) để thấy sự chênh lệch về thời gian lao động xã hội cần thiết.</Typography>
              
              <Paper variant="outlined" sx={{ p: 2, pt: 2, mb: 4, width: '100%' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary', letterSpacing: '0.5px', pl: 1 }}>
                  Nhiệm vụ / Prompt
                </Typography>
                <TextField fullWidth value={prompt} onChange={(e) => setPrompt(e.target.value)} variant="outlined" disabled={isTimerActive || isLoading} />
              </Paper>
              
              <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid size={{ xs: 12, sm: 4 }}><StatCard title="Thời gian Lao động Sống" value={time > 0 ? `${(time/1000).toFixed(2)}s` : '---'} interval="Con người thực hiện" trend="neutral" data={[]}/></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><StatCard title="Thời gian Lao động Máy hóa" value={aiTimeValue} interval="AI thực hiện" trend="neutral" data={[]}/></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><StatCard title="Hệ số Tăng năng suất" value={productivityFactor > 0 ? `${productivityFactor.toFixed(1)}x` : '---'} interval="AI hiệu quả hơn" trend={productivityFactor > 1 ? 'up' : 'neutral'} data={[]}/></Grid>
              </Grid>
              
              <Grid container spacing={3} alignItems="stretch">
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6">Lao động Sống (V)</Typography>
                    <Box sx={{ mt: 2, flexGrow: 1, position: 'relative' }}>
                      <TextField fullWidth multiline variant="outlined" label="Bắt đầu gõ để tính giờ..."
                        value={humanText} onChange={handleHumanTextChange} disabled={hasCalledApi && !isTimerActive}
                        InputLabelProps={{ sx: { top: '0px', '&.Mui-focused': { top: '-8px' } } }}
                        sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', '& .MuiInputBase-root': { height: '100%', alignItems: 'flex-start' }, '& .MuiInputBase-inputMultiline': { height: '100% !important', overflow: 'auto !important' } }}
                      />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Button variant="contained" color="error" onClick={handleStopTimer} disabled={!isTimerActive}>Dừng</Button>
                      <Button variant="outlined" onClick={handleResetHuman}>Thử lại</Button>
                    </Box>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6">Lao động Máy hóa (C)</Typography>
                      <Box sx={{ 
                          p: 2, mt: 2, border: '1px dashed grey', borderRadius: 1, flexGrow: 1, 
                          overflowY: 'auto', 
                          background: (theme) => alpha(theme.palette.grey[500], 0.05), 
                          // Cài đặt font chung cho toàn bộ box
                          fontFamily: 'var(--font-inter)', 
                          '& h1, & h2, & h3, & h4, & h5, & h6': { margin: '0 0 8px 0', fontWeight: 600 }, 
                          '& p': { margin: '0 0 8px 0', lineHeight: 1.6 }, // Tăng line-height cho dễ đọc
                          '& li': { marginBottom: 4 }, 
                          // Áp dụng font monospace cho code
                          '& code': { 
                              fontFamily: 'var(--font-source-code-pro)', 
                              backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.1), 
                              padding: '2px 4px', 
                              borderRadius: 4,
                              fontSize: '0.875rem'
                          }, 
                          '& pre': { 
                              fontFamily: 'var(--font-source-code-pro)',
                              backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.1), 
                              padding: 8, 
                              borderRadius: 6, 
                              overflowX: 'auto' 
                          } 
                      }}>
                        {isLoading ? (<CircularProgress />) : (<ReactMarkdown>{formatAiResponse(aiResponse) || 'Kết quả từ AI sẽ hiển thị ở đây...'}</ReactMarkdown>)}
                      </Box>
                     <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Button variant="contained" color="primary" onClick={() => { if (!hasCalledApi) { handleApiCall(); setHasCalledApi(true); } }} disabled={isLoading || hasCalledApi}>Thực thi AI</Button>
                    </Box>
                    {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
                  </Paper>
                </Grid>
              </Grid>
              
              {Number(productivityFactor) > 0 && (
                <Paper variant='outlined' sx={{ mt: 4, p: 2, borderColor: 'success.main', background: (theme) => alpha(theme.palette.success.main, 0.1)}}>
                  <Typography variant="h6" component="div"><Typography component="span" fontWeight="bold">Kết luận:</Typography> Lao động máy hóa (AI) hiệu quả hơn <Typography component="span" fontWeight="bold">{productivityFactor.toFixed(1)} lần</Typography>.</Typography>
                  <Typography>Điều này chứng minh AI (C) là công cụ cách mạng giúp <Typography component="span" fontWeight="bold">giảm mạnh "Thời gian lao động xã hội cần thiết"</Typography>.</Typography>
                </Paper>
              )}
          </Container>
        </Box>
      </Box>
    </AppTheme>
  );
}