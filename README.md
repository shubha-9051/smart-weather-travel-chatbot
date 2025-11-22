# Smart Weather-Aware Travel Assistant

A full-stack web application that provides intelligent, weather-based travel recommendations using LLM AI and real-time data integration.

## Overview

This project demonstrates the integration of modern web technologies with AI language models to create a context-aware travel planning assistant. The system analyzes current weather conditions and user preferences to generate personalized travel itineraries with detailed location information.

## Video Link: https://drive.google.com/file/d/154X-JMKVAABCmBY487eWIfN7vWD6pHN9/view?usp=sharing

## Core Features

- **AI-Powered Recommendations**: Utilizes Groq's Llama 3.3 70B model for natural language understanding and response generation
- **Real-Time Weather Integration**: Fetches live weather data via OpenMeteo API for location-specific recommendations
- **Multilingual Support**: Full English/Japanese interface with dynamic language switching
- **Voice Input**: Speech-to-text transcription using Groq Whisper API
- **Rich Media Integration**: Google Places API for location photos and details
- **Persistent Chat History**: Session management with localStorage persistence

<img width="1300" height="1825" alt="image" src="https://github.com/user-attachments/assets/2481c398-51d5-4cc2-b126-c1b78dc15b45" />

## Architecture Diagram

<img width="2075" height="1253" alt="diagram-export-22-11-2025-10_46_28-pm" src="https://github.com/user-attachments/assets/e2f9690d-3d1d-47a8-8834-428925d3f999" />

## Technical Stack

**Frontend**
- Next.js 
- TailwindCSS
- Zustand (State Management)

**Backend & APIs**
- Groq API (LLM & Speech-to-Text)
- OpenMeteo API (Weather Data)
- Google Places API (Location Data)
