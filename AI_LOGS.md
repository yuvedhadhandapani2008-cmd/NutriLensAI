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

---

# Day 4 - Meal History & Analytics Dashboard

## Features Added

- Meal history storage using Firebase Firestore
- Daily meal tracking
- Weekly nutrition analytics
- Fitness score calculation
- Streak tracking system
- Interactive analytics dashboard
- Weekly nutrition charts

## Analytics Features

The dashboard now provides:

- Weekly calorie trends
- Protein intake tracking
- Carbohydrate intake tracking
- Fat intake tracking
- Nutrition summaries
- Daily progress monitoring
- Fitness score calculation
- User streak tracking

## Data Visualization

Implemented:

- Line charts for calorie trends
- Bar charts for protein intake
- Bar charts for carbohydrate intake
- Bar charts for fat intake
- Weekly nutrition summaries

Libraries Used:

- react-native-chart-kit
- react-native-svg

## Firebase Integration

Added Firestore storage for:

- Meal history
- Nutrition analysis records
- User profile information
- Goal tracking data
*- Analytics calculations

## Major Bugs Fixed

### Chart Rendering Issue

Issue:
Charts displayed blank data on first load.

Fix:

- Added proper data validation
- Implemented fallback values
- Improved analytics state management

### Firestore Data Sync Issue

Issue:
Meal history was not updating immediately.

Fix:

- Refactored Firestore fetch logic
- Added screen focus refresh
- Optimized data loading flow

### Analytics Calculation Errors

Issue:
Nutrition totals occasionally returned incorrect values.

Fix:

- Reworked aggregation functions
- Added safe number parsing
- Improved nutrition calculation utilities

## Current Working Flow

User scans meal →
Meal saved to Firestore →
Nutrition stored →
Analytics updated →
Charts generated →
Fitness score calculated

## Current App Capabilities

The app can now:

- Store meal history
- Track daily nutrition
- Generate weekly analytics
- Display interactive charts
- Calculate fitness score
- Maintain user streaks
- Analyze nutrition trends

## AI Assistance Used

| Tool          | Purpose                   |
| ------------- | ------------------------- |
| ChatGPT       | Analytics architecture    |
| Cursor AI     | Firestore integration     |
| Gemini Vision | Nutrition data generation |

## Next Planned Features

- PDF nutrition reports
- Advanced health insights
- Nutrition export tools
- Personalized recommendations
- Progress reports
- Achievement badges

---

# Day 5 - PDF Reports & Premium Features

## Features Added

- PDF nutrition report generation
- Meal analysis export
- Weekly nutrition reports
- Full nutrition summary reports
- Nutrition history export
- Professional report formatting

## Reporting Features

Users can now download:

### Meal Report

Includes:

- Meal type
- AI nutrition analysis
- Nutrition recommendations
- Scan timestamp

### Weekly Report

Includes:

- Weekly calorie summary
- Protein totals
- Carbohydrate totals
- Fat totals


### Full Nutrition Report

Includes:

- Complete nutrition summary
- Historical nutrition totals

## PDF Technology Stack

Libraries Used:

- expo-print
- expo-sharing
- expo-file-system

## Export Workflow

User selects report →
HTML generated →
PDF created →
File exported →
Ready for sharing

## Major Bugs Fixed

### PDF Generation Error

Issue:
Reports failed when image URLs were remote.

Fix:

- Added image download process
- Converted images to Base64
- Embedded images inside PDF

### HTML Rendering Issue

Issue:
Special characters broke PDF layout.

Fix:

- Added HTML escaping utility
- Sanitized AI response content

### Sharing Failure

Issue:
PDF export failed on unsupported devices.

Fix:

- Added availability checks
- Implemented fallback handling
- Improved export error messages

## Security Improvements

- Removed exposed API keys
- Added environment variable configuration
- Improved file handling security
- Updated Git ignore rules

## Final Application Features

NutriLens AI now supports:

- AI food recognition
- Real-time camera capture
- Detailed nutrition analysis
- Meal history tracking
- Firebase cloud storage
- Weekly analytics
- Nutrition charts
- Fitness score calculation
- Streak tracking
- PDF report generation
- Personalized recommendations

## AI Assistance Used

| Tool          | Purpose                        |
| ------------- | ------------------------------ |
| ChatGPT       | Report generation architecture |
| Cursor AI     | PDF implementation             |
| Gemini Vision | Nutrition analysis             |

## Project Status

Current Version:
NutriLens AI v1.0

Status:
Production Ready Demo Version

Completed Modules:

- Authentication Ready
- AI Food Analysis
- Nutrition Tracking
- Meal History
- Analytics Dashboard
- PDF Reporting
- Firebase Integration
