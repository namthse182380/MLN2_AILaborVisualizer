// src/components/MenuContent.tsx
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, IconButton, Box, Divider, Typography, Menu, MenuItem, Tooltip } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import type { Chat } from '../app/chat/[chatId]/page';

const mainListItems = [
  { text: 'Trang chủ', icon: <HomeRoundedIcon />, href: '/' },
  { text: 'Trạm Mô phỏng', icon: <DashboardIcon />, href: '/simulation' },
  { text: 'Phòng Thí nghiệm', icon: <ScienceRoundedIcon />, href: '/lab' },
  { text: 'Thư viện Tri thức', icon: <MenuBookRoundedIcon />, href: '/about' },
];

const ChatHistoryItem = ({ chat, currentPathname }: { chat: Chat, currentPathname: string }) => {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    // Kiểm tra xem chat này có nội dung phân tích không
    const hasAnalysis = useMemo(() => {
        return chat.analyses && chat.analyses.length > 0;
    }, [chat.analyses]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const handleDelete = () => { 
        const storedChats = JSON.parse(localStorage.getItem('chatHistory') || '[]') as Chat[];
        const updatedChats = storedChats.filter(c => c.id !== chat.id);
        localStorage.setItem('chatHistory', JSON.stringify(updatedChats));
        window.dispatchEvent(new Event('storage')); // Cập nhật UI
        handleClose();
        if (currentPathname === `/chat/${chat.id}`) {
            router.push('/chat'); // Chuyển hướng nếu đang ở trang bị xóa
        }
     };
    
    // Tích hợp: Gửi tín hiệu để mở bảng phân tích khi điều hướng
    const handleOpenAnalysisPanel = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        event.preventDefault();
        sessionStorage.setItem('requestOpenPanelForChat', chat.id);
        router.push(`/chat/${chat.id}`);
    };

    return (
        <ListItem disablePadding>
            <ListItemButton component={Link} href={`/chat/${chat.id}`} selected={currentPathname === `/chat/${chat.id}`}>
                <ListItemIcon><QuestionAnswerRoundedIcon /></ListItemIcon>
                <ListItemText primary={chat.title} primaryTypographyProps={{ noWrap: true, fontSize: '0.875rem' }} />
                
                {hasAnalysis && (
                    <Tooltip title="Xem tóm tắt phân tích">
                        <IconButton size="small" onClick={handleOpenAnalysisPanel} sx={{ ml: 1 }}>
                            <AssessmentIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}

                <IconButton size="small" onClick={handleClick} sx={{ ml: 1 }}><MoreVertIcon fontSize="small" /></IconButton>
            </ListItemButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Xóa</MenuItem>
            </Menu>
        </ListItem>
    );
};

export default function MenuContent() {
  const pathname = usePathname();
  const [chats, setChats] = useState<Chat[]>([]);

  const loadChats = () => {
    const storedChats = localStorage.getItem('chatHistory');
    setChats(storedChats ? JSON.parse(storedChats) : []);
  };
  
  useEffect(() => {
    loadChats();
    window.addEventListener('storage', loadChats);
    return () => window.removeEventListener('storage', loadChats);
  }, []);
  
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Link href={item.href} passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
              <ListItemButton selected={pathname === item.href}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <Divider sx={{ my: 1 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 1 }}>
              <Typography variant="caption" fontWeight="bold">TRỢ LÝ PHÂN TÍCH</Typography>
              <Tooltip title="Bắt đầu cuộc trò chuyện mới">
                  <IconButton size="small" component={Link} href="/chat">
                      <AddCircleOutlineIcon fontSize="small" />
                  </IconButton>
              </Tooltip>
          </Stack>
          <List dense>
              {chats.map((chat) => (
                  <ChatHistoryItem key={chat.id} chat={chat} currentPathname={pathname} />
              ))}
          </List>
      </Box>
    </Stack>
  );
}