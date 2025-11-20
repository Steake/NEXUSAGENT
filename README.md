<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Nexus Agent

**Autonomous Reasoning Agent with Metacognitive Loop**

[![Deploy to GitHub Pages](https://github.com/Steake/NEXUSAGENT/actions/workflows/deploy.yml/badge.svg)](https://github.com/Steake/NEXUSAGENT/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[🚀 Live Demo](https://steake.github.io/NEXUSAGENT/) | [📖 Documentation](#documentation) | [🤝 Contributing](#contributing)

</div>

---

## 🌟 Overview

**Nexus Agent** is a self-directed, goal-oriented agentic system featuring:

- **Metacognitive Loop**: Continuously identifies knowledge gaps and spawns sub-goals
- **Erbingham-style Control Interface**: Fine-tune cognitive parameters in real-time
- **Recursive Reasoning**: Breaks down complex problems into solvable sub-tasks
- **Visual Goal Graph**: Track reasoning processes and decision trees
- **Powered by Gemini AI**: Leverages Google's Gemini for advanced reasoning capabilities

## ✨ Features

- 🧠 **Autonomous Goal Decomposition**: Automatically breaks down complex objectives
- 🔄 **Recursive Sub-goal Generation**: Creates hierarchical task structures
- 📊 **Real-time Visualization**: Watch the agent think and reason
- 🎛️ **Adjustable Parameters**: Control recursion depth, confidence thresholds, and more
- 💡 **Knowledge Context Tracking**: Maintains learned information across reasoning cycles
- 🎨 **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Steake/NEXUSAGENT.git
   cd NEXUSAGENT
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

## 📖 Documentation

### How It Works

1. **Goal Input**: Enter a primary directive (e.g., "Design a sustainable Mars colony")
2. **Analysis**: The agent analyzes the goal using Gemini AI
3. **Knowledge Gap Detection**: Identifies what information is needed
4. **Sub-goal Creation**: Spawns child goals to fill knowledge gaps
5. **Recursive Processing**: Continues until all goals are resolved
6. **Knowledge Synthesis**: Builds context from completed goals

### System Parameters

- **Recursion Limit**: Maximum depth of sub-goal nesting
- **Confidence Threshold**: Minimum confidence to accept solutions
- **Reasoning Depth**: How thoroughly to analyze each goal
- **Synthesis Mode**: How to combine learned knowledge

### Architecture

```
NEXUSAGENT/
├── App.tsx              # Main application component
├── components/          # UI components
│   ├── ControlPanel.tsx # Parameter controls
│   ├── GoalGraph.tsx    # Goal visualization
│   └── TerminalLog.tsx  # Reasoning log display
├── services/            # External services
│   └── geminiService.ts # Gemini AI integration
├── types.ts             # TypeScript type definitions
├── constants.ts         # Default configuration
└── vite.config.ts       # Vite build configuration
```

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **AI Engine**: Google Gemini API
- **Deployment**: GitHub Pages (via GitHub Actions)

## 🚢 Deployment

The project is automatically deployed to GitHub Pages using GitHub Actions. Every push to the `main` branch triggers a new deployment.

**Live URL**: [https://steake.github.io/NEXUSAGENT/](https://steake.github.io/NEXUSAGENT/)

### Manual Deployment

To deploy manually:
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powering the reasoning engine
- AI Studio for the initial project scaffolding
- The open-source community for inspiration and tools

## 📧 Contact

**Project Link**: [https://github.com/Steake/NEXUSAGENT](https://github.com/Steake/NEXUSAGENT)

---

<div align="center">
Made with 🧠 by the Nexus Agent Team
</div>
