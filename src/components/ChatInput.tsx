// src/components/ChatInput.tsx
"use client";
import React from 'react';
import { Stack, TextField, IconButton } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  isLoading: boolean;
}

export default function ChatInput({ input, setInput, handleSend, isLoading }: ChatInputProps) {
  return (
    // alignItems: 'flex-end' để nút Gửi luôn thẳng hàng với dòng cuối của text
    <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: 'flex-end' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Đặt câu hỏi hoặc mô tả kịch bản..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        disabled={isLoading}
        // Đây là 2 prop cần thiết để nó hoạt động
        multiline
        maxRows={3}
        sx={{
          // Thuộc tính này để xử lý các chuỗi ký tự dài không có dấu cách
          // đảm bảo không tràn theo chiều ngang.
          '& .MuiInputBase-input': {
            overflowWrap: 'break-word',
          },
        }}
      />
      <IconButton
        color="primary"
        onClick={handleSend}
        disabled={isLoading || !input.trim()}
        sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            flexShrink: 0, // Ngăn nút bị co lại
        }}
      >
        <SendRoundedIcon />
      </IconButton>
    </Stack>
  );
}