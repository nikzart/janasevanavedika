import { Home, Lightbulb, GraduationCap, Bus, Wheat, LucideIcon } from 'lucide-react';

interface SchemeConfig {
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const schemeConfig: Record<string, SchemeConfig> = {
  GL: {
    name: 'Gruha Lakshmi',
    icon: Home,
    color: '#C026D3',
    bgColor: 'bg-fuchsia-100',
  },
  GJ: {
    name: 'Gruha Jyothi',
    icon: Lightbulb,
    color: '#F59E0B',
    bgColor: 'bg-amber-100',
  },
  YN: {
    name: 'Yuva Nidhi',
    icon: GraduationCap,
    color: '#10B981',
    bgColor: 'bg-emerald-100',
  },
  SH: {
    name: 'Shakti',
    icon: Bus,
    color: '#EC4899',
    bgColor: 'bg-pink-100',
  },
  AB: {
    name: 'Anna Bhagya',
    icon: Wheat,
    color: '#8B5CF6',
    bgColor: 'bg-violet-100',
  },
};

interface SchemeIconProps {
  scheme: string;
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
}

const sizeClasses = {
  sm: { icon: 'w-4 h-4', container: 'w-6 h-6' },
  md: { icon: 'w-5 h-5', container: 'w-8 h-8' },
  lg: { icon: 'w-6 h-6', container: 'w-10 h-10' },
};

export function SchemeIcon({ scheme, size = 'sm', showBackground = true }: SchemeIconProps) {
  const config = schemeConfig[scheme];
  if (!config) return null;

  const Icon = config.icon;
  const sizes = sizeClasses[size];

  if (!showBackground) {
    return <Icon className={sizes.icon} style={{ color: config.color }} />;
  }

  return (
    <div
      className={`${config.bgColor} ${sizes.container} rounded-lg flex items-center justify-center flex-shrink-0`}
    >
      <Icon className={sizes.icon} style={{ color: config.color }} />
    </div>
  );
}

interface SchemeBadgeProps {
  scheme: string;
  size?: 'sm' | 'md';
}

export function SchemeBadge({ scheme, size = 'sm' }: SchemeBadgeProps) {
  const config = schemeConfig[scheme];
  if (!config) return <span>{scheme}</span>;

  return (
    <div className="flex items-center gap-2">
      <SchemeIcon scheme={scheme} size={size} />
      <span className={`font-medium ${size === 'sm' ? 'text-sm' : 'text-base'} text-slate-700`}>
        {config.name}
      </span>
    </div>
  );
}

export function getSchemeColor(scheme: string): string {
  return schemeConfig[scheme]?.color || '#64748b';
}

export function getSchemeName(scheme: string): string {
  return schemeConfig[scheme]?.name || scheme;
}
