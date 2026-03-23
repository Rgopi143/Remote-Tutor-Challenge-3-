<div align="center">
  <h1>🎓 Education Tutor for Remote India</h1>
  <p><em>An AI-powered educational platform designed to bridge the digital divide in remote areas of India</em></p>
</div>

## 🌟 About

Education Tutor for Remote India is a comprehensive web application that leverages AI technology to provide quality education to students in remote and underserved regions. The platform features multilingual support, offline capabilities, and interactive learning tools to make education accessible to everyone.

## ✨ Key Features

- **🤖 AI-Powered Tutoring**: Intelligent tutoring system powered by Google Gemini AI
- **🌍 Multilingual Support**: Available in English, Hindi, Marathi, Tamil, Telugu, Bengali, and Gujarati
- **📱 Offline Library**: Download and access educational content without internet connectivity
- **🎨 Interactive Drawing Canvas**: Visual learning tools with drawing and annotation capabilities
- **🎤 Voice Input**: Speech-to-text functionality for hands-free interaction
- **📷 Camera Integration**: Image recognition and visual learning support
- **💬 Real-time Chat**: Interactive conversational learning experience
- **📚 Resource Management**: Organized learning materials and progress tracking

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, TailwindCSS
- **Backend**: Express.js, Node.js
- **AI Integration**: Google Gemini AI API
- **Database**: SQLite (better-sqlite3)
- **UI Components**: Lucide React Icons, Motion (Framer Motion)
- **Build Tool**: Vite
- **Canvas/Graphics**: Konva, React-Konva

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rgopi143/Remote-Tutor-Challenge-3-.git
   cd education-tutor-for-remote-india
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your configuration:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage

### For Students

1. **Choose Your Language**: Select from supported Indian languages
2. **Start Learning**: Interact with the AI tutor through chat or voice
3. **Use Drawing Tools**: Create visual representations of concepts
4. **Access Offline Library**: Download content for offline learning
5. **Track Progress**: Monitor your learning journey

### For Teachers

1. **Create Learning Materials**: Use the drawing canvas to create visual aids
2. **Manage Content**: Organize and upload educational resources
3. **Monitor Student Progress**: Track learning outcomes and engagement

## 🏗️ Project Structure

```
education-tutor-for-remote-india/
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx      # Main landing interface
│   │   ├── OfflineLibrary.tsx   # Offline content management
│   │   ├── DrawingCanvas.tsx    # Interactive drawing tools
│   │   └── Sidebar.tsx          # Navigation sidebar
│   ├── services/
│   │   └── geminiService.ts     # AI integration service
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── package.json                # Project dependencies
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

## 🌐 Deployment

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel
   - Netlify
   - AWS Amplify
   - Any static hosting service

### Environment Variables for Production

Make sure to set these environment variables in your deployment platform:

- `GEMINI_API_KEY`: Your Google Gemini API key
- `APP_URL`: Your production application URL

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powering the intelligent tutoring system
- The open-source community for the amazing tools and libraries
- All contributors who help make education more accessible

## 📞 Support

For support, questions, or suggestions:

- Create an issue on GitHub
- Contact the development team
- Check our [FAQ](docs/FAQ.md) (coming soon)

## 🔮 Future Roadmap

- [ ] Mobile app development
- [ ] More Indian languages support
- [ ] Advanced analytics dashboard
- [ ] Collaborative learning features
- [ ] Integration with educational boards
- [ ] Parent/teacher dashboard
- [ ] Gamification elements

---

<div align="center">
  <p>Made with ❤️ for the students of India</p>
  <p><strong>Empowering education through technology</strong></p>
</div>
