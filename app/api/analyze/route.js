import { connectDB } from "@/lib/connectDB";
import FoodTrackModel from "@/schema/track";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB();
    const { base64Image } = await req.json();
    if (!base64Image) {
        return NextResponse.json({ message: "image missing" }, { status: 400 });
    }
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const result = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite-preview",
            contents: [
                {
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: base64Image,  // use directly, no fetching needed
                    },
                },
                {
                    text: `
You are a professional nutritionist AI. Analyze the food image and return ONLY a valid JSON array. No explanation, no markdown, no extra text — only raw JSON.

RULES:
- Food will mostly be Indian cuisine.
- If multiple items are on one plate (roti + sabzi + rice), treat as ONE combined dish.
- Estimate values realistically. Do NOT overestimate.
- Every single field must be present. No field should be missing.
- Return only the JSON array. Nothing else.

OUTPUT FORMAT:
[
  {
    "name": "string (if multiple items like roti sabzi rice → name it 'Roti Sabzi & Rice'. If a unique dish like Pav Bhaji, Samosa → use its proper name)",
    
    "foodType": "string (classify the food into EXACTLY one of these categories only: Healthy | Junk | Snack | Meal | Beverage | Sweet | High Protein | Fast Food)",
    
    "isProcessed": boolean (true if packaged/ultra-processed, false if homemade/natural),
    
    "items": [
      {
        "itemName": "string (each visible component separately e.g. roti, sabzi, rice. If single item like milk → only one entry)",
        "itemWeight_g": number (approximate weight in grams, number only, no unit)
      }
    ],
    
    "nutrition": {
      "calories_kcal": number (total combined calories, number only),
      "protein_g": number (total combined protein, number only),
      "carbs_g": number (total combined carbs, number only),
      "fat_g": number (total combined fat, number only),
      "fiber_g": number (total combined fiber, number only),
      "sugar_g": number (total combined sugar, number only)
    },
    
    "vitamins": [
      {
        "name": "string (vitamin name e.g. Vitamin C, Vitamin B12)",
        "amount_mg": number (amount in mg, number only)
      }
    ],
    
    "healthRating": number (0 to 5, based on nutritional quality),
    
    "tags": ["string (relevant health tags e.g. #HighProtein #LowCarb #JunkFood #GoodForGut)"],
    
    "shouldHaveMore": "yes/no/enough (target: teenage skinny-fat male. yes = eat more, enough = ideal portion, no = avoid or limit)",
    
    "confidence": number (0 to 1, how confident you are in your estimates)
  }
]
                    `,
                },
            ],
        });

        let raw = "";
        for (const part of result.candidates[0].content.parts) {
            if (part.text) raw += part.text;
        }

        // strip markdown code blocks if Gemini wraps in ```json
        const cleaned = raw.replace(/```json|```/g, "").trim();

        // parse to real JSON
        const analysis = JSON.parse(cleaned);

        const track = new FoodTrackModel({ data: analysis });
        await track.save();

        return NextResponse.json({ analysis, track });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}