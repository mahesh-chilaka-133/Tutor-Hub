import React, { useState, useEffect, useContext, useCallback } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

// --- Component Imports ---
import SessionList from '../components/features/session/SessionList';
import ProfileModal from '../components/modals/ProfileModal';
import PaymentModal from '../components/modals/PaymentModal'; // <-- NEW: PaymentModal

// --- Stylesheet ---
import './DashboardPage.css';

const DashboardPage = () => {
    const { user } = useContext(AuthContext);

    // --- State Management ---
    const [sessions, setSessions] = useState([]);
    const [tutorProfile, setTutorProfile] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // <-- NEW: State for Payment Modal
    const [currentSessionIdForPayment, setCurrentSessionIdForPayment] = useState(null); // <-- NEW: Stores the session ID for the modal
    const [currentSessionPriceForPayment, setCurrentSessionPriceForPayment] = useState(0); // <-- NEW
    const [loading, setLoading] = useState(true);

    // --- Data Fetching ---
    const fetchDashboardData = useCallback(async () => {
        try {
            const requests = [api.get('/sessions/my-sessions')];
            if (user?.role === 'tutor') {
                requests.push(api.get(`/tutors?user=${user._id}`));
            }
            const responses = await Promise.all(requests);

            const sessionData = responses[0].data.data;
            setSessions(sessionData.sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate)));

            if (user?.role === 'tutor') {
                setTutorProfile(responses[1].data.data[0]);
            }
        } catch (err) {
            console.error("Failed to load dashboard data.", err);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            setLoading(true);
            fetchDashboardData().finally(() => setLoading(false));
        }
    }, [user, fetchDashboardData]);

    // Callbacks for modals
    const handleProfileUpdate = () => {
        fetchDashboardData(); // Refresh data after profile update
        setIsProfileModalOpen(false); // Close profile modal
    };

    // NEW: Callback when a payment is 'completed' from the modal
    const handlePaymentComplete = async (sessionId) => {
        try {
            // Send API request to backend to mark session's paymentStatus as 'paid'
            await api.put(`/sessions/${sessionId}`, { paymentStatus: 'paid' });
            fetchDashboardData(); // Refresh dashboard data to show 'paid' status
        } catch (error) {
            console.error("Error updating payment status on backend:", error);
        }
        setIsPaymentModalOpen(false); // Close payment modal
        setCurrentSessionIdForPayment(null); // Clear the session ID
    };



    if (loading || !user) {
        return <div className="dashboard-page"><p>Loading Dashboard...</p></div>;
    }

    return (
        <>
            {/* Profile Editing Modal */}
            {isProfileModalOpen && (
                <ProfileModal
                    user={user}
                    tutorProfile={tutorProfile}
                    onClose={() => setIsProfileModalOpen(false)}
                    onProfileUpdate={handleProfileUpdate}
                />
            )}
            {/* Payment Modal Render (only if triggered) */}
            {isPaymentModalOpen && currentSessionIdForPayment && (
                <PaymentModal
                    sessionId={currentSessionIdForPayment}
                    sessionPrice={currentSessionPriceForPayment} // <-- Pass price
                    onClose={() => setIsPaymentModalOpen(false)}
                    onPaymentComplete={handlePaymentComplete}
                />
            )}

            <div className="dashboard-page">
                <header className="dashboard-header">
                    <div className="header-title">
                        <h1>My Dashboard</h1>
                        <p>Welcome back, {user.name}!</p>
                    </div>
                    <div className="profile-trigger" onClick={() => setIsProfileModalOpen(true)}>
                        <FaUserCircle className="profile-icon" />
                        <span>My Profile</span>
                    </div>
                </header>

                <main className="main-panel">
                    <div className="sessions-group">
                        <h2>Your Sessions</h2>
                        {sessions.length > 0 ? (
                            <SessionList
                                sessions={sessions}
                                userRole={user.role}
                                onSessionUpdate={fetchDashboardData}
                                onOpenPaymentModal={(sessionId, price) => { // <-- Updated signature
                                    setCurrentSessionIdForPayment(sessionId);
                                    // We need to store price too (adding state for it)
                                    setCurrentSessionPriceForPayment(price);
                                    setIsPaymentModalOpen(true);
                                }}
                            />
                        ) : (
                            <p className="no-sessions-message">You have no sessions scheduled.</p>
                        )}
                    </div>

                </main>
            </div>
        </>
    );
};

export default DashboardPage;