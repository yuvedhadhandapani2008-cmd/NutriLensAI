# Food tracking and analysis features
_Exported on 5/29/2026 at 18:56:35 GMT+5:30 from Cursor (3.5.38)_

---

**User**

WHAT YOU SHOULD DO NOW 🔥
PRIORITY ORDER
✅ 1. REAL GOAL-BASED MACRO CALCULATIONS

MOST IMPORTANT

✅ 2. REAL RING PERCENTAGES

Makes dashboard feel premium instantly.

✅ 3. REAL WATER TRACKER

Easy and impressive.

✅ 4. REAL STREAK SYSTEM

Very valuable for scoring.
 i want proper gemini prompt to identify the food and give me all the infredients and the proteins , carbs , fats , macros of all the ingredients and also the total food proteins , carbs , fats , macros with gym and diet recommendations . 
also i want to be able to download my entire report and my weekly analysis report with exact charts , not just wordings . give me all these features . strictly dont affect any of the exixting features 

---

**Cursor**

Exploring the codebase to understand the current implementation, then implementing goal-based macros, ring percentages, water tracking, streaks, an enhanced Gemini prompt, and downloadable reports with charts.


Implementing shared nutrition utilities, enhancing the Gemini prompt, fixing dashboard logic (today's data, water persistence, streaks), and adding PDF reports with chart visuals.


All requested features are in place without removing existing flows (scan → result → history, partner card, profile UI, tabs).

### 1. Real goal-based macro calculations
New `utils/nutritionGoals.js` uses **Mifflin–St Jeor BMR**, activity multiplier, and goal adjustments (Weight Loss, Muscle Gain, etc.). **Profile → Save** now writes personalized `calorieGoal`, `proteinGoal`, `carbsGoal`, `fatsGoal`, and `waterGoal`.

**Re-save your profile once** so Firebase gets the new calculated targets.

### 2. Real ring percentages
Dashboard rings use **today’s meals only** (not all-time history) via `filterMealsByDay` + `ringPercent()`. Calorie, protein, carbs, fats, water, and micros rings reflect actual progress vs goals.

### 3. Real water tracker
Water is stored in Firestore (`tracking/dailyState`) with a **date key** — it resets each day and persists across app restarts.

### 4. Real streak system
Streak = **consecutive days with at least one logged meal**, counting back from today (`utils/streakCalculator.js`). Fitness score blends macro adherence, streak, and meals logged today.

### 5. Enhanced Gemini food analysis
`gemini.js` now sends a structured nutritionist prompt that:
- Lists every ingredient with macros, vitamins, minerals  
- Totals protein/carbs/fats/fiber/sugar/sodium  
- Adds macro split %, health score, gym/diet/hydration advice  
- Uses your **real profile** from Firebase (loaded in `HomeScreen`)

Output format stays compatible with existing parsers.

### 6. Downloadable reports with charts
**Analytics** tab now has:
- In-app **line & bar charts** (weekly calories, protein, macros)  
- **Download weekly analysis** — PDF with SVG bar charts, goal rings, streak, meal log  
- **Download full report** — same for entire history  

Uses `expo-print` + `expo-sharing` (already in your project).

### New files
- `utils/nutritionGoals.js`  
- `utils/mealParser.js`  
- `utils/streakCalculator.js`  
- `services/reportService.js`  

### What to do on device
1. Open **Profile** → tap **Save Profile** (refreshes goals).  
2. Log a meal today → check **Dashboard** rings and streak.  
3. Use **Analytics** → download PDF and share/save via the system sheet.  

Existing screens (Home scan, Result, History, Login, etc.) are unchanged in behavior — only enhanced under the hood where noted.

---

**User**

text: `
Analyze this food image carefully.

Return ONLY in this exact structured format.

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
(short summary)
`,
i want this exact structured ai analysis output and also in the histroy screen ass a download report in the bottom off each scan histories , it should also give me the same output in the pdf 

---

**Cursor**

Updating the Gemini prompt to your exact format and adding per-meal PDF downloads on the History screen.


Here’s what was updated:

### 1. Gemini prompt — your exact format
`gemini.js` now uses your structured template verbatim (`MEAL NAME`, ingredient blocks, `OVERALL NUTRITION TOTALS`, `HEALTH SCORE`, gym/diet/hydration, `FINAL SUMMARY`). If a profile exists, only gym/diet lines are personalized — the output structure stays the same.

### 2. History — download per scan
Each history card has a **Download Report (PDF)** button at the bottom. It exports that scan’s full AI text in the same layout as on screen (monospace, line breaks preserved), plus the meal photo and scan time.

### 3. PDF content
The meal PDF includes:
- Meal type & scan date/time  
- Food image (when available)  
- **Full structured analysis** — same text as `meal.result` (not a summary)

Use the system share sheet to save or send the file.

**Note:** New scans will follow the exact format. Older scans keep whatever text was saved before; re-scan if you want them in the new structure.

---

**User**

in dashboard all the meters should be refreshed for each day and the total goals for the the parameters should be set based on the height, weight and the fitness goal the person sets in the profile . 
HOW PARTNER FITNESS WOULD WORK 🔥

Imagine:

You + your gym friend

Both connect in the app.

Then app shows:

✅ combined streak
✅ combined calories burned
✅ combined protein intake
✅ challenge system
✅ leaderboard
✅ motivation tracking

Example:

🔥 Team Streak: 12 Days

You:
120g protein

Partner:
135g protein

It needs:
authentication
user linking
realtime syncing
invitations

complete this , strictly without changing the existing fetures 


---

**Cursor**

Exploring the auth setup, dashboard, and partner implementation to add daily meter resets, profile-based goals, and a partner fitness system without breaking existing features.


Implementing user-scoped daily tracking, profile-based goals, and a full partner fitness system with invites and realtime sync.


Here’s what was implemented:

### Daily dashboard refresh
- All rings (calories, protein, carbs, fats, micros, water) use **today’s data only** — they reset each new day automatically.
- Water is stored per user with a **date key** so it resets at midnight.
- Meals are filtered by `createdAt` for the current day only.

### Goals from profile (height, weight, fitness goal)
- Goals are calculated with **Mifflin–St Jeor** from weight, height, age, gender, activity level, and fitness goal.
- Dashboard always applies `resolveProfileWithGoals()` so rings match your profile even if old saved goals were wrong.
- **Save Profile** once so height, weight, and goal are stored.
- Dashboard shows today’s targets under your goal (e.g. `2800 kcal · 140g protein`).

### Partner fitness system (auth + realtime)
Uses your existing **Firebase Auth** login.

**How to connect**
1. Both users must **sign up / log in**.
2. User A opens **Dashboard → Gym Partner** and copies their **invite code**.
3. User B enters that code and taps **Connect Partner**.

**What you see when linked (live updates)**
- Team streak (days **both** logged a meal)
- Combined calories & protein (today)
- You vs partner protein (e.g. `You: 120g` / `Partner: 135g`)
- Weekly protein challenge bar
- Leaderboard (today)
- Motivation messages (ahead/behind)
- Combined fitness score

**Technical setup**
- User-scoped data: `users/{uid}/meals`, `profile`, `tracking`, `dailyStats`
- Teams: `teams/{teamId}` with realtime `onSnapshot`
- Invites: `invites/{code}`
- Legacy paths (`profile/userData`, `meals`) still work for older data

### Files added/updated
- `services/userData.js` — shared data + daily sync  
- `services/partnerService.js` — invites, linking, realtime team stats  
- `components/PartnerFitnessCard.js` — partner UI on dashboard  
- `utils/profileGoals.js` — goal resolution  
- Updated: Dashboard, Profile, Home, History, Analytics, Signup  

### What you should do
1. **Re-save your profile** (height, weight, goal).
2. **Log in** on two accounts to test partner linking.
3. In **Firebase Console → Firestore rules**, allow authenticated users to read/write their own `users/{uid}` docs and shared `teams` / `invites` (tight rules in production).

Existing flows (scan, result, history PDF, analytics, tabs) are unchanged; partner is an upgrade on top of the old “Gym Partner” section.

---

**User**

For the code present, we get this error:
```
Variable declaration expected.
```
Fix it, verify, and then give a concise explanation. @gemini.js:14-17 

---

**Cursor**

Invalid syntax on line 6: `text:` was mistakenly added before the template literal. Removing it and the trailing comma.


**Fix:** Line 6 had `const ANALYSIS_FORMAT = text: \`` — `text:` is not valid there. It was changed to `const ANALYSIS_FORMAT = \``. The stray comma after the closing backtick was removed so the statement ends with `;`.

**Why:** `text:` belongs inside an object (e.g. `{ text: "..." }` in the API body), not in a `const` assignment. The parser read `text` as a variable name and expected a declaration after `=`, which triggered “Variable declaration expected” around the template literal.

**Verified:** `node --check gemini.js` exits 0; no linter issues.

---

**User**

ai analysis is still showing the older format of output 

---

**Cursor**

Tracing the analysis flow and strengthening the Gemini prompt so outputs match the required format.


The terminal shows the Gemini API key is invalid, so the app falls back to a short error template. Checking API key configuration and improving error handling.


The Gemini API key isn't loading (terminal: `API key not valid`), so the app returns a short fallback instead of the full analysis. Fixing API key loading and error handling.


The short output wasn’t from an old prompt — **Gemini wasn’t running successfully**.

Your Expo logs show:
```text
"message": "API key not valid. Please pass a valid API key."
```

When that happens, the app used a **minimal fallback** (only `MEAL NAME`, `MEAL TYPE`, totals, `FINAL SUMMARY`) — not the full structured analysis.

### What we fixed
1. **`app.config.js`** – loads `EXPO_PUBLIC_GEMINI_API_KEY` from `.env`
2. **`gemini.js`** – checks for a valid key, surfaces API errors, validates required sections, uses `systemInstruction` + your exact format
3. **No more silent fallback** – failures throw so you see an alert instead of a fake short result

### What you need to do
1. Copy `.env.example` → `.env` in the project root  
2. Add your key from [Google AI Studio](https://aistudio.google.com/apikey):
   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=your_actual_key_here
   ```
3. Restart Expo with cache clear:
   ```bash
   npx expo start -c
   ```
4. **Scan a new meal** — History still shows old saved text from failed scans.

After a valid key and restart, new scans should return the full format with ingredient breakdown, totals, health score, and recommendations.

---

**User**

i have created a new gemini api key and i have given in the env file 

---

**Cursor**

Verifying your API key setup and that the app loads it correctly.


Terminal shows "API Key not found" — the key isn't reaching the app at runtime. Diagnosing and fixing how the key is loaded.


Your `.env` setup is correct — the key loads on the server (39 characters). Two separate issues were blocking analysis:

### 1. Key not reaching the app
Expo was calling Gemini with an **empty** key (`API Key not found`). That’s fixed by reading the key at request time in `config/apiKeys.js` from `app.config.js` / `EXPO_PUBLIC_GEMINI_API_KEY`.

### 2. Wrong model for your plan
`gemini-2.0-flash` returns **quota exceeded** on your free tier. Your key works with **`gemini-2.5-flash`**, so the app now uses that model.

### What you should do now
1. **Stop** the running Expo server (Ctrl+C).
2. Start fresh:
   ```bash
   npx expo start -c
   ```
3. **Reload** the app on your phone (shake device → Reload).
4. **Scan a new meal** — History still shows old failed results.

If it still fails, the alert will say whether it’s a key load issue or a quota limit.

**Security note:** Your API key is in `.env` (good). Don’t commit or share that file. If it was ever exposed, create a new key in [Google AI Studio](https://aistudio.google.com/apikey) and update `.env`.

---

**User**

i want the meal photo which i uploaded or captured also in the report i download . 

---

**Cursor**

Checking how reports are generated and fixing meal photo embedding in PDFs.


Converting meal images to base64 for PDF embedding — `file://` URIs don't work in expo-print HTML.


Meal photos are now embedded in all downloadable PDFs.

### What changed
Local `file://` and camera URIs don’t work inside PDF HTML, so before generating a report the app converts each meal image to a **base64 data URI** and embeds it in the PDF.

### Where photos appear
| Report | Photo |
|--------|--------|
| **History → Download Report** | Large meal photo at the top |
| **Analytics → Weekly report** | Photo per meal in the log |
| **Analytics → Full report** | Photo per meal in the log |

### What to do
Download a report again from **History** or **Analytics** (older PDFs won’t update automatically). The first export may take a moment while the image is processed.

If a photo is missing, the analysis text is still included — that usually means the original image file is no longer on the device.

