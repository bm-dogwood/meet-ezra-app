/**
 * API Client for making authenticated requests to the Django backend
 */

import { getAccessToken, refreshToken, emitAuthError } from './auth'
import type { ReportSchedule } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ApiError {
  error: string
  detail?: string
}

export class ApiClient {
  private baseUrl: string
  private orgId: string | null = null

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl
  }

  setOrgId(orgId: string) {
    this.orgId = orgId
  }

  private async getHeaders(): Promise<HeadersInit> {
    let tok = getAccessToken()
    if (!tok) {
      throw new Error('No authentication token available')
    }

    const headers: HeadersInit = {
      'Authorization': `Bearer ${tok}`,
      'Content-Type': 'application/json',
    }

    return headers
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    let response = await fetch(url.toString(), {
      method: 'GET',
      headers: await this.getHeaders(),
    })

    // If 401, try refreshing token once
    if (response.status === 401) {
      const refreshedToken = await refreshToken()
      if (refreshedToken) {
        response = await fetch(url.toString(), {
          method: 'GET',
          headers: await this.getHeaders(),
        })
      } else {
        // Refresh failed - emit auth error for redirect
        emitAuthError()
        throw new Error('Session expired. Please log in again.')
      }
    }

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.detail || error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    // If 401, try refreshing token once
    if (response.status === 401) {
      const refreshedToken = await refreshToken()
      if (refreshedToken) {
        response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: await this.getHeaders(),
          body: data ? JSON.stringify(data) : undefined,
        })
      } else {
        emitAuthError()
        throw new Error('Session expired. Please log in again.')
      }
    }

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.detail || error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    // If 401, try refreshing token once
    if (response.status === 401) {
      const refreshedToken = await refreshToken()
      if (refreshedToken) {
        response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'PUT',
          headers: await this.getHeaders(),
          body: data ? JSON.stringify(data) : undefined,
        })
      } else {
        emitAuthError()
        throw new Error('Session expired. Please log in again.')
      }
    }

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.detail || error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async delete<T>(endpoint: string): Promise<T> {
    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    })

    // If 401, try refreshing token once
    if (response.status === 401) {
      const refreshedToken = await refreshToken()
      if (refreshedToken) {
        response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'DELETE',
          headers: await this.getHeaders(),
        })
      } else {
        emitAuthError()
        throw new Error('Session expired. Please log in again.')
      }
    }

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.detail || error.error || `HTTP ${response.status}`)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return response.json()
  }

  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, string>): Promise<T> {
    let tok = getAccessToken()
    if (!tok) {
      throw new Error('No authentication token available')
    }

    const formData = new FormData()
    formData.append('file', file)
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tok}`,
        // Don't set Content-Type - browser sets it with boundary for multipart
      },
      body: formData,
    })

    if (response.status === 401) {
      const refreshedToken = await refreshToken()
      if (refreshedToken) {
        response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${refreshedToken}`,
          },
          body: formData,
        })
      } else {
        emitAuthError()
        throw new Error('Session expired. Please log in again.')
      }
    }

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.detail || error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    // If 401, try refreshing token once
    if (response.status === 401) {
      const refreshedToken = await refreshToken()
      if (refreshedToken) {
        response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'PATCH',
          headers: await this.getHeaders(),
          body: data ? JSON.stringify(data) : undefined,
        })
      } else {
        emitAuthError()
        throw new Error('Session expired. Please log in again.')
      }
    }

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({ error: response.statusText }))
      throw new Error(error.detail || error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

}

// Export a singleton instance
export const apiClient = new ApiClient()

