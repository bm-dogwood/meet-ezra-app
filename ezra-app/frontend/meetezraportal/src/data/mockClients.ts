// ===========================================
// EZRA PORTAL - Mock Client Data
// ===========================================

import type { Client, User } from '@/types';

export const mockClients: Client[] = [
  {
    id: 'client-001',
    name: 'Glow Spa Franchise',
    slug: 'glow-spa',
    logo: '/logos/glow-spa.svg',
    primaryColor: '#8B5CF6',
    posSystem: 'zenoti',
    locationCount: 24,
    createdAt: '2023-06-15T00:00:00Z',
    status: 'active',
  },
  {
    id: 'client-002',
    name: 'FreshCuts Barbershop',
    slug: 'freshcuts',
    logo: '/logos/freshcuts.svg',
    primaryColor: '#10B981',
    posSystem: 'stripe',
    locationCount: 48,
    createdAt: '2023-08-22T00:00:00Z',
    status: 'active',
  },
  {
    id: 'client-003',
    name: 'Zen Wellness Studios',
    slug: 'zen-wellness',
    logo: '/logos/zen-wellness.svg',
    primaryColor: '#06B6D4',
    posSystem: 'zenoti',
    locationCount: 12,
    createdAt: '2024-01-10T00:00:00Z',
    status: 'active',
  },
  {
    id: 'client-004',
    name: 'Prime Fitness Group',
    slug: 'prime-fitness',
    logo: '/logos/prime-fitness.svg',
    primaryColor: '#EF4444',
    posSystem: 'toast',
    locationCount: 156,
    createdAt: '2023-03-01T00:00:00Z',
    status: 'active',
  },
];

export const mockUsers: User[] = [
  {
    id: 'user-001',
    email: 'admin@glowspa.com',
    name: 'Sarah Chen',
    role: 'franchisor',
    clientId: 'client-001',
    clientName: 'Glow Spa Franchise',
    avatar: undefined,
    permissions: [
      'view_all_locations',
      'export_data',
      'manage_users',
      'view_reports',
      'manage_settings',
    ],
  },
  {
    id: 'user-002',
    email: 'manager@glowspa.com',
    name: 'Mike Johnson',
    role: 'district_manager',
    clientId: 'client-001',
    clientName: 'Glow Spa Franchise',
    permissions: ['view_all_locations', 'export_data', 'view_reports'],
  },
  {
    id: 'user-003',
    email: 'store@glowspa.com',
    name: 'Emily Davis',
    role: 'store_manager',
    clientId: 'client-001',
    clientName: 'Glow Spa Franchise',
    permissions: ['view_assigned_locations', 'view_reports'],
  },
];

// Default demo user for mock login
export const demoUser: User = {
  id: 'demo-user',
  email: 'demo@ezra.ai',
  name: 'Demo User',
  role: 'franchisor',
  clientId: 'client-001',
  clientName: 'Glow Spa Franchise',
  permissions: [
    'view_all_locations',
    'export_data',
    'manage_users',
    'view_reports',
    'manage_settings',
  ],
};

/**
 * Get a client by ID
 */
export function getClientById(clientId: string): Client | undefined {
  return mockClients.find((client) => client.id === clientId);
}

/**
 * Get a user by email (for mock login)
 */
export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find((user) => user.email === email) || demoUser;
}

/**
 * Get users for a specific client
 */
export function getUsersByClient(clientId: string): User[] {
  return mockUsers.filter((user) => user.clientId === clientId);
}
