import { connectDB } from "@/lib/connectDB";
import FoodTrackModel from "@/schema/track";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const { base64Image, text = "", mimeType = "image/jpeg" } = await req.json();

    if (!base64Image) {
      return NextResponse.json({ message: "image missing" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const safeText = text.replace(/[`$]/g, "");

    const result = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      generationConfig: { responseMimeType: "application/json" },
      contents: [
        { inlineData: { mimeType, data: base64Image } },
        {
          text: `You are a professional nutritionist AI. Analyze the food image${safeText ? ` and consider this note: '${safeText}'` : ""}.
Return ONLY a valid JSON array. No explanation, no markdown, no extra text.
RULES:
- Food will mostly be Indian cuisine.
- If multiple items are on one plate → treat as ONE combined dish.
- Estimate values realistically.
- Every field must be present.
OUTPUT FORMAT:
[{
  "name": "string",
  "foodType": "Healthy | Junk | Snack | Meal | Beverage | Sweet | High Protein | Fast Food",
  "isProcessed": boolean,
  "items": [{ "itemName": "string", "itemWeight_g": number }],
  "nutrition": {
    "calories_kcal": number, "protein_g": number, "carbs_g": number,
    "fat_g": number, "fiber_g": number, "sugar_g": number
  },
  "vitamins": [{ "name": "string", "amount_mg": number }],
  "healthRating": number,
  "tags": ["string"],
  "shouldHaveMore": "yes | no | enough",
  "confidence": number
}]`,
        },
      ],
    });

    const raw = result?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("");

    if (!raw) throw new Error("Empty Gemini response");

    const match = raw.replace(/```json|```/g, "").trim().match(/\[\s*{[\s\S]*}\s*\]/);
    if (!match) throw new Error("Invalid JSON format from Gemini");

    const analysis = JSON.parse(match[0]);
    if (!Array.isArray(analysis) || analysis.length === 0) throw new Error("Empty analysis");

    const track = await FoodTrackModel.create({ data: analysis });

    return NextResponse.json({ message: "success", analysis, track });
  } catch (error) {
    console.error("Gemini error:", error.message);
    return NextResponse.json({ message: "failure", error: error.message }, { status: 500 });
  }
}