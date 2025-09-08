# 📚 StoryNest

**A full-stack storytelling platform for authors to write, share, and explore stories.**

StoryNest combines a React frontend with a Spring Boot backend, facilitating story creation with chapters, user interaction features, and personalized reading experiences.

---

## ✨ Features

- User authentication & profile management with JWT security
- Create, edit, and delete stories and chapters
- Commenting, liking, rating, and following authors
- Genre-based story discovery and advanced search
- Reading progress tracking and a personal library ("My Reads")
- Real-time notifications and dashboard analytics
- Responsive UI for desktop and mobile

---

## 📁 Project Structure

```
StoryNest/
├── story-app/                 # Spring Boot backend
│   ├── src/main/java/com/aniket/newproject/
│   │   ├── model/             # Entity classes (User, Story, Chapter, etc.)
│   │   ├── controller/        # REST API controllers
│   │   ├── service/           # Business logic
│   │   ├── repo/              # Repositories (DAO)
│   │   ├── dto/               # Data Transfer Objects
│   │   └── config/            # App and security configuration
│   └── pom.xml                # Maven dependencies
├── react-app/                 # React frontend
│   ├── public/                # Public assets including recordings/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Pages (Dashboard, Profile, etc.)
│   │   ├── hooks/             # Custom hooks like useAuth
│   │   ├── api/               # Axios setup and API calls
│   │   └── App.jsx            # Main app router and component
│   └── package.json           # NPM dependencies
└── README.md                  # This file
```

---

## 🎬 Demo Video

Check out a quick demo of StoryNest in action!



---

## 🚀 Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- PostgreSQL 13+
- Maven 3.6+

### Backend Setup

1. Clone the repo:

```
git clone https://github.com/Aniket-Sahu/StoryNest.git
cd StoryNest/story-app
```

2. Configure your database in `src/main/resources/application.properties`:

```
spring.datasource.url=jdbc:postgresql://localhost:5432/storynest
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Run backend:

```
mvn clean install
mvn spring-boot:run
```

API runs on `http://localhost:8080`

### Frontend Setup

Open a new terminal:

```
cd StoryNest/react-app
npm install
npm start
```

Frontend runs on `http://localhost:3000`

---

## 📑 API Overview

- Authentication: `/api/auth/login`, `/api/auth/register`, `/api/auth/profile`
- Stories: CRUD under `/api/stories`
- Chapters: Manage story chapters
- Interactions: Like, Rate, Comment, Follow

---

## 🛠️ Deployment

1. Build React:

```
cd react-app
npm run build
```

2. Copy build to backend static resources:

```
cp -r build/* ../story-app/src/main/resources/static/
```

3. Package backend:

```
cd ../story-app
mvn clean package
```

4. Run JAR:

```
java -jar target/*.jar
```

Recommended hosting: Vercel/Netlify (frontend), Railway/Render (backend), Supabase/Neon (database)

---

## 🤝 Contributing

Contributions welcome!  
Fork, create a branch, commit changes, push and open a pull request.

---

## 📜 License

MIT License - see LICENSE file

---

## 👨‍💻 Author

Aniket Sahu  
[GitHub](https://github.com/Aniket-Sahu) | [LinkedIn](https://www.linkedin.com/in/aniket-sahu-691b95254/)

---

⭐ If you find StoryNest useful, please give it a star!

---