import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { FaUserGraduate, FaChalkboardTeacher, FaEdit,FaRobot, FaSearch, FaRegCalendarCheck } from 'react-icons/fa';
import './LoggedInHomePage.css';
import ChatbotModal from './ChatBotModel'; // Adjust path if needed

/**
 * This is the main "welcome" page for a logged-in user.
 * It acts as a mini-dashboard, providing a personalized greeting and showing
 * role-specific information to guide the user's next actions.
 */
const LoggedInHomePage = () => {
    const [showChatbot, setShowChatbot] = useState(false);
    // Get the user object from our global context
    const { user } = useContext(AuthContext);

    // State to hold upcoming sessions for students
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    // This effect runs once when the component loads to fetch relevant data
    useEffect(() => {
        // We only need to fetch sessions if the user is a student
        if (user?.role === 'student') {
            const fetchMySessions = async () => {
                setLoading(true);
                try {
                    const { data } = await api.get('/sessions/my-sessions');
                    // Filter for sessions that are in the future and have been confirmed
                    const upcomingSessions = data.data
                        .filter(s => new Date(s.sessionDate) > new Date() && s.status === 'confirmed')
                        .sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate));
                    setSessions(upcomingSessions);
                } catch (error) {
                    console.error("Could not fetch sessions", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchMySessions();
        } else {
            // If the user is a tutor, we don't need to load anything extra for this page
            setLoading(false);
        }
    }, [user]); // The dependency array ensures this runs if the user object changes

    // A separate component to render the student-specific view
    const renderStudentView = () => (
        <div className="info-box">
            <h3><FaRegCalendarCheck className="info-box-icon" /> Your Upcoming Sessions</h3>
            {loading ? <p>Loading sessions...</p> :
             sessions.length > 0 ? (
                <ul className="sessions-list">
                    {sessions.slice(0, 3).map(session => ( // Show the next 3 sessions
                        <li key={session._id} className="session-item">
                            <div>
                                <strong>{session.subject}</strong> with {session.tutor.user.name}
                            </div>
                            <span className="session-time">{new Date(session.sessionDate).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            ) : <p>You have no upcoming confirmed sessions. Time to book one!</p>}
        </div>
    );

    // A separate component to render the tutor-specific view
    const renderTutorView = () => (
        <div className="info-box prompt">
            <FaEdit className="info-box-icon"/>
            <div>
                <h3>Complete Your Profile to Attract Students</h3>
                <p>A great profile with a detailed bio, subjects, and availability is the key to getting booked.</p>
                <Link to="/dashboard" className="btn-small">Update Profile Now</Link>
            </div>
        </div>
    );

    // Fallback while the user object is loading
    if (!user) {
        return <div className="loggedIn-home-page"><p>Loading...</p></div>;
    }

    return (
        <div className="loggedIn-home-page">
            <header className="welcome-header">
                <h1>Welcome back, {user.name}!</h1>
                <p>Let's make today a productive day.</p>
            </header>

            <div className="dashboard-grid">
                {/* The main content panel shows different info based on role */}
                <div className="main-panel">
                    {user.role === 'student' ? renderStudentView() : renderTutorView()}
                </div>

                {/* The sidebar provides consistent quick actions */}
                <aside className="sidebar-panel">
                    <h3>Quick Actions</h3>
                    <Link to="/tutors" className="action-card">
                        <FaSearch className="action-icon" />
                        <span>Find a Tutor</span>
                    </Link>
                    <Link to="/dashboard" className="action-card">
                        {user.role === 'student' ? <FaUserGraduate className="action-icon" /> : <FaChalkboardTeacher className="action-icon" />}
                        <span>My Dashboard</span>
                    </Link>
                </aside>
            </div>
            {/* Floating AI Chatbot Button */}
            <button
                className="ai-chatbot-fab"
                onClick={() => setShowChatbot(true)}
                aria-label="Open AI Assistant"
            >
                <FaRobot size={28} />
            </button>
            {showChatbot && <ChatbotModal onClose={() => setShowChatbot(false)} />}
        </div>
    );
};

export default LoggedInHomePage;