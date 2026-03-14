# Design System & UI

Resumy's UI is designed with a "Premium-First" philosophy, focusing on minimalist aesthetics and smooth, delightful interactions.

## 🎨 Aesthetic Principles
- **Minimalist Modern**: High use of white space, subtle borders, and a refined "Stone/Slate" color palette.
- **Micro-Animations**: Extensive use of Framer Motion for loading states, modal transitions, and interactive elements.
- **Contextual Loading**: Specialized loaders for different phases (Importing, Switching, Initializing) to improve perceived performance.

## 🏗️ UI Components
Located in `frontend/components/`:
- **Editor**: A modular form system divided into sections (Personal, Experience, Education, etc.).
- **Live Preview**: An iframe-based renderer that reflects changes in real-time.
- **Doodle Animations**: Hand-drawn SVG animations used to highlight key concepts without using heavy images.

## 🖼️ Resume Templates
Templates are located in the backend and frontend shared logic:
- **Classic**: Serif-based, centered, traditional academic layout.
- **Modern**: Clean, sans-serif, high-impact readability.
- **Creative**: Uses vibrant accents and unique sidebar layouts.
- **Executive**: Dark-themed headers and sophisticated, dense hierarchies.

## 📱 Responsiveness
The UI is fully responsive using Tailwind's layout engine. The editor collapses into a vertical stack on mobile, while the preview remains accessible via a "Preview Toggle" to maximize screen real estate.
