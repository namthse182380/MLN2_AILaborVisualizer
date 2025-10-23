// src/components/SideMenu.tsx
'use client'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuContent from './MenuContent';
import Image from 'next/image';
import { Stack } from '@mui/material';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      {/* --- BẮT ĐẦU THAY ĐỔI --- */}
      <Stack 
        alignItems="center" 
        justifyContent="center"
        // Điều chỉnh chiều cao của khu vực logo cho phù hợp
        sx={{ p: 2, height: '84px' }}
      >
        <Image 
          src="/FPT_logo.png" // Đường dẫn tới logo FPT trong thư mục /public
          alt="FPT Corporation Logo"
          // Các props width/height này dùng để tối ưu hóa và xác định tỷ lệ
          // Kích thước thực tế sẽ được điều khiển bởi 'style' bên dưới
          width={160} 
          height={64}
          // Dùng style để logo hiển thị với chiều rộng mong muốn và chiều cao tự động
          style={{
            width: '100px', // Chiếm phần lớn chiều rộng sidebar
            height: 'auto',   // Chiều cao tự động điều chỉnh để không méo ảnh
          }}
        />
      </Stack>
      {/* --- KẾT THÚC THAY ĐỔI --- */}

      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent />
      </Box>
    </Drawer>
  );
}