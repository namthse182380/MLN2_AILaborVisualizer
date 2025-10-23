// src/components/ChatWelcome.tsx
"use client";
import React from 'react';
import { Box, Typography, Paper, Grid, Button, Stack } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

interface ChatWelcomeProps {
  onExampleClick: (prompt: string) => void;
}

const examplePrompts = [
  {
    title: "So sánh Đơn giản",
    prompt: "So sánh chi phí sản xuất một bài viết trước và sau khi dùng AI."
  },
  {
    title: "Phân tích Kịch bản",
    prompt: "Phân tích kịch bản một nhà máy thay thế 100 công nhân bằng 10 robot AI."
  },
  {
    title: "Hỏi về Lý thuyết",
    prompt: "AI làm tăng cấu tạo hữu cơ của tư bản như thế nào?"
  },
  {
    title: "Dự báo Tương lai",
    prompt: "Tác động lâu dài của AI đến tỷ suất lợi nhuận là gì?"
  }
];

export default function ChatWelcome({ onExampleClick }: ChatWelcomeProps) {
  return (
    <Box 
      sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        px: 2
      }}
    >
      <Stack spacing={3} alignItems="center" sx={{ maxWidth: '700px', textAlign: 'center' }}>
        <LightbulbOutlinedIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          Trợ lý Phân tích Kinh tế Chính trị
        </Typography>
        <Typography color="text.secondary">
          Sẵn sàng phân tích tác động của AI theo lăng kính Mác-Lênin. 
          Bạn có thể bắt đầu bằng cách đặt một câu hỏi hoặc thử một trong các ví dụ dưới đây.
        </Typography>
        
        <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2 }, width: '100%', mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>Gợi ý cho bạn</Typography>
          <Grid container spacing={2}>
            {examplePrompts.map((item) => (
              <Grid size={{xs:12, md:6}} key={item.title}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => onExampleClick(item.prompt)}
                  sx={{
                    p: 1.5,
                    height: '100%',
                    textTransform: 'none',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start'
                  }}
                >
                  <Typography fontWeight="medium" sx={{ fontSize: '0.875rem' }}>{item.title}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'normal' }}>
                    {item.prompt}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Stack>
    </Box>
  );
}