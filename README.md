# Toweel – Frontend

Toweel is an intelligent emotion analysis search engine demo project developed for the AI in Action Hackathon. This project adopts a frontend-backend separation architecture, and this repository contains the backend API service.

By combining Google Cloud Vertex AI's text embedding models with MongoDB vector database, Toweel can understand users' emotional expressions and return relevant emotional content, helping users better understand and express their emotional states.

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

### UI Development
- **React.js** – Built with a component-based architecture for reusability and scalability.
- **TailwindCSS** – Used for utility-first styling, enabling rapid, responsive design.
- **Redux Toolkit** – Utilized for centralized and predictable state management across the application. It manages emotion data, selected cards, reading flow, and summary report state. Modular slices (emotionSlice, summarySlice) enable separation of concerns and easier debugging.
- **Framer Motion** – Powered lightweight & interactive UI transitions, and fine-tuned animations for each emotion, including path-drawing, transform effects, and reverse-order rendering.

### Voice Input
- **Web Speech API** – Integrated native browser speech-to-text for a natural, hands-free input experience.

### PDF Generation
- **React-pdf API** – Used to generate downloadable summary reports that reflect user emotion insights in a clean, readable format.

### Deployment & CI/CD Integration
- **Firebase Hosting** – Deployed the frontend with automatic builds and fast CDN delivery. Set up continuous deployment via Firebase for smooth updates from Git-based workflows.


---

## 📁 Project Structure
```
toweel-frontend/
├── public/
├── src/
│ ├── assets/
│ ├── components/ #Reusable UI components
│ ├── emotion-svgs/
│ ├── animations/
│ ├── pages/
│ ├── store/ #Redux config
│ ├── utils/
│ └── App.jsx
├── .gitignore
├── tailwind.config.js
├── firebase.json
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
- Gemini 2.0 API for emotional analysis
- Web Speech API
- Inspiration from real-world emotional journaling and therapy tools
