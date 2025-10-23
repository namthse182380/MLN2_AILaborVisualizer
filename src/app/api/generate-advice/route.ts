// src/app/api/generate-advice/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Hàm getAiClient giữ nguyên...
const getAiClient = () => {
    const supplier = process.env.GPT_SUPPLIER;
    if (supplier === 'GEMINI') {
        if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");
        return {
            client: new OpenAI({ apiKey: process.env.GEMINI_API_KEY, baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/" }),
            model: process.env.GEMINI_MODEL_USING || "gemini-1.5-flash-latest"
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
  let lastContentBeforeParse = ''; 

  try {
    const analysisData = await request.json();
    const { client: aiClient, model } = getAiClient();

    // --- PROMPT TỐI ƯU HÓA CUỐI CÙNG ---
    const masterPrompt = `
      ### YOUR PERSONA
      You are a world-class strategist and storyteller. You are not a robot. You are an empathetic mentor talking to a client about a pivotal moment in their business. Your tone is wise, insightful, and deeply human. Your language is rich and evocative.

      ### YOUR TASK
      Analyze the client's data and produce a single, valid JSON object. This object will contain a long-form narrative analysis ('adviceText') and an array of data visualizations ('suggestedCharts') that illustrate a positive future roadmap.

      ### CLIENT'S DATA
      ${JSON.stringify(analysisData, null, 2)}

      ### THE STORY YOU MUST TELL (for 'adviceText')
      Write a long, flowing essay in Vietnamese. Use Markdown for paragraphs, bold, and italics. Structure your story in this narrative arc:
      1.  **The Mirror:** Start by reflecting their data back to them in a personal way. "Nhìn vào những con số của bạn..." Show them the clear financial victory, the strategic brilliance of optimizing costs.
      2.  **The Crossroads:** Gently pivot to the human story. "Nhưng chúng ta đều biết, đây không chỉ là câu chuyện về những con số..." Discuss the social challenges and the profound responsibility that comes with this newfound power. Frame it as a critical choice between short-term profit and long-term legacy.
      3.  **The Visionary's Roadmap:** This is the heart of your analysis. Propose a detailed, multi-phase plan for the future. Be inspiring. For example: "Phase 1: The Human Bridge (Hỗ trợ & Chuyển đổi)", "Phase 2: The Growth Engine (Tái đầu tư & Nâng cao năng lực)", "Phase 3: The Legacy Project (Dẫn đầu & Tạo tác động)". Flesh out each phase with concrete, actionable ideas.
      4.  **The Deeper 'Why':** As a final thought, briefly connect their journey to the timeless principles of political economy (MLN). Frame it as a fascinating lens to understand the deep forces at play, like the rising organic composition of capital and the resulting pressures on the rate of profit.

      ### CRITICAL FINAL RULES
      - Your entire output MUST be a single, valid JSON object. No extra text or comments.
      - The 'adviceText' field must be a correctly escaped JSON string. All special characters (quotes, backslashes, newlines) must be properly escaped.
      - The 'suggestedCharts' must be an array of objects, each with a 'type' that exactly matches the required strings.
      - Follow the EXACT JSON structure shown in the example below.

      ### COMPLETE OUTPUT EXAMPLE
      {
        "adviceText": "Chào bạn,\\n\\nNhìn vào những con số bạn cung cấp, tôi thấy một bức tranh vừa ấn tượng, vừa đầy thách thức... Đây là một bước đi táo bạo, và về mặt tài chính, đó là một quyết định chiến lược xuất sắc. Bạn đã giảm đáng kể chi phí cho 'lao động sống' (Tư bản khả biến V) từ ${analysisData.after.v} xuống còn ${analysisData.before.v}, một sự tối ưu hóa đáng kinh ngạc.\\n\\nNhưng chúng ta đều biết, đây không chỉ là câu chuyện về những con số, phải không?...",
        "suggestedCharts": [
          {
            "type": "pie",
            "title": "Phân bổ 'Quỹ Chuyển đổi Lao động'",
            "description": "Đề xuất sử dụng một phần giá trị thặng dư cho giai đoạn đầu.",
            "data": [
              { "id": 0, "value": 50, "label": "Hỗ trợ thôi việc" },
              { "id": 1, "value": 30, "label": "Đào tạo lại kỹ năng" },
              { "id": 2, "value": 20, "label": "Hỗ trợ tìm việc mới" }
            ]
          },
          {
            "type": "investment_bar",
            "title": "Tái đầu tư: Con người vs. Máy móc",
            "description": "So sánh chi phí đầu tư trong kịch bản tương lai.",
            "data": [
              { "category": "Nâng cao NL con người", "value": 150 },
              { "category": "Bảo trì & Nâng cấp AI", "value": 50 }
            ]
          },
          {
            "type": "value_distribution",
            "title": "Phân phối Tổng Giá trị",
            "description": "So sánh sự phân bổ giá trị giữa kịch bản hiện tại và tương lai.",
            "data": [
              { "scenario": "Hiện tại (Sau AI)", "Tư bản (C)": ${analysisData.after.c}, "Lao động (V)": ${analysisData.after.v}, "Tích lũy (M)": ${analysisData.after.m} },
              { "scenario": "Tương lai Thịnh vượng", "Tư bản (C)": ${analysisData.after.c}, "Lao động (V)": ${analysisData.after.v * 1.2}, "Tái đầu tư XH": ${analysisData.after.m * 0.4}, "Lợi nhuận": ${analysisData.after.m * 0.6} }
            ]
          }
        ]
      }
    `;

    // Logic thử lại và ghi log chi tiết khi lỗi
    for (let i = 0; i < MAX_RETRIES; i++) {
        let content = '';
        try {
            const response = await aiClient.chat.completions.create({ model, messages: [{ role: "user", content: masterPrompt }], response_format: { type: "json_object" } });
            content = response.choices[0].message?.content || '';
            if (!content) throw new Error("AI returned empty content.");

            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch && jsonMatch[0]) {
                content = jsonMatch[0];
            }
            
            lastContentBeforeParse = content;
            const parsedJson = JSON.parse(content);

            if (parsedJson.adviceText && Array.isArray(parsedJson.suggestedCharts)) {
                if (parsedJson.suggestedCharts.every((chart: any) => chart.type)) {
                    return NextResponse.json(parsedJson);
                }
            }
            throw new Error("Parsed JSON is missing required fields or has wrong structure.");
        } catch (error) {
            console.error(`Generate Advice Attempt ${i + 1} failed:`, error);
            if (i === MAX_RETRIES - 1) throw error;
        }
    }
    throw new Error("Failed to generate advice from AI after multiple attempts.");

  } catch (error: any) {
    console.error("Generate Advice API Route FINAL Error:", error);
    if (error instanceof SyntaxError && lastContentBeforeParse) {
        console.error("--- CONTENT THAT FAILED TO PARSE ---");
        console.error(lastContentBeforeParse);
        console.error("------------------------------------");
    }
    const errorMessage = error.response ? `${error.status} ${await error.response.text()}` : error.message;
    return NextResponse.json({ error: `Lỗi từ AI provider: ${errorMessage}` }, { status: 500 });
  }
}