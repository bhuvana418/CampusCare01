# CampusCare – Campus Issue Reporting and Tracking System

## 1. Introduction

CampusCare is a web-based Campus Issue Reporting and Tracking System developed to simplify the process of reporting, managing, and resolving campus-related issues.

In educational institutions, students and faculty members often face problems related to infrastructure, laboratory equipment, classroom facilities, electrical systems, and maintenance. Reporting these problems through traditional methods can lead to delays, communication difficulties, and a lack of proper tracking.

CampusCare provides a centralized digital platform where students and faculty members can report issues and monitor their progress. The system allows users to submit complaints, receive tracking information, and view the current status of their reported issues.

The application is developed using React and Vite for the frontend, Node.js and Express.js for the backend, and Supabase PostgreSQL for database management. The application is deployed using Vercel, Render, and Supabase.

The main objective of CampusCare is to improve campus maintenance management by providing a simple, accessible, and organized complaint reporting system.

---

## 2. Problem Statement

Traditional campus complaint management systems often depend on manual registers, verbal communication, or direct contact with maintenance departments.

These methods may create several difficulties:

- Students may not know where to report a particular issue.
- Complaints may be delayed or overlooked.
- Users may not know the current status of their complaints.
- Departments may find it difficult to organize and prioritize complaints.
- Communication between users and maintenance departments may be inefficient.

To overcome these challenges, CampusCare provides a digital complaint management system that allows users to report problems and track their progress through a web application.

### Objectives

The main objectives of the project are:

- To develop a centralized platform for reporting campus issues.
- To simplify complaint registration and tracking.
- To provide separate access for students and faculty members.
- To organize complaints according to categories and departments.
- To store user and complaint information in a structured database.
- To improve transparency in the complaint resolution process.
- To deploy the application online for easy accessibility.

---

## 3. Proposed System

CampusCare provides a web-based solution for managing campus-related complaints.

Users can register and log in to the application, submit complaints, and track their reported issues. Each complaint is associated with a tracking ID, allowing users to identify and monitor its progress.

The system organizes complaints according to their category, location, priority, and department.

The backend processes user requests and communicates with the database to store and retrieve information. The frontend displays the information in a user-friendly interface.

### Main Features

**User Registration and Login**

Students and faculty members can create accounts and access the application using their credentials.

**Role-Based Access**

The application provides different interfaces and functionalities based on the user's role.

**Complaint Submission**

Users can report issues by providing details such as complaint title, category, location, description, priority, and department.

**Complaint Tracking**

Users can track their complaints using the assigned tracking ID.

**Department-Based Organization**

Complaints can be associated with the relevant department based on their category.

**Complaint Status Management**

The system maintains complaint status information, allowing users to monitor the progress of reported issues.

---

## 4. Technologies Used

CampusCare is developed using modern full-stack web development technologies.

| Technology | Description |
|---|---|
| React.js | Used to develop the interactive frontend interface. |
| Vite | Used as the frontend development server and build tool. |
| JavaScript | Used to implement application logic. |
| JSX | Used to create React components. |
| CSS | Used for application styling and layout. |
| Node.js | Used as the server-side JavaScript runtime. |
| Express.js | Used to develop backend APIs. |
| PostgreSQL | Used as the relational database. |
| Supabase | Used for hosted PostgreSQL database services. |
| Git | Used for version control. |
| GitHub | Used to store and manage the source code. |
| Vercel | Used to deploy the frontend. |
| Render | Used to deploy the backend. |

---

## 5. System Architecture

CampusCare follows a three-tier architecture consisting of the presentation layer, application layer, and database layer.

Each layer performs a specific responsibility and communicates with the other layers to provide the complete application functionality.

### 5.1 Presentation Layer – Frontend

The frontend is developed using React.js and Vite.

It provides the interface through which users interact with CampusCare.

The frontend is responsible for:

- Displaying registration and login forms.
- Collecting user information.
- Displaying complaint submission forms.
- Showing complaint details and tracking information.
- Sending requests to the backend.
- Displaying responses received from the backend.

The frontend is deployed on Vercel.

### 5.2 Application Layer – Backend

The backend is developed using Node.js and Express.js.

It acts as the communication layer between the frontend and the database.

The backend is responsible for:

- Processing registration and login requests.
- Receiving complaint information.
- Handling API requests.
- Performing database operations.
- Retrieving complaint information.
- Updating complaint status.
- Sending responses to the frontend.

The backend is deployed on Render.

### 5.3 Database Layer

The database layer uses PostgreSQL, hosted through Supabase.

It stores user information, complaint details, and other application data.

The backend communicates with the database through the database connection module.

### Architecture Diagram

```text
              CAMPUSCARE APPLICATION

       +------------------------------+
       |          FRONTEND            |
       |                              |
       |       React.js + Vite        |
       |                              |
       |        Hosted on Vercel      |
       +--------------+---------------+
                      |
                      |
                 HTTP / API
                      |
                      |
       +--------------v---------------+
       |          BACKEND             |
       |                              |
       |       Node.js + Express.js   |
       |                              |
       |        Hosted on Render      |
       +--------------+---------------+
                      |
                      |
                SQL QUERIES
                      |
                      |
       +--------------v---------------+
       |          DATABASE            |
       |                              |
       |        PostgreSQL            |
       |                              |
       |        Supabase              |
       +------------------------------+
```

