import Constants from "expo-constants";

/**
 * Resolves Gemini key from Expo extra (app.config.js) or EXPO_PUBLIC env.
 * Read at call time so a Metro reload after .env changes can pick it up.
 */
export function getGeminiApiKey() {
  const extra =
    Constants.expoConfig?.extra ||
    Constants.manifest2?.extra?.expoClient?.extra ||
    Constants.manifest?.extra ||
    {};

  const key = String(
    extra.geminiApiKey ||
      process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
      ""
  ).trim();

  return key;
}

export function isGeminiConfigured() {
  return getGeminiApiKey().length > 20;
}
