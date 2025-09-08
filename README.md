📚 StoryNest
A comprehensive full-stack storytelling platform where authors can write, share, and explore captivating stories.

StoryNest combines the power of React and Spring Boot to deliver an intuitive storytelling experience with features like chapter management, user interactions, reading progress tracking, and social engagement.

✨ Features
📖 Story Management
Story Creation & Publishing: Create and publish stories with rich text editing

Chapter Management: Organize stories into chapters with seamless navigation

Genre Classification: Categorize stories by genre for better discoverability

Story Status Tracking: Mark stories as draft, ongoing, completed, or on hiatus

👥 User Experience
User Authentication: Secure JWT-based authentication system

User Profiles: Customizable user profiles with bio and reading statistics

Reading Progress: Track reading progress across all stories and chapters

Personal Library: "My Reads" section to manage reading lists and favorites

🎯 Social Features
Comments System: Chapter-level commenting with nested replies

Rating & Reviews: Rate stories and leave detailed reviews

Follow System: Follow favorite authors and get notifications

Social Interactions: Like stories and engage with the community

🔍 Discovery & Navigation
Advanced Search: Search stories by title, author, genre, or content

Genre Exploration: Browse stories by specific genres

Trending Content: Discover popular and trending stories

Responsive Design: Optimized for desktop and mobile devices

📱 Additional Features
Notifications: Real-time notifications for story updates and interactions

Dashboard Analytics: Author dashboard with story performance metrics

Reading Statistics: Track reading time and progress

Customizable Settings: Personalize reading experience

🏗️ Tech Stack
Backend (Spring Boot)
Framework: Spring Boot 3.5.3

Security: Spring Security with JWT authentication

Database: PostgreSQL with JPA/Hibernate

API: RESTful APIs with comprehensive endpoint coverage

Build Tool: Maven

Frontend (React)
Framework: React 18.2.0

Routing: React Router DOM for SPA navigation

HTTP Client: Axios for API communication

Styling: CSS modules with responsive design

State Management: React hooks and context

Key Dependencies
Backend: Spring Data JPA, Spring Security, JWT, Lombok, PostgreSQL

Frontend: React Router, Axios, Testing Library

📁 Project Structure
text
StoryNest/
├── story-app/                 # Spring Boot backend
│   ├── src/main/java/com/aniket/newproject/
│   │   ├── model/            # Entity models (User, Story, Chapter, etc.)
│   │   ├── controller/       # REST controllers
│   │   ├── service/          # Business logic layer
│   │   ├── repo/             # Repository interfaces
│   │   ├── dto/              # Data transfer objects
│   │   └── config/           # Security and app configuration
│   └── pom.xml               # Maven dependencies
│
├── react-app/                # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components (Dashboard, Profile, etc.)
│   │   ├── hooks/           # Custom React hooks (useAuth, etc.)
│   │   ├── api/             # API configuration and calls
│   │   └── App.jsx          # Main app component with routing
│   ├── public/
│   │   └── recordings/      # Demo video assets
│   └── package.json         # npm dependencies
└── README.md

🎬 Demo Video
See StoryNest in action! Here's a quick demonstration of the key features:



🚀 Getting Started
Prerequisites
Java 21 or higher

Node.js 18 or higher

PostgreSQL 13 or higher

Maven 3.6 or higher

Backend Setup (Spring Boot)
Clone the repository

bash
git clone https://github.com/Aniket-Sahu/StoryNest.git
cd StoryNest
Navigate to backend directory

bash
cd story-app
Configure database

Create a PostgreSQL database named storynest

Update application.properties with your database credentials:

text
spring.datasource.url=jdbc:postgresql://localhost:5432/storynest
spring.datasource.username=your_username
spring.datasource.password=your_password
Install dependencies and run

bash
mvn clean install
mvn spring-boot:run
Backend API will be available at http://localhost:8080

Frontend Setup (React)
Open a new terminal and navigate to frontend directory

bash
cd react-app
Install dependencies

bash
npm install
Start the development server

bash
npm start
Frontend will be available at http://localhost:3000

📊 API Endpoints
Authentication
POST /api/auth/login - User login

POST /api/auth/register - User registration

GET /api/auth/profile - Get user profile

Stories
GET /api/stories - Get all stories

POST /api/stories - Create new story

GET /api/stories/{id} - Get story details

PUT /api/stories/{id} - Update story

DELETE /api/stories/{id} - Delete story

Chapters
GET /api/stories/{storyId}/chapters - Get story chapters

POST /api/stories/{storyId}/chapters - Create new chapter

GET /api/chapters/{id} - Get chapter content

PUT /api/chapters/{id} - Update chapter

User Interactions
POST /api/stories/{id}/like - Like/unlike story

POST /api/stories/{id}/rate - Rate story

GET /api/stories/{id}/comments - Get story comments

POST /api/stories/{id}/comments - Add comment

🌐 Deployment
Production Build
Build the React frontend

bash
cd react-app
npm run build
Copy build files to Spring Boot static resources

bash
cp -r build/* ../story-app/src/main/resources/static/
Package Spring Boot application

bash
cd ../story-app
mvn clean package
Run the JAR file

bash
java -jar target/bookApp-0.0.1-SNAPSHOT.jar
Deployment Options
Recommended free hosting platforms:

Backend: Railway, Koyeb, Render

Frontend: Vercel, Netlify

Database: Supabase, Neon, Railway PostgreSQL

🧪 Features in Detail
User Authentication & Security
JWT-based stateless authentication

Secure password hashing

Protected routes and API endpoints

User session management

Story & Chapter Management
Rich text editor for story creation

Chapter organization and navigation

Story metadata management (genre, status, description)

Author dashboard with analytics

Reading Experience
Chapter-by-chapter reading interface

Reading progress tracking

Bookmark and favorites system

Responsive reading interface

Social Interactions
Comment system with threading support

Story rating and review system

User following and notifications

Social sharing capabilities

🎨 UI/UX Features
Responsive Design: Optimized for all device sizes

Modern Interface: Clean and intuitive user interface

Dark/Light Mode: Customizable theme preferences

Loading States: Smooth loading animations and spinners

Error Handling: Comprehensive error handling and user feedback

🔧 Configuration
Environment Variables
Create a .env file in the story-app directory:

text
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/storynest
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000

# Server Configuration
SERVER_PORT=8080
🤝 Contributing
We welcome contributions to StoryNest! Here's how you can help:

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Development Guidelines
Follow existing code style and conventions

Write meaningful commit messages

Add tests for new features

Update documentation as needed

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
Aniket Sahu

GitHub: @Aniket-Sahu