---

## 6. Frontend Development

The frontend of CampusCare is developed using React.js and Vite.

React is used to create interactive user interfaces, while Vite provides a fast development environment and builds the application for deployment.

The frontend was developed using Visual Studio Code.

### Frontend Structure

The frontend source code contains the following important files:

```text
frontend/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── index.js
│
├── public/
├── package.json
├── package-lock.json
└── vite.config.js
```

### App.jsx

The `App.jsx` file contains the main React application component.

It manages the primary interface, user interactions, registration, login, complaint submission, and complaint tracking.

It also handles communication with the backend API.

### App.css

The `App.css` file contains the styles for the main application interface.

It defines the layout, colors, buttons, forms, input fields, dashboard sections, and other visual elements.

### index.css

The `index.css` file contains global styles that apply throughout the application.

### index.js

The `index.js` file acts as the frontend entry point in the project's configuration and initializes the React application.

### Frontend Development

The frontend development server can be started using:

```bash
npm run dev
```

The application can then be accessed through the local URL provided by Vite.

---

## 7. Backend Development

The backend is developed using Node.js and Express.js.

It handles application logic, processes frontend requests, and communicates with the PostgreSQL database.

### Backend Structure

```text
backend/
│
├── db.js
├── server.js
├── package.json
└── package-lock.json
```

### server.js

The `server.js` file contains the main Express application.

It initializes the server, configures middleware, and defines API routes.

The backend processes requests related to registration, login, complaint submission, complaint retrieval, and status updates.

### db.js

The `db.js` file manages the database connection.

It contains the configuration required to connect the backend to the Supabase PostgreSQL database.

The backend uses this connection to perform database operations such as inserting, retrieving, and updating records.

### API Communication

The frontend communicates with the backend through HTTP requests.

The backend processes the requests and returns the required responses.

Examples of HTTP methods include:

| Method | Purpose |
|---|---|
| GET | Retrieve information. |
| POST | Submit new information. |
| PATCH | Update selected information. |
| PUT | Replace an existing resource. |
| DELETE | Remove information. |

The application uses the relevant methods for user and complaint operations.

---

## 8. Database Design

CampusCare uses PostgreSQL as its relational database.

The database is hosted through Supabase, which provides a managed PostgreSQL database service.

The database stores the information required for the application and allows the backend to retrieve and manage records.

### Users Table

The users table stores information about registered users.

The information may include:

- User ID.
- Name.
- Username.
- Email address.
- Password information.
- User role.
- Department.

### Complaints Table

The complaints table stores information about reported campus issues.

The information may include:

- Complaint ID.
- Tracking ID.
- Complaint title.
- Complaint category.
- Complaint description.
- Location.
- Priority.
- Department.
- Complaint status.
- User information.
- Creation date and time.

The exact columns and data types depend on the implemented database schema.

### Database Connectivity

The backend communicates with Supabase PostgreSQL through the database connection module.

When a user submits a registration form or complaint, the frontend sends the information to the backend.

The backend processes the request and performs the appropriate database operation.

The database stores the information and returns the result to the backend.

The backend then sends a response to the frontend.

This approach ensures that database operations are handled through the backend rather than directly through the frontend.

---

## 9. Application Workflow

The CampusCare application follows a simple workflow.

1. The user opens the CampusCare website.
2. The user registers or logs in.
3. The user accesses the appropriate interface.
4. The user submits a campus-related complaint.
5. The frontend sends the complaint information to the backend.
6. The backend processes the request.
7. The backend stores the complaint in the PostgreSQL database.
8. The backend returns a response to the frontend.
9. The user can view and track the complaint.
10. The complaint status can be updated through the application.

### Complaint Submission Workflow

```text
User
 |
 v
React Frontend
 |
 v
Express API
 |
 v
Backend Processing
 |
 v
Supabase PostgreSQL
 |
 v
Database Response
 |
 v
Frontend Update
```

---

## 10. Local Development Setup

The project can be executed locally by setting up the frontend, backend, and database.

### Prerequisites

The following tools are required:

- Visual Studio Code.
- Node.js.
- npm.
- Git.
- GitHub account.
- Supabase account.

### Step 1: Clone the Repository

```bash
git clone https://github.com/bhuvana418/CampusCare01.git
```

Navigate to the project directory:

```bash
cd CampusCare01
```

### Step 2: Install Frontend Dependencies

Navigate to the frontend folder:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

### Step 3: Install Backend Dependencies

Open another terminal and navigate to the backend folder:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

### Step 4: Configure the Database

Configure the database connection in `db.js`.

The connection configuration must match the Supabase PostgreSQL database.

The required database tables must be created before running the application.

Database credentials should be kept private and should not be uploaded to a public GitHub repository.

### Step 5: Start the Backend

Run the backend server:

```bash
node server.js
```

The backend starts on its configured port.

The frontend and backend should both be running for the complete application to function locally.

---

## 11. GitHub and Version Control

