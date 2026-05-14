// ===========================================
// EZRA PORTAL - Mock Location Data
// ===========================================

import type { Location, LocationFilters, PaginatedResponse } from '@/types';
import { randomInRange, randomFloatInRange } from '@/lib/utils';

// Generate realistic location data for Glow Spa Franchise
export const mockLocations: Location[] = [
  {
    id: 'loc-80660',
    clientId: 'client-001',
    storeCode: '80660',
    name: 'Apple Valley',
    address: '14825 Galaxie Ave',
    city: 'Apple Valley',
    state: 'MN',
    zipCode: '55124',
    timezone: 'America/Chicago',
    posSystem: 'zenoti',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    lpRiskScore: 12,
  },
  {
    id: 'loc-80661',
    clientId: 'client-001',
    storeCode: '80661',
    name: 'Woodbury',
    address: '9040 Hudson Rd',
    city: 'Woodbury',
    state: 'MN',
    zipCode: '55125',
    timezone: 'America/Chicago',
    posSystem: 'zenoti',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    lpRiskScore: 8,
  },
  {
    id: 'loc-80662',
    clientId: 'client-001',
    storeCode: '80662',
    name: 'Eden Prairie',
    address: '8251 Flying Cloud Dr',
    city: 'Eden Prairie',
    state: 'MN',
    zipCode: '55344',
    timezone: 'America/Chicago',
    posSystem: 'zenoti',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    lpRiskScore: 45,
  },
  {
    id: 'loc-80663',
    clientId: 'client-001',
    storeCode: '80663',
    name: 'Maple Grove',
    address: '11365 Fountains Dr N',
    city: 'Maple Grove',
    state: 'MN',
    zipCode: '55369',
    timezone: 'America/Chicago',
    posSystem: 'zenoti',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    lpRiskScore: 5,
  },
  {
    id: 'loc-80664',
    clientId: 'client-001',
    storeCode: '80664',
    name: 'Burnsville',
    address: '1150 Burnsville Center',
    city: 'Burnsville',
    state: 'MN',
    zipCode: '55306',
    timezone: 'America/Chicago',
    posSystem: 'zenoti',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    lpRiskScore: 22,
  },
  {
    id: 'loc-80665',
    clientId: 'client-001',
    storeCode: '80665',
    name: 'Roseville',
    address: '1700 County Road B W',
    city: 'Roseville',
    state: 'MN',
    zipCode: '55113',
    timezone: 'America/Chicago',
    posSystem: 'stripe',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    lpRiskScore: 15,
  },
  {
    id: 'loc-80666',
    clientId: 'client-001',
    storeCode: '80666',
    name: 'St. Louis Park',
    address: '5601 Excelsior Blvd',
    city: 'St. Louis Park',
    state: 'MN',
    zipCode: '55416',
    timezone: 'America/Chicago',
    posSystem: 'stripe',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    lpRiskScore: 9,
  },
  {
    id: 'loc-80667',
    clientId: 'client-001',
    storeCode: '80667',
    name: 'Eagan',
    address: '1276 Promenade Pl',
    city: 'Eagan',
    state: 'MN',
    zipCode: '55121',
    timezone: 'America/Chicago',
    posSystem: 'zenoti',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    lpRiskScore: 18,
  },
  {
    id: 'loc-80668',
    clientId: 'client-001',
    storeCode: '80668',
    name: 'Plymouth',
    address: '3400 Vicksburg Lane N',
    city: 'Plymouth',
    state: 'MN',
    zipCode: '55447',
    timezone: 'America/Chicago',
    posSystem: 'zenoti',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    lpRiskScore: 7,
  },
  {
    id: 'loc-80669',
    clientId: 'client-001',
    storeCode: '80669',
    name: 'Bloomington',
    address: '7821 Southtown Center',
    city: 'Bloomington',
    state: 'MN',
    zipCode: '55431',
    timezone: 'America/Chicago',
    posSystem: 'zenoti',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    lpRiskScore: 32,
  },
  {
    id: 'loc-80670',
    clientId: 'client-001',
    storeCode: '80670',
    name: 'Minnetonka',
    address: '11311 Highway 7',
    city: 'Minnetonka',
    state: 'MN',
    zipCode: '55305',
    timezone: 'America/Chicago',
    posSystem: 'stripe',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    lpRiskScore: 11,
  },
  {
    id: 'loc-80671',
    clientId: 'client-001',
    storeCode: '80671',
    name: 'Shakopee',
    address: '1159 Vierling Dr E',
    city: 'Shakopee',
    state: 'MN',
    zipCode: '55379',
    timezone: 'America/Chicago',
    posSystem: 'zenoti',
    status: 'onboarding',
    lastSyncAt: null,
    lpRiskScore: undefined,
  },
  // Texas expansion locations
  {
    id: 'loc-90001',
    clientId: 'client-001',
    storeCode: '90001',
    name: 'Austin - Downtown',
    address: '222 Congress Ave',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    timezone: 'America/Chicago',
    posSystem: 'stripe',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    lpRiskScore: 14,
  },
  {
    id: 'loc-90002',
    clientId: 'client-001',
    storeCode: '90002',
    name: 'Houston - Galleria',
    address: '5015 Westheimer Rd',
    city: 'Houston',
    state: 'TX',
    zipCode: '77056',
    timezone: 'America/Chicago',
    posSystem: 'stripe',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    lpRiskScore: 28,
  },
  {
    id: 'loc-90003',
    clientId: 'client-001',
    storeCode: '90003',
    name: 'Dallas - Uptown',
    address: '2700 Cedar Springs Rd',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75201',
    timezone: 'America/Chicago',
    posSystem: 'stripe',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    lpRiskScore: 19,
  },
  {
    id: 'loc-90004',
    clientId: 'client-001',
    storeCode: '90004',
    name: 'San Antonio - River Walk',
    address: '123 Losoya St',
    city: 'San Antonio',
    state: 'TX',
    zipCode: '78205',
    timezone: 'America/Chicago',
    posSystem: 'stripe',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    lpRiskScore: 6,
  },
  // California locations
  {
    id: 'loc-70001',
    clientId: 'client-001',
    storeCode: '70001',
    name: 'Los Angeles - Beverly Hills',
    address: '9560 Wilshire Blvd',
    city: 'Beverly Hills',
    state: 'CA',
    zipCode: '90212',
    timezone: 'America/Los_Angeles',
    posSystem: 'zenoti',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    lpRiskScore: 42,
  },
  {
    id: 'loc-70002',
    clientId: 'client-001',
    storeCode: '70002',
    name: 'San Francisco - Union Square',
    address: '333 Post St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94108',
    timezone: 'America/Los_Angeles',
    posSystem: 'zenoti',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 16 * 60 * 1000).toISOString(),
    lpRiskScore: 24,
  },
  {
    id: 'loc-70003',
    clientId: 'client-001',
    storeCode: '70003',
    name: 'San Diego - La Jolla',
    address: '7863 Girard Ave',
    city: 'La Jolla',
    state: 'CA',
    zipCode: '92037',
    timezone: 'America/Los_Angeles',
    posSystem: 'zenoti',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 13 * 60 * 1000).toISOString(),
    lpRiskScore: 8,
  },
  {
    id: 'loc-70004',
    clientId: 'client-001',
    storeCode: '70004',
    name: 'Palo Alto',
    address: '180 University Ave',
    city: 'Palo Alto',
    state: 'CA',
    zipCode: '94301',
    timezone: 'America/Los_Angeles',
    posSystem: 'stripe',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    lpRiskScore: 3,
  },
  // Florida locations
  {
    id: 'loc-60001',
    clientId: 'client-001',
    storeCode: '60001',
    name: 'Miami - Brickell',
    address: '701 Brickell Ave',
    city: 'Miami',
    state: 'FL',
    zipCode: '33131',
    timezone: 'America/New_York',
    posSystem: 'zenoti',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 19 * 60 * 1000).toISOString(),
    lpRiskScore: 35,
  },
  {
    id: 'loc-60002',
    clientId: 'client-001',
    storeCode: '60002',
    name: 'Orlando - Downtown',
    address: '425 E Central Blvd',
    city: 'Orlando',
    state: 'FL',
    zipCode: '32801',
    timezone: 'America/New_York',
    posSystem: 'zenoti',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 21 * 60 * 1000).toISOString(),
    lpRiskScore: 17,
  },
  {
    id: 'loc-60003',
    clientId: 'client-001',
    storeCode: '60003',
    name: 'Tampa - Hyde Park',
    address: '1602 W Snow Ave',
    city: 'Tampa',
    state: 'FL',
    zipCode: '33606',
    timezone: 'America/New_York',
    posSystem: 'stripe',
    status: 'active',
    lastSyncAt: new Date(Date.now() - 17 * 60 * 1000).toISOString(),
    lpRiskScore: 10,
  },
  {
    id: 'loc-60004',
    clientId: 'client-001',
    storeCode: '60004',
    name: 'Jacksonville',
    address: '225 Water St',
    city: 'Jacksonville',
    state: 'FL',
    zipCode: '32202',
    timezone: 'America/New_York',
    posSystem: 'zenoti',
    status: 'inactive',
    lastSyncAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lpRiskScore: undefined,
  },
];

