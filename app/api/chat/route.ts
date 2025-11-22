import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are a helpful travel assistant for Japan.
You can understand Japanese voice input (transcribed) and English text.

**Goal**: Provide a travel itinerary or advice based on the user's query and the CURRENT WEATHER (if provided).

**Rules**:
1. **Weather-Aware**: If weather data is provided, use it! 
   - If raining -> suggest indoor activities (museums, arcades, cafes).
   - If hot -> suggest light clothes, hydration, indoor/shaded spots.
   - If cold -> suggest warm clothes, hot pot (nabe), onsens.
2. **Vague Queries**: If the user's request is too vague (e.g., "Japan trip"), ask clarifying questions in the 'follow_up_questions' field instead of a full itinerary.
3. **JSON Output**: You MUST return strict JSON matching the schema below. ALL fields are required. If a field is not applicable, return an empty array or string.

**Schema**:
{
  "response": "Conversational response explaining your reasoning. Explicitly mention why these places were chosen based on the weather (e.g., 'Since it's raining, I've selected indoor spots...').",
  "recommendations": [
    { 
      "name": "Place Name", 
      "description": "Why visit here?", 
      "location": "City/Area",
      "main_points": ["Point 1", "Point 2", "Point 3"]
    }
  ],
  "location": "City/Area detected (e.g. Tokyo)",
  "clothing_tips": ["Specific clothing advice based on weather"],
  "travel_tips": ["General travel advice"],
  "summary": "MANDATORY: A concise, pretty summary of the plan.",
  "follow_up_questions": ["3 distinct follow-up options"]
}
`;

export async function POST(req: Request) {
  try {
    const { messages, language = 'en' } = await req.json();
    const lastUserMessage = messages[messages.length - 1].content;

    // Language-specific system prompts
    const SYSTEM_PROMPT_EN = `
You are a travel magazine writer and expert Japan travel assistant.

**Response Guidelines**:
- For simple questions (e.g., "Is sunscreen required?", "What's the weather?"): Use minimal JSON with just "response" field
- For travel planning (e.g., "Plan a trip", "Recommend places"): Use full detailed JSON schema below

**Minimal JSON for Simple Questions**:
{
  "response": "Your helpful answer in 2-3 sentences",
  "recommendations": [],
  "location": "",
  "summary": "",
  "follow_up_questions": []
}

**Full JSON for Travel Planning**:
{
  "response": "Warm, conversational introduction (2-3 sentences) explaining the overall plan and weather context.",
  "recommendations": [
    {
      "name": "Place Name",
      "location": "City/Area",
      "overview": "Rich 3-4 sentence description. Paint a picture. What makes this place special? What's the atmosphere?",
      "best_features": ["Feature 1 with details", "Feature 2 with details", "Feature 3 with details"],
      "insider_tips": ["Specific tip 1", "Specific tip 2", "Local secret or timing advice"],
      "weather_reasoning": "2-3 sentences explaining WHY this place is perfect for today's weather conditions.",
      "what_to_wear": ["Specific clothing item 1", "Specific clothing item 2", "Accessory or footwear advice"]
    }
  ],
  "location": "City/Area",
  "summary": "Beautiful 2-3 sentence summary of the entire day/trip. Make it inspiring and memorable.",
  "follow_up_questions": ["Thoughtful question 1", "Thoughtful question 2", "Thoughtful question 3"]
}

**Language**: ENGLISH
`;

    const SYSTEM_PROMPT_JA = `
あなたは旅行雑誌のライターであり、日本旅行の専門家です。

**応答ガイドライン**:
- 簡単な質問（例：「日焼け止めは必要ですか？」、「天気は？」）：「response」フィールドのみの最小限のJSONを使用
- 旅行プランニング（例：「旅行を計画して」、「場所を推薦して」）：以下の詳細なJSONスキーマを使用

**簡単な質問用の最小限のJSON**:
{
  "response": "2-3文での親切な回答",
  "recommendations": [],
  "location": "",
  "summary": "",
  "follow_up_questions": []
}

