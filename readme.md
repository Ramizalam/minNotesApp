# 📝 Mini Notes App

A full-stack Notes application built with **React**, **Node.js/Express**, and **MongoDB**. Features user authentication, CRUD operations, search, and loading states.

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, Tailwind CSS 4, Vite     |
| Backend    | Node.js, Express 5                 |
| Database   | MongoDB, Mongoose 9                |
| Auth       | JWT (JSON Web Tokens), Cookie-based |
| Validation | Zod                                |

---

## 📁 Project Structure

```
mini-notes/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js       # Auth request handlers
│   │   └── note.controller.js       # Note request handlers
│   ├── middleware/
│   │   └── authorization.middleware.js  # JWT auth middleware
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── Note.js                  # Note schema
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   └── noteRoutes.js            # Note endpoints (protected)
│   ├── services/
│   │   ├── auth.service.js          # Auth business logic
│   │   └── note.service.js          # Note business logic
│   ├── server.js                    # App entry point
│   ├── .env                         # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── NoteForm.jsx         # Create/Edit note form
│   │   │   ├── NoteCard.jsx         # Individual note card
│   │   │   ├── Spinner.jsx          # Loading spinner
│   │   │   └── Toast.jsx            # Toast notifications
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication state
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Main notes page
│   │   │   ├── Login.jsx            # Login page
│   │   │   └── Register.jsx         # Registration page
│   │   ├── App.jsx                  # Root component with routing
│   │   ├── App.css
│   │   ├── index.css                # Global styles + Tailwind
│   │   └── main.jsx                 # Entry point
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ✨ Features

### 1. User Authentication
- Register with name, email, and password
- Login with email and password
- JWT stored in **httpOnly cookies** for security
- Protected routes — only authenticated users can access notes

### 2. Create Note
- Add a new note with **title** and **description**
- Input validation using Zod on the backend
- Loading spinner while creating

### 3. Read Notes
- View all your notes in a list (sorted newest first)
- Each note displays **title**, **description**, and **created date**
- Skeleton loading animation while fetching

### 4. Update Note
- Click the ✏️ edit button on any note
- Form auto-fills with existing data
- Loading spinner while updating

### 5. Delete Note
- Click the 🗑️ delete button on any note
- UI updates immediately after deletion
- Loading spinner on the specific card being deleted

### 6. Search Notes
- **Server-side search** by note title
- Debounced input (400ms) to reduce API calls
- Real-time results as you type

### 7. Loading States
- ⏳ **Skeleton loaders** when fetching notes
- ⏳ **Spinners** on create, update, and delete buttons
- ⏳ **Full-page spinner** during auth checks

---

## 🚀 How to Run Locally

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **MongoDB** (local or cloud) — [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)

---

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd mini-notes
```

---

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install
```

#### Configure Environment Variables

Open `backend/.env` and set your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/mini-notes
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_change_this
```

> **Note:** If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string:
> ```
> MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mini-notes
> ```

#### Start the Backend Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on http://localhost:5000
```

---

### Step 3: Setup Frontend

Open a **new terminal** and run:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

You should see:
```
VITE v8.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

### Step 4: Open the App

Go to **http://localhost:5173** in your browser.

1. You will be redirected to the **Login** page
2. Click **"Create one"** to register a new account
3. Fill in your name, email, and password (min 6 characters)
4. After registration, you'll be redirected to the **Home** page
5. Start creating, editing, searching, and deleting notes!

---

## 📡 API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint    | Auth Required | Description          |
|--------|-------------|:------------:|----------------------|
| POST   | `/register` | ❌           | Register a new user  |
| POST   | `/login`    | ❌           | Login user           |
| POST   | `/logout`   | ❌           | Logout (clear cookie)|
| GET    | `/me`       | ✅           | Get current user     |

### Note Routes (`/api/notes`)

| Method | Endpoint      | Auth Required | Description                    |
|--------|---------------|:------------:|--------------------------------|
| GET    | `/`           | ✅           | Get all notes (`?search=term`) |
| POST   | `/`           | ✅           | Create a new note              |
| PUT    | `/:id`        | ✅           | Update a note                  |
| DELETE | `/:id`        | ✅           | Delete a note                  |

---

## 🔧 Available Scripts

### Backend (`/backend`)

| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Start server with auto-reload (watch mode) |
| `npm start`     | Start server in production mode          |

### Frontend (`/frontend`)

| Command         | Description                   |
|-----------------|-------------------------------|
| `npm run dev`   | Start Vite dev server         |
| `npm run build` | Build for production          |
| `npm run preview` | Preview production build    |

---

## 📦 Dependencies

### Backend
| Package        | Purpose                    |
|----------------|----------------------------|
| express        | Web framework              |
| mongoose       | MongoDB ODM                |
| jsonwebtoken   | JWT token generation       |
| bcryptjs       | Password hashing           |
| cookie-parser  | Parse cookies from requests|
| cors           | Cross-origin requests      |
| dotenv         | Environment variables      |
| zod            | Input validation           |

### Frontend
| Package          | Purpose                 |
|------------------|-------------------------|
| react            | UI library              |
| react-dom        | React DOM rendering     |
| react-router-dom | Client-side routing     |
| tailwindcss      | Utility-first CSS       |
| @tailwindcss/vite| Tailwind Vite plugin    |
