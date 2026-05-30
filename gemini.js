import {
  getGeminiApiKey,
  isGeminiConfigured,
} from "./config/apiKeys";

const ANALYSIS_FORMAT = `Analyze this food image carefully.

Return ONLY in this exact structured format. Do not use markdown, bullet symbols other than •, or extra sections.

MEAL NAME:
(name)

MEAL TYPE:
Breakfast/Lunch/Snacks/Dinner/Dessert

FOODS DETECTED:
• item
• item
• item

--------------------------------

INGREDIENT-WISE NUTRITION BREAKDOWN

Ingredient: ___

Calories: ___ kcal
Protein: ___ g
Carbs: ___ g
Fats: ___ g
Fiber: ___ g
Sugar: ___ g
Sodium: ___ mg

Vitamins:
- ___
- ___

Minerals:
- ___
- ___

--------------------------------

Ingredient: ___

Calories: ___ kcal
Protein: ___ g
Carbs: ___ g
Fats: ___ g
Fiber: ___ g
Sugar: ___ g
Sodium: ___ mg

Vitamins:
- ___

Minerals:
- ___

--------------------------------

OVERALL NUTRITION TOTALS

Total Overall Calories: ___ kcal
Total Protein: ___ g
Total Carbs: ___ g
Total Fat: ___ g
Total Fiber: ___ g
Total Sugar: ___ g
Total Sodium: ___ mg

--------------------------------

HEALTH SCORE:
__/10

GYM RECOMMENDATION:
(short recommendation)

DIET RECOMMENDATION:
(short recommendation)

HYDRATION RECOMMENDATION:
Drink ___ ml water

FINAL SUMMARY:
(short summary)`;

function buildAnalysisPrompt(userProfile) {
  let prompt = ANALYSIS_FORMAT;

  if (userProfile) {
    prompt += `

Personalize only GYM RECOMMENDATION and DIET RECOMMENDATION for goal "${userProfile.goal || "Maintenance"}", weight ${userProfile.weight || "—"}kg, BMI ${userProfile.bmi || "—"}. Keep every section header and line exactly as shown above.`;
  }

  return prompt;
}

function hasRequiredSections(text) {
  const required = [
    "MEAL NAME:",
    "MEAL TYPE:",
    "FOODS DETECTED:",
    "INGREDIENT-WISE NUTRITION BREAKDOWN",
    "OVERALL NUTRITION TOTALS",
    "Total Overall Calories:",
    "HEALTH SCORE:",
    "GYM RECOMMENDATION:",
    "DIET RECOMMENDATION:",
    "FINAL SUMMARY:",
  ];
  const upper = text.toUpperCase();
  return required.every((section) =>
    upper.includes(section.toUpperCase())
  );
}

export const analyzeFoodImage = async (
  base64Image,
  userProfile
) => {
  const apiKey = getGeminiApiKey();

  if (!isGeminiConfigured()) {
    throw new Error(
      "Gemini API key not loaded in the app. Add EXPO_PUBLIC_GEMINI_API_KEY to .env, then stop Expo and run: npx expo start -c"
    );
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text:
                "You are a nutrition analyst. Always reply using the exact section headers and order given in the user prompt. Never use markdown code blocks. Never omit INGREDIENT-WISE NUTRITION BREAKDOWN or OVERALL NUTRITION TOTALS.",
            },
          ],
        },
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image,
                },
              },
              {
                text: buildAnalysisPrompt(userProfile),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192,
        },
      }),
    }
  );

  const data = await response.json();

  console.log(
    "Gemini Response:",
    JSON.stringify(data, null, 2)
  );

  if (data?.error) {
    const msg = data.error.message || "";
    if (
      msg.includes("quota") ||
      msg.includes("Quota")
    ) {
      throw new Error(
        "Gemini free tier limit reached. Wait a minute and try again, or enable billing in Google AI Studio."
      );
    }
    if (
      msg.includes("API key") ||
      msg.includes("API_KEY")
    ) {
      throw new Error(
        "Gemini API key not loaded. Stop Expo, run: npx expo start -c, then scan again."
      );
    }
    throw new Error(
      msg || "Gemini API request failed."
    );
  }

  const result =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!result) {
    throw new Error(
      "Gemini returned no analysis. Try again with a clearer photo."
    );
  }

  if (!hasRequiredSections(result)) {
    throw new Error(
      "AI response was incomplete. Please scan again — ensure Gemini API key is valid and the photo shows the full meal."
    );
  }

  return result.trim();
};
