# TODO - MERN TODO App (Code-A-Nova)

## Goal
Build a premium full-stack TODO app with secure OTP auth, protected routes, task CRUD, drag-and-drop ordering, contact form email, and due-date reminder cron.

## Current repo snapshot
- Backend: auth + /profile only (OTP + JWT). No tasks/contact/cron yet.
- Frontend: auth pages + dashboard profile only. No AuthContext/TaskContext or task UI yet.
- CSS: Tailwind v4 is already present in frontend dependencies.

---

## Implementation Steps
### Backend (Node + Express + Mongo)
- [x] Fix backend `server.js` PORT selection and ensure dotenv loads before env usage.

- [x] Create `backend/config/db.js` and move Mongo connection logic.

- [ ] Create `backend/config/mailer.js` with SMTP transporter + console fallback when SMTP env missing.
- [ ] Refactor auth into controllers:
  - [ ] Create `backend/controllers/authController.js`
  - [ ] Create `backend/routes/authRoutes.js`
  - [ ] Wire routes from `server.js`
- [ ] Add task layer:
  - [ ] `backend/models/Task.js`
  - [ ] `backend/controllers/taskController.js`
  - [ ] `backend/routes/taskRoutes.js` (JWT protected)
- [ ] Add contact layer:
  - [ ] `backend/controllers/contactController.js`
  - [ ] `backend/routes/contactRoutes.js`
- [ ] Add cron:
  - [ ] `backend/cron/reminderCron.js`
  - [ ] Wire cron initialization in `server.js`
- [ ] Add/update `.env.example` files:
  - [ ] `backend/.env.example`
  - [ ] keep optional SMTP fallback behavior documented

### Frontend (React + Vite + Tailwind)
- [ ] Add API service wrapper using `VITE_API_URL`.
- [ ] Implement `AuthContext` and update auth pages + ProtectedRoute.
- [ ] Implement `TaskContext` and wire Dashboard data + metrics.
- [ ] Build full Dashboard task UI:
  - [ ] Create task form
  - [ ] Filter tabs, search, sorting
  - [ ] Task list with DnD using `@dnd-kit`
  - [ ] Edit modal + status toggle
- [ ] Add premium layout components:
  - [ ] Navbar, Footer, dark/light toggle
- [ ] Ensure all routes render correctly: Home, Signup, OTPVerify, Login, Dashboard, Contact

### Verification
- [ ] Backend manual tests (Postman/curl):
  - [ ] OTP register/verify/login
  - [ ] Protected route 401 without token
  - [ ] Tasks CRUD works only for the logged-in user
  - [ ] Contact endpoint sends emails (or console fallback)
- [ ] Frontend manual tests:
  - [ ] Dashboard metrics correct
  - [ ] DnD reorder persists (if backend field added)
  - [ ] Theme toggle works

