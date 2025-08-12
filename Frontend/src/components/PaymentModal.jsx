import React, { useState, useEffect } from 'react';
import { FaTimes, FaQrcode } from 'react-icons/fa';
import './PaymentModal.css';

const PaymentModal = ({ sessionId, onClose, onPaymentComplete }) => {
    const [timeLeft, setTimeLeft] = useState(15);
    const [paymentStatusMessage, setPaymentStatusMessage] = useState('');

    useEffect(() => {
        // Timer for QR code display
        const timer = setTimeout(() => {
            setPaymentStatusMessage('Thank you for your payment!');
            // Simulate completion after timer
            setTimeout(() => {
                onPaymentComplete(sessionId); // Callback to parent to update payment status
                onClose(); // Close modal
            }, 1000); // Give 1 second to see thank you message
        }, 15000); // 15 seconds display duration

        // Countdown timer
        const countdown = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        // Cleanup timers on component unmount or modal close
        return () => {
            clearTimeout(timer);
            clearInterval(countdown);
        };
    }, [sessionId, onClose, onPaymentComplete]);

    return (
        <div className="payment-modal-overlay" onClick={onClose}>
            <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="payment-modal-header">
                    <h2>Complete Your Payment</h2>
                    <button className="close-modal-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </header>
                <main className="payment-modal-body">
                    {paymentStatusMessage ? (
                        <p className="thank-you-message">{paymentStatusMessage}</p>
                    ) : (
                        <>
                            <p className="countdown">Time left: {timeLeft} seconds</p>
                            <div className="qr-code-placeholder">
                                <FaQrcode className="qr-icon" />
                                <p>Simulated QR Code Here</p>
                            </div>
                            <div className="payment-instructions">
                                <h3>Instructions:</h3>
                                <p>1. Open your preferred payment app (e.g., GPay, Paytm).</p>
                                <p>2. Scan the QR code above.</p>
                                <p>3. Enter the exact amount for your session.</p>
                                <p>4. Complete the transaction. Your session status will be updated shortly.</p>
                                <p>5. This is a dummy integration for demonstration purposes only.</p>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default PaymentModal;