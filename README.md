# NEXUS Platform

A full-stack educational platform built with React, Vite, and Django, providing an interactive learning experience with features like course management, study groups, real-time chat, and resource sharing.

## 🚀 Features

### Frontend
- **Responsive Design**: Works on desktop and mobile devices
- **Interactive UI**: Built with modern React 18 components
- **Real-time Updates**: Live chat and notifications
- **Progress Tracking**: Visualize learning progress
- **Resource Management**: Upload, view, and manage learning materials with rich metadata

### Backend
- **RESTful API**: Powered by Django REST Framework
- **Authentication**: JWT and session-based auth
- **Real-time Chat**: WebSocket support with Django Channels
- **File Storage**: Secure file uploads and management with metadata extraction
- **Database**: PostgreSQL with SQLite for development
- **Caching**: Redis for improved performance

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: React Context API
- **Routing**: React Router v7
- **UI Components**: Custom components with CSS modules
- **Data Visualization**: Recharts
- **HTTP Client**: Axios

### Backend
- **Framework**: Django 5.2.1
- **API**: Django REST Framework
- **Authentication**: djangorestframework-simplejwt
- **Real-time**: Django Channels, Redis
- **Database**: PostgreSQL (production), SQLite (development)
- **Storage**: Django Storages (S3 compatible)
- **Task Queue**: Celery (for async tasks)
- **Documentation**: DRF Spectacular

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn (for frontend)
- Python 3.9+ and pip (for backend)
- PostgreSQL (for production)
- Redis (for real-time features)
- Git
##
##
##
##
##

### Frontend Setup ##

1. **Clone the repository**
   ```bash
   git clone https://github.com/NEXUS-NXS/NEXUS.git
   cd NEXUS/nexus-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file in the frontend root:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_APP_NAME=NEXUS
   VITE_WS_URL=ws://localhost:8000/ws/
   ```
##
##
##
##
### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd ../nexus-backend
   ```

2. **Install Poetry** (if not already installed)

   **For macOS (with Homebrew)**
   ```bash
   brew install poetry
   ```

   **For Windows (with Chocolatey)**
   ```bash
   choco install poetry
   ```

   # poetry installation on Windows should be done with the following command:(Try if the choco does not work for you.)
   (Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | Invoke-Expression
   

   **For Linux (with pip)**
   ```bash
   pip install poetry
   ```

3. **Install project dependencies**
   ```bash
   poetry install
   
   # Activate the virtual environment
   poetry shell
   ```
##
##
##
## SKIP THIS PART IF IT WORKS ON YOUR GLOBAL ENVIRONMENT
4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.
##
##
##

5. **Run migrations**
   ```bash
   poetry run python manage.py makemigrations
   poetry run python manage.py migrate
   ```
##
 **NOTE!!!!!**

## Highly recommened by Jeremiah not to create a superuser since it will be of trouble when using https
6. **Create superuser**
   ```bash
   poetry run python manage.py createsuperuser
##   ```

### Running the Application

1. **Start Redis** (in a new terminal)
   ```bash
   redis-server
   ```

2. **Start the backend** (in the backend directory)
   ```bash
   # Development server
   poetry run python manage.py runserver
   
   # Production server with HTTPS (requires SSL certificates)
   poetry run uvicorn config.asgi:application \
     --host 0.0.0.0 \
     --port 8000 \
     --ssl-certfile certs/127.0.0.1.pem \
     --ssl-keyfile certs/127.0.0.1-key.pem
   ```

3. **Start the frontend** (in the frontend directory)
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - API Docs: http://localhost:8000/api/schema/swagger-ui/

## 📂 Project Structure

```
NEXUS/
├── nexus-frontend/           # Frontend React application
│   ├── public/               # Static files
│   └── src/                  # Source code
│       ├── assets/           # Images, fonts, etc.
│       ├── components/       # Reusable UI components
│       ├── context/          # React context providers
│       ├── hooks/            # Custom React hooks
│       ├── pages/            # Page components
│       ├── services/         # API services
│       ├── styles/           # Global styles
│       ├── utils/            # Utility functions
│       ├── App.jsx           # Main App component
│       └── main.jsx          # Application entry point
│
└── nexus-backend/            # Backend Django application
    ├── config/               # Project settings
    │   ├── settings/
    │   │   ├── base.py      # Base settings
    │   │   ├── dev.py       # Development settings
    │   │   └── production.py # Production settings
    │   └── urls.py          # Main URL configuration
    │
    ├── apps/                 # Django apps
    │   ├── users/           # User management
    │   ├── courses/         # Course management
    │   ├── study_groups/    # Study groups
    │   ├── chat/            # Real-time chat
    │   └── resources/       # Learning resources
    │
    ├── media/               # User-uploaded files
    ├── static/              # Static files
    ├── manage.py            # Django management script
    └── pyproject.toml       # Python dependencies (Poetry)
```

## 🛠 Development

### Frontend Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Run tests
npm test
```

### Backend Commands
Make sure you have poetry installed and activated
```bash

# Create a new migration
poetry run python manage.py makemigrations

# Run migrations
poetry run python manage.py migrate

### Ignore running development server by poetry for now...(We are using Uvicorn)

# Run development server
poetry run python manage.py runserver

# Run production server with Uvicorn
uvicorn config.asgi:application   --host 0.0.0.0   --port 8000   --ssl-certfile certs/127.0.0.1.pem   --ssl-keyfile certs/127.0.0.1-key.pem

# Run Celery worker
celery -A config worker -l info

# Run Celery beat (for scheduled tasks)
celery -A config beat -l info
```

### Code Style

- **Frontend**: [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- **Backend**: [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- **Git**: [Conventional Commits](https://www.conventionalcommits.org/)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Django](https://www.djangoproject.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django Channels](https://channels.readthedocs.io/)
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
