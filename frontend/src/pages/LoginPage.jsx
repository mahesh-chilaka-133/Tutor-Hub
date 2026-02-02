import React, { useState, useContext } from 'react';
// import axios from 'axios'; // We will use our custom api service instead
import api from '../services/api'; // <-- CHANGE: Import your centralized api service
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import './AuthForm.css';
import { FiMail, FiLock } from 'react-icons/fi';
import loginImage from '../assets/login-illustration.jpg';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });

            console.log('✅ Login response:', response.data); // 👈 ADD THIS

            login(response.data);
            navigate('/');
        } catch (err) {
            console.error('Login error details:', err);
            if (err.response) {
                console.error('Response data:', err.response.data);
                console.error('Response status:', err.response.status);
                setError(err.response.data?.error || `Login failed: Server responded with status ${err.response.status}`);
            } else if (err.request) {
                console.error('No response received:', err.request);
                setError('Login failed: No response from server. Please check your connection.');
            } else {
                console.error('Error setting up request:', err.message);
                setError(`Login failed: ${err.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };


    // --- NO CHANGES to the UI structure below this line ---
    return (
        <AuthLayout imageSrc={loginImage} imageAlt="Person working on a laptop">
            <div className="auth-card">
                <h2 className="auth-title">Welcome Back!</h2>
                <p className="auth-subtitle">Log in to continue your journey with TutorHub.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <FiMail className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <FiLock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isLoading ? 'Logging In...' : 'Login'}
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;