import { Home, Lightbulb, GraduationCap, Bus, Wheat, LucideProps, ChevronRight } from 'lucide-react';
import { Scheme } from '../types';
import { useLanguage } from '../hooks/useLanguage';

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Home,
  Lightbulb,
  GraduationCap,
  Bus,
  Wheat,
};

interface SchemeCardProps {
  scheme: Scheme;
  onClick: () => void;
  index?: number;
}

export default function SchemeCard({ scheme, onClick, index = 0 }: SchemeCardProps) {
  const { t } = useLanguage();
  const Icon = iconMap[scheme.icon] || Home;

  return (
    <button
      onClick={onClick}
      className="scheme-card w-full bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-left group animate-initial animate-fade-in-up"
      style={{
        ['--card-accent' as string]: scheme.colorAccent,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon with animated background */}
        <div
          className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${scheme.colorAccent}15` }}
        >
          <Icon
            className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
            style={{ color: scheme.colorAccent }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Benefit Badge */}
          <span
            className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white mb-1.5"
            style={{ backgroundColor: scheme.colorAccent }}
          >
            {scheme.benefitBadge}
          </span>

          {/* Scheme Name */}
          <h3
            className="font-bold text-base leading-tight transition-colors duration-200"
            style={{ color: scheme.colorAccent }}
          >
            {t(scheme.name)}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {t(scheme.tagline)}
          </p>

          {/* Description */}
          <p className="text-sm text-slate-600 mt-1.5 line-clamp-2">
            {t(scheme.description)}
          </p>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 self-center">
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition-all duration-300 group-hover:bg-slate-100 group-hover:translate-x-1">
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
          </div>
        </div>
      </div>
    </button>
  );
}