// Helper functions for specific endpoints
export const dsrApi = {
  regular: {
    tl: {
      list: (params?: { skip?: number; limit?: number }) => 
        apiClient.get('/api/dsr-regular-tl', params),
      get: (id: number) => 
        apiClient.get(`/api/dsr-regular-tl/${id}`),
      create: (data: any) => 
        apiClient.post('/api/dsr-regular-tl', data),
      update: (id: number, data: any) => 
        apiClient.put(`/api/dsr-regular-tl/${id}`, data),
      delete: (id: number) => 
        apiClient.delete(`/api/dsr-regular-tl/${id}`),
    },
    input: {
      list: (params?: { skip?: number; limit?: number }) => 
        apiClient.get('/api/dsr-regular-input', params),
      get: (id: number) => 
        apiClient.get(`/api/dsr-regular-input/${id}`),
      create: (data: any) => 
        apiClient.post('/api/dsr-regular-input', data),
      update: (id: number, data: any) => 
        apiClient.put(`/api/dsr-regular-input/${id}`, data),
      delete: (id: number) => 
        apiClient.delete(`/api/dsr-regular-input/${id}`),
    },
  },
  cali: {
    tl: {
      list: (params?: { skip?: number; limit?: number }) => 
        apiClient.get('/api/dsr-cali-tl', params),
      get: (id: number) => 
        apiClient.get(`/api/dsr-cali-tl/${id}`),
      create: (data: any) => 
        apiClient.post('/api/dsr-cali-tl', data),
      update: (id: number, data: any) => 
        apiClient.put(`/api/dsr-cali-tl/${id}`, data),
      delete: (id: number) => 
        apiClient.delete(`/api/dsr-cali-tl/${id}`),
    },
    input: {
      list: (params?: { skip?: number; limit?: number }) => 
        apiClient.get('/api/dsr-cali-input', params),
      get: (id: number) => 
        apiClient.get(`/api/dsr-cali-input/${id}`),
      create: (data: any) => 
        apiClient.post('/api/dsr-cali-input', data),
      update: (id: number, data: any) => 
        apiClient.put(`/api/dsr-cali-input/${id}`, data),
      delete: (id: number) => 
        apiClient.delete(`/api/dsr-cali-input/${id}`),
    },
  },
  nvaz: {
    tl: {
      list: (params?: { skip?: number; limit?: number }) => 
        apiClient.get('/api/dsr-nvaz-tl', params),
      get: (id: number) => 
        apiClient.get(`/api/dsr-nvaz-tl/${id}`),
      create: (data: any) => 
        apiClient.post('/api/dsr-nvaz-tl', data),
      update: (id: number, data: any) => 
        apiClient.put(`/api/dsr-nvaz-tl/${id}`, data),
      delete: (id: number) => 
        apiClient.delete(`/api/dsr-nvaz-tl/${id}`),
    },
    input: {
      list: (params?: { skip?: number; limit?: number }) => 
        apiClient.get('/api/dsr-nvaz-input', params),
      get: (id: number) => 
        apiClient.get(`/api/dsr-nvaz-input/${id}`),
      create: (data: any) => 
        apiClient.post('/api/dsr-nvaz-input', data),
      update: (id: number, data: any) => 
        apiClient.put(`/api/dsr-nvaz-input/${id}`, data),
      delete: (id: number) => 
        apiClient.delete(`/api/dsr-nvaz-input/${id}`),
    },
  },
}

