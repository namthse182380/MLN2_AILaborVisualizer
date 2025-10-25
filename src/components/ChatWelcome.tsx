// src/components/ChatWelcome.tsx
"use client";
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
    Box, Typography, Paper, Grid, Button, Stack, 
    Accordion, AccordionSummary, AccordionDetails 
} from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ChatWelcomeProps {
  onExampleClick: (prompt: string) => void;
}

const examplePrompts = [
  {
    title: "Phân tích Kịch bản",
    prompt: "Nhà máy của tôi ban đầu có C=1000, V=800. Sau khi áp dụng AI, C tăng lên 2500 và V giảm còn 300. Phân tích giúp tôi."
  },
  {
    title: "Hỏi đáp nhanh",
    prompt: "AI ảnh hưởng đến cấu tạo hữu cơ của tư bản như thế nào?"
  }
];

export default function ChatWelcome({ onExampleClick }: ChatWelcomeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  const handleAccordionChange = (event: React.SyntheticEvent, expanded: boolean) => {
    setIsExpanded(expanded);
    if (expanded) {
      setTimeout(() => {
        // --- CẬP NHẬT: Dùng 'nearest' để cuộn mượt hơn và tránh nhảy trang nếu đã thấy ---
        accordionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  };

  return (
    <Box 
      sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start', // --- CẬP NHẬT: Căn lề trên cùng để dễ cuộn hơn
        height: '100%',
        px: 2,
        // --- CẬP NHẬT QUAN TRỌNG: Xóa bỏ thanh cuộn lồng nhau ---
        // overflowY: 'auto', // XÓA DÒNG NÀY
      }}
    >
      <Stack spacing={3} alignItems="center" sx={{ maxWidth: '750px', textAlign: 'center', py: 3 }}>
        <LightbulbOutlinedIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          Trợ lý Phân tích Kinh tế Chính trị
        </Typography>
        <Typography color="text.secondary">
          Biến kịch bản kinh tế của bạn thành dashboard phân tích chỉ với một cú nhấp chuột.
        </Typography>
        
        <Paper ref={accordionRef} variant="outlined" sx={{ p: 2, width: '100%', textAlign: 'left' }}>
            <Accordion 
              expanded={isExpanded}
              onChange={handleAccordionChange}
              sx={{ boxShadow: 'none', '&.Mui-expanded': { margin: 0 }, bgcolor: 'transparent' }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="medium">Xem hướng dẫn nhanh (và kết quả mẫu)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack spacing={2}>
                        <Typography><b>Bước 1:</b> Mô tả kịch bản của bạn, cung cấp rõ số liệu <b>Tư bản Bất biến (C)</b> và <b>Tư bản Khả biến (V)</b> trước và sau khi có AI.</Typography>
                        <Typography><b>Bước 2:</b> Khi AI phân tích xong và đề xuất, hãy nhấn vào nút <b>"Trực quan hóa Phân tích"</b>.</Typography>
                        <Typography><b>Kết quả:</b> Bạn sẽ nhận được một dashboard phân tích toàn diện như thế này.</Typography>
                        <Box sx={{ pt: 1 }}>
                            <Image
                                src="/visualize-preview.png"
                                alt="Xem trước trang Visualize"
                                width={1200}
                                height={800}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: '8px',
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            />
                        </Box>
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </Paper>
        
        <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2 }, width: '100%' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>Thử một trong các gợi ý sau</Typography>
          <Grid container spacing={2}>
            {examplePrompts.map((item) => (
              <Grid size={{xs:12, md:6}} key={item.title}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => onExampleClick(item.prompt)}
                  sx={{
                    p: 1.5, height: '100%', textTransform: 'none', textAlign: 'left',
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'
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