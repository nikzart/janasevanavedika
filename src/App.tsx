import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { AdminProvider } from './admin/AdminContext';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import LeadsList from './admin/LeadsList';
import LeadDetail from './admin/LeadDetail';
import IssuesList from './admin/IssuesList';
import IssueDetail from './admin/IssueDetail';
import GalleryManager from './admin/GalleryManager';
import Settings from './admin/Settings';
import HomePage from './pages/HomePage';
import SchemesPage from './pages/SchemesPage';
import ReportIssuePage from './pages/ReportIssuePage';
import GalleryPage from './pages/GalleryPage';
import LeadersPage from './pages/LeadersPage';
import PageTransition from './components/PageTransition';
import BottomNavbar from './components/BottomNavbar';
import InstallBanner from './components/InstallBanner';
import UpdateBanner from './components/UpdateBanner';

const PUBLIC_ROUTES = ['/', '/schemes', '/report', '/gallery', '/leaders'];

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
          <Route
            path="/gallery"
            element={
              <PageTransition>
                <GalleryPage />
              </PageTransition>
            }
          />
          <Route
            path="/leaders"
            element={
              <PageTransition>
                <LeadersPage />
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
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {/* Bottom navbar outside AnimatePresence - stays fixed during page transitions */}
      {isPublicRoute && <BottomNavbar />}

      {/* PWA Install Banner */}
      {isPublicRoute && <InstallBanner />}
    </>
  );
}

export default function App() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  return (
    <BrowserRouter>
      <AdminProvider>
        {needRefresh && <UpdateBanner onUpdate={handleUpdate} />}
        <AnimatedRoutes />
      </AdminProvider>
    </BrowserRouter>
  );
}
