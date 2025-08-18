import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    // --- THIS IS THE KEY CHANGE ---
    // We now use useContext directly and get the 'isLoggedIn' value you defined
    const { isLoggedIn, logout } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // This effect closes the mobile menu automatically when the user navigates to a new page
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // This effect prevents the page body from scrolling when the mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [isMenuOpen]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            {/* The overlay will appear to allow closing the menu by clicking outside */}
            <div
                className={`menu-overlay ${isMenuOpen ? 'active' : ''}`}
                onClick={closeMenu}
            ></div>

            <header className="navbar-header">
                <nav className="navbar-container">
                    <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
                        Tutor Hub
                    </NavLink>

                    <button
                        className="menu-toggle"
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                        onClick={handleMenuToggle}
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    <ul className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
                        {isLoggedIn ? (
                            // --- Links to show when the user IS logged in ---
                            <>
                                <li><NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>Home</NavLink></li>
                                <li><NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink></li>
                                <li><NavLink to="/tutors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Tutors</NavLink></li>
                                <li className="navbar-button-li"><button onClick={handleLogout} className="navbar-button secondary">Logout</button></li>
                            </>
                        ) : (
                            // --- Links to show when the user IS NOT logged in ---
                            <>
                                <li><NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>Home</NavLink></li>
                                <li><NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink></li>
                                <li><NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Login</NavLink></li>
                                <li className="navbar-button-li"><NavLink to="/register" className="navbar-button primary">Sign Up</NavLink></li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>
        </>
    );
};

export default Navbar;