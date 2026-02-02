import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserFriends, FaLaptopCode, FaBook } from 'react-icons/fa';
import './HomePage.css';

/**
 * This is the public-facing homepage for the TutorHub application.
 * It serves as a landing/marketing page for visitors who are NOT logged in.
 * Its purpose is to explain the platform's value and provide clear calls-to-action.
 */
const HomePage = () => {
    const featuredSubjects = ['Mathematics', 'Physics', 'Computer Science', 'English Literature', 'History', 'Chemistry'];

    return (
        <div className="home-page-container">
            {/* Section 1: Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Unlock Your Potential. Find the Perfect Tutor Today.</h1>
                    <p className="hero-subtitle">
                        Connect with thousands of expert tutors for one-on-one or group sessions in any subject you can imagine.
                    </p>
                    <div className="hero-buttons">
                        {/* This button will now lead to the login page because /tutors is protected */}
                        <Link to="/tutor-preview" className="btn btn-primary">Find a Tutor</Link>
                        <Link to="/register" className="btn btn-secondary">Become a Tutor</Link>
                    </div>
                </div>
            </header>

            {/* Section 2: How It Works */}
            <section className="how-it-works-section">
                <h2 className="section-title">How It Works</h2>
                <div className="steps-container">
                    <div className="step-card">
                        <FaSearch className="step-icon" />
                        <h3>1. Search Tutors</h3>
                        <p>Browse our extensive list of qualified tutors. Filter by subject, availability, and ratings to find your ideal match.</p>
                    </div>
                    <div className="step-card">
                        <FaUserFriends className="step-icon" />
                        <h3>2. Book a Session</h3>
                        <p>Once you're logged in, you can book a session directly through our platform and connect with your tutor securely.</p>
                    </div>
                    <div className="step-card">
                        <FaLaptopCode className="step-icon" />
                        <h3>3. Start Learning</h3>
                        <p>Join your session and start learning! Our platform supports a rich learning experience to help you achieve your goals.</p>
                    </div>
                </div>
            </section>

            {/* Section 3: Featured Subjects */}
            <section className="featured-subjects-section">
                <h2 className="section-title">Explore Popular Subjects</h2>
                <div className="subjects-container">
                    {featuredSubjects.map(subject => (
                        <div key={subject} className="subject-tag">
                            <FaBook />
                            <span>{subject}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;