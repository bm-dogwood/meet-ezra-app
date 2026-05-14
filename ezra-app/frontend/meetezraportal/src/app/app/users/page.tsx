'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Users, Building2, Shield, UserPlus, Trash2, Edit, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { usersApi, tenantsApi } from '@/lib/api';

interface TenantUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'franchisor_admin' | 'franchise_user';
  organization: string;
  status: 'active' | 'pending' | 'disabled';
  createdAt: string;
}

interface Tenant {
  id: string;
  name: string;
  code: string;
  usersCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

const roleLabels: Record<string, { label: string; color: string }> = {
  super_admin: { label: 'Super Admin', color: 'bg-purple-500/10 text-purple-500' },
  franchisor_admin: { label: 'Franchisor Admin', color: 'bg-ezra-500/10 text-ezra-500' },
  franchise_user: { label: 'Franchise User', color: 'bg-surface-500/10 text-surface-400' },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: 'bg-success-500/10 text-success-500' },
  pending: { label: 'Pending', color: 'bg-warning-500/10 text-warning-500' },
  disabled: { label: 'Disabled', color: 'bg-danger-500/10 text-danger-500' },
  inactive: { label: 'Inactive', color: 'bg-surface-500/10 text-surface-400' },
};

export default function UsersManagementPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'tenants'>('users');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [users, setUsers] = useState<TenantUser[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await usersApi.list();
      const transformedUsers: TenantUser[] = (data as any[]).map((u: any) => ({
        id: String(u.id),
        name: u.first_name && u.last_name ? `${u.first_name} ${u.last_name}` : u.username,
        email: u.email,
        role: u.role || 'franchise_user',
        organization: u.tenant_name || 'Platform',
        status: u.is_active ? 'active' : 'disabled',
        createdAt: u.date_joined?.split('T')[0] || '',
      }));
      setUsers(transformedUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, [isAuthenticated]);

  // Fetch tenants from API
  const fetchTenants = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await tenantsApi.list();
      const transformedTenants: Tenant[] = (data as any[]).map((t: any) => ({
        id: String(t.id),
        name: t.name,
        code: t.code,
        usersCount: t.users_count || 0,
        status: t.is_active ? 'active' : 'inactive',
        createdAt: t.created_at?.split('T')[0] || '',
      }));
      setTenants(transformedTenants);
    } catch (err) {
      console.error('Failed to fetch tenants:', err);
    }
  }, [isAuthenticated]);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUsers(), fetchTenants()]);
      setIsLoading(false);
    };
    fetchData();
  }, [fetchUsers, fetchTenants]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'franchise_user' as const,
    organization: '',
  });

  const [newTenant, setNewTenant] = useState({
    name: '',
    code: '',
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
      // Find tenant ID from organization name
      const selectedTenant = tenants.find(t => t.name === newUser.organization);
      
      await usersApi.create({
        username: newUser.email.split('@')[0],
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        tenant_id: selectedTenant?.id,
      });
      
      setShowAddUserModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'franchise_user', organization: '' });
      setSuccessMessage('User created successfully! They will receive an email to set their password.');
      setTimeout(() => setSuccessMessage(''), 5000);
      
      // Refresh users list
      await fetchUsers();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create user');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
      await tenantsApi.create({
        name: newTenant.name,
        code: newTenant.code.toLowerCase().replace(/\s+/g, '-'),
      });
      
      setShowAddTenantModal(false);
      setNewTenant({ name: '', code: '' });
      setSuccessMessage('Tenant created successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
      
      // Refresh tenants list
      await fetchTenants();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create tenant');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await usersApi.delete(userId);
      setSuccessMessage('User deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh users list
      await fetchUsers();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete user');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
            User Management
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Manage tenants and users for your multi-tenant platform
          </p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'tenants' && (
            <Button 
              onClick={() => setShowAddTenantModal(true)}
              leftIcon={<Building2 className="w-4 h-4" />}
            >
              Add Tenant
            </Button>
          )}
          {activeTab === 'users' && (
            <Button 
              onClick={() => setShowAddUserModal(true)}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Add User
            </Button>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="p-4 rounded-lg bg-success-500/10 border border-success-500/20 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
          <p className="text-sm text-success-500">{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-danger-500/10 border border-danger-500/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0" />
          <p className="text-sm text-danger-500">{errorMessage}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-surface-200 dark:border-surface-700">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-ezra-500 text-ezra-500'
              : 'border-transparent text-surface-500 hover:text-surface-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users ({users.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('tenants')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'tenants'
              ? 'border-ezra-500 text-ezra-500'
              : 'border-transparent text-surface-500 hover:text-surface-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Tenants ({tenants.length})
          </div>
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Organization</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-surface-900 dark:text-surface-100">{user.name}</span>
                    </td>
                    <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleLabels[user.role].color}`}>
                        {roleLabels[user.role].label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{user.organization}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabels[user.status].color}`}>
                        {statusLabels[user.status].label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1 text-surface-400 hover:text-ezra-500 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-surface-400 hover:text-danger-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tenants Tab */}
      {activeTab === 'tenants' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Tenant Name</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Code</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Users</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-surface-500 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-surface-900 dark:text-surface-100">{tenant.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <code className="px-2 py-1 rounded bg-surface-100 dark:bg-surface-800 text-sm">{tenant.code}</code>
                    </td>
                    <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{tenant.usersCount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabels[tenant.status].color}`}>
                        {statusLabels[tenant.status].label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{tenant.createdAt}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1 text-surface-400 hover:text-ezra-500 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-surface-400 hover:text-danger-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-white mb-6">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="John Doe"
                required
              />
              <Input
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
              <Input
                label="Temporary Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Min 6 characters"
                required
              />
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg bg-surface-800 border border-surface-700 text-white focus:border-ezra-500 focus:ring-1 focus:ring-ezra-500 outline-none"
                >
                  <option value="franchise_user">Franchise User</option>
                  <option value="franchisor_admin">Franchisor Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Organization</label>
                <select
                  value={newUser.organization}
                  onChange={(e) => setNewUser({ ...newUser, organization: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-surface-800 border border-surface-700 text-white focus:border-ezra-500 focus:ring-1 focus:ring-ezra-500 outline-none"
                  required
                >
                  <option value="">Select tenant...</option>
                  {tenants.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddUserModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create User
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {showAddTenantModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-white mb-6">Add New Tenant</h3>
            <form onSubmit={handleAddTenant} className="space-y-4">
              <Input
                label="Tenant Name"
                type="text"
                value={newTenant.name}
                onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                placeholder="Acme Franchise"
                required
              />
              <Input
                label="Tenant Code"
                type="text"
                value={newTenant.code}
                onChange={(e) => setNewTenant({ ...newTenant, code: e.target.value })}
                placeholder="acme-franchise"
                required
              />
              <p className="text-sm text-surface-500">
                The tenant code will be used as a unique identifier. Use lowercase letters, numbers, and hyphens only.
              </p>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAddTenantModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Tenant
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
