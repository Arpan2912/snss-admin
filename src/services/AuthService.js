import { ApiRequest } from './RequestService';
const { endpoints: { LOGIN } } = require('../constant/endpoint');

const TOKEN_KEY = 'snss_admin_token';

export const login = async (email, password) => {
    const response = await ApiRequest('post', LOGIN, { email, password });
    const token = response?.data?.token;
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
    return response;
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;

    try {
        // Decode payload (base64) to check expiry without a library
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp && payload.exp > now;
    } catch {
        return false;
    }
};
