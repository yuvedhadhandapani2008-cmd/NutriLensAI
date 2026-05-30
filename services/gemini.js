import Constants from "expo-constants";

const GEMINI_API_KEY =
  Constants.expoConfig?.extra
    ?.geminiApiKey;

export const analyzeFoodImage =
  async (
    base64Image,
    userProfile
  ) => {
    try {
      let response;

      for (
        let i = 0;
        i < 3;
        i++
      ) {
        response =
          await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `
Analyze this food image carefully.

User Goal:
${userProfile?.goal || "Muscle Gain"}

Weight:
${userProfile?.weight || 70} kg

Height:
${userProfile?.height || 170} cm

BMI:
${userProfile?.bmi || 24}

Return ONLY in this exact format.

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

Minerals:
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
(short summary)
`,
                      },

                      {
                        inline_data: {
                          mime_type:
                            "image/jpeg",

                          data: base64Image,
                        },
                      },
                    ],
                  },
                ],
              }),
            }
          );

        const tempData =
          await response.json();

        if (
          !tempData.error
        ) {
          response = {
            json:
              async () =>
                tempData,
          };

          break;
        }

        console.log(
          "Retrying Gemini..."
        );

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              2000
            )
        );
      }

      const data =
        await response.json();

      if (data.error) {
        throw new Error(
          data.error.message
        );
      }

      console.log(
        "Gemini Response:",
        JSON.stringify(
          data,
          null,
          2
        )
      );

      const result =
        data?.candidates?.[0]
          ?.content?.parts?.[0]
          ?.text;

      if (!result) {
        return `
MEAL NAME:
Unknown Meal

MEAL TYPE:
Snacks

FOODS DETECTED:
• Unknown Food

--------------------------------

OVERALL NUTRITION TOTALS

Total Overall Calories: 0 kcal
Total Protein: 0 g
Total Carbs: 0 g
Total Fat: 0 g

--------------------------------

HEALTH SCORE:
0/10

GYM RECOMMENDATION:
Unable to analyze meal.

DIET RECOMMENDATION:
Please try another image.

HYDRATION RECOMMENDATION:
Drink 500 ml water

FINAL SUMMARY:
AI could not analyze the image properly.
`;
      }

      return result;
    } catch (error) {
      console.log(
        "Gemini Error:",
        error
      );

      return `
MEAL NAME:
Unknown Meal

MEAL TYPE:
Snacks

FOODS DETECTED:
• Unknown Food

--------------------------------

OVERALL NUTRITION TOTALS

Total Overall Calories: 0 kcal
Total Protein: 0 g
Total Carbs: 0 g
Total Fat: 0 g

--------------------------------

HEALTH SCORE:
0/10

GYM RECOMMENDATION:
AI analysis failed.

DIET RECOMMENDATION:
Please try again later.

HYDRATION RECOMMENDATION:
Drink 500 ml water

FINAL SUMMARY:
Something went wrong during AI analysis.
`;
    }
  };