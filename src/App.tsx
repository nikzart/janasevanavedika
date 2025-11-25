import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AdminProvider } from './admin/AdminContext';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import LeadsList from './admin/LeadsList';
import LeadDetail from './admin/LeadDetail';
import IssuesList from './admin/IssuesList';
import IssueDetail from './admin/IssueDetail';
import HomePage from './pages/HomePage';
import SchemesPage from './pages/SchemesPage';
import ReportIssuePage from './pages/ReportIssuePage';
import PageTransition from './components/PageTransition';
import BottomNavbar from './components/BottomNavbar';

const PUBLIC_ROUTES = ['/', '/schemes', '/report'];

function AnimatedRoutes() {
  const location = useLocation();
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes with page transitions */}
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/schemes"
            element={
              <PageTransition>
                <SchemesPage />
              </PageTransition>
            }
          />
          <Route
            path="/report"
            element={
              <PageTransition>
                <ReportIssuePage />
              </PageTransition>
            }
          />

          {/* Admin routes (no page transitions) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leads" element={<LeadsList />} />
            <Route path="leads/:id" element={<LeadDetail />} />
            <Route path="issues" element={<IssuesList />} />
            <Route path="issues/:id" element={<IssueDetail />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {/* Bottom navbar outside AnimatePresence - stays fixed during page transitions */}
      {isPublicRoute && <BottomNavbar />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <AnimatedRoutes />
      </AdminProvider>
    </BrowserRouter>
  );
}
