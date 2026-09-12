import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Login from './pages/admin/Login';
import DashboardOverview from './pages/admin/DashboardOverview';
import SkillsManager from './pages/admin/SkillsManager';
import ProjectsManager from './pages/admin/ProjectsManager';
import ProfileManager from './pages/admin/ProfileManager';
import ExperiencesManager from './pages/admin/ExperiencesManager';
import BlogsManager from './pages/admin/BlogsManager';
import MessagesManager from './pages/admin/MessagesManager';
import ServicesManager from './pages/admin/ServicesManager';
import SocialLinksManager from './pages/admin/SocialLinksManager';
import ThemesManager from './pages/admin/ThemesManager';
import PlatformStatsManager from './pages/admin/PlatformStatsManager';

import Portfolio from './pages/public/Portfolio';
import BlogPost from './pages/public/BlogPost';
import AllProjects from './pages/public/AllProjects';
import AllBlogs from './pages/public/AllBlogs';

import ConstellationBackground from './components/ConstellationBackground';
import MouseCursor from './components/MouseCursor';

function App() {
  return (
    <Router>
      <ConstellationBackground />
      <MouseCursor />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Portfolio />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/blogs" element={<AllBlogs />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* Admin Login (Secret Route) */}
        <Route path="/admin/login420" element={<Login />} />
        <Route path="/admin/login" element={<Navigate to="/" replace />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="profile" element={<ProfileManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="social-links" element={<SocialLinksManager />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="experiences" element={<ExperiencesManager />} />
            <Route path="blogs" element={<BlogsManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="themes" element={<ThemesManager />} />
            <Route path="stats" element={<PlatformStatsManager />} />
          </Route>
        </Route>

        {/* Fallback to public page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
