import React from 'react';
import api from '../services/api';
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt, FaCheck, FaTimes,FaVideo, FaCreditCard } from 'react-icons/fa';
import './SessionList.css';
import { Link } from 'react-router-dom';


const SessionList = ({ sessions, userRole, onSessionUpdate, onOpenPaymentModal }) => {

    const handleUpdateStatus = async (sessionId, status) => {
        try {
            await api.put(`/sessions/${sessionId}`, { status });
            onSessionUpdate(); // Notify the parent DashboardPage to refetch all data
        } catch (error) {
            console.error("Failed to update session status", error);
        }
    };

    if (sessions.length === 0) {
        return null;
    }

    return (
        <div className="session-list-grid">
            {sessions.map(session => (
                <div key={session._id} className={`session-card status-${session.status} payment-status-${session.paymentStatus}`}>
                    <div className="session-card-header">
                        <h3>{session.subject}</h3>
                        <span className="session-status">{session.status}</span>
                    </div>

                    <div className="session-card-body">
                        <div className="session-participant">
                            {userRole === 'student' ? <FaChalkboardTeacher /> : <FaUserGraduate />}
                            <span>
                                {userRole === 'student'
                                    ? `Tutor: ${session.tutor.user.name}`
                                    : `Student: ${session.student.name}`}
                            </span>
                        </div>
                        <div className="session-time">
                            <FaCalendarAlt />
                            <span>{new Date(session.sessionDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                        {/* NEW: Payment Status Display (visible to both student and tutor) */}
                        <div className="session-payment-status">
                            <FaCreditCard /> <span>Payment: {session.paymentStatus}</span>
                        </div>
                    </div>

                    <div className="session-card-actions">
                        {userRole === 'student' && session.status === 'pending' && session.paymentStatus === 'pending' && (
                            <button
                                onClick={() => onOpenPaymentModal(session._id)}
                                className={`btn-payment status-${session.paymentStatus}`}
                            >
                                <FaCreditCard /> Make Payment
                            </button>
                        )}

                        {userRole === 'tutor' && session.status === 'pending' && (
                            <>
                                <button onClick={() => handleUpdateStatus(session._id, 'confirmed')} className="btn-session-confirm">
                                    <FaCheck /> Confirm
                                </button>
                                <button onClick={() => handleUpdateStatus(session._id, 'cancelled')} className="btn-session-cancel">
                                    <FaTimes /> Cancel
                                </button>
                            </>
                        )}

                        {userRole === 'student' && session.paymentStatus === 'paid' && (
                            <span className="payment-confirmed-indicator">Payment Confirmed!</span>
                        )}

                        {session.status === 'confirmed' && (
                            <Link to={`/session/${session._id}/call`} className="btn-join-call">
                                <FaVideo /> Join Video Call
                            </Link>
                        )}
                    </div>

                </div>
            ))}
        </div>
    );
};

export default SessionList;