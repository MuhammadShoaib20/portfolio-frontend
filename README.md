# Portfolio Frontend

This is the frontend of a full-stack portfolio application. It provides a modern, responsive interface for showcasing projects, blog posts, skills, and contact information, along with a full-featured admin panel for content management.

## 🔗 Links

- **Frontend (Vercel):** [https://my-portfolio-q9h8.vercel.app](https://my-portfolio-q9h8.vercel.app)
- **Backend API (Render):** [https://my-portfolio-ler8.onrender.com/api](https://my-portfolio-ler8.onrender.com/api)
- **GitHub:** [https://github.com/MuhammadShoaib20/my-portfolio](https://github.com/MuhammadShoaib20/my-portfolio)

> ⚠️ The backend API may return a 404 if the server is sleeping (Render free tier). Wait a moment and retry, or check the API URL in your environment config.

---

## 🚀 Features

- 🎨 **Modern UI** – Tailwind CSS, dark mode, animations (Framer Motion)
- 🔐 **Authentication** – JWT login for admin users with role-based access (admin, editor, superadmin)
- ✍️ **Admin Dashboard** – Manage projects, blog posts, messages, profile, settings, and resumes
- 📁 **File Uploads** – Images for projects/blogs and PDF/DOC resumes via Cloudinary
- 📨 **Contact Form** – Visitors can send messages; admin can mark as read/replied and delete
- 🧾 **Resume Downloads** – Multiple resume versions with download tracking
- 📊 **Analytics** – View and like counts for projects and blog posts

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI library |
| React Router DOM 7 | Client-side routing |
| Tailwind CSS 3 | Utility-first styling |
| Axios | HTTP client |
| React Hot Toast | Toast notifications |
| Framer Motion | Animations |
| React Icons | Icon library |
| date-fns | Date formatting |
| React Markdown | Render markdown content |

---

## 📦 Prerequisites

- Node.js **v18 or higher**
- npm or yarn
- Backend API running locally or deployed

---

## 🔧 Installation & Setup

**1. Clone the repository:**

```bash
git clone https://github.com/MuhammadShoaib20/my-portfolio.git
cd my-portfolio/frontend
```

**2. Install dependencies:**

```bash
npm install
```

**3. Create a `.env` file:**

```env
REACT_APP_API_URL=http://localhost:5000/api
```

> Replace with your live backend URL for production (e.g., `https://your-backend.onrender.com/api`).

**4. Start the development server:**

```bash
npm start
```

App will be available at [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── admin/              # Admin pages (dashboard, projects, blogs, etc.)
│   ├── components/         # Reusable UI components
│   ├── context/            # React contexts (Auth, Theme)
│   ├── pages/              # Public pages (Home, Projects, Blog, Contact)
│   ├── utils/              # Axios instance and API endpoints
│   ├── App.js              # Main app with routes
│   ├── index.js            # Entry point
│   └── index.css           # Tailwind + global styles
├── .env.example
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Run in development mode |
| `npm test` | Launch test runner |
| `npm run build` | Build for production |
| `npm run eject` | Eject from CRA (use with caution) |

---

## 🔌 API Integration

All API calls are centralized in `src/utils/api.js`. The Axios instance automatically attaches JWT tokens for protected routes and redirects to login on `401` errors.

| Module | Description |
|---|---|
| `authAPI` | Login, register, get/update profile, change password |
| `projectsAPI` | CRUD for projects |
| `blogsAPI` | CRUD for blog posts |
| `contactAPI` | Send and manage contact messages |
| `profileAPI` | Fetch and update public profile |
| `userAPI` | Manage admin users (superadmin only) |
| `resumeAPI` | Manage and download resume files |

---

## 🚀 Deployment

1. Build the project: `npm run build`
2. Deploy the `build/` folder to Vercel, Netlify, or any static host
3. Set `REACT_APP_API_URL` to your live backend URL

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## 📄 License

Licensed under the **MIT License**.

---

<div align="center">Built with ❤️ by <a href="https://github.com/MuhammadShoaib20">Muhammad Shoaib</a></div>