export const dhrApi = {
  regular: {
    tracker: {
      list: (params?: { skip?: number; limit?: number }) => 
        apiClient.get('/api/dhr-regular-tracker', params),
      get: (id: number) => 
        apiClient.get(`/api/dhr-regular-tracker/${id}`),
      create: (data: any) => 
        apiClient.post('/api/dhr-regular-tracker', data),
      update: (id: number, data: any) => 
        apiClient.put(`/api/dhr-regular-tracker/${id}`, data),
      delete: (id: number) => 
        apiClient.delete(`/api/dhr-regular-tracker/${id}`),
    },
    input: {
      list: (params?: { skip?: number; limit?: number }) => 
        apiClient.get('/api/dhr-regular-input', params),
      get: (id: number) => 
        apiClient.get(`/api/dhr-regular-input/${id}`),
      create: (data: any) => 
        apiClient.post('/api/dhr-regular-input', data),
      update: (id: number, data: any) => 
        apiClient.put(`/api/dhr-regular-input/${id}`, data),
      delete: (id: number) => 
        apiClient.delete(`/api/dhr-regular-input/${id}`),
    },
  },
  cali: {
    tracker: {
      list: (params?: { skip?: number; limit?: number }) => 
        apiClient.get('/api/dhr-cali-tracker', params),
      get: (id: number) => 
        apiClient.get(`/api/dhr-cali-tracker/${id}`),
      create: (data: any) => 
        apiClient.post('/api/dhr-cali-tracker', data),
      update: (id: number, data: any) => 
        apiClient.put(`/api/dhr-cali-tracker/${id}`, data),
      delete: (id: number) => 
        apiClient.delete(`/api/dhr-cali-tracker/${id}`),
    },
    input: {
      list: (params?: { skip?: number; limit?: number }) => 
        apiClient.get('/api/dhr-cali-input', params),
      get: (id: number) => 
        apiClient.get(`/api/dhr-cali-input/${id}`),
      create: (data: any) => 
        apiClient.post('/api/dhr-cali-input', data),
      update: (id: number, data: any) => 
        apiClient.put(`/api/dhr-cali-input/${id}`, data),
      delete: (id: number) => 
        apiClient.delete(`/api/dhr-cali-input/${id}`),
    },
  },
  nvaz: {
    tracker: {
      list: (params?: { skip?: number; limit?: number }) => 
        apiClient.get('/api/dhr-nvaz-tracker', params),
      get: (id: number) => 
        apiClient.get(`/api/dhr-nvaz-tracker/${id}`),
      create: (data: any) => 
        apiClient.post('/api/dhr-nvaz-tracker', data),
      update: (id: number, data: any) => 
        apiClient.put(`/api/dhr-nvaz-tracker/${id}`, data),
      delete: (id: number) => 
        apiClient.delete(`/api/dhr-nvaz-tracker/${id}`),
    },
    input: {
      list: (params?: { skip?: number; limit?: number }) => 
        apiClient.get('/api/dhr-nvaz-input', params),
      get: (id: number) => 
        apiClient.get(`/api/dhr-nvaz-input/${id}`),
      create: (data: any) => 
        apiClient.post('/api/dhr-nvaz-input', data),
      update: (id: number, data: any) => 
        apiClient.put(`/api/dhr-nvaz-input/${id}`, data),
      delete: (id: number) => 
        apiClient.delete(`/api/dhr-nvaz-input/${id}`),
    },
  },
}

// Locations and Sales Performance API
export const locationsApi = {
  list: (params?: { 
    city?: string; 
    state?: string; 
    status?: string;
    state_region?: string;
    skip?: number; 
    limit?: number 
  }) => apiClient.get('/api/locations', params),
  get: (id: string) => apiClient.get(`/api/locations/${id}`),
  create: (data: any) => apiClient.post('/api/locations', data),
  update: (id: string, data: any) => apiClient.put(`/api/locations/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/locations/${id}`),
  updateStatus: (id: string, status: 'active' | 'inactive' | 'onboarding' | 'pending' | 'suspended' | 'closed') =>
    apiClient.put(`/api/locations/${id}/status`, { status }),
  getCities: () => apiClient.get('/api/locations/filter/cities'),
  getStates: () => apiClient.get('/api/locations/filter/states/'),
  getCityStateCombinations: () => apiClient.get('/api/locations/filter/city-state'),
  getByState: (params?: {
    state?: string;
    status?: string;
    state_region?: string;
  }) => apiClient.get('/api/locations/by-state', params),
  getStateLocations: (state: string, status?: string) =>
    apiClient.get(`/api/states/${state}/locations`, status ? { status } : {}),
}

// States API
export const statesApi = {
  getSummary: (state?: string) => 
    apiClient.get('/api/states/summary', state ? { state } : {}),
}

