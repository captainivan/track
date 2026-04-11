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

    const MODELS = ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.5-flash-lite"];
    const prompt = `You are an expert AI nutritionist specializing in Indian cuisine analysis.

Analyze the given food image${safeText ? ` and consider this user note: "${safeText}"` : ""}.

STRICT INSTRUCTIONS:
- Return ONLY a valid JSON array.
- DO NOT include markdown, explanations, or extra text.
- Output must be directly parseable JSON.
- If unsure, make realistic assumptions based on common Indian food portions.

FOOD INTERPRETATION RULES:
- If multiple food items are served together on one plate → treat them as ONE combined dish.
- If clearly separate items (e.g., drink + meal), still combine into one structured output.
- Estimate portion sizes in grams realistically.
- Assume standard Indian serving sizes if unclear.

CLASSIFICATION RULES:
- "foodType" MUST be one of:
  "Healthy", "Junk", "Snack", "Meal", "Beverage", "Sweet", "High Protein", "Fast Food"

- "isProcessed":
  true → packaged / refined / deep fried / junk
  false → fresh / homemade / natural

NUTRITION RULES:
- Values must be realistic and internally consistent.
- Calories must align with macros:
  calories ≈ (protein*4 + carbs*4 + fat*9)
- Fiber and sugar must not exceed carbs.
- Avoid extreme or impossible numbers.

VITAMINS RULE:
- Include 2–5 relevant vitamins.
- Use realistic mg values (small numbers).

HEALTH RATING:
- MUST be an INTEGER strictly between 1 and 5.
- Allowed values ONLY: 1, 2, 3, 4, 5
- DO NOT use decimals, fractions, or values outside this range.

Meaning:
1 = very unhealthy
2 = unhealthy
3 = average
4 = healthy
5 = very healthy

- If unsure, choose the closest valid integer.
- NEVER output a value less than 1 or greater than 5.

TAGS RULE:
- Tags MUST be lowercase hashtags.
- Example: ["#highprotein", "#indianfood", "#homemade", "#lowfat"]
- Minimum 3 tags, maximum 6.

TIP:
- Provide a short, specific, and actionable dietary suggestion based on the meal
- Max 20 words
- use simple words and easy to undersatnd
- Focus on improvement (e.g., reduce, add, replace, balance)
- Avoid generic advice

Examples:
- "Reduce oil, add more vegetables"
- "Increase protein, limit refined carbs"
- "Swap fried items for grilled alternatives"

"shouldHaveMore":
- "yes" → nutritionally insufficient / too little food
- "no" → excessive or unhealthy quantity
- "enough" → balanced portion

CONFIDENCE:
- Value between 0 and 1 (e.g., 0.85)
- Lower if unclear or ambiguous image

OUTPUT FORMAT:
[
  {
    "name": "string",
    "foodType": "Healthy | Junk | Snack | Meal | Beverage | Sweet | High Protein | Fast Food",
    "isProcessed": boolean,
    "items": [
      { 
    "itemName": "string", 
    "itemWeight_g": number, 
    "itemCalories_kcal": number, 
    "itemProtein_g": number, 
    "itemCarbs_g": number, 
    "itemFat_g": number, 
    "itemFiber_g": number, 
    "itemSugar_g": number 
    }
    ],
    "nutrition": {
      "calories_kcal": number,
      "protein_g": number,
      "carbs_g": number,
      "fat_g": number,
      "fiber_g": number,
      "sugar_g": number
    },
    "vitamins": [
      { "name": "string", "amount_mg": number }
    ],
    "healthRating": number,
    "tags": ["#example"],
    "tip": "string",
    "shouldHaveMore": "yes | no | enough",
    "confidence": number
  }
]`;

    let raw = null;
    let lastError = null;

    for (let i = 0; i < MODELS.length; i++) {
      try {
        const result = await ai.models.generateContent({
          model: MODELS[i],
          generationConfig: { responseMimeType: "application/json" },
          contents: [
            { inlineData: { mimeType, data: base64Image } },
            { text: prompt },
          ],
        });

        raw = result?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text ?? "")
          .join("");

        if (raw) {
          console.log(`✅ Success with model: ${MODELS[i]}`);
          break;
        }

      } catch (modelError) {
        lastError = modelError;
        console.warn(`⚠️ Model ${MODELS[i]} failed: ${modelError.message}`);
      }
    }

    if (!raw) {
      throw new Error(`All models failed. Last error: ${lastError?.message}`);
    }

    const match = raw.replace(/```json|```/g, "").trim().match(/\[\s*{[\s\S]*}\s*\]/);
    if (!match) throw new Error("Invalid JSON format from Gemini");

    const analysis = JSON.parse(match[0]);
    if (!Array.isArray(analysis) || analysis.length === 0) throw new Error("Empty analysis");

    const track = await FoodTrackModel.create({ data: analysis });
    return NextResponse.json({ message: "success", analysis, track });

  } catch (error) {
    console.error("Final error:", error.message);
    return NextResponse.json({ message: "failure", error: error.message }, { status: 500 });
  }
}