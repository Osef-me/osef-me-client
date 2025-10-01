// Environment variables with validation
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

// API Configuration
export const API_BASE_URL = getEnvVar('VITE_API_BASE_URL', 'http://localhost:3001/api/')

// App Configuration
export const APP_NAME = getEnvVar('VITE_APP_NAME', 'Osefme Frontend')
export const APP_VERSION = getEnvVar('VITE_APP_VERSION', '1.0.0')

// Development Configuration
export const DEBUG = getEnvVar('VITE_DEBUG', 'false') === 'true'
export const ENABLE_DEVTOOLS = getEnvVar('VITE_ENABLE_DEVTOOLS', 'true') === 'true'

// Feature Flags
export const ENABLE_ANALYTICS = getEnvVar('VITE_ENABLE_ANALYTICS', 'false') === 'true'
export const ENABLE_ERROR_REPORTING = getEnvVar('VITE_ENABLE_ERROR_REPORTING', 'true') === 'true'

// Environment helpers
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD
export const isTest = import.meta.env.MODE === 'test'

// Configuration object for easy access
export const config = {
  api: {
    baseUrl: API_BASE_URL,
  },
  app: {
    name: APP_NAME,
    version: APP_VERSION,
  },
  development: {
    debug: DEBUG,
    devtools: ENABLE_DEVTOOLS,
  },
  features: {
    analytics: ENABLE_ANALYTICS,
    errorReporting: ENABLE_ERROR_REPORTING,
  },
  environment: {
    isDevelopment,
    isProduction,
    isTest,
  },
} as const