export const salesApi = {
  dailyPerformance: {
    list: (params?: {
      location_id?: string;
      city?: string;
      state?: string;
      start_date?: string;
      end_date?: string;
      skip?: number;
      limit?: number;
    }) => apiClient.get('/api/daily-sales-performance', params),
    getSummary: (locationId: string, params?: {
      start_date?: string;
      end_date?: string;
    }) => apiClient.get(`/api/daily-sales-performance/${locationId}/summary`, params),
    getDailyBreakdown: (locationId: string, startDate: string, endDate: string) =>
      apiClient.get(`/api/daily-sales-performance/${locationId}/daily-breakdown`, {
        start_date: startDate,
        end_date: endDate,
      }),
    create: (data: any) => apiClient.post('/api/daily-sales-performance', data),
    update: (id: string, data: any) => apiClient.put(`/api/daily-sales-performance/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/daily-sales-performance/${id}`),
  },
  /**
   * Get comprehensive sales report for a store
   * Returns all data points needed for the dashboard:
   * - Summary KPIs
   * - Daily breakdown table
   * - Revenue over time (for charts)
   * - Payment mix
   * - Goal comparisons
   */
  getSalesReport: (storeId: string, startDate: string, endDate: string) =>
    apiClient.get(`/api/stores/${storeId}/sales-report`, {
      start_date: startDate,
      end_date: endDate,
    }),
  /**
   * Get aggregate sales overview metrics across all stores
   * Returns KPIs, revenue trend, and sales by location
   */
  getOverview: (params?: { days?: number; period?: 'daily' | 'weekly' | 'monthly' }) =>
    apiClient.get('/api/sales/overview/', params),
  getTopPerformers: (params?: { limit?: number }) =>
    apiClient.get('/api/sales/top-performers/', params),
  getQuickStats: () =>
    apiClient.get('/api/sales/quick-stats/'),
}

// Store Metrics API
export const storeMetricsApi = {
  getAll: () => apiClient.get('/api/stores/metrics/'),
}

// Stores API
export const storesApi = {
  list: (params?: {
    location_id?: string;
    status?: string;
    city?: string;
    state?: string;
    skip?: number;
    limit?: number;
    include_all?: boolean;
  }) => apiClient.get('/api/stores', params),
  get: (id: string) => apiClient.get(`/api/stores/${id}`),
  create: (data: any) => apiClient.post('/api/stores', data),
  update: (id: string, data: any) => apiClient.put(`/api/stores/${id}`, data),
  updateStatus: (id: string, status: 'active' | 'inactive' | 'onboarding' | 'pending' | 'suspended' | 'closed') =>
    apiClient.put(`/api/stores/${id}/status`, { status }),
  delete: (id: string) => apiClient.delete(`/api/stores/${id}`),
  getByLocation: (locationId: string, status?: string) =>
    apiClient.get(`/api/locations/${locationId}/stores`, status ? { status } : {}),
  goals: {
    list: (params?: { skip?: number; limit?: number }) =>
      apiClient.get('/api/location-goals', params),
    get: (id: string) => apiClient.get(`/api/location-goals/${id}`),
    create: (data: any) => apiClient.post('/api/location-goals', data),
    update: (id: string, data: any) => apiClient.put(`/api/location-goals/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/location-goals/${id}`),
  },
  transactions: {
    list: (params?: { skip?: number; limit?: number }) =>
      apiClient.get('/api/sales-transactions', params),
    get: (id: string) => apiClient.get(`/api/sales-transactions/${id}`),
    create: (data: any) => apiClient.post('/api/sales-transactions', data),
    update: (id: string, data: any) => apiClient.put(`/api/sales-transactions/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/sales-transactions/${id}`),
  },
}

// LP (Loss Prevention) API
export const lpApi = {
  getOverview: (params?: { start_date?: string; end_date?: string }) => 
    apiClient.get('/api/lp/overview', params),
  getAlerts: (params?: {
    status?: string;
    alert_type?: string;
    limit?: number;
    skip?: number;
    start_date?: string;
    end_date?: string;
    store_code?: string;
  }) => apiClient.get('/api/lp/alerts', params),
  getAlertDetail: (alertType: string) => 
    apiClient.get(`/api/lp/alerts/${alertType}/`),
  getFlagsByLocation: (params?: { 
    report_date?: string;
  }) => apiClient.get('/api/lp/flags-by-location/', params),
  getConfig: () => apiClient.get('/api/lp/config/'),
  updateConfig: (data: {
    thresholds?: {
      cash_ratio?: { yellow_min?: number; red_min?: number };
      tip_percent?: { green_min?: number; green_max?: number; yellow_low?: number; yellow_high?: number };
      low_ticket?: { yellow_min?: number; red_min?: number };
    };
    low_ticket_services?: string[];
  }) => apiClient.put('/api/lp/config/', data),
  calculate: (reportDate?: string) => 
    apiClient.post('/api/lp/calculate/', { report_date: reportDate }),
}