/**
 * Get all locations for a client
 */
export function getLocationsByClient(clientId: string): Location[] {
  return mockLocations.filter((loc) => loc.clientId === clientId);
}

/**
 * Get a single location by ID
 */
export function getLocationById(locationId: string): Location | undefined {
  return mockLocations.find((loc) => loc.id === locationId);
}

/**
 * Get a location by store code
 */
export function getLocationByCode(storeCode: string): Location | undefined {
  return mockLocations.find((loc) => loc.storeCode === storeCode);
}

/**
 * Filter and paginate locations
 */
export function filterLocations(
  clientId: string,
  filters: LocationFilters = {},
  page = 1,
  pageSize = 10
): PaginatedResponse<Location> {
  let filtered = getLocationsByClient(clientId);

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (loc) =>
        loc.name.toLowerCase().includes(searchLower) ||
        loc.storeCode.toLowerCase().includes(searchLower) ||
        loc.city.toLowerCase().includes(searchLower)
    );
  }

  // Apply state filter
  if (filters.state) {
    filtered = filtered.filter((loc) => loc.state === filters.state);
  }

  // Apply status filter
  if (filters.status) {
    filtered = filtered.filter((loc) => loc.status === filters.status);
  }

  // Apply POS system filter
  if (filters.posSystem) {
    filtered = filtered.filter((loc) => loc.posSystem === filters.posSystem);
  }

  // Calculate pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = filtered.slice(startIndex, endIndex);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Get unique states from locations
 */
export function getUniqueStates(clientId: string): string[] {
  const locations = getLocationsByClient(clientId);
  const states = [...new Set(locations.map((loc) => loc.state))];
  return states.sort();
}

/**
 * Get location count by state
 */
export function getLocationCountByState(
  clientId: string
): { state: string; count: number }[] {
  const locations = getLocationsByClient(clientId);
  const counts: Record<string, number> = {};

  locations.forEach((loc) => {
    counts[loc.state] = (counts[loc.state] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Generate random today's revenue for a location
 */
export function generateTodayRevenue(locationId: string): number {
  // Use locationId as seed for consistent values
  const seed = locationId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const base = 2000 + (seed % 3000);
  const variance = randomFloatInRange(-200, 500, 0);
  return Math.round(base + variance);
}

/**
 * Generate random average ticket for a location
 */
export function generateAvgTicket(locationId: string): number {
  const seed = locationId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const base = 65 + (seed % 40);
  const variance = randomFloatInRange(-10, 15, 2);
  return Number((base + variance).toFixed(2));
}
