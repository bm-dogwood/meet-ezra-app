'use client';

// ===========================================
// EZRA PORTAL - Top Navigation Bar
// ===========================================

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useLocation } from '@/hooks/useLocations';
import {
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { getInitials } from '@/lib/utils';
import { changePassword } from '@/lib/auth';

interface TopBarProps {
  className?: string;
}

/**
 * Extracts the store code from a store name.
 * Store code is the last numeric sequence in the name.
 * Examples:
 * - "01 APPLE VALLEY 80660" -> "80660"
 * - "18828-LOCATED INSIDE WMART 1646" -> "1646"
 */
const extractStoreCode = (storeName: string): string | null => {
  if (!storeName) return null;
  // Find all numeric sequences in the string
  const matches = storeName.match(/\d+/g);
  // Return the last one (store code is always at the end)
  return matches && matches.length > 0 ? matches[matches.length - 1] : null;
};

export const TopBar: React.FC<TopBarProps> = ({ className }) => {
  const pathname = usePathname();
  const params = useParams();
  const { user, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Change password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const resetChangePasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setChangePasswordError('');
    setChangePasswordSuccess(false);
    setIsChangingPassword(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError('');
    
    if (newPassword !== confirmPassword) {
      setChangePasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setChangePasswordError('Password must be at least 6 characters');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setChangePasswordSuccess(true);
    } catch (err: any) {
      if (err.message.includes('incorrect')) {
        setChangePasswordError('Current password is incorrect. If you forgot your password, please sign out and use the Forgot Password option on the login page.');
      } else {
        setChangePasswordError(err.message || 'Failed to change password');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const closeChangePasswordModal = () => {
    setIsChangePasswordOpen(false);
    resetChangePasswordForm();
  };
  
  // Get store ID from params if on a location detail page
  const storeId = params?.storeId as string | undefined;
  const { location } = useLocation(storeId || '');
  const { overrides } = useBreadcrumb();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: { label: string; href: string }[] = [];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Format label
      let label = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      
      if (segment === 'app') label = 'Dashboard';
      if (segment.startsWith('loc-')) label = `Store ${segment.replace('loc-', '')}`;
      // For location detail pages, show store code instead of "Store Details"
      // Extract store code from store name (last numeric part)
      if (index > 0 && segments[index - 1] === 'locations' && /^\d+$/.test(segment)) {
        if (location?.name) {
          const storeCode = extractStoreCode(location.name);
          label = storeCode || 'Store Details';
        } else {
          label = 'Store Details';
        }
      }

      // Use breadcrumb override if available (for scheduling/exponential store pages)
      if (overrides[segment]) {
        label = overrides[segment];
      }

      breadcrumbs.push({ label, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header
      className={cn(
        'h-16 bg-white dark:bg-surface-900',
        'border-b border-surface-200 dark:border-surface-800',
        'flex items-center justify-between px-6',
        'sticky top-0 z-30',
        className
      )}
    >
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2">
        <nav className="flex items-center text-sm">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              {index > 0 && (
                <span className="mx-2 text-surface-400">/</span>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-surface-900 dark:text-surface-100">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            'p-2 rounded-lg transition-colors',
            'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300',
            'hover:bg-surface-100 dark:hover:bg-surface-800'
          )}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-surface-200 dark:bg-surface-700" />

        {/* Client/Brand Name */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800">
          <Building2 className="w-4 h-4 text-surface-500" />
          <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
            {user?.clientName || 'Default'}
          </span>
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={cn(
              'flex items-center gap-2 p-1.5 pr-3 rounded-lg transition-colors',
              'hover:bg-surface-100 dark:hover:bg-surface-800'
            )}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ezra-400 to-ezra-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user ? getInitials(user.name) : 'U'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-surface-500" />
          </button>

          {/* User dropdown */}
          {isUserMenuOpen && (
            <div
              className={cn(
                'absolute right-0 mt-2 w-56',
                'bg-white dark:bg-surface-850 rounded-xl',
                'border border-surface-200 dark:border-surface-700',
                'shadow-elevated',
                'animate-scale-in origin-top-right'
              )}
            >
              <div className="p-4 border-b border-surface-200 dark:border-surface-700">
                <p className="font-medium text-surface-900 dark:text-surface-100">
                  {user?.name || 'Demo User'}
                </p>
                <p className="text-sm text-surface-500 mt-0.5">
                  {user?.email || 'demo@ezra.ai'}
                </p>
              </div>
              <div className="p-2">
                <Link
                  href="/app/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  href="/app/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsChangePasswordOpen(true);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 w-full"
                >
                  <KeyRound className="w-4 h-4" />
                  Change Password
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={closeChangePasswordModal}
          />
          <div className="relative bg-white dark:bg-surface-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-elevated border border-surface-200 dark:border-surface-700">
            <button
              onClick={closeChangePasswordModal}
              className="absolute top-4 right-4 p-1 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              <X className="w-5 h-5" />
            </button>
            
            {changePasswordSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success-500" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
                  Password Changed
                </h3>
                <p className="text-surface-500 mb-6">
                  Your password has been updated successfully.
                </p>
                <button
                  onClick={closeChangePasswordModal}
                  className="px-6 py-2 bg-ezra-500 text-white rounded-lg hover:bg-ezra-600 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-1">
                  Change Password
                </h3>
                <p className="text-sm text-surface-500 mb-6">
                  Enter your current password and choose a new one.
                </p>

                {changePasswordError && (
                  <div className="mb-4 p-3 rounded-lg bg-danger-500/10 border border-danger-500/20 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-danger-500">{changePasswordError}</p>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-ezra-500 focus:border-transparent"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-ezra-500 focus:border-transparent"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-ezra-500 focus:border-transparent"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeChangePasswordModal}
                      className="flex-1 px-4 py-2.5 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="flex-1 px-4 py-2.5 bg-ezra-500 text-white rounded-lg hover:bg-ezra-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isChangingPassword ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Changing...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
