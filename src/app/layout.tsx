// src/app/layout.tsx
import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import theme from '@/theme';
// --- NEW: Import font mới từ next/font/google ---
import { Inter, Source_Code_Pro } from 'next/font/google';

// --- NEW: Cấu hình font ---
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', // Tạo biến CSS cho font chính
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600'],
  variable: '--font-source-code-pro', // Tạo biến CSS cho font monospace
});

export const metadata = {
  title: 'AI Labor Visualizer',
  description: 'Mô phỏng tác động của AI lên Kinh tế Chính trị Mác-Lênin.',
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    // --- NEW: Áp dụng class của font vào thẻ <html> ---
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sourceCodePro.variable}`}>
      <body>
        <InitColorSchemeScript attribute="class" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {props.children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}