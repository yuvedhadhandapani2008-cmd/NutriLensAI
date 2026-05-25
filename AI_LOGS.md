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