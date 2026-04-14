import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Important for sending/receiving cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

let authContext = null;

export const setAuthContext = (context) => {
  authContext = context;
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      if (authContext) {
        try {
          await authContext.logout();
        } catch (logoutError) {
          console.error('Error during logout:', logoutError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;