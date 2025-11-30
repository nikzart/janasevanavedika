import { NavLink, useLocation } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { Home, AlertCircle, FileText, Images, Users } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function BottomNavbar() {
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      icon: Home,
      label: t({ en: 'Home', kn: 'ಮುಖಪುಟ' }),
      activeColor: 'text-white',
    },
    {
      to: '/report',
      icon: AlertCircle,
      label: t({ en: 'Report', kn: 'ದೂರು' }),
      activeColor: 'text-orange-400',
    },
    {
      to: '/schemes',
      icon: FileText,
      label: t({ en: 'Schemes', kn: 'ಯೋಜನೆಗಳು' }),
      activeColor: 'text-blue-400',
    },
    {
      to: '/gallery',
      icon: Images,
      label: t({ en: 'Gallery', kn: 'ಗ್ಯಾಲರಿ' }),
      activeColor: 'text-green-400',
    },
    {
      to: '/leaders',
      icon: Users,
      label: t({ en: 'Leaders', kn: 'ನಾಯಕರು' }),
      activeColor: 'text-purple-400',
    },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-40">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25, delay: 0.1 }}
        className="bg-slate-900 rounded-full shadow-2xl px-3 py-3 max-w-md mx-auto overflow-hidden"
      >
        <LayoutGroup>
          <div className="flex items-center justify-between">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2 px-2 py-1"
                >
                  <motion.div
                    layout="position"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-shrink-0">
                      <Icon
                        className={`w-6 h-6 ${
                          isActive ? item.activeColor : 'text-slate-500'
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </div>

                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15 }}
                        className={`text-sm font-semibold whitespace-nowrap ${item.activeColor}`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </motion.div>
                </NavLink>
              );
            })}
          </div>
        </LayoutGroup>
      </motion.div>
    </nav>
  );
}
