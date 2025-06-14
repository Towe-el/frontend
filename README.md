# Toweel – Frontend

A beautifully interactive emotion exploration tool that lets users express themselves via text or voice, and receive AI-driven emotional insights — complete with animated visuals and downloadable reports.

---

## 🚀 Project Overview

This is the frontend of the Emotional Wheel app. Users can input how they feel (via text or speech), and the app uses AI (Gemini 2.0) to analyze their emotions. It visualizes the analysis through a spinning emotion wheel, animated emotion cards, and generates a downloadable summary report.

---

## ✨ Features

- 🎤 **Voice & Text Input** using Web Speech API
- 🧠 **AI-Powered Emotion Analysis** via backend integration (Gemini 2.0)
- 🎡 **Spinning Emotion Wheel** triggered by user input
- 🎴 **Dynamic Emotion Cards** with custom SVG animations
- 📄 **Personalized PDF Report** of emotion summaries
- 📚 **Emotion History Log** in the “My Emotions” section

---

## 🛠️ Tech Stack

- **React** – Component-based UI architecture  
- **TailwindCSS** – Utility-first styling  
- **Framer Motion** – Smooth UI and SVG animations  
- **Web Speech API** – Voice-to-text functionality  
- **Firebase Hosting** – Deployment and CI/CD  
- **Custom SVG Animations** – Emotion-specific visual effects  

---

## 📁 Project Structure
```
toweel-frontend/
├── public/
├── src/
│ ├── assets/
│ ├── components/ # Reusable UI components
│ ├── emotion-svgs/ # SVG React components per emotion
│ ├── animations/ # Animation logic and motion utils
│ ├── pages/ # Page-level components
│ ├── utils/ # Helpers (e.g., session, formatting)
│ └── App.jsx # Root component
├── .gitignore
├── tailwind.config.js
├── firebase.json # Hosting config
└── package.json
```

---

## ⚡ Quick Start

### 1. Clone the Repository

```
git clone https://github.com/your-username/emotional-wheel-frontend.git
cd emotional-wheel-frontend
```

### 2. Install Dependencies
```
npm install
```
### 3. Run the App Locally
```
npm run dev
```
### 4. Build for Production
```
npm run build
```

## 🌱 What's Next

- 📱 Improve Mobile Responsiveness for seamless touch interaction

- 🌍 Multilingual Support for global accessibility

- 🔒 Emotion Privacy Controls for user trust
  

## 🙌 Acknowledgments
- OpenAI Gemini 2.0 API for emotional analysis
- Google Web Speech API
- Inspiration from real-world emotional journaling and therapy tools
