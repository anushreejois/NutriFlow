const apiRoot = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_BASE_URL = `${apiRoot.replace(/\/+$/, '')}/nutriflow/v1`;
