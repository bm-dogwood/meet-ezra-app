'use client';

import { useAuth } from '@/context/AuthContext';

interface UsePermissionsReturn {
  canConfigureAlerts: boolean;
  canViewAlerts: boolean;
  isFranchiseAdmin: boolean;
  isFranchiseUser: boolean;
  isSuperAdmin: boolean;
  userRole: string | undefined;
}

/**
 * Hook to check user permissions for various features
 * 
 * Permission Model for LP Alert Configuration:
 * - Franchise Admin (franchisor_admin): Can view AND edit
 * - Super Admin (super_admin): Can view only
 * - Franchise User (franchise_user): Can view only
 */
export function usePermissions(): UsePermissionsReturn {
  const { user } = useAuth();
  
  // Cast role to string for comparison (backend uses different role names)
  const userRole = user?.role as unknown as string | undefined;
  
  // Only Franchise Admin can configure alerts
  const canConfigureAlerts = userRole === 'franchisor_admin';
  
  // All authenticated users can view alerts
  const canViewAlerts = !!user;
  
  // Role checks
  const isFranchiseAdmin = userRole === 'franchisor_admin';
  const isFranchiseUser = userRole === 'franchise_user';
  const isSuperAdmin = userRole === 'super_admin';
  
  return {
    canConfigureAlerts,
    canViewAlerts,
    isFranchiseAdmin,
    isFranchiseUser,
    isSuperAdmin,
    userRole,
  };
}

export default usePermissions;
