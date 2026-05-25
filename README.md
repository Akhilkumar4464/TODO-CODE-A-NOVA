# 📝 Code-A-Nova Full Stack TODO Application

A premium, fully featured, secure **MERN Stack (MongoDB, Express, React, Node.js)** TODO Application built as an internship project for Code-A-Nova. The application incorporates secure user authentication with OTP-based email verification, a personalized task dashboard, complete task management (CRUD) capabilities, native drag-and-drop reordering, background cron reminders, and a modern responsive user interface.

---

## 🚀 Live Demo & Repository
- **Frontend URL:** 
- **Backend URL:**
- **GitHub Repository:** [https://github.com/Akhilkumar4464/TODO-CODE-A-NOVA.git](https://github.com/Akhilkumar4464/TODO-CODE-A-NOVA.git)

---

## 🛠️ Project Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 (Vite) | High-performance UI rendering & routing |
| **Backend** | Node.js + Express 5 | REST API Server & Middleware controller |
| **Database** | MongoDB + Mongoose 9 | Data persistence, schemas, & validation |
| **Auth** | JWT + bcryptjs | Secure token sessions & password hashing |
| **Email** | Nodemailer | OTP delivery & contact/task notification emails |
| **Cron Jobs** | node-cron | Scheduled hourly email reminder checks |
| **Styling** | Tailwind CSS v4 | Modern, glassmorphism-based utility styles |

---

## ✨ Features & Capabilities

### 1. Authentication & Security
- **Signup (Registration):** Users register with their `UserName`, `gmail`, and `password`. Upon signup, a secure 6-digit OTP is generated and sent to their email.
- **OTP Verification:** Verification screen validates the 6-digit OTP (expires in 10 minutes). Once verified, the user's `isVerified` status is set to `true`, allowing them to log in.
- **Login:** Authenticates registered, verified users and issues a JWT token.
- **Protected Routes:** Frontend route guard (`ProtectedRoute.jsx`) restricts access to `/dashboard` for unauthenticated sessions.
- **Logout:** Discards the token from the client application.

### 2. Task Management (CRUD)
- **Create:** Add new tasks with `title`, optional `description`, optional `dueDate`, and `priority` level (`Low`, `Medium`, `High`).
- **Read:** Display all user tasks, filterable by status (`All`, `Pending`, `In-Progress`, `Completed`), and sorted by priority, due date, or default position.
- **Update:** Complete modal and quick-toggle updates for editing title, description, status, priority, and due dates.
- **Delete:** Task removal with user confirmation prompts.
- **Real-time Metrics:** High-level overview cards displaying counts of **Total**, **Pending**, **In-Progress**, and **Completed** tasks.

### 3. Advanced Features
- **Native HTML5 Drag-and-Drop:** Drag and reorder task cards directly in the UI. Features optimistic frontend updates for zero latency and persists changes using a backend bulk `Task.bulkWrite` endpoint.
- **Cron-based Email Reminders:** A background cron job runs hourly to identify tasks due within the next 24 hours (excluding completed ones) and sends automated reminder emails to users.
- **Contact Form Integration:** Users can submit inquiries via the `/contact` form page. The backend triggers a confirmation email response back to the sender.
- **Premium Glassmorphic Design:** Stylized dark mode dashboard utilizing custom buttons, cards, avatars, dialog modals, loading spinners, and toast alerts.

---

## 📂 Project Architecture

```text
TODO-CODE-A-NOVA-3/
├── backend/
│   ├── config/             # DB Connection, Mailer SMTP configs
│   ├── controllers/        # Route controllers (Task, Contact)
│   ├── cron/               # Hourly task due date email reminder (reminderCron.js)
│   ├── middlewares/        # JWT Authentication validator (auth.middleware.js)
│   ├── models/             # Mongoose schemas (User.model.js, Task.model.js)
│   ├── routes/             # Express API Routers (auth, task, contact)
│   ├── utils/              # OTP, Token, and legacy Email utilities
│   ├── .env                # Backend local environment configuration
│   ├── package.json        # Node.js backend dependencies & scripts
│   └── server.js           # Server application entry point
│
├── frontend/
│   ├── public/             # Static page assets
│   ├── src/
│   │   ├── assets/         # CSS style sheets
│   │   ├── components/     # Application view components
│   │   │   ├── layout/     # PageShell, Navbar, Footer components
│   │   │   ├── pages/      # Contact form component
│   │   │   ├── ui/         # Buttons, Avatars, Modals, Cards, Inputs, Toasts
│   │   │   ├── Dashboard.jsx # Main Dashboard view
│   │   │   ├── Home.jsx    # Home / Landing page view
│   │   │   ├── Login.jsx   # Login page component
│   │   │   ├── Signup.jsx  # Sign-up page component
│   │   │   ├── VerifyOtp.jsx # OTP verification step component
│   │   │   └── ProtectedRoute.jsx # Router session guard
│   │   ├── context/        # State management (AuthContext, TaskContext)
│   │   ├── App.jsx         # App routing & context initialization
│   │   ├── index.css       # Core Tailwind CSS directives
│   │   └── main.jsx        # Frontend entry point
│   ├── .env                # Frontend local API URL configurations
│   ├── package.json        # Frontend scripts & package dependencies
│   └── vite.config.js      # Vite build configurations
│
└── README.md               # Root Documentation (This file)
```

---

## 🗄️ Database Schema Details

### User Schema (`backend/models/User.model.js`)
```javascript
{
  UserName: { type: String, required: true, trim: true },
  gmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, trim: true, minlength: 6 },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  isVerified: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
}
```

### Task Schema (`backend/models/Task.model.js`)
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  dueDate: { type: Date, default: null },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In-Progress', 'Completed'], default: 'Pending' },
  position: { type: Number, default: 0 },
  reminderSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 🔌 API Endpoint Reference

### Authentication Endpoints
- **`POST /api/auth/register`** - Register a user and dispatch verification OTP.
- **`POST /api/auth/verify-otp`** - Verify OTP token and activate account status.
- **`POST /api/auth/login`** - Authenticate credentials and return JWT token.
- **`POST /api/auth/logout`** - Logs out the user (frontend clears JWT).
- **`GET /api/auth/profile`** - Get current logged-in user profile details *(Protected)*.
- **`GET /api/auth/me`** - Fetch current user info verification *(Protected)*.

### Task Endpoints
- **`GET /api/tasks`** - Fetch all tasks for the authenticated user, sorted by position *(Protected)*.
- **`POST /api/tasks`** - Create a new task with automatic position calculation *(Protected)*.
- **`PUT /api/tasks/reorder`** - Bulk updates task order sequence positions *(Protected)*.
- **`PUT /api/tasks/:id`** - Update specific task details (resets reminder if due date changes) *(Protected)*.
- **`DELETE /api/tasks/:id`** - Remove specific task *(Protected)*.

### Contact Endpoints
- **`POST /api/contact`** - Submits feedback messages and triggers customer confirmation mailings.

---

## ⚙️ Environment Variables Guide

### Backend Variables (`backend/.env`)
Create a `.env` file under the `/backend` folder:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/todoApp
JWT_SECRET=your_jwt_super_secret_key_here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:5173
```
> ⚠️ **Note:** To send emails via Gmail, make sure to generate an **App Password** from Google Account settings instead of using your primary password.

### Frontend Variables (`frontend/.env`)
Create a `.env` file under the `/frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏁 Step-by-Step Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas cloud account)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Akhilkumar4464/TODO-CODE-A-NOVA.git
cd TODO-CODE-A-NOVA
```

---

### Step 2: Configure Environments
Create a `.env` file in the `backend/` and `frontend/` folders using the environment templates shown in the **Environment Variables Guide** section above.

---

### Step 3: Run the Backend Server
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Start the Express development server (using `nodemon`):
   ```bash
   npm run dev
   ```
   *(Verify it prints `Server is running on port 5000`, `Connected to MongoDB` and `[CRON] reminderCron scheduled.`)*

---

### Step 4: Run the Frontend App
1. Open a new terminal tab and navigate to the `frontend` directory:
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
4. Access the client app in your browser at `http://localhost:5173`.

---
