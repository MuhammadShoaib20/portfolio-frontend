import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/layout/AdminLayout";
import Chatbot from "./components/common/Chatbot";

// Public Pages
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import BlogDetail from "./pages/BlogDetail";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Skills from "./pages/Skills";
import NotFound from "./pages/NotFound";

// Admin Pages
import Login from "./admin/Login";
import CreateAdmin from "./admin/CreateAdmin";
import Register from "./admin/Register";
import Dashboard from "./admin/Dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ManageProjects from "./admin/ManageProjects";
import AddProject from "./admin/AddProject";
import EditProject from "./admin/EditProject";
import ManageBlogs from "./admin/ManageBlogs";
import AddBlog from "./admin/AddBlog";
import EditBlog from "./admin/EditBlog";
import Messages from "./admin/Messages";
import EditProfile from "./admin/EditProfile";
import Settings from "./admin/Settings";
import AdminManagement from "./admin/AdminManagement";
import ResumeManagement from "./admin/ResumeManagement";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
            <Routes>
              {/* Public routes with Navbar and Footer */}
              <Route
                element={
                  <>
                    <Navbar />
                    <main className="flex-1 w-full">
                      <Outlet />
                    </main>
                    <Footer />
                  </>
                }
              >
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="*" element={<NotFound />} />
              </Route>

{/* Public admin routes (no layout) */}
<Route path="/admin/login" element={<Login />} />
<Route path="/admin/create" element={<CreateAdmin />} />
<Route path="/admin/register" element={<Register />} />

              {/* Protected admin routes with AdminLayout */}
              <Route element={<AdminLayout />}>
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/projects"
                  element={
                    <ProtectedRoute>
                      <ManageProjects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/projects/add"
                  element={
                    <ProtectedRoute>
                      <AddProject />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/projects/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditProject />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blogs"
                  element={
                    <ProtectedRoute>
                      <ManageBlogs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blogs/add"
                  element={
                    <ProtectedRoute>
                      <AddBlog />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blogs/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditBlog />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/messages"
                  element={
                    <ProtectedRoute>
                      <Messages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/profile"
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requiredRole="superadmin">
                      <AdminManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/resumes"
                  element={
                    <ProtectedRoute>
                      <ResumeManagement />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
            <Toaster position="top-right" />
            
            {/* ✅ Floating Chatbot - visible on all pages */}
            <Chatbot />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;