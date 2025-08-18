import React, { useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { AuthContext } from '../context/AuthContext';

const VideoCallPage = () => {
    const { sessionId } = useParams();
    const { user, isLoggedIn } = useContext(AuthContext);
    const meetingContainerRef = useRef(null);

    useEffect(() => {
        if (
            !isLoggedIn ||
            !user ||
            !user.id ||
            !user.name ||
            !sessionId ||
            !meetingContainerRef.current
        ) {
            return;
        }

        const appID = 1917417403;
        const serverSecret = '01e5dfce2849bb0c76edbe60a1549e08';
        const userID = user.id.toString();
        const userName = user.name;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            sessionId,
            userID,
            userName,
            3600
        );

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
        });

        // Clean up on unmount
        return () => {
            if (meetingContainerRef.current) {
                meetingContainerRef.current.innerHTML = '';
            }
        };
    }, [sessionId, isLoggedIn, user]);

    if (!isLoggedIn || !user) {
        return (
            <div className="video-call-warning">
                Please log in to join the call.
            </div>
        );
    }

    return (
        <div className="video-call-container">
            <div
                ref={meetingContainerRef}
                style={{
                    width: '100vw',
                    height: '100vh',
                    minHeight: '400px',
                    background: '#000',
                    borderRadius: '18px',
                    overflow: 'hidden',
                }}
            />
        </div>
    );
};

export default VideoCallPage;