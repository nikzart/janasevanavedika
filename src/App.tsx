import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from './admin/AdminContext';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import LeadsList from './admin/LeadsList';
import LeadDetail from './admin/LeadDetail';
import PublicApp from './PublicApp';

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicApp />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leads" element={<LeadsList />} />
            <Route path="leads/:id" element={<LeadDetail />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  );
}
