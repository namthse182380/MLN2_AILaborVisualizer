// src/app/api/visualize/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Định nghĩa lại kiểu Message để file này hiểu
interface Message { role: 'user' | 'assistant'; content: string; }

// Hàm helper để cấu hình client AI (giữ nguyên)
const getAiClient = () => {
    const supplier = process.env.GPT_SUPPLIER;
    if (supplier === 'GEMINI') {
        if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");
        return {
            client: new OpenAI({ apiKey: process.env.GEMINI_API_KEY, baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/" }),
            model: process.env.GEMINI_MODEL_USING || "gemini-pro"
        };
    }
    if (!process.env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not configured");
    return {
        client: new OpenAI({ baseURL: "https://openrouter.ai/api/v1", apiKey: process.env.OPENROUTER_API_KEY }),
        model: process.env.OPENROUTER_MODEL_USING || 'mistralai/mistral-7b-instruct:free'
    };
};

export async function POST(request: Request) {
  const MAX_RETRIES = 2;
  try {
    const body = await request.json();
    // --- SỬA LỖI: Nhận 'messages' thay vì 'text' ---
    const messages: Message[] = body.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Invalid or empty 'messages' array provided in the request body.");
    }

    // Biến đổi mảng messages thành một chuỗi văn bản duy nhất để AI phân tích
    const conversationText = messages
      .map(msg => `${msg.role === 'user' ? 'Người dùng' : 'Trợ lý'}: ${msg.content}`)
      .join('\n---\n');

    // --- SỬA LỖI: Cập nhật prompt để xử lý hội thoại ---
    const extractionPrompt = `
      You are a data extraction API. Your task is to analyze the provided CONVERSATION HISTORY to extract numerical data.
      RULES:
      1.  READ the entire conversation to find the FINAL, CONFIRMED values for the scenario.
      2.  EXTRACT the following values for BOTH the "before AI" and "after AI" scenarios:
          - Constant Capital (C)
          - Variable Capital (V)
      3.  EXTRACT the final text-based analysis paragraph from the assistant's LAST message.
      4.  YOUR ENTIRE RESPONSE MUST BE ONLY THE JSON OBJECT. Do not include markdown or any other text.
      
      CONVERSATION HISTORY TO ANALYZE:
      ---
      ${conversationText}
      ---
      
      EXPECTED JSON OUTPUT STRUCTURE:
      {
        "before": { "c": <number>, "v": <number> },
        "after": { "c": <number>, "v": <number> },
        "analysis": "<string>"
      }
    `;
    
    const { client: aiClient, model } = getAiClient();
    
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const response = await aiClient.chat.completions.create({
                model: model,
                messages: [{ role: "user", content: extractionPrompt }],
                response_format: { type: "json_object" }
            });
            
            let content = response.choices[0].message?.content;
            if (!content) {
                throw new Error("AI returned empty content.");
            }

            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch && jsonMatch[0]) {
                content = jsonMatch[0];
            }
            
            const parsedJson = JSON.parse(content);

            if (parsedJson.before && parsedJson.after && typeof parsedJson.before.c === 'number' && typeof parsedJson.before.v === 'number') {
                return NextResponse.json(parsedJson);
            }

            throw new Error("Parsed JSON is missing required fields.");

        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i === MAX_RETRIES - 1) {
                throw error;
            }
        }
    }
    
    throw new Error("Failed to extract data from AI after multiple attempts.");

  } catch (error: any) {
    console.error("Extraction API Error:", error);
    const errorMessage = error.response ? `${error.status} ${await error.response.text()}` : error.message;
    return NextResponse.json({ error: `Lỗi từ AI provider: ${errorMessage}` }, { status: 500 });
  }
}