// src/components/AppNavbar.tsx
"use client";

import * as React from 'react';
import Image from 'next/image'; // --- THÊM MỚI ---
import { usePathname } from 'next/navigation'; // --- THÊM MỚI ---
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MuiToolbar from '@mui/material/Toolbar';
import { tabsClasses } from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider'; // --- THÊM MỚI ---
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SideMenuMobile from './SideMenuMobile';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '.././theme/ColorModeIconDropdown';

const Toolbar = styled(MuiToolbar)({
  width: '100%',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '12px',
  flexShrink: 0,
  [`& ${tabsClasses.flexContainer}`]: {
    gap: '8px',
    p: '8px',
    pb: 0,
  },
});

// --- THÊM MỚI: Logic để lấy tên trang ---
const pathMap: { [key: string]: string } = {
  '/': 'Trang chủ',
  '/simulation': 'Trạm Mô phỏng',
  '/lab': 'Phòng Thí nghiệm',
  '/chat': 'Trợ lý Phân tích',
  '/about': 'Thư viện Tri thức',
  '/visualize': 'Dashboard Phân tích',
};

export default function AppNavbar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  let pageTitle = 'Dashboard'; // Default title
  if (pathname.startsWith('/chat/')) {
    pageTitle = 'Trợ lý Phân tích';
  } else {
    pageTitle = pathMap[pathname] || 'Dashboard';
  }
  // --- KẾT THÚC THÊM MỚI ---

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: 'auto', md: 'none' },
        boxShadow: 0,
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        top: 'var(--template-frame-height, 0px)',
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexGrow: 1,
            width: '100%',
            gap: 1,
          }}
        >
          {/* --- BẮT ĐẦU THAY ĐỔI GIAO DIỆN HEADER --- */}
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center', mr: 'auto' }}
          >
            <Image
              src="/FPT_logo.png"
              alt="FPT Logo"
              width={80}
              height={32}
              style={{
                height: '32px',
                width: 'auto',
              }}
            />
            <Divider orientation="vertical" flexItem />
            <Typography variant="h6" component="h1" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {pageTitle}
            </Typography>
          </Stack>
          {/* --- KẾT THÚC THAY ĐỔI GIAO DIỆN HEADER --- */}
          <ColorModeIconDropdown />
          <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuRoundedIcon />
          </MenuButton>
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

// --- XÓA: Component CustomIcon không còn được sử dụng ---
// export function CustomIcon() { ... }