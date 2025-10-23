"use client";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Stack, Divider } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
export default function ProductivityLeverageCard({ factor }: { factor: number }) {
return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    <Typography component="h2" variant="h6" gutterBottom>
    Đòn bẩy Năng suất
    </Typography>
    <Stack direction="row" spacing={2} alignItems="center" my={2}>
    <Typography variant="h3" fontWeight="bold" color="primary">
    {factor.toFixed(1)}x
    </Typography>
    <SpeedIcon color="primary" sx={{ fontSize: 40 }}/>
    </Stack>
    <Divider sx={{ width: '80%', my: 1 }}/>
    <Typography variant="caption" color="text.secondary" align="center">
    AI thực hiện công việc nhanh hơn {factor.toFixed(1)} lần so với lao động sống.
    </Typography>
    </CardContent>
    </Card>
);
}