import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './VideoCallPage.css';

const VideoCallPage = () => {
    const { sessionId } = useParams();
    const { user, isLoggedIn } = useContext(AuthContext);
    const meetingContainerRef = useRef(null);
    const navigate = useNavigate();
    const [sdkLoaded, setSdkLoaded] = useState(false);

    useEffect(() => {
        // --- 1. Load the Zego SDK dynamically from CDN ---
        // This avoids Rolleup/Vite build crashes fixed in later versions or specific environments
        const scriptId = 'zego-sdk-script';
        let script = document.getElementById(scriptId);

        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://unpkg.com/@zegocloud/zego-uikit-prebuilt@2.15.0/zego-uikit-prebuilt.js';
            script.async = true;
            script.onload = () => {
                console.log("Zego SDK loaded from CDN");
                setSdkLoaded(true);
            };
            document.body.appendChild(script);
        } else {
            setSdkLoaded(true);
        }

        // --- 2. Initialize Zego once SDK is ready and dependencies are present ---
        if (!sdkLoaded || !isLoggedIn || !user || !sessionId || !meetingContainerRef.current) return;

        const userId = user.id || user._id;
        if (!userId || !user.name) return;

        const appID = 974095163;
        const serverSecret = 'd3e865bf74f042987faf63813dcb3ee7';
        const userID = userId.toString();
        const userName = user.name;

        // Access from global window object
        const { ZegoUIKitPrebuilt } = window;
        if (!ZegoUIKitPrebuilt) {
            console.error("ZegoUIKitPrebuilt not found on window");
            return;
        }

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
            onJoinRoom: () => console.log('VideoCall: Joined'),
            onLeaveRoom: () => {
                console.log('VideoCall: Left');
                navigate('/dashboard');
            },
        });

        return () => {
            if (zp && typeof zp.destroy === 'function') {
                zp.destroy();
            }
            if (meetingContainerRef.current) {
                meetingContainerRef.current.innerHTML = '';
            }
        };
    }, [sessionId, isLoggedIn, user, navigate, sdkLoaded]);

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
            {!sdkLoaded && <div style={{ color: 'white', padding: '20px' }}>Loading Video Engine...</div>}
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