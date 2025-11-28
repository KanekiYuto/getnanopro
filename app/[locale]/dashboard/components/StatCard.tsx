'use client';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  badge?: string;
  color: 'primary' | 'secondary' | 'blue' | 'purple';
  expiryInfo?: React.ReactNode;
}

const colorStyles = {
  primary: {
    bg: 'bg-primary/5',
    hoverBg: 'group-hover:bg-primary/10',
    iconBg: 'bg-primary/10',
    hoverIconBg: 'group-hover:bg-primary',
    iconColor: 'text-primary',
    hoverIconColor: 'group-hover:text-white',
    border: 'hover:border-primary/50',
    hoverTextColor: 'group-hover:text-primary',
    badgeBg: 'bg-gray-500/10',
    badgeText: 'text-gray-400',
  },
  secondary: {
    bg: 'bg-secondary/5',
    hoverBg: 'group-hover:bg-secondary/10',
    iconBg: 'bg-secondary/10',
    hoverIconBg: 'group-hover:bg-secondary',
    iconColor: 'text-secondary',
    hoverIconColor: 'group-hover:text-white',
    border: 'hover:border-secondary/50',
    hoverTextColor: 'group-hover:text-secondary',
    badgeBg: 'bg-secondary/10',
    badgeText: 'text-secondary',
  },
  blue: {
    bg: 'bg-blue-500/5',
    hoverBg: 'group-hover:bg-blue-500/10',
    iconBg: 'bg-blue-500/10',
    hoverIconBg: 'group-hover:bg-blue-500',
    iconColor: 'text-blue-500',
    hoverIconColor: 'group-hover:text-white',
    border: 'hover:border-blue-500/50',
    hoverTextColor: 'group-hover:text-blue-500',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-400',
  },
  purple: {
    bg: 'bg-purple-500/5',
    hoverBg: 'group-hover:bg-purple-500/10',
    iconBg: 'bg-purple-500/10',
    hoverIconBg: 'group-hover:bg-purple-500',
    iconColor: 'text-purple-500',
    hoverIconColor: 'group-hover:text-white',
    border: 'hover:border-purple-500/50',
    hoverTextColor: 'group-hover:text-purple-500',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-400',
  },
};

export default function StatCard({ icon, value, label, badge, color, expiryInfo }: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <div className={`group relative bg-gradient-to-br from-bg-elevated to-bg-elevated/50 rounded-2xl border border-border p-6 ${styles.border} transition-all duration-300 overflow-hidden cursor-pointer`}>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${styles.iconBg} ${styles.hoverIconBg} group-hover:scale-110 transition-all duration-300`}>
            <div className={`w-6 h-6 ${styles.iconColor} ${styles.hoverIconColor} transition-colors`}>
              {icon}
            </div>
          </div>
          {badge && (
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${styles.badgeBg} ${styles.badgeText}`}>
              {badge}
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-2 mb-2 flex-wrap">
          <h3 className={`text-3xl font-bold text-white ${styles.hoverTextColor} transition-colors`}>
            {value}
          </h3>
          {expiryInfo}
        </div>
        <p className="text-sm text-text-muted">{label}</p>
      </div>
    </div>
  );
}
