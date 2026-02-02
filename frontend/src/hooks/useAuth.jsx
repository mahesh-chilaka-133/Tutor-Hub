import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


/**
 * This is a custom hook that simplifies accessing the AuthContext.
 * Instead of importing both `useContext` and `AuthContext` in every component,
 * we can just import and use this `useAuth` hook.
 *
 * It's a cleaner and more common practice in React development.
 *
 * @returns The value of the AuthContext (which includes user, isAuthenticated, login, logout, etc.)
 */
const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;