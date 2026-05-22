# 📝 Code-A-Nova Full Stack TODO Application

A premium, fully featured, secure **MERN Stack (MongoDB, Express, React, Node.js)** TODO Application built as an internship assignment for Code-A-Nova. The application incorporates secure user authentication with OTP-based email verification, a personalized dashboard, complete task management (CRUD) capabilities, and a responsive modern user interface.

---

## 🚀 Live Demo & Repository
- **Frontend URL:** *[Insert Live Frontend URL if deployed]*
- **Backend URL:** *[Insert Live Backend URL if deployed]*
- **GitHub Repository:** [https://github.com/Akhilkumar4464/TODO-CODE-A-NOVA.git](https://github.com/Akhilkumar4464/TODO-CODE-A-NOVA.git)

---

## 🛠️ Recommended Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | High-performance UI rendering & Client-side Routing |
| **Backend** | Node.js + Express.js | REST API Server & Middleware controller |
| **Database** | MongoDB + Mongoose | Data Persistence & Schemas |
| **Auth** | JWT + bcrypt | Secure Sessions, Token-based Access Control & Password Hashing |
| **Email** | Nodemailer | Secure OTP delivery for registration verification |
| **Styling** | Tailwind CSS / Material UI (MUI) | Premium, responsive component design |

---

## ✨ Features & Requirements

### 1. Authentication Flow
- **Registration (Signup):** Users provide their Name, Email, and Password. Upon submission, a secure 6-digit OTP is generated on the backend and sent to their email using Nodemailer.
- **OTP Verification:** Users enter the 6-digit OTP. On successful validation, their account status is marked as `isVerified: true`, and they are redirected to the Login page.
- **Login:** Users authenticate with Email and Password. Upon successful verification, a JSON Web Token (JWT) is issued and stored securely (localStorage or HttpOnly cookie), redirecting them to the Dashboard.
- **Protected Routes:** React Router guards prevent unauthenticated users from accessing the dashboard pages.
- **Logout:** Clears the authentication token and returns the user to the landing page.

### 2. Task Management (CRUD)
- **Create:** Task creation form with validation (Title is required, description, due date, priority, and status).
- **Read:** Display all tasks in a beautiful card or list layout with filter tabs (All, Pending, In-Progress, Completed).
- **Update:** Inline editing or modal popup to modify task details, status, or priorities.
- **Delete:** Soft or hard delete mechanism with user confirmation.
- **Real-time Metrics:** Dashboard metrics summarizing Total, Completed, Pending, and In-Progress tasks.

### 3. User Profile
- Displays the logged-in user's profile details: Name, Email, and Account creation date.
- Initial-based custom avatar generator.

### 4. Interactive Components
- **Navbar:** Responsive header featuring branding logo, navigation links, and conditional login/signup/logout options.
- **Footer:** Informational footer with contact information, links, and copyright.
- **Contact Form:** Contact page with fields for Name, Email, and Message. Integrates with Nodemailer to trigger a confirmation response to the sender.

---

## 📂 Project Architecture

The application is structured into a clean monorepo format, separating concerns between client and server:

```text
TODO-CODE-A-NOVA/
├── backend/
│   ├── config/             # DB Connection, Mailer Config
│   ├── controllers/        # Auth and Task route controllers
│   ├── middleware/         # JWT Verification, Request validation
│   ├── models/             # Mongoose Schemas (User, Task)
│   ├── routes/             # Express Router configurations
│   ├── .env.example        # Reference environment variables
│   ├── package.json        # Backend dependencies
│   └── server.js           # Express App Entrypoint
│
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images, icons, global styles
│   │   ├── components/     # Reusable UI components (Navbar, Footer, Modal, Button)
│   │   ├── context/        # AuthContext and TaskContext for state management
│   │   ├── pages/          # Home, Login, Signup, OTPVerify, Dashboard, Contact
│   │   ├── services/       # API call handlers (Axios clients)
│   │   ├── App.jsx         # App routes config
│   │   └── main.jsx        # App entry point
│   ├── .env.example        # Frontend environment variables
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite build configurations
│
├── .env.example            # Root environment template
└── README.md               # Documentation (This file)
```

---

## 🗄️ MongoDB Database Schemas

### User Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed using bcrypt
  otp: { type: String, default: null },       // Temporary 6-digit code
  otpExpires: { type: Date, default: null },  // OTP expiration time limit
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

### Task Model
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: Date, default: null },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In-Progress', 'Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 🔌 API Endpoint Reference

### Authentication Endpoints
- **`POST /api/auth/register`** - Register a new user and dispatch OTP.
- **`POST /api/auth/verify-otp`** - Verify registration OTP and activate account.
- **`POST /api/auth/login`** - Authenticate credentials and return JWT.
- **`GET /api/auth/me`** - Fetch authenticated user details *(Protected - Requires JWT)*.

### Task Endpoints
- **`GET /api/tasks`** - Fetch all tasks for the logged-in user *(Protected - Requires JWT)*.
- **`POST /api/tasks`** - Create a new task *(Protected - Requires JWT)*.
- **`PUT /api/tasks/:id`** - Update a specific task by ID *(Protected - Requires JWT)*.
- **`DELETE /api/tasks/:id`** - Delete a specific task by ID *(Protected - Requires JWT)*.

---

## ⚙️ Environment Variables Guide

To run the application, configure separate environment variables for both the backend and frontend services. Refer to the `.env.example` file details below:

### Backend Environments (`backend/.env`)
Create a file named `.env` in the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/todoApp
JWT_SECRET=your_jwt_super_secret_key_here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:5173
```
> ⚠️ **Note:** For Gmail, you must generate an **App Password** from your Google Account Security Settings rather than using your main account password.

### Frontend Environments (`frontend/.env`)
Create a file named `.env` in the `frontend/` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏁 Step-by-Step Installation & Setup

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas account)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Akhilkumar4464/TODO-CODE-A-NOVA.git
cd TODO-CODE-A-NOVA
```

---

### Step 2: Configure Environment Variables
1. Copy the `.env.example` templates to active `.env` files.
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
2. Open the `.env` files in your code editor and replace the placeholder values with your credentials.

---

### Step 3: Run the Backend Server
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Start the Express development server:
   ```bash
   npm run dev
   ```
   *(Ensure it outputs: `Server is running on port 5000` & `Connected to MongoDB`)*

---

### Step 4: Run the Frontend App
1. Open a new terminal window/tab and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development application:
   ```bash
   npm run dev
   ```
4. Access the application in your browser at `http://localhost:5173`.

---

## ✨ Bonus Features Implemented
- **Drag-and-Drop Task Reordering:** Dynamic visual prioritization via `@dnd-kit`.
- **Search & Sort:** Quick search by title with sorting capability by due date and priority levels.
- **Theme Support:** Dark / Light theme toggle built using Tailwind styling settings.
- **Task reminders:** Automatic notification system using `node-cron`.

---

## 📮 Submission Info
- **Submitting to:** codenova31@gmail.com
- **Subject line format:** `[INTERN ASSIGNMENT] Full Stack TODO App - <Your Name>`
- **Content:** Public GitHub Repository URL, deployed URL link, and validation details.
