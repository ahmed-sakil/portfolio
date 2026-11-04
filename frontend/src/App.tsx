import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PortfolioHome } from './PortfolioHome';

const AdminLogin = React.lazy(() =>
  import('./features/admin/AdminLogin').then((m) => ({ default: m.AdminLogin }))
);
const AdminDashboard = React.lazy(() =>
  import('./features/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);

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

  // Group public portfolio routes under one stable key so the underlying canvas and scroll positions remain intact during slide transitions
  const routeGroupKey = location.pathname.startsWith('/admin') ? location.pathname : 'portfolio-canvas';

  return (
    <div key={routeGroupKey} className="min-h-screen animate-in slide-in-from-right-8 fade-in duration-300 ease-out">
      <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center font-mono text-xs text-text-muted">Loading...</div>}>
        <Routes location={location}>
          {/* Public Portfolio Routes */}
          <Route path="/" element={<PortfolioHome />} />
          <Route path="/projects" element={<PortfolioHome />} />
          <Route path="/project/:slug" element={<PortfolioHome />} />

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
      </Suspense>
    </div>
  );
};

export default App;