/**
 * Download LP Report as Excel file
 * Supports both daily and weekly report types with date range filtering
 */
export const downloadLPReport = async (options?: {
  reportType?: 'daily' | 'weekly';
  reportDate?: string;
  startDate?: string;
  endDate?: string;
}): Promise<void> => {
  const { getAccessToken, refreshToken } = await import('./auth');
  
  let token = getAccessToken();
  if (!token) {
    throw new Error('No authentication token available');
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const url = new URL(`${API_URL}/api/lp/report/download/`);
  
  // Add query parameters based on options
  if (options?.reportType) {
    url.searchParams.append('report_type', options.reportType);
  }
  if (options?.reportDate) {
    url.searchParams.append('report_date', options.reportDate);
  }
  if (options?.startDate) {
    url.searchParams.append('start_date', options.startDate);
  }
  if (options?.endDate) {
    url.searchParams.append('end_date', options.endDate);
  }

  let response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  // If 401, try refreshing token once
  if (response.status === 401) {
    const refreshedToken = await refreshToken();
    if (refreshedToken) {
      response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${refreshedToken}`,
        },
      });
    } else {
      // Refresh failed - emit auth error for redirect
      const { emitAuthError } = await import('./auth');
      emitAuthError();
      throw new Error('Session expired. Please log in again.');
    }
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const error = await response.json();
      throw new Error(error.error || error.detail || `HTTP ${response.status}`);
    }
    throw new Error(`Failed to download report: HTTP ${response.status}`);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `LP_Risk_Analysis.xlsx`;
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^";\n]+)"?/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }

  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

// Users API
export const usersApi = {
  list: (params?: { skip?: number; limit?: number; tenant_id?: string }) =>
    apiClient.get('/api/users/', params),
  get: (id: string) => apiClient.get(`/api/users/${id}/`),
  create: (data: {
    username: string;
    email: string;
    password: string;
    role: string;
    tenant_id?: string;
  }) => apiClient.post('/api/users/', data),
  update: (id: string, data: any) => apiClient.put(`/api/users/${id}/`, data),
  delete: (id: string) => apiClient.delete(`/api/users/${id}/`),
}

// Tenants API
export const tenantsApi = {
  list: (params?: { skip?: number; limit?: number }) =>
    apiClient.get('/api/tenants/', params),
  get: (id: string) => apiClient.get(`/api/tenants/${id}/`),
  create: (data: { name: string; code: string }) =>
    apiClient.post('/api/tenants/', data),
  update: (id: string, data: any) => apiClient.put(`/api/tenants/${id}/`, data),
  delete: (id: string) => apiClient.delete(`/api/tenants/${id}/`),
}

// Reports API
export const reportsApi = {
  list: (params?: { type?: string; skip?: number; limit?: number }) =>
    apiClient.get('/api/reports/', params),
  get: (id: string) => apiClient.get(`/api/reports/${id}/`),
  generate: (data: { type: string; date_range?: { start: string; end: string } }) =>
    apiClient.post('/api/reports/generate/', data),
  download: (id: string) => apiClient.get(`/api/reports/${id}/download/`),
}

// Sales Report Download API
export interface SalesReportDownloadParams {
  reportType: 'daily' | 'weekly';
  date?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Download sales report as Excel file
 * Handles blob response and triggers browser download
 */
export const downloadSalesReport = async (params: SalesReportDownloadParams): Promise<void> => {
  const { getAccessToken, refreshToken } = await import('./auth');
  
  let token = getAccessToken();
  if (!token) {
    throw new Error('No authentication token available');
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const url = new URL(`${API_URL}/api/reports/sales/download/`);
  url.searchParams.append('report_type', params.reportType);
  if (params.date) {
    url.searchParams.append('date', params.date);
  }
  if (params.startDate) {
    url.searchParams.append('start_date', params.startDate);
  }
  if (params.endDate) {
    url.searchParams.append('end_date', params.endDate);
  }

  let response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  // If 401, try refreshing token once
  if (response.status === 401) {
    const refreshedToken = await refreshToken();
    if (refreshedToken) {
      response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${refreshedToken}`,
        },
      });
    } else {
      // Refresh failed - emit auth error for redirect
      const { emitAuthError } = await import('./auth');
      emitAuthError();
      throw new Error('Session expired. Please log in again.');
    }
  }

  if (!response.ok) {
    // Try to parse error response as JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const error = await response.json();
      throw new Error(error.error || error.detail || `HTTP ${response.status}`);
    }
    throw new Error(`Failed to download report: HTTP ${response.status}`);
  }

  // Get the blob from response
  const blob = await response.blob();

  // Extract filename from Content-Disposition header or generate default
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `${params.reportType}_sales_report.xlsx`;
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^";\n]+)"?/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }

  // Create download link and trigger download
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

