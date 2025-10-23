"use client";
import React from 'react';
import { Box, CircularProgress, Stack, Typography, CssBaseline } from '@mui/material';
import AppTheme from '@/theme/AppTheme';

export default function Loading() {
  return (
    <AppTheme>
        <CssBaseline />
        <Box 
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                backgroundColor: 'background.default',
                zIndex: 9999,
            }}
        >
            <Stack spacing={2} alignItems="center">
                <CircularProgress />
                <Typography sx={{ color: 'text.secondary' }}>
                    Đang tải trang...
                </Typography>
            </Stack>
        </Box>
    </AppTheme>
  );
}