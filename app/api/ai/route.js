import { GoogleGenAI } from "@google/genai";

export async function POST() {
    try {
        console.log("starting------------");

        const imageUrl = "https://static.toiimg.com/thumb/msid-121340289,width-1280,height-720,resizemode-4/121340289.jpg";

        const ai = new GoogleGenAI({
            apiKey: "AIzaSyCV5It_dW7uCx1M-_7nLpBE4Z8KY8cYbhU"
        });

        // Fetch the image and convert to base64
        const imageResponse = await fetch(imageUrl);
        const imageArrayBuffer = await imageResponse.arrayBuffer();
        const base64ImageData = Buffer.from(imageArrayBuffer).toString("base64");

        const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",  // upgraded model
            contents: [
                {
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: base64ImageData,
                    },
                },
                {
                    text: "Analyze this image in detail. Describe what you see, including objects, people, colors, setting, mood, and any notable elements.",
                },
            ],
        });

        // Parse all part types from response
        let analysis = "";
        for (const part of result.candidates[0].content.parts) {
            if (part.text) analysis += part.text + "\n";
            if (part.executableCode) analysis += "Code: " + part.executableCode.code + "\n";
            if (part.codeExecutionResult) analysis += "Output: " + part.codeExecutionResult.output + "\n";
        }

        console.log("analysis :---------- ", analysis);
        

        return Response.json({ analysis });

    } catch (error) {
        console.error(error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}