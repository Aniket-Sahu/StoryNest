# StoryNest

StoryNest is a full-stack storytelling platform. Authors can write, share, and explore stories through a React-based frontend and a Spring Boot backend.

##  Project Structure
```

StoryNest/
├── story-app/    # Spring Boot backend
└── react-app/    # React frontend

````

##  Getting Started

### Backend (Spring Boot)
1. Navigate to the backend folder:
   ```bash
   cd story-app
````

2. Install dependencies and run with Maven:

   ```bash
   mvn spring-boot:run
   ```
3. The backend API will be available at `http://localhost:8080`.

### Frontend (React)

1. Open a new terminal and go to:

   ```bash
   cd react-app
   ```
2. Install dependencies and start the dev server:

   ```bash
   npm install
   npm start
   ```
3. The app will typically run at `http://localhost:3000` and communicate with the backend.

## Deployment Workflow

To bundle both parts for production:

1. Build the React app:

   ```bash
   cd react-app
   npm run build
   ```
2. Copy the `build/` directory into the backend’s static resources, for example:

   ```
   cp -r build ../story-app/src/main/resources/static/
   ```
3. Package the Spring Boot application:

   ```bash
   cd ../story-app
   mvn clean package
   ```
4. Deploy or run the generated JAR.

## Tech Stack

* **Backend**: Spring Boot (Java), REST APIs
* **Frontend**: React (JavaScript/TypeScript)
* **Build Tools**: Maven, npm

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue if you'd like to propose changes.