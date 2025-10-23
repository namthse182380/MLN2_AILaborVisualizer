// src/theme.ts
'use client';
import { createTheme } from '@mui/material/styles';
// --- REMOVED: Bỏ import Roboto ---

const theme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  typography: {
    // --- NEW: Sử dụng biến CSS của font Inter ---
    fontFamily: 'var(--font-inter), Arial, sans-serif',
    // --- NEW: Thêm định nghĩa cho font monospace để dễ sử dụng ---
    caption: {
        fontFamily: 'var(--font-source-code-pro), monospace',
    },
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { severity: 'info' },
              style: {
                backgroundColor: '#60a5fa',
              },
            },
          ],
        },
      },
    },
  },
});

export default theme;