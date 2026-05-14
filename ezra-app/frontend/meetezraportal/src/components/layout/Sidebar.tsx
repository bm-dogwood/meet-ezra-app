'use client';

// ===========================================
// EZRA PORTAL - Sidebar Navigation
// ===========================================

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Shield,
  Calendar,
  Rocket,
  MapPin,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Target,
  Mail,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.FC<{ className?: string }>;
  badge?: string | number;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/app', icon: LayoutDashboard },
  { label: 'Ezra Scheduling', href: '/app/scheduling', icon: Calendar },
  { label: 'Ezra Exponential', href: '/app/exponential', icon: Rocket },
  { label: 'Ezra LP', href: '/app/lp', icon: Shield },
  { label: 'Ezra Sales', href: '/app/sales', icon: ShoppingCart },
  { label: 'Business Locations', href: '/app/locations', icon: MapPin },
  { label: 'Set Goals', href: '/app/goals', icon: Target },
  { label: 'Reports', href: '/app/reports', icon: FileText },
  { label: 'Report Scheduling', href: '/app/report-scheduling', icon: Mail },
  { label: 'Settings', href: '/app/settings', icon: Settings },
];

interface SidebarProps {
  className?: string;
  isDemoMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, isDemoMode = false }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app';
    return pathname.startsWith(href);
  };

  // Filter nav items based on user role — hide Report Scheduling for franchise_user
  const filteredNavItems = navItems.filter((item) => {
    if (item.href === '/app/report-scheduling' && (user?.role as unknown as string) === 'franchise_user') {
      return false;
    }
    return true;
  });

  return (
    <aside
      className={cn(
        'fixed left-0 z-40',
        isDemoMode ? 'top-10 h-[calc(100vh-40px)]' : 'top-0 h-screen',
        'bg-surface-925 border-r border-surface-800',
        'flex flex-col transition-all duration-300',
        isCollapsed ? 'w-[72px]' : 'w-[260px]',
        className
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-surface-800">
        <Link href="/app" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ezra-400 to-ezra-600 flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-white tracking-tight">
                Ezra
              </span>
              {isDemoMode && (
                <span className="text-xs text-ezra-400 font-medium">Demo Account</span>
              )}
            </div>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            'text-surface-400 hover:text-surface-200 hover:bg-surface-800',
            isCollapsed && 'ml-auto'
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                    'transition-all duration-200',
                    'group relative',
                    active
                      ? 'bg-ezra-500/10 text-ezra-400'
                      : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
                  )}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-ezra-500 rounded-r-full" />
                  )}

                  <Icon
                    className={cn(
                      'w-5 h-5 flex-shrink-0',
                      active ? 'text-ezra-400' : 'text-surface-500 group-hover:text-surface-300'
                    )}
                  />

                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-sm font-medium">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-ezra-500/20 text-ezra-400">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div
                      className={cn(
                        'absolute left-full ml-2 px-2 py-1 rounded-md',
                        'bg-surface-800 text-white text-sm font-medium',
                        'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
                        'transition-all duration-200 whitespace-nowrap',
                        'shadow-elevated z-50'
                      )}
                    >
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-surface-800">
        {!isCollapsed && (
          <div className="text-xs text-surface-500">
            <p>Ezra AI Platform</p>
            <p className="mt-0.5">v1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
