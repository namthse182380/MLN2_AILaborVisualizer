// src/app/api/openrouter/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Hàm helper để cấu hình client AI (ĐÃ SỬA LỖI THEO ĐÚNG TÀI LIỆU)
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


export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    const { client: aiClient, model } = getAiClient();

    const fullPrompt = `${prompt}\n\nHãy trả về dưới dạng Markdown đẹp, có đánh số các câu.`;
    const startTime = performance.now();
    
    const response = await aiClient.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: fullPrompt }]
    });

    const textResponse = response.choices[0].message?.content;
    if (!textResponse) {
        throw new Error("Invalid response structure from AI.");
    }

    const cleanedResponse = textResponse.replace(/<s>|<\/s>|\[BOS\]|\[EOS\]/g, '').trim();
    const endTime = performance.now();

    return NextResponse.json({ text: cleanedResponse, timeMs: endTime - startTime });

  } catch (error: any) {
    console.error("Lab API Error:", error);
    const errorMessage = error.response ? `${error.status} ${await error.response.text()}` : error.message;
    return NextResponse.json({ error: `Lỗi từ AI provider: ${errorMessage}` }, { status: 500 });
  }
}