// Scheduling Report Download
export const downloadSchedulingReport = async (options?: {
  startDate?: string;
  endDate?: string;
}): Promise<void> => {
  const { getAccessToken, refreshToken } = await import('./auth');

  let token = getAccessToken();
  if (!token) {
    throw new Error('No authentication token available');
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const url = new URL(`${API_URL}/api/scheduling/report/download/`);
  if (options?.startDate) url.searchParams.append('start_date', options.startDate);
  if (options?.endDate) url.searchParams.append('end_date', options.endDate);

  let response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (response.status === 401) {
    const refreshedToken = await refreshToken();
    if (refreshedToken) {
      response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${refreshedToken}` },
      });
    } else {
      const { emitAuthError } = await import('./auth');
      emitAuthError();
      throw new Error('Session expired. Please log in again.');
    }
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const error = await response.json();
      throw new Error(error.error || error.detail || `HTTP ${response.status}`);
    }
    throw new Error(`Failed to download report: HTTP ${response.status}`);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = 'Scheduling_Report.xlsx';
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^";\n]+)"?/);
    if (filenameMatch && filenameMatch[1]) filename = filenameMatch[1];
  }

  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

// ===========================================
// Exponential Report Download
// ===========================================
export const downloadExponentialReport = async (options?: {
  startDate?: string;
  endDate?: string;
}): Promise<void> => {
  const { getAccessToken, refreshToken } = await import('./auth');

  let token = getAccessToken();
  if (!token) {
    throw new Error('No authentication token available');
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const url = new URL(`${API_URL}/api/exponential/report/download/`);
  if (options?.startDate) url.searchParams.append('start_date', options.startDate);
  if (options?.endDate) url.searchParams.append('end_date', options.endDate);

  let response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (response.status === 401) {
    const refreshedToken = await refreshToken();
    if (refreshedToken) {
      response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${refreshedToken}` },
      });
    } else {
      const { emitAuthError } = await import('./auth');
      emitAuthError();
      throw new Error('Session expired. Please log in again.');
    }
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const error = await response.json();
      throw new Error(error.error || error.detail || `HTTP ${response.status}`);
    }
    throw new Error(`Failed to download report: HTTP ${response.status}`);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = 'Exponential_Report.xlsx';
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^";\n]+)"?/);
    if (filenameMatch && filenameMatch[1]) filename = filenameMatch[1];
  }

  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
}

// Store Targets types
interface StoreTarget {
  store_id: number;
  store_name: string;
  store_code: string;
  city: string | null;
  state: string | null;
  daily_revenue_target: number;
  daily_labor_target_hours: number;
  has_target: boolean;
}

interface TargetsResponse {
  target_date: string;
  targets: StoreTarget[];
  total_stores: number;
}

// Store Targets API (Set Goals)
export const targetsApi = {
  getTargets: (targetDate?: string): Promise<TargetsResponse> =>
    apiClient.get<TargetsResponse>('/api/stores/targets/', targetDate ? { target_date: targetDate } : {}),
  setTarget: (data: {
    store_id: number;
    target_date?: string;
    daily_revenue_target?: number;
    daily_labor_target_hours?: number;
    revenue_target?: number;
    labor_target_hours?: number;
  }) => apiClient.post('/api/stores/targets/', data),
}

// Current User API (with tenant info)
export const currentUserApi = {
  getProfile: () => apiClient.get('/api/users/me/'),
}

