// Central API Client for LeakRadar Frontend
export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('rzp_backend_url');
    if (saved) return saved.endsWith('/') ? saved.slice(0, -1) : saved;
  }
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  // Smart fallback for local development when running on port 3000 or 5173
  if (typeof window !== 'undefined') {
    const port = window.location.port;
    const hostname = window.location.hostname;
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && (port === '3000' || port === '5173' || port === '4173')) {
      return 'http://localhost:8000';
    }
  }
  return '';
};

export const setApiBaseUrl = (url) => {
  if (typeof window !== 'undefined') {
    if (!url) {
      localStorage.removeItem('rzp_backend_url');
    } else {
      const clean = url.trim().endsWith('/') ? url.trim().slice(0, -1) : url.trim();
      localStorage.setItem('rzp_backend_url', clean);
    }
  }
};

export async function apiFetch(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || data.message || `Request failed with status ${res.status}`);
      }
      return data;
    } else {
      const text = await res.text();
      if (!res.ok) {
        if (text.startsWith('<!DOCTYPE') || text.startsWith('<html') || text.includes('The page')) {
          throw new Error(`API endpoint '${endpoint}' returned HTML (404/Route Not Found). Check your VITE_API_BASE_URL setting.`);
        }
        throw new Error(text || `HTTP Error ${res.status}`);
      }
      return text;
    }
  } catch (err) {
    console.error(`API Fetch Error [${endpoint}]:`, err);
    throw err;
  }
}
