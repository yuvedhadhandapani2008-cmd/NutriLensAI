# Gemini model not found error
_Exported on 5/26/2026 at 21:18:19 GMT+5:30 from Cursor (3.5.33)_

---

**User**

resolve this now immediately 

---

**Cursor**

The Gemini API is returning 404 because `gemini-1.5-flash-latest` isn't valid for that endpoint. I'll check your Gemini service config and update it to a supported model.


Past fixes used `gemini-2.5-flash`; the service still points at the retired model. Verifying which models work with your API key, then updating the config.


Updating `gemini.js`: replacing the retired model, adding the missing `getErrorMessage` export, and accepting `mimeType` from HomeScreen.


**Fixed.** The 404 came from calling retired model `gemini-1.5-flash-latest`.

### What changed
`services/gemini.js` now:
- Uses **`gemini-2.5-flash-lite`** first, with fallbacks to `gemini-2.5-flash` and `gemini-2.0-flash`
- Exports **`getErrorMessage`** (required by `HomeScreen.js`)
- Accepts **`mimeType`** from the image picker
- Uses **`fetch`** instead of axios (more reliable in React Native)
- **Throws** real errors so you get useful alerts instead of a silent failure

Verified: `gemini-2.5-flash-lite` responds successfully with your API key.

### Restart the app
Expo may still be serving cached code. Run:

```bash
npx expo start -c
```

Then reload the app on your phone and scan a meal again. Analysis should work now.

