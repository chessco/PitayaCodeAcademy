import axios from 'axios';

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3004').replace(/\/$/, '') + '/',
});

// Interceptor to add Tenant ID and Auth Token
api.interceptors.request.use((config) => {
    const host = window.location.hostname;

    // Resolve tenant slug
    let tenantSlug = 'demo'; // Default for local dev

    if (host === 'academy.pitayacode.io') {
        tenantSlug = 'academy-api';
    } else if (host !== 'localhost' && host !== '127.0.0.1') {
        // Fallback or dynamic resolution for other domains if needed
        // For now, we explicitly handle the academy domain
        tenantSlug = host.split('.')[0];
    }

    config.headers['X-Tenant-Id'] = tenantSlug;

    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
