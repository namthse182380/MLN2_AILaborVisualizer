"use client";

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

// Map path to a readable name
const pathMap: { [key: string]: string } = {
  '/': 'Trạm Mô phỏng',
  '/lab': 'Phòng Thí nghiệm',
  '/chat': 'Chatbot Trực quan',
  '/about': 'Thư viện Tri thức',
};

export default function NavbarBreadcrumbs() {
  const pathname = usePathname();
  const pageTitle = pathMap[pathname] || 'Home';

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">AI Labor Visualizer</Typography>
      <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
        {pageTitle}
      </Typography>
    </StyledBreadcrumbs>
  );
}