import { NavLink } from 'react-router-dom';
import { Home, AlertCircle, FileText } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function BottomNavbar() {
  const { t } = useLanguage();

  const navItems = [
    {
      to: '/',
      icon: Home,
      label: t({ en: 'Home', kn: 'ಮುಖಪುಟ' }),
    },
    {
      to: '/report',
      icon: AlertCircle,
      label: t({ en: 'Report', kn: 'ದೂರು' }),
    },
    {
      to: '/schemes',
      icon: FileText,
      label: t({ en: 'Schemes', kn: 'ಯೋಜನೆಗಳು' }),
    },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 px-2 py-2 max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                  <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-slate-600'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
