// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Hàm helper để cấu hình client AI (giữ nguyên từ các file khác)
const getAiClient = () => {
    const supplier = process.env.GPT_SUPPLIER;

    if (supplier === 'GEMINI') {
        if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");
        return {
            client: new OpenAI({
                apiKey: process.env.GEMINI_API_KEY,
                baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
            }),
            model: process.env.GEMINI_MODEL_USING || "gemini-pro"
        };
    }

    // Mặc định là OpenRouter
    if (!process.env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not configured");
    return {
        client: new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        }),
        model: process.env.OPENROUTER_MODEL_USING || 'mistralai/mistral-7b-instruct:free'
    };
};

// Tối ưu cho Vercel/Next.js streaming
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    // --- FIX: Đọc đúng key 'messages' từ body, giải quyết lỗi gốc ---
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      // Trả về lỗi 400 Bad Request nếu messages không hợp lệ
      return NextResponse.json({ error: "Invalid or empty 'messages' array provided in the request body." }, { status: 400 });
    }
    
    const { client: aiClient, model } = getAiClient();

    // Prompt hệ thống hướng dẫn AI cách hành xử như một trợ lý phân tích
    const systemPrompt = `
      You are a Marxist Political Economy Analyst Assistant. Your role is to analyze the impact of AI adoption on labor and capital.
      RULES:
      1.  Always respond in Vietnamese.
      2.  If the user provides a scenario, first ask for clarifying numbers for Constant Capital (C) and Variable Capital (V), for both "before AI" and "after AI" situations.
      3.  Once the user confirms the numbers, you MUST perform these steps in a single response:
          a.  Start with a confirmation like "Tuyệt vời! Với các dữ liệu bạn đã xác nhận, tôi sẽ tiến hành phân tích."
          b.  CRITICAL STEP: Immediately after, explicitly summarize the key figures in a clear, easy-to-parse format. Example: "Dữ liệu tóm tắt:\\n- Trước AI: C = 70, V = 600\\n- Sau AI: C = 82, V = 120"
          c.  Provide a brief Marxist analysis based on these numbers.
      4.  If your analysis includes numerical data for C and V, ALWAYS end your entire message with the exact phrase: "Bạn có muốn tôi vẽ biểu đồ trực quan cho phân tích này không?"
      5.  If this is the VERY FIRST user message in the conversation, generate a short, relevant title (max 5 words) for the chat and put it at the very beginning of your response, like this: "TITLE: Phân tích Nhà máy Robot\\n\\n... (rest of your response)".
    `;

    // Gửi prompt hệ thống cùng với lịch sử tin nhắn và yêu cầu streaming
    const responseStream = await aiClient.chat.completions.create({
        model: model,
        messages: [
            { role: "system", content: systemPrompt },
            ...messages
        ],
        stream: true, // Bật chế độ streaming
    });
    
    // Tạo một ReadableStream để gửi về cho client
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        // Lặp qua từng chunk dữ liệu từ AI
        for await (const chunk of responseStream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            // Gửi chunk đã được mã hóa vào stream
            controller.enqueue(encoder.encode(content));
          }
        }
        // Đóng stream khi không còn dữ liệu
        controller.close();
      },
    });

    // Trả về một Response với stream làm body
    return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    const errorMessage = error.message || "An unknown error occurred";
    // Trả về lỗi 500 Internal Server Error
    return NextResponse.json({ error: `Lỗi từ API Chat: ${errorMessage}` }, { status: 500 });
  }
}