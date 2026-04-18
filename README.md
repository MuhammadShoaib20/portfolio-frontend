# 🎨 Portfolio – Frontend

This is the frontend of a full-stack portfolio application built with **React**. It provides a modern, responsive UI for showcasing projects, blogs, skills, and includes a powerful admin dashboard.

---

## 🔗 Links

* 🚀 **Live Demo:**
  https://portfolio-frontend-two-eta.vercel.app

* 🖥️ **Backend API:**
  https://portfolio-backend-production-f6c0.up.railway.app/api

* 🐙 **GitHub:**
  https://github.com/MuhammadShoaib20/portfolio-frontend

---

## 🚀 Features

* 🎨 Modern UI (Tailwind CSS + Dark Mode)
* 🎬 Animations (Framer Motion)
* 🔐 JWT Authentication (Admin roles)
* ✍️ Admin Dashboard (projects, blogs, messages)
* 📁 File Uploads (Cloudinary)
* 📨 Contact Form
* 📄 Resume Management
* 📊 Analytics (views & likes)

---

## 🛠️ Tech Stack

| Technology         | Purpose       |
| ------------------ | ------------- |
| React 18           | UI            |
| React Router DOM 7 | Routing       |
| Tailwind CSS       | Styling       |
| Axios              | API calls     |
| React Hot Toast    | Notifications |
| Framer Motion      | Animations    |
| React Icons        | Icons         |
| date-fns           | Date handling |

---

## 📁 Project Structure

```bash
frontend/
├── public/
├── src/
│   ├── admin/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── utils/
│   ├── App.js
│   └── index.js
├── .env.example
├── package.json
└── tailwind.config.js
```

---

## ⚙️ Installation

```bash
git clone https://github.com/MuhammadShoaib20/portfolio-frontend.git
cd portfolio-frontend
npm install
```

---

## 🔧 Environment Variables

Create `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

👉 Production:

```env
REACT_APP_API_URL=https://portfolio-backend-production-f6c0.up.railway.app/api
```

---

## ▶️ Run Project

```bash
npm start
```

App runs on: **http://localhost:3000**

---

## 🚀 Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Add env: `REACT_APP_API_URL`
4. Deploy

---

## 📄 License

MIT License

---

<div align="center">
❤️ Built by Muhammad Shoaib
</div>
