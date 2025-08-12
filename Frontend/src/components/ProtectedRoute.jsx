import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Ensure this path is correct

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext);
    const location = useLocation();

    // If the user is not logged in, redirect them to the /login page
    if (!isLoggedIn) {
        // We also save the location they were trying to access, so we can
        // redirect them back after they successfully log in.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If the user is logged in, render the component they were trying to access
    return children;
};

export default ProtectedRoute;