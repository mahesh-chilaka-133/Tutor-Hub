import axios from 'axios';

// Create an instance of axios with default settings
const api = axios.create({
    // The base URL for all API requests will be your backend server
    baseURL: 'http://localhost:5000/api', // Make sure this matches your backend port
    headers: {
        'Content-Type': 'application/json',
    },
});

/*
  Adds a request interceptor to include the token in every request.
  This is a powerful feature of axios. Before any request is sent,
  this function will run, get the token from localStorage, and
  add it to the Authorization header.
*/
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;