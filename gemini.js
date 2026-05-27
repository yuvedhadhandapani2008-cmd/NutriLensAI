const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

const MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
];

const PROMPT = `You are an advanced AI nutritionist and fitness coach.

Analyze this food image in detail.

Identify:
- all visible foods
- desserts
- sweets
- drinks
- sauces
- ingredients

Estimate:
- serving quantity in grams
- portion size
- ingredient quantities

For EACH food item provide:
- calories
- protein
- carbs
- fats
- fiber
- sugar
- sodium

Also provide:
- vitamins
- minerals
- micronutrients

Then provide:
1. Total overall calories
2. Total protein
3. Total carbs
4. Total fat

Then provide:
- whether this meal is healthy
- whether it is good for muscle gain
- whether it is good for weight loss
- gym/diet recommendation

Return response in clean sections.

Support:
- Indian foods
- desserts
- sweets
- fast food
- beverages
- mixed plates
- restaurant meals
- homemade meals`;

function cleanBase64(data) {
  if (!data) return "";
  const match = data.match(/^data:image\/[^;]+;base64,(.+)$/);
  const raw = match ? match[1] : data;
  return raw.replace(/\s/g, "");
}

export function getErrorMessage(error) {
  const apiMessage = error?.response?.data?.error?.message;
  if (apiMessage) return apiMessage;
  if (error?.message) return error.message;
  return "AI nutrition analysis failed.";
}

async function callGemini(model, base64Image, mimeType) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: PROMPT },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const err = new Error(data?.error?.message || `Gemini API error (${response.status})`);
    err.response = { data };
    throw err;
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text;
}

export const analyzeFoodImage = async (base64Image, mimeType = "image/jpeg") => {
  if (!API_KEY) {
    throw new Error(
      "Missing EXPO_PUBLIC_GEMINI_API_KEY. Add it to .env and restart Expo with: npx expo start -c"
    );
  }

  const imageData = cleanBase64(base64Image);
  if (!imageData) {
    throw new Error("No image data to analyze.");
  }

  console.log("STARTING GEMINI FOOD ANALYSIS");

  let lastError;

  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      const result = await callGemini(model, imageData, mimeType);

      if (result) {
        console.log("GEMINI SUCCESS");
        return result;
      }
    } catch (error) {
      lastError = error;
      console.log(`Model ${model} failed:`, error.response?.data || error.message);

      const status = error.response?.data?.error?.status;
      if (status === "NOT_FOUND") continue;
      if (status === "RESOURCE_EXHAUSTED") continue;
    }
  }

  console.log("FULL GEMINI ERROR:", lastError?.response?.data || lastError?.message);
  throw lastError || new Error("AI nutrition analysis failed.");
};
