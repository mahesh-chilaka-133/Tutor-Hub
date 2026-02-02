import React, { useContext, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { AuthContext } from '@/context/AuthContext';
import './VideoCallPage.css'; // Ensure CSS is imported

const VideoCallPage = () => {
    const { sessionId } = useParams();
    const { user, isLoggedIn } = useContext(AuthContext);
    const meetingContainerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("VideoCall: Effect triggered", { isLoggedIn, user, sessionId });

        // Handle both id formats
        const userId = user?.id || user?._id;

        if (
            !isLoggedIn ||
            !user ||
            !userId ||
            !user.name ||
            !sessionId ||
            !meetingContainerRef.current
        ) {
            console.warn("VideoCall: Missing required data", { userId, userName: user?.name, sessionId });
            return;
        }

        // Keys provided by user
        const appID = 974095163;
        const serverSecret = 'd3e865bf74f042987faf63813dcb3ee7';

        const userID = userId.toString();
        const userName = user.name;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            sessionId,
            userID,
            userName,
            3600
        );

        console.log('VideoCall: Creating Zego Instance');
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: meetingContainerRef.current,
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            },
            showPreJoinView: true,
            sharedLinks: [
                {
                    name: "Copy Link",
                    url: `${window.location.origin}${window.location.pathname}`,
                },
            ],
            onJoinRoom: () => {
                console.log('VideoCall: Successfully joined room');
            },
            onLeaveRoom: () => {
                console.log('VideoCall: Left room');
                navigate('/dashboard'); // Navigate back to dashboard when call ends
            },
        });

        // Clean up on unmount
        return () => {
            console.log('VideoCall: Cleaning up Zego Instance');
            if (zp && typeof zp.destroy === 'function') {
                zp.destroy();
            }
            if (meetingContainerRef.current) {
                meetingContainerRef.current.innerHTML = '';
            }
        };
    }, [sessionId, isLoggedIn, user, navigate]);

    if (!isLoggedIn || !user) {
        return (
            <div className="video-call-warning">
                Please log in to join the call.
            </div>
        );
    }

    return (
        <div
            className="video-call-wrapper"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999,
                background: '#000'
            }}
        >
            <div
                ref={meetingContainerRef}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    );
};

export default VideoCallPage;