// Report Schedules API
export const schedulesApi = {
  list: (params?: { page?: number; page_size?: number }): Promise<any> =>
    params?.page
      ? apiClient.get<any>('/api/schedules/', params)
      : apiClient.get<ReportSchedule[]>('/api/schedules/'),
  create: (data: {
    name: string;
    report_types: ('daily' | 'weekly' | 'lp' | 'scheduling' | 'exponential')[];
    cron_expression: string;
    schedule_time: string;
    timezone: string;
    recipients: string[];
  }): Promise<ReportSchedule> =>
    apiClient.post<ReportSchedule>('/api/schedules/', data),
  update: (id: number, data: {
    name?: string;
    report_types?: ('daily' | 'weekly' | 'lp' | 'scheduling' | 'exponential')[];
    cron_expression?: string;
    schedule_time?: string;
    timezone?: string;
    recipients?: string[];
  }): Promise<ReportSchedule> =>
    apiClient.put<ReportSchedule>(`/api/schedules/${id}/`, data),
  delete: (id: number): Promise<void> =>
    apiClient.delete<void>(`/api/schedules/${id}/`),
  toggle: (id: number, isActive: boolean): Promise<ReportSchedule> =>
    apiClient.patch<ReportSchedule>(`/api/schedules/${id}/`, { is_active: isActive }),
}

// ===========================================
// Exponential (Customer Follow-up) API
// ===========================================
export const exponentialApi = {
  getOverview: (params?: { start_date?: string; end_date?: string }) =>
    apiClient.get('/api/exponential/overview/', params),
  getStoreDrilldown: (storeId: string | number, params?: { start_date?: string; end_date?: string }) =>
    apiClient.get(`/api/exponential/stores/${storeId}/`, params),
  getCampaigns: (params?: { status?: string; segment?: string; search?: string; page?: number; limit?: number }) =>
    apiClient.get('/api/exponential/campaigns/', params),
  createCampaign: (data: {
    name: string;
    target_bucket: string;
    message_template?: string;
    coupon_value?: number;
    coupon_code?: string;
    booking_link?: string;
    scope?: string;
    store_id?: number;
    location_ids?: (number | string)[];
    guest_ids?: string[];
    schedule_type?: 'immediate' | 'scheduled' | 'recurring';
    scheduled_at?: string | null;
    execute_now?: boolean;
    is_recurring?: boolean;
    recurring_frequency?: string;
    recurring_end_date?: string | null;
  }) => apiClient.post('/api/exponential/campaigns/', data),
  updateCampaign: (campaignId: number | string, data: Record<string, any>) =>
    apiClient.put(`/api/exponential/campaigns/${campaignId}/detail/`, data),
  deleteCampaign: (campaignId: number | string) =>
    apiClient.delete(`/api/exponential/campaigns/${campaignId}/detail/`),
  deleteCampaignById: (campaignId: number | string) =>
    apiClient.delete(`/api/exponential/campaigns/${campaignId}/detail/`),
  getCampaignDetail: (campaignId: string | number, params?: { message_status?: string; search?: string; page?: number; limit?: number }) =>
    apiClient.get(`/api/exponential/campaigns/${campaignId}/detail/`, params),
  executeCampaign: (campaignId: number | string) =>
    apiClient.post(`/api/exponential/campaigns/${campaignId}/execute/`),
  updateCampaignStatus: (campaignId: number, status: string) =>
    apiClient.put(`/api/exponential/campaigns/${campaignId}/status/`, { status }),
  getLocations: (params?: { store_id?: string }) =>
    apiClient.get('/api/exponential/locations/', params),
  getGuests: (params?: { store_id?: string; bucket?: string; search?: string; page?: number; limit?: number; source?: string; last_service?: string; last_services?: string; guest_type?: string; sort?: string; sms_status?: string; location_ids?: string; date_from?: string; date_to?: string }) =>
    apiClient.get('/api/exponential/guests/', params),
  getServiceTypes: () =>
    apiClient.get('/api/exponential/guests/service-types/'),
  importGuests: (guests: Array<{ first_name: string; last_name?: string; phone: string; email?: string; location_code?: string; segment?: string }>) =>
    apiClient.post('/api/exponential/guests/import/', { guests }),
  importGuestsFile: (file: File) =>
    apiClient.uploadFile('/api/exponential/guests/import/', file),
  parseImportFile: (file: File) =>
    apiClient.uploadFile('/api/exponential/guests/import/parse/', file),
  submitImportMapping: (data: { import_id: number; column_mapping: Record<string, string> }) =>
    apiClient.post('/api/exponential/guests/import/map/', data),
  getImportHistory: (params?: { page?: number; limit?: number }) =>
    apiClient.get('/api/exponential/guests/imports/', params),
  getAudienceEstimate: (params?: { segment?: string; location_ids?: string; sms_status?: string; last_service?: string }) =>
    apiClient.get('/api/exponential/audience-estimate/', params),
  getUptake: () =>
    apiClient.get('/api/exponential/uptake/'),
  validateTwilio: () =>
    apiClient.get('/api/exponential/twilio/validate/'),
  sendTestSms: (data: { to_number: string; message?: string }) =>
    apiClient.post('/api/exponential/twilio/send-test/', data),
  lookupMessage: (messageSid: string) =>
    apiClient.get(`/api/exponential/twilio/messages/${messageSid}/`),
  syncCampaignStatuses: (campaignId: number | string) =>
    apiClient.post(`/api/exponential/campaigns/${campaignId}/sync-statuses/`),
  // Segment config CRUD
  getSegmentConfigs: () =>
    apiClient.get('/api/exponential/segment-configs/'),
  saveSegmentConfig: (data: { id?: number; name: string; slug: string; minDays: number; maxDays?: number | null; riskLevel?: string; color?: string; sortOrder?: number; isActive?: boolean }) =>
    apiClient.post('/api/exponential/segment-configs/', data),
  replaceSegmentConfigs: (segments: Array<{ name: string; slug: string; minDays: number; maxDays?: number | null; riskLevel?: string; color?: string; sortOrder?: number; isActive?: boolean }>) =>
    apiClient.put('/api/exponential/segment-configs/', { segments }),
  deleteSegmentConfig: (id: number) =>
    apiClient.delete(`/api/exponential/segment-configs/?id=${id}`),
  // Store data upload
  getStoreData: () =>
    apiClient.get('/api/exponential/store-data/'),
  uploadStoreData: (stores: Array<{ name: string; externalCode?: string; displayName: string; address: string; bookingLink?: string }>) =>
    apiClient.post('/api/exponential/store-data/', { stores }),
}

