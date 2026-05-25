const API_KEY =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
  "AIzaSyA_4SLVZiKCAzGsD8b2M1aWTG3UeNXiHpY";

const MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
];

const PROMPT = `Analyze this food image carefully.

Identify ALL foods visible.

For EACH food give:
- Food name
- Calories
- Protein
- Carbs
- Fat

Then give:
TOTAL NUTRITION

Keep the response short and clean.`;

function normalizeBase64(data) {
  if (!data || typeof data !== "string") {
    return null;
  }
  const comma = data.indexOf(",");
  if (data.startsWith("data:") && comma !== -1) {
    return data.slice(comma + 1);
  }
  return data.replace(/\s/g, "");
}

function getErrorMessage(error) {
  if (typeof error === "string") {
    return error;
  }

  const apiError = error?.apiError;

  if (apiError?.message) {
    if (apiError.status === "RESOURCE_EXHAUSTED") {
      return "Gemini API quota exceeded. Try again in a minute or use a new API key at ai.google.dev.";
    }
    if (apiError.status === "NOT_FOUND") {
      return "Gemini model not available. Update the app.";
    }
    return apiError.message;
  }

  if (error?.message === "Network request failed") {
    return "Network error. Check your internet connection.";
  }

  return error?.message || "Unknown error";
}

async function callGemini(model, base64Image, mimeType) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const err = new Error(data?.error?.message || `HTTP ${response.status}`);
    err.apiError = data?.error;
    throw err;
  }

  const candidate = data.candidates?.[0];

  if (!candidate) {
    const err = new Error(
      data.promptFeedback?.blockReason
        ? `Blocked by safety filter: ${data.promptFeedback.blockReason}`
        : "No response from Gemini."
    );
    throw err;
  }

  if (candidate.finishReason && candidate.finishReason !== "STOP") {
    const err = new Error(`Response blocked: ${candidate.finishReason}`);
    throw err;
  }

  const text = candidate.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join("\n");

  if (!text) {
    throw new Error("Gemini returned empty text.");
  }

  return text;
}

export const analyzeFoodImage = async (
  base64Image,
  mimeType = "image/jpeg"
) => {
  if (!API_KEY) {
    throw new Error(
      "Missing API key. Add EXPO_PUBLIC_GEMINI_API_KEY to your .env file."
    );
  }

  const imageData = normalizeBase64(base64Image);

  if (!imageData) {
    throw new Error("Could not read image data. Try selecting the photo again.");
  }

  let lastError = null;

  for (const model of MODELS) {
    try {
      return await callGemini(model, imageData, mimeType);
    } catch (error) {
      lastError = error;
      const status = error.apiError?.status;
      if (status === "NOT_FOUND") {
        continue;
      }
      if (status === "RESOURCE_EXHAUSTED") {
        continue;
      }
      throw error;
    }
  }

  throw lastError || new Error("All Gemini models failed.");
};

export { getErrorMessage };
