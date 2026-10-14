import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PortfolioHome } from './PortfolioHome';
import { AdminLogin } from './features/admin/AdminLogin';
import { AdminDashboard } from './features/admin/AdminDashboard';

// Simple Auth Guard
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('portfolio_admin_token');
  if (!token) {
    return <Navigate to="/admin/login404" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="min-h-screen animate-in slide-in-from-right-8 fade-in duration-300 ease-out">
      <Routes location={location}>
        {/* Public Single Page Portfolio */}
        <Route path="/" element={<PortfolioHome />} />

        {/* Obfuscated Admin Login Route */}
        <Route path="/admin/login404" element={<AdminLogin />} />

        {/* Protected Admin Console */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