**旅行プランニング用の完全なJSON**:
{
  "response": "温かく会話的な導入（2-3文）。全体的なプランと天気の文脈を説明。",
  "recommendations": [
    {
      "name": "場所名",
      "location": "市/エリア",
      "overview": "豊かな3-4文の説明。絵を描くように。この場所の特別な点は？雰囲気は？",
      "best_features": ["詳細付きの特徴1", "詳細付きの特徴2", "詳細付きの特徴3"],
      "insider_tips": ["具体的なヒント1", "具体的なヒント2", "地元の秘密やタイミングのアドバイス"],
      "weather_reasoning": "この場所が今日の天気に最適な理由を2-3文で説明。",
      "what_to_wear": ["具体的な服装アイテム1", "具体的な服装アイテム2", "アクセサリーや履物のアドバイス"]
    }
  ],
  "location": "市/エリア",
  "summary": "1日/旅行全体の美しい2-3文の要約。感動的で記憶に残るように。",
  "follow_up_questions": ["思慮深い質問1", "思慮深い質問2", "思慮深い質問3"]
}

**言語**: 日本語
`;

    const SYSTEM_PROMPT = language === 'ja' ? SYSTEM_PROMPT_JA : SYSTEM_PROMPT_EN;

    // Step 1: Extract Location (Simple heuristic or LLM call)
    // For robustness, let's do a quick LLM call to extract location
    const locationCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Extract the city or region from the user's travel query. ALWAYS return the location name in ENGLISH (romanized), even if the input is in Japanese. For example: '東京' -> 'Tokyo', '京都' -> 'Kyoto', '大阪' -> 'Osaka', '北海道' -> 'Hokkaido', '沖縄' -> 'Okinawa'. Return ONLY the English city/region name, nothing else. If no location found, return 'null'." },
        { role: "user", content: lastUserMessage }
      ],
      model: "openai/gpt-oss-20b", // Better model for translation
    });
    const locationCandidate = locationCompletion.choices[0]?.message?.content?.trim();
    console.log('🔍 Location extraction:', { input: lastUserMessage, extracted: locationCandidate });

    let weatherContext = "";
    let weatherData = null;

    // Step 2: Fetch Weather if location found and not 'null'
    if (locationCandidate && locationCandidate.toLowerCase() !== 'null') {
      try {
        // Geocoding
        console.log('🌍 Geocoding location:', locationCandidate);
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationCandidate)}&count=1&language=en&format=json`);
        const geoJson = await geoRes.json();
        console.log('📍 Geocoding result:', geoJson);

        if (geoJson.results && geoJson.results.length > 0) {
          const { latitude, longitude, name } = geoJson.results[0];
          console.log('✅ Found location:', { name, latitude, longitude });

          // Weather
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`);
          const weatherJson = await weatherRes.json();
          console.log('🌤️ Weather data:', weatherJson);

          const temp = weatherJson.current.temperature_2m;
          const code = weatherJson.current.weather_code;

          // Simple code map
          let condition = "Unknown";
          if (code === 0) condition = "Clear";
          else if (code <= 3) condition = "Cloudy";
          else if (code >= 51) condition = "Rain/Snow";

          weatherContext = `Current Weather in ${name}: ${temp}°C, ${condition}.`;
          weatherData = { location: name, temperature: temp, condition };
          console.log('✅ Weather context created:', weatherContext);
        } else {
          console.log('❌ No geocoding results found for:', locationCandidate);
        }
      } catch (e) {
        console.error("Weather fetch error:", e);
      }
    }

    // Step 3: Generate Itinerary
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT + (weatherContext ? `\n\n${weatherContext}` : "") },
        ...messages
      ],
      model: "openai/gpt-oss-20b",
      response_format: { type: "json_object" }, // Keep JSON mode for structured responses
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No response");

    console.log("LLM Raw Response:", content.substring(0, 200) + "...");

    // Try to parse as JSON
    try {
      // Extract JSON if wrapped in markdown code blocks or has extra text
      let jsonContent = content.trim();

      // Remove markdown code blocks if present
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Try to find JSON object if there's extra text
      const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
      }

      const jsonResponse = JSON.parse(jsonContent);
      return NextResponse.json(jsonResponse);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.log("Failed content:", content);
      // If parsing fails, return error
      return NextResponse.json({
        response: "I apologize, but I encountered an error processing your request. Please try rephrasing your question.",
        recommendations: [],
        location: "",
        summary: "",
        follow_up_questions: []
      });
    }

  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
