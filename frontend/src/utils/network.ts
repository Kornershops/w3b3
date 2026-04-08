/**
 * Centralized networking utility for W3B3 Frontend.
 * Ensures that all API and WebSocket calls use the correct environment-aware URLs
 * with protocol-strict formatting.
 */

export const getBaseUrl = (type: 'api' | 'socket' = 'api'): string => {
  // Extract URL from environment or default to localhost
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  // Remove any trailing slashes to ensure a clean base
  let baseUrl = rawUrl.replace(/\/$/, '');

  // For API calls, ensure the /api suffix is present
  if (type === 'api') {
    baseUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  }

  // Socket.io handles its own namespace/pathing, usually just needs the clean base
  return baseUrl;
};

export const API_BASE_URL = getBaseUrl('api');
export const SOCKET_BASE_URL = getBaseUrl('socket');
