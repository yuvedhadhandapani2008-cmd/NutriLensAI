require("dotenv").config();

const appJson = require("./app.json");

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      geminiApiKey:
        process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
        process.env.GEMINI_API_KEY ||
        "",
    },
  },
};