GitHub is used to maintain the CampusCare source code and manage project versions.

The project files are organized into frontend and backend directories.

Git is used to track changes, while GitHub provides an online repository for storing and sharing the project.

### GitHub Repository

The project repository is available at:

https://github.com/bhuvana418/CampusCare01

### Initializing Git

Git can be initialized using:

```bash
git init
```

Add the project files:

```bash
git add .
```

Create the initial commit:

```bash
git commit -m "Initial CampusCare project setup"
```

### Connecting to GitHub

Connect the local project to the GitHub repository:

```bash
git remote add origin https://github.com/bhuvana418/CampusCare01.git
```

Set the main branch:

```bash
git branch -M main
```

Push the project:

```bash
git push -u origin main
```

### Updating the Repository

Changes can be uploaded using:

```bash
git add .
git commit -m "Update CampusCare application"
git push
```

The `.gitignore` file is used to prevent unnecessary files, such as `node_modules`, build files, and sensitive configuration files, from being uploaded to GitHub.

---

## 12. Deployment

CampusCare is deployed using separate hosting services for the frontend, backend, and database.

### Frontend Deployment – Vercel

The React frontend is deployed using Vercel.

Vercel hosts the frontend application and provides a public URL through which users can access CampusCare.

The frontend communicates with the deployed backend using its configured API URL.

**Live Website:**

https://campuscare01.vercel.app

### Backend Deployment – Render

The Node.js and Express.js backend is deployed using Render.

Render hosts the backend server and provides a public URL for API communication.

The backend processes requests received from the frontend and communicates with the PostgreSQL database.

**Backend Health Check:**

https://campuscare01.onrender.com/api/health

### Database Hosting – Supabase

The PostgreSQL database is hosted using Supabase.

Supabase provides a managed PostgreSQL database that stores user information and complaint records.

The backend connects to the database through the database connection configuration in `db.js`.

The database is used to store, retrieve, and update application information.

**Supabase Dashboard:**

https://supabase.com/dashboard

---

## 13. Testing

Testing was performed during development to verify the functionality of the application.

### Frontend Testing

The frontend was tested to verify:

- Registration and login forms.
- Complaint submission.
- User interactions.
- Complaint tracking.
- Display of complaint information.

### Backend Testing

The backend was tested to verify:

- Server startup.
- API endpoint functionality.
- Request processing.
- Database connectivity.
- Complaint creation and retrieval.
- Complaint status updates.

### Database Testing

The database was tested to verify:

- Successful database connection.
- User record insertion.
- Complaint record insertion.
- Data retrieval.
- Data updates.

### Integration Testing

Integration testing was performed to verify communication between the frontend, backend, and database.

The complete workflow was tested by submitting information through the frontend and checking whether the backend processed the request and stored the information in the database.

---

## 14. Advantages

CampusCare provides several advantages over traditional complaint management systems.

- **Centralized Management:** All complaints can be managed through a single platform.
- **Easy Accessibility:** Users can access the application through a web browser.
- **Improved Transparency:** Users can track complaints using their tracking IDs.
- **Department Organization:** Complaints can be associated with relevant departments.
- **Reduced Manual Work:** Digital reporting reduces dependence on manual registers.
- **Structured Data Storage:** PostgreSQL maintains information in a structured format.
- **Scalable Architecture:** The separation of frontend, backend, and database makes the system easier to maintain and extend.

---

## 15. Future Enhancements

CampusCare can be improved with additional features in the future.

Possible enhancements include:

- Email notifications for complaint updates.
- An administrative dashboard.
- Advanced complaint search and filtering.
- Image uploads for reporting damaged facilities.
- Complaint history and resolution tracking.
- Analytics and department-wise reports.
- Improved authentication and authorization.
- Further optimization for mobile devices.

These enhancements could improve the usability and efficiency of the application.

---

## 16. Conclusion

CampusCare is a full-stack web application developed to simplify campus issue reporting and tracking.

The project demonstrates the integration of frontend development, backend APIs, relational database management, version control, and cloud deployment.

React.js and Vite were used to develop the frontend, while Node.js and Express.js were used to implement the backend.

Supabase PostgreSQL provides structured storage for user and complaint information.

GitHub was used to manage the source code, while Vercel and Render were used to deploy the frontend and backend.

The application provides a centralized platform for reporting campus issues, tracking complaints, and organizing maintenance-related information.

CampusCare demonstrates practical knowledge of full-stack web development and provides a foundation for developing more advanced campus management applications.

---

## 17. Live Demo and Source Code

| Component | Link |
|---|---|
| Live Website | https://campuscare01.vercel.app |
| Backend Health Check | https://campuscare01.onrender.com/api/health |
| Supabase Dashboard | https://supabase.com/dashboard |
| GitHub Repository | https://github.com/bhuvana418/CampusCare01 |



**Project Name:** CampusCare – Campus Issue Reporting and Tracking System

**Project Type:** Full-Stack Web Application

**Frontend:** React.js and Vite

**Backend:** Node.js and Express.js

**Database:** Supabase PostgreSQL

**Deployment:** Vercel and Render

**Source Code:** GitHub

