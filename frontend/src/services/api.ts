import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Interceptor to add Tenant ID
api.interceptors.request.use((config) => {
    // Resolve tenant from hostname
    const host = window.location.hostname;
    const parts = host.split('.');

    // In dev (localhost), we might want to use a header for testing multiple tenants
    // If not localhost, try to extract first part of domain
    if (host === 'localhost' || host === '127.0.0.1') {
        // For local testing, we can use a localStorage or cookie if needed, 
        // but here we'll default to 'demo' if not specified
        config.headers['X-Tenant-Id'] = localStorage.getItem('tenantId') || 'demo';
    } else if (parts.length >= 3) {
        config.headers['X-Tenant-Id'] = parts[0];
    }

    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
