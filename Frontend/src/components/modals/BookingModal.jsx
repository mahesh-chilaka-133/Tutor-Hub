import React, { useState } from 'react';
import { FaTimes, FaBook, FaCalendarAlt } from 'react-icons/fa'; // Import icons
import api from '../../services/api';
import './BookingModal.css';

const BookingModal = ({ tutor, onClose }) => {
    // State to manage the form inputs
    const [subject, setSubject] = useState(tutor.subjects[0] || '');
    const [sessionDate, setSessionDate] = useState('');

    // State for handling success or error messages
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            await api.post('/sessions', {
                tutorId: tutor._id,
                subject,
                sessionDate,
            });
            setSuccess('Session requested successfully! You can check its status on your dashboard.');
            // Optionally clear the form after success
            setSessionDate('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to book session. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* --- Modal Header --- */}
                <header className="modal-header">
                    <h2>Book a Session</h2>
                    <button className="close-modal-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </header>

                {/* --- Modal Body --- */}
                <main className="modal-body">
                    <p className="modal-subtitle">
                        You are booking a session with <strong>{tutor.user.name}</strong>.
                    </p>
                    <form onSubmit={handleSubmit} className="booking-form">
                        {/* Only show one message at a time */}
                        {success ? <p className="success-message">{success}</p> :
                            error && <p className="error-message">{error}</p>}

                        <div className="form-group">
                            <label htmlFor="subject"><FaBook /> Subject</label>
                            <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required>
                                {tutor.subjects.length > 0 ? (
                                    tutor.subjects.map(s => <option key={s} value={s}>{s}</option>)
                                ) : (
                                    <option disabled>Tutor has not listed any subjects</option>
                                )}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="sessionDate"><FaCalendarAlt /> Preferred Date & Time</label>
                            <input
                                id="sessionDate"
                                type="datetime-local"
                                value={sessionDate}
                                onChange={(e) => setSessionDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="modal-actions">
                            <button type="button" onClick={onClose} className="btn-cancel">
                                Cancel
                            </button>
                            <button type="submit" className="btn-confirm" disabled={isLoading}>
                                {isLoading ? 'Requesting...' : 'Request Session'}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default BookingModal;