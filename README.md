# NEXUS Platform

A modern educational platform built with React and Vite, providing an interactive learning experience with features like course management, study groups, and real-time collaboration.

## 🚀 Features

- **Responsive Design**: Works on desktop and mobile devices
- **Interactive UI**: Built with modern React components
- **Course Management**: Browse and manage courses
- **Study Groups**: Collaborate with peers
- **Real-time Chat**: Communicate with instructors and classmates
- **Progress Tracking**: Monitor your learning journey
- **Resource Sharing**: Share and access learning materials

## 🛠 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v7
- **UI Components**: Custom components with CSS modules
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nexus.git
   cd nexus/nexus-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root with the following variables:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_APP_NAME=NEXUS
   ```

4. **Start the development server**
   ```bash
   npm run dev -- --host
   # or
   yarn dev --host
   ```
   The app will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 📂 Project Structure

```
nexus-frontend/
├── public/          # Static files
├── src/
│   ├── assets/      # Images, fonts, etc.
│   ├── components/  # Reusable UI components
│   ├── context/     # React context providers
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Page components
│   ├── services/    # API services
│   ├── styles/      # Global styles
│   ├── utils/       # Utility functions
│   ├── App.jsx      # Main App component
│   └── main.jsx     # Application entry point
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

### Code Style

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and variable names
- Add PropTypes for component props

### Git Workflow

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -m "Add your feature"`
3. Push to the branch: `git push origin feature/your-feature`
4. Create a pull request

## 🌐 API Integration

The frontend communicates with the backend REST API. Ensure the backend server is running before starting the frontend.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_BASE_URL | Base URL for API requests | http://localhost:8000/api |
| VITE_APP_NAME | Application name | NEXUS |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)
- And all other open-source projects that made this possible.