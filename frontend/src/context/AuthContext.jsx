import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import for decoding the token
import api from '../services/api'; // Import your API service

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state

    // Function to fetch the user profile using the token from local storage
    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode the token and get the user object from the response.
                const decoded = jwtDecode(token);
                // Set the 'Authorization' header for all API requests
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                // Fetch User from /api/auth/me endpoint with the access token
                const response = await api.get('/auth/me'); // Use the api service.
                setUser(response.data.user);  // Set the user from the api call
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Error fetching user data:", error);
                // If the token is invalid, remove it and log the user out
                logout();
            }
        }
        setLoading(false);
    }, []); // No dependencies, runs once on component mount.

    // This effect runs on component mount to check for a token
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // The login function to be exposed by the context
    // @desc    Login user and return token
// @route   POST /api/auth/login
// @access  Public
const login = ({ token, user }) => {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set Authorization header
    setUser({ // The User has been loaded with this object
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    });
    setIsLoggedIn(true);
};

    // The logout function
    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};