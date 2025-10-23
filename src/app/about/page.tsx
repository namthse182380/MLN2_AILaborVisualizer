'use client'

import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import { Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AppNavbar from '@/components/AppNavbar';
import SideMenu from '@/components/SideMenu';
import AppTheme from '@/theme/AppTheme';
import Header from '@/components/Header';
import { CssBaseline } from '@mui/material';

export default function AboutPage() {
  return (
    <AppTheme>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <SideMenu />
            <AppNavbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <Container maxWidth="lg" sx={{ flexGrow: 1, mt: { xs: 8, md: 2 } }}>
                    <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                            Thư viện Tri thức: Giải thích Lý luận
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
                            Nền tảng học thuật của dự án, giải thích các khái niệm Kinh tế Chính trị Mác-Lênin được sử dụng trong mô phỏng.
                        </Typography>

                        <Box sx={{ width: '100%', maxWidth: '900px' }}>
                            <Accordion defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight="bold">1. Hàng hóa và Hai thuộc tính</Typography></AccordionSummary>
                                <AccordionDetails>
                                    <Typography paragraph>
                                        Hàng hóa là sản phẩm của lao động, có thể thỏa mãn một nhu cầu nào đó của con người thông qua trao đổi, mua bán. Nó có hai thuộc tính: Giá trị sử dụng và Giá trị.
                                    </Typography>
                                    <Typography>- <b>Giá trị sử dụng:</b> Là công dụng của vật phẩm, quyết định mục đích tiêu dùng. AI, với tư cách là một công cụ, có giá trị sử dụng vô cùng lớn trong việc tăng năng suất và tự động hóa.</Typography>
                                    <Typography>- <b>Giá trị:</b> Là lao động xã hội của người sản xuất đã hao phí để tạo ra hàng hóa, được kết tinh trong đó. Đây là cơ sở của giá trị trao đổi.</Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight="bold">2. Tư bản Bất biến (C) và Tư bản Khả biến (V)</Typography></AccordionSummary>
                                <AccordionDetails>
                                     <Typography paragraph>
                                        Để tiến hành sản xuất, nhà tư bản phải ứng trước tư bản để mua tư liệu sản xuất và sức lao động. Hai bộ phận này có vai trò khác nhau trong việc tạo ra giá trị thặng dư.
                                    </Typography>
                                    <Typography>- <b>Tư bản Bất biến (Constant Capital - C):</b> Là bộ phận tư bản tồn tại dưới hình thái tư liệu sản xuất (máy móc, nhà xưởng, nguyên liệu...). Giá trị của nó được lao động cụ thể bảo tồn và chuyển dịch nguyên vẹn vào sản phẩm mới, **không tăng lên**. Trong mô phỏng này, **AI và các chi phí công nghệ** được tính vào Tư bản Bất biến (C).</Typography>
                                    <br />
                                    <Typography>- <b>Tư bản Khả biến (Variable Capital - V):</b> Là bộ phận tư bản dùng để mua sức lao động. Thông qua lao động trừu tượng, nó tạo ra một giá trị mới lớn hơn giá trị của chính nó. Phần lớn hơn đó chính là giá trị thặng dư (M). Do đó, V là bộ phận tư bản **có sự biến đổi về lượng**, và là **nguồn gốc duy nhất của giá trị thặng dư**.</Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight="bold">3. Quy luật Tỷ suất Lợi nhuận (p') có xu hướng Giảm</Typography></AccordionSummary>
                                <AccordionDetails>
                                    <Typography paragraph>
                                        Đây là một trong những quy luật kinh tế quan trọng nhất của chủ nghĩa tư bản, được mô phỏng trực tiếp trong dự án này.
                                    </Typography>
                                    <Typography>
                                        Để chiến thắng trong cạnh tranh, các nhà tư bản buộc phải liên tục áp dụng công nghệ mới (tăng C) để tăng năng suất lao động. Việc này dẫn đến việc giảm tương đối chi phí cho lao động sống (giảm V). Kết quả là **Cấu tạo hữu cơ của tư bản (c/v)** ngày càng tăng lên.
                                    </Typography>
                                    <br />
                                    <Typography>
                                        Vì giá trị thặng dư (M) chỉ do Tư bản Khả biến (V) tạo ra, nên dù tỷ suất bóc lột (m' = m/v) có thể tăng, nhưng tỷ trọng của V trong tổng tư bản ngày càng giảm. Hệ quả tất yếu là **Tỷ suất Lợi nhuận (p' = M / (C+V))** có xu hướng giảm dần theo thời gian. Mô phỏng của chúng tôi đã minh họa rõ quy luật này khi bạn kéo thanh trượt ứng dụng AI.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                        
                        <Box sx={{ mt: 4 }}>
                            <Button variant="contained" component={NextLink} href="/">
                                Quay lại Trạm Mô phỏng
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    </AppTheme>
  );
}