import React from 'react';
import { FaBullseye, FaHeart, FaUsers, FaLightbulb } from 'react-icons/fa';
import './AboutPage.css';
import aboutImage from '../assets/about-us-illustration.svg'; // We'll assume you have an illustration

const AboutPage = () => {
    return (
        <div className="about-page">
            {/* Section 1: Page Header & Mission */}
            <header className="about-header">
                <div className="about-header-content">
                    <h1>About TutorHub</h1>
                    <p className="mission-statement">
                        <FaBullseye className="mission-icon" />
                        Our mission is to make quality education accessible to everyone, everywhere, by connecting passionate learners with expert tutors in a supportive online environment.
                    </p>
                </div>
                <div className="about-header-image">
                    <img src={aboutImage} alt="People collaborating on learning" />
                </div>
            </header>

            {/* Section 2: Our Story */}
            <section className="about-section">
                <div className="about-section-content">
                    <FaHeart className="section-icon" />
                    <h2>Our Story</h2>
                    <p>
                        TutorHub was founded by a group of educators and developers who saw a common challenge: finding qualified, reliable tutors was often difficult and expensive. Students struggled to get the personalized help they needed, and talented tutors found it hard to connect with a broader audience. We knew there had to be a better way. We envisioned a single, streamlined platform where learning could be tailored to individual needs, making education more effective and engaging.
                    </p>
                </div>
            </section>

            {/* Section 3: What Makes Us Different */}
            <section className="about-section alternate-bg">
                <div className="about-section-content">
                    <FaLightbulb className="section-icon" />
                    <h2>Why Choose TutorHub?</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <h3>Expert Tutors</h3>
                            <p>Every tutor on our platform is vetted for subject matter expertise and teaching ability, ensuring you get the best learning experience.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Flexible Learning</h3>
                            <p>Learn on your own schedule. Book one-on-one or group sessions that fit your life, at prices you can afford.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Secure & Simple</h3>
                            <p>Our platform handles everything from booking and payments to secure messaging, so you can focus on what matters most: learning.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Meet the Team (Fictional) */}
            <section className="about-section">
                <div className="about-section-content">
                    <FaUsers className="section-icon" />
                    <h2>Meet the Team</h2>
                    <div className="team-grid">
                        <div className="team-member">
                            <h4>K. Sumanth Kumar</h4>
                            <p>Backend Developer</p>
                        </div>
                        <div className="team-member">
                            <h4>Ch. Mahesh</h4>
                            <p>Project Management</p>
                        </div>
                        <div className="team-member">
                            <h4>M. Sai Sudheer</h4>
                            <p>Frontend Developer</p>
                        </div>
                        <div className="team-member">
                            <h4>M. Sasanth</h4>
                            <p>Project Management</p>
                        </div>
                        <div className="team-member">
                            <h4>D. Sailesh</h4>
                            <p>UI/UX Designer</p>
                        </div>
                        <div className="team-member">
                            <h4>K. Hemanth Kumar</h4>
                            <p>UI/UX Designer</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;   