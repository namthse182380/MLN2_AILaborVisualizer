// src/app/chat/[chatId]/page.tsx
'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Paper, Typography, CssBaseline, Drawer, useTheme, useMediaQuery, IconButton, Tooltip, Alert, Stack, CircularProgress } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

import AppTheme from '@/theme/AppTheme';
import SideMenu from '@/components/SideMenu';
import AppNavbar from '@/components/AppNavbar';
import Header from '@/components/Header';
import ChatInput from '@/components/ChatInput';
import ChatMessageList from '@/components/ChatMessageList';
import AnalysisPanel from '@/components/AnalysisPanel';
import Loading from '@/app/loading';

export interface Message { role: 'user' | 'assistant'; content: string; }
export interface AnalysisResult { c: number; v: number; m: number; organicComp: number; pRate: number; }
export interface AnalysisData { id: string; title: string; before: AnalysisResult; after: AnalysisResult; analysis: string; }
export interface Chat { id: string; title: string; messages: Message[]; analyses: AnalysisData[]; }

const ANALYSIS_PANEL_WIDTH = 450; 

export default function ChatPage() {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState('');
    const [isPanelOpen, setPanelOpen] = useState(false);
    const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const router = useRouter();
    const params = useParams();
    const chatId = params.chatId as string;
    const chatEndRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

    const isLoading = loadingMessage.includes('AI đang trả lời...');
    const isVisualizing = !!loadingMessage && !isLoading;

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loadingMessage]);

    useEffect(() => {
        if (chatId && !isInitialized) {
            const storedChats = JSON.parse(localStorage.getItem('chatHistory') || '[]') as Chat[];
            const existingChat = storedChats.find(c => c.id === chatId);
            if (existingChat) {
                setChat(existingChat);
                setMessages(existingChat.messages);
                if (existingChat.analyses?.length > 0) {
                    setCurrentAnalysisId(existingChat.analyses[existingChat.analyses.length - 1].id);
                }
            } else {
                const newChat: Chat = { id: chatId, title: `Cuộc trò chuyện mới`, messages: [], analyses: [] };
                setChat(newChat);
                setMessages([]);
            }
            setIsInitialized(true);
        }
    }, [chatId, isInitialized]);
    
    useEffect(() => {
        const requestedChatId = sessionStorage.getItem('requestOpenPanelForChat');
        if (requestedChatId === chatId && chat) {
            setPanelOpen(true);
            sessionStorage.removeItem('requestOpenPanelForChat');
        }
    }, [chatId, chat]);

    const saveChat = (currentChat: Chat, currentMessages: Message[]) => {
        const updatedChat = { ...currentChat, messages: currentMessages };
        const storedChats = JSON.parse(localStorage.getItem('chatHistory') || '[]') as Chat[];
        const chatIndex = storedChats.findIndex(c => c.id === updatedChat.id);
        if (chatIndex > -1) {
            storedChats[chatIndex] = updatedChat;
        } else {
            storedChats.push(updatedChat);
        }
        localStorage.setItem('chatHistory', JSON.stringify(storedChats));
        window.dispatchEvent(new Event('storage'));
    };

    const handleSend = useCallback(async () => {
        if (!input.trim() || !chat) return;
        setError('');
        const newUserMessage: Message = { role: 'user', content: input };
        
        // Cập nhật state với tin nhắn người dùng và placeholder của assistant CÙNG LÚC
        const currentMessages = [...messages, newUserMessage];
        const assistantPlaceholder: Message = { role: 'assistant', content: '' };
        setMessages([...currentMessages, assistantPlaceholder]);
        
        setInput('');
        setLoadingMessage('AI đang trả lời...');

        let fullResponse = '';
        try {
            const response = await fetch('/api/chat', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                // Gửi đi currentMessages (chỉ chứa tin nhắn người dùng) để AI không thấy placeholder của chính nó
                body: JSON.stringify({ messages: currentMessages }) 
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Không thể phân tích lỗi từ server.' }));
                throw new Error(errorData.error || response.statusText);
            }
            if (!response.body) {
                throw new Error('Response body không tồn tại.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                fullResponse += decoder.decode(value, { stream: true });
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: 'assistant', content: fullResponse };
                    return updated;
                });
            }
        } catch (error: any) {
            const errorMessage = error.message || "Đã có lỗi không xác định xảy ra.";
            console.error("Chat API error:", errorMessage);
            fullResponse = `**Lỗi:** ${errorMessage}`;
            // Cập nhật tin nhắn cuối cùng với thông báo lỗi
             setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: fullResponse };
                return updated;
            });
        } finally {
            // --- BẮT ĐẦU SỬA LỖI & NÂNG CẤP ---
            let finalTitle = chat.title;
            let finalContent = fullResponse;

            // Điều kiện mới, đáng tin cậy hơn để xác định "lần trao đổi đầu tiên"
            // `messages.length` là state TRƯỚC khi gửi, `currentMessages.length` là state SAU khi thêm tin nhắn người dùng
            if (currentMessages.length === 1 && fullResponse.startsWith('TITLE:')) {
                const firstNewlineIndex = fullResponse.indexOf('\n');
                if (firstNewlineIndex !== -1) {
                    finalTitle = fullResponse.substring(6, firstNewlineIndex).trim();
                    finalContent = fullResponse.substring(firstNewlineIndex + 1).trimStart();
                }
            }
            
            const finalAssistantMessage: Message = { role: 'assistant', content: finalContent };
            
            // Cách xây dựng mảng tin nhắn cuối cùng an toàn nhất
            const finalMessages = [...currentMessages, finalAssistantMessage];

            const updatedChat: Chat = { ...chat, title: finalTitle };
            
            // Cập nhật tất cả state một lần cuối để đảm bảo đồng bộ
            setChat(updatedChat);
            setMessages(finalMessages);
            saveChat(updatedChat, finalMessages);
            setLoadingMessage('');
            // --- KẾT THÚC SỬA LỖI ---
        }
    }, [input, chat, messages]);

    // Các hàm và phần còn lại của component giữ nguyên...
    const handleVisualize = useCallback(async (messageIndex: number) => {
        if (!chat) return;
        setError('');
        setLoadingMessage('1/3: Đang trích xuất dữ liệu...');
        try {
            const conversationHistory = messages.slice(0, messageIndex + 1);
            if (!conversationHistory || conversationHistory.length === 0) {
                throw new Error('Không tìm thấy lịch sử hội thoại.');
            }
            const analyzeRes = await fetch('/api/visualize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: conversationHistory }) });
            if (!analyzeRes.ok) { const err = await analyzeRes.json(); throw new Error(`Lỗi trích xuất: ${err.error || 'Lỗi không xác định từ API'}`); }
            const extractedData = await analyzeRes.json();
            const isExtractedDataValid = (data: any) => {
                const isResultObjectValid = (res: any) => res && typeof res.c === 'number' && typeof res.v === 'number';
                return data && data.before && data.after && isResultObjectValid(data.before) && isResultObjectValid(data.after);
            };
            if (!isExtractedDataValid(extractedData)) {
                console.error("Dữ liệu không hợp lệ từ /api/analyze-from-text:", extractedData);
                throw new Error('AI không thể trích xuất đủ dữ liệu C và V.');
            }
            const calculateMetrics = (data: { c: number, v: number }): AnalysisResult => {
                const m = data.v; 
                const organicComp = data.v > 0 ? data.c / data.v : 0;
                const pRate = (data.c + data.v) > 0 ? (m / (data.c + data.v)) * 100 : 0;
                return { ...data, m, organicComp, pRate };
            };
            const fullAnalysisData = {
                before: calculateMetrics(extractedData.before),
                after: calculateMetrics(extractedData.after),
                analysis: extractedData.analysis,
            };
            setLoadingMessage('2/3: AI đang tạo lời khuyên...');
            const adviceRes = await fetch('/api/generate-advice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fullAnalysisData) });
            if (!adviceRes.ok) { const err = await adviceRes.json(); throw new Error(`Lỗi tạo lời khuyên: ${err.error}`); }
            const suggestionResult = await adviceRes.json();
            setLoadingMessage('3/3: Đang chuẩn bị dashboard...');
            const newAnalysis: AnalysisData = { id: `analysis-${Date.now()}`, title: `Phân tích #${(chat.analyses?.length || 0) + 1}`, ...fullAnalysisData };
            const updatedAnalyses = [...(chat.analyses || []), newAnalysis];
            const updatedChat = { ...chat, analyses: updatedAnalyses };
            setChat(updatedChat);
            saveChat(updatedChat, messages);
            setCurrentAnalysisId(newAnalysis.id);
            setPanelOpen(true);
            const finalPayload = { analysisData: fullAnalysisData, suggestionData: suggestionResult };
            sessionStorage.setItem('visualizationPayload', JSON.stringify({ data: finalPayload, chatId: chat.id }));
            router.push('/visualize');
        } catch (error: any) { 
            console.error("Visualization flow error:", error.message);
            let detailedErrorMessage = error.message;
            if (error.message.includes('AI không thể trích xuất')) {
                detailedErrorMessage += '\nMẹo: Hãy thử mô tả rõ ràng hơn, ví dụ: "Trước AI, chi phí máy móc là 1000 và lao động là 800. Sau AI, máy móc là 2500 và lao động là 400."';
            }
            setError(detailedErrorMessage);
        } finally { 
            setLoadingMessage('');
        }
    }, [messages, chat, router]);
    const handleExampleClick = (prompt: string) => { setInput(prompt); };
    if (!isInitialized || !chat) {
        return <Loading />;
    }
    const currentAnalysis = chat.analyses?.find(a => a.id === currentAnalysisId);
    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', height: '100vh' }}>
                <SideMenu />
                <AppNavbar />
                <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Header />
                    <Box sx={{ display: 'flex', flexGrow: 1, gap: 2, overflow: 'hidden', mt: { xs: 8, md: 2 } }}>
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                             <Paper variant="outlined" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, overflow: 'hidden' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexShrink: 0 }}>
                                    <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>{chat.title}</Typography>
                                    <Tooltip title={isPanelOpen ? "Đóng bảng Phân tích" : "Mở bảng Phân tích"}>
                                        <IconButton onClick={() => setPanelOpen(!isPanelOpen)} color={isPanelOpen ? 'primary' : 'default'}><AssessmentIcon /></IconButton>
                                    </Tooltip>
                                </Box>
                                <Box sx={{ flexGrow: 1, overflowY: 'auto', minHeight: 0 }}>
                                    <ChatMessageList 
                                        messages={messages} 
                                        isLoading={isLoading}
                                        isVisualizing={isVisualizing}
                                        onVisualize={handleVisualize}
                                        onExampleClick={handleExampleClick}
                                    />
                                    <div ref={chatEndRef} />
                                </Box>
                                <Box sx={{ flexShrink: 0, pt: 1 }}>
                                    {isVisualizing && (
                                         <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1, mt: 1 }}>
                                            <CircularProgress size={24} />
                                            <Typography variant="body2" color="text.secondary">{loadingMessage}</Typography>
                                        </Stack>
                                    )}
                                    {error && <Alert severity="error" onClose={() => setError('')} sx={{mt: 1, whiteSpace: 'pre-wrap'}}>{error}</Alert>}
                                    <ChatInput input={input} setInput={setInput} handleSend={handleSend} isLoading={!!loadingMessage} />
                                </Box>
                            </Paper>
                        </Box>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, width: isPanelOpen ? `${ANALYSIS_PANEL_WIDTH}px` : '0px', flexShrink: 0, transition: 'width 0.3s ease-in-out', overflow: 'hidden' }}>
                            <AnalysisPanel analyses={chat.analyses || []} currentAnalysis={currentAnalysis} onSelectAnalysis={setCurrentAnalysisId} onNavigateToDashboard={() => { router.push('/visualize'); }} isOpen={isPanelOpen} onClose={() => setPanelOpen(false)} />
                        </Box>
                    </Box>
                </Box>
            </Box>
             <Drawer anchor="right" open={!isMdUp && isPanelOpen} onClose={() => setPanelOpen(false)}>
                <Box sx={{ width: '85vw', maxWidth: ANALYSIS_PANEL_WIDTH, height: '100%'}}>
                     <AnalysisPanel analyses={chat.analyses || []} currentAnalysis={currentAnalysis} onSelectAnalysis={setCurrentAnalysisId} onNavigateToDashboard={() => { router.push('/visualize'); }} isOpen={isPanelOpen} onClose={() => setPanelOpen(false)} />
                </Box>
            </Drawer>
        </AppTheme>
    );
}