// ===========================================
// Scheduling (Labor Optimization) API
// ===========================================
export const schedulingApi = {
  getOverview: (params?: { start_date?: string; end_date?: string }) =>
    apiClient.get('/api/scheduling/overview/', params),
  getStoreRankings: () =>
    apiClient.get('/api/scheduling/rankings/'),
  getStoreDrilldown: (storeId: string | number, params?: { start_date?: string; end_date?: string }) =>
    apiClient.get(`/api/scheduling/stores/${storeId}/`, params),
}

// ===========================================
// SMS Templates API
// ===========================================
export const smsTemplatesApi = {
  list: (params?: { bucket?: string; active?: string }) =>
    apiClient.get('/api/exponential/templates/', params),
  get: (id: number) =>
    apiClient.get(`/api/exponential/templates/${id}/`),
  create: (data: {
    template_id: string;
    name: string;
    bucket: string;
    body: string;
    is_active?: boolean;
  }) => apiClient.post('/api/exponential/templates/', data),
  update: (id: number, data: {
    template_id?: string;
    name?: string;
    bucket?: string;
    body?: string;
    is_active?: boolean;
  }) => apiClient.put(`/api/exponential/templates/${id}/`, data),
  delete: (id: number) =>
    apiClient.delete(`/api/exponential/templates/${id}/`),
}

// ===========================================
// AppConfig API
// ===========================================
export const appConfigApi = {
  getAll: () =>
    apiClient.get('/api/config/'),
  get: (name: string) =>
    apiClient.get('/api/config/', { name }),
  update: (name: string, value: any) =>
    apiClient.put('/api/config/', { name, value }),
}
