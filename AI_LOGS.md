# NutriLens AI - AI Development Logs

## Project Overview

AI-powered nutrition tracking app built using:
- React Native
- Expo
- Gemini Vision API
- Cursor AI
- ChatGPT

Goal:
Upload food images and get:
- food recognition
- calories
- protein
- carbs
- fats

---

# Day 1 - Project Initialization

## Tasks Completed
- Created Expo React Native app
- Connected Android device using Expo Go
- Configured GitHub repository
- Built initial dashboard UI
- Added dark theme interface

## AI Assistance Used
- ChatGPT for architecture guidance
- Cursor AI for code generation

## Issues Faced
- Expo dependency conflicts
- Worklets version mismatch
- Metro bundler cache errors

## Solutions Applied
- Recreated clean Expo SDK project
- Cleared cache using:
  npx expo start -c
- Removed incompatible dependencies

---

# Day 2 - AI Food Recognition

## Features Added
- Image upload using expo-image-picker
- Base64 image conversion
- Gemini Vision API integration
- Nutrition analysis output

## Prompt Engineering
Prompt used:
"Analyze this food image and provide:
- food names
- calories
- protein
- carbs
- fats"

## Major Bugs
### Watermelon Repetition Bug
Issue:
AI repeatedly returned watermelon for unrelated images.

Root Cause:
Cached or malformed image payload.

Fix:
- Rebuilt image conversion flow
- Cleared Expo cache
- Reworked Gemini request structure

### Expo FileSystem Error
Issue:
readAsStringAsync deprecated in Expo SDK 54.

Fix:
Used:
expo-file-system/legacy

---

# Current Working Flow

User uploads image →
Image converted to base64 →
Gemini Vision analyzes image →
Nutrition details displayed

---

# AI Models Used

| Tool | Purpose |
|---|---|
| Gemini Vision | Food recognition |
| ChatGPT | Debugging and architecture |
| Cursor AI | Code generation and fixes |

---

# Planned Features

- Daily calorie tracking
- Meal history
- Macro progress charts
- CalAI-inspired UI
- Authentication
- Cloud storage

---

# Day 3 - Advanced Nutrition Analysis & Camera Integration

## Features Added

- Real-time food photo capture using Expo Camera
- AI-powered detailed nutrition analysis
- Ingredient-level food breakdown
- Serving size estimation
- Fitness and diet recommendations
- Result screen UI for displaying nutrition output
- Improved dark theme styling

## Advanced Nutrition Features

The AI now provides:

- food recognition
- serving quantity estimation
- ingredient analysis
- calories
- protein
- carbs
- fats
- fiber
- sugar
- sodium
- vitamins
- minerals
- gym recommendations

Supported food categories:

- Indian foods
- desserts
- sweets
- beverages
- mixed food plates
- restaurant meals
- homemade meals

## Prompt Engineering Improvements

Enhanced Gemini Vision prompt to:

- identify multiple foods in one image
- estimate serving quantities
- analyze ingredients separately
- provide micronutrient insights
- generate fitness-focused recommendations

## UI Improvements

- Added camera capture button
- Added image preview section
- Added loading state indicator
- Added dedicated result screen
- Improved spacing and typography
- Added modern dark UI styling

## Security Improvements

### API Key Leak Warning

Issue:
GitHub detected exposed API keys.

Fix:

- Removed hardcoded API keys
- Added .env configuration
- Secured Gemini API key
- Secured Roboflow API key
- Updated .gitignore to ignore environment files

## Major Bugs Fixed

### Gemini API Error

Issue:
Gemini requests failed after environment variable migration.

Fix:

- Reconfigured environment variable access
- Restarted Expo cache
- Rebuilt Gemini request flow

### Camera Permission Issues

Issue:
Camera access failed on Android device.

Fix:

- Added Expo Camera permissions flow
- Added permission handling logic
- Added fallback error handling

## Current Working Flow

User captures/uploads food image →
Image converted to base64 →
Gemini Vision analyzes image →
Detailed nutrition analysis generated →
Result screen displayed

## Current App Capabilities

The app can now:

- recognize multiple foods
- analyze complete meals
- estimate nutrition values
- provide fitness insights
- support real-time food photography
- handle mixed food plates

## AI Assistance Used

| Tool          | Purpose                                     |
| ------------- | ------------------------------------------- |
| Gemini Vision | Food image analysis                         |
| ChatGPT       | Debugging, architecture, prompt engineering |
| Cursor AI     | Code generation and runtime fixes           |

## Next Planned Features

- Meal history storage
- Daily calorie tracking
- Macro progress dashboard
- Health score system
- Water intake tracker
- Personalized nutrition recommendations
- Charts and analytics