# NEXUS Backend

Django REST framework backend for the NEXUS educational platform, providing APIs for user management, course content, study groups, and real-time chat functionality.

## 🚀 Features

- **User Authentication**: JWT and session-based authentication
- **Course Management**: Create, read, update, and delete courses and lessons
- **Study Groups**: Collaborative learning spaces with discussion boards
- **Resources**: File uploads and resource management
- **Real-time Chat**: WebSocket-based chat functionality
- **RESTful API**: Well-documented endpoints for frontend integration

## 🛠️ Tech Stack

- **Backend Framework**: Django 5.2
- **API**: Django REST Framework
- **Database**: SQLite (development), PostgreSQL (production-ready)
- **Authentication**: JWT + Session Authentication
- **Real-time**: Django Channels
- **CORS**: django-cors-headers
- **Documentation**: DRF Spectacular

## 🚀 Setup

### Prerequisites

- Python 3.9+
- pip (Python package manager)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nexus-backend.git
   cd nexus-backend
   ```

2. **Set up a virtual environment**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```

## 📂 Project Structure

```
nexus-backend/
├── config/               # Project configuration
├── users/                # User authentication and profiles
├── courses/              # Course management
├── study_groups/         # Study group functionality
├── resources/            # Learning resources
├── chat/                 # Real-time chat
├── media/                # User-uploaded files
├── static/               # Static files
├── .env.example          # Example environment variables
├── manage.py             # Django management script
└── requirements.txt      # Project dependencies
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/me/` - Get current user details

### Users
- `GET /api/users/` - List all users
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user profile
- `PATCH /api/users/{id}/` - Partially update user profile

### Courses
- `GET /api/courses/` - List all courses
- `POST /api/courses/` - Create a new course
- `GET /api/courses/{id}/` - Get course details
- `PUT /api/courses/{id}/` - Update course
- `DELETE /api/courses/{id}/` - Delete course

## 📝 Development

### Code Style
- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) guidelines
- Use type hints for better code documentation
- Document all public methods and classes with docstrings

### Git Workflow
1. Create a new branch for your feature: `git checkout -b feature/your-feature`
2. Make your changes and commit them: `git commit -m "Add your feature"`
3. Push to the branch: `git push origin feature/your-feature`
4. Create a pull request

### Running Tests
```bash
# Run all tests
python manage.py test

# Run tests for a specific app
python manage.py test users

# Run with coverage
coverage run manage.py test
coverage report
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DEBUG | Enable debug mode | True |
| SECRET_KEY | Django secret key | (random) |
| ALLOWED_HOSTS | Allowed hostnames | ['localhost', '127.0.0.1'] |
| CORS_ALLOWED_ORIGINS | Allowed CORS origins | ['http://localhost:5173'] |
| DB_NAME | Database name | db.sqlite3 |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Django REST Framework
- Django Channels
- DRF Spectacular
- And all other open-source projects that made this possible.
