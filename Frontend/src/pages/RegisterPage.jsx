import React, { useState, useContext } from 'react'; // <-- Import useContext
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // <-- Import AuthContext
import AuthLayout from '../components/layout/AuthLayout';
import api from '../services/api';
import './AuthForm.css';
import { FiUser, FiMail, FiLock, FiBriefcase } from 'react-icons/fi'; // <-- Import Briefcase icon
import signupImage from '../assets/signup-illustration.jpg';

const RegisterPage = () => {
    // We'll manage state for each field individually for clarity
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // <-- NEW: State for user role, defaults to 'student'

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // const { login } = useContext(AuthContext); // Auto-login removed
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            // Send all four fields (name, email, password, AND role) to the backend
            await api.post('/auth/register', { name, email, password, role });

            // navigate to login page
            navigate('/login');

        } catch (err) {
            setError(err.response?.data?.error || 'Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout imageSrc={signupImage} imageAlt="Person celebrating success">
            <div className="auth-card">
                <h2 className="auth-title">Create Your Account</h2>
                <p className="auth-subtitle">Join our community to start learning or teaching today!</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <FiUser className="input-icon" />
                        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <FiMail className="input-icon" />
                        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <FiLock className="input-icon" />
                        <input type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" />
                    </div>

                    {/* --- NEW ROLE SELECTOR DROPDOWN --- */}
                    <div className="input-group">
                        <FiBriefcase className="input-icon" />
                        <select value={role} onChange={(e) => setRole(e.target.value)} required>
                            <option value="student">I want to learn (Student)</option>
                            <option value="tutor">I want to teach (Tutor)</option>
                        </select>
                    </div>

                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;