// src/components/ChatMessageList.tsx
"use client";
import React from 'react';
import { Box, Paper, Typography, Avatar, Stack, CircularProgress, Button } from '@mui/material';
import { deepPurple, grey } from '@mui/material/colors';
import ReactMarkdown from 'react-markdown';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { Message } from '../app/chat/[chatId]/page';
import ChatWelcome from './ChatWelcome';

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  isVisualizing: boolean; // NEW: Prop để biết có đang visualize không
  onVisualize: (messageIndex: number) => void;
  onExampleClick: (prompt: string) => void;
}

const triggerPhrase = "bạn có muốn tôi vẽ biểu đồ trực quan cho phân tích này không?";

export default function ChatMessageList({ messages, isLoading, isVisualizing, onVisualize, onExampleClick }: ChatMessageListProps) {
  
  if (messages.length === 0 && !isLoading) {
    return <ChatWelcome onExampleClick={onExampleClick} />;
  }

  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
      <Stack spacing={2}>
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          // Chỉ hiển thị nút khi không có tác vụ loading nào khác đang chạy
          const showVisualizeButton = msg.role === 'assistant' && msg.content.toLowerCase().includes(triggerPhrase);

          return (
            <Stack key={index} direction="row" spacing={2} alignItems="flex-start" sx={{ justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
              {!isUser && (
                <Avatar sx={{ bgcolor: deepPurple[500], width: 32, height: 32 }}><SmartToyOutlinedIcon fontSize="small" /></Avatar>
              )}
              <Box sx={{ maxWidth: '80%' }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    bgcolor: isUser ? 'primary.main' : 'background.default',
                    color: isUser ? 'primary.contrastText' : 'text.primary',
                    borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                  }}
                >
                  <ReactMarkdown components={{ p: ({ node, ...props }) => <Typography variant="body2" {...props} />, li: ({ node, ...props }) => <li style={{ fontSize: '0.875rem' }} {...props} /> }}>
                    {msg.content}
                  </ReactMarkdown>
                </Paper>
                {showVisualizeButton && (
                   <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AnalyticsIcon />}
                      onClick={() => onVisualize(index)}
                      sx={{ mt: 1, textTransform: 'none' }}
                      // --- FIX: Vô hiệu hóa nút khi đang xử lý visualize ---
                      disabled={isVisualizing} 
                   >
                       {isVisualizing ? 'Đang xử lý...' : 'Trực quan hóa Phân tích'}
                   </Button>
                )}
              </Box>
              {isUser && (
                <Avatar sx={{ bgcolor: grey[300], color: grey[800], width: 32, height: 32 }}><PersonOutlineOutlinedIcon fontSize="small" /></Avatar>
              )}
            </Stack>
          );
        })}
        {isLoading && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: deepPurple[500], width: 32, height: 32 }}><SmartToyOutlinedIcon fontSize="small" /></Avatar>
            <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">AI đang trả lời...</Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}