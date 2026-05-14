/**
 * Auth utilities for Django JWT authentication
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Global flag to prevent concurrent token refresh requests
let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

// Event emitter for auth errors
type AuthErrorListener = () => void
const authErrorListeners: AuthErrorListener[] = []

export function onAuthError(listener: AuthErrorListener): () => void {
  authErrorListeners.push(listener)
  return () => {
    const index = authErrorListeners.indexOf(listener)
    if (index > -1) {
      authErrorListeners.splice(index, 1)
    }
  }
}

export function emitAuthError(): void {
  authErrorListeners.forEach(listener => listener())
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  tenant: number | null
  tenant_name: string | null
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

const TOKEN_KEY = 'auth_tokens'
const USER_KEY = 'auth_user'

export function getStoredTokens(): AuthTokens | null {
  if (typeof window === 'undefined') return null
  const tokens = localStorage.getItem(TOKEN_KEY)
  return tokens ? JSON.parse(tokens) : null
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export function storeAuth(user: User, tokens: AuthTokens): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getAccessToken(): string | null {
  const tokens = getStoredTokens()
  return tokens?.access || null
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Login failed' }))
    throw new Error(error.error || 'Invalid credentials')
  }
  
  const data: LoginResponse = await response.json()
  storeAuth(data.user, data.tokens)
  return data
}

export async function register(data: {
  username: string
  email: string
  password: string
  first_name?: string
  last_name?: string
  role?: string
  tenant_code?: string
}): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Registration failed' }))
    throw new Error(error.error || error.username?.[0] || error.email?.[0] || 'Registration failed')
  }
  
  const result: LoginResponse = await response.json()
  storeAuth(result.user, result.tokens)
  return result
}

export async function refreshToken(): Promise<string | null> {
  // If already refreshing, return the existing promise (deduplication)
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  const tokens = getStoredTokens()
  if (!tokens?.refresh) return null
  
  // Set refreshing flag and create promise
  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: tokens.refresh }),
      })
      
      if (!response.ok) {
        clearAuth()
        emitAuthError()
        return null
      }
      
      const data = await response.json()
      const newTokens: AuthTokens = { ...tokens, access: data.access }
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newTokens))
      return data.access
    } catch {
      clearAuth()
      emitAuthError()
      return null
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()
  
  return refreshPromise
}

export function logout(): void {
  clearAuth()
}

export async function forgotPasswordRequest(data: {
  email: string
  new_password: string
  confirm_password: string
}): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/api/auth/forgot-password/request/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Failed to send OTP')
  }
  
  return response.json()
}

export async function forgotPasswordVerify(data: {
  email: string
  otp: string
}): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/api/auth/forgot-password/verify/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Verification failed' }))
    throw new Error(error.error || 'Invalid OTP')
  }
  
  return response.json()
}

export async function changePassword(data: {
  current_password: string
  new_password: string
  confirm_password: string
}): Promise<{ message: string }> {
  const tokens = getStoredTokens()
  if (!tokens?.access) {
    throw new Error('Not authenticated')
  }
  
  const response = await fetch(`${API_URL}/api/auth/change-password/`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokens.access}`
    },
    body: JSON.stringify(data),
  })
  
  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(result.error || 'Failed to change password')
  }
  
  return result
}
