import { Navigate, Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, AlertTriangle, Images, Settings, LogOut, Menu, X, Loader2, Users2 } from 'lucide-react';
import { useState } from 'react';
import { useAdmin } from './AdminContext';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/leads', label: 'Leads', icon: Users },
  { path: '/admin/issues', label: 'Issues', icon: AlertTriangle },
  { path: '/admin/gallery', label: 'Gallery', icon: Images },
  { path: '/admin/leaders', label: 'Leaders', icon: Users2 },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { isAuthenticated, loading, logout } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile header */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-slate-100 rounded-lg"
        >
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="font-semibold text-slate-800">Admin Dashboard</h1>
        <div className="w-10" />
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h1 className="font-bold text-lg text-primary">Janaseva Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-slate-100 rounded"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 p-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
}
