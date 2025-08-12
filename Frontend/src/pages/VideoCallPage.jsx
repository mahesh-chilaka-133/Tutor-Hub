import React, { useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { AuthContext } from '../context/AuthContext';

const VideoCallPage = () => {
    const { sessionId } = useParams();
    const { user, isLoggedIn } = useContext(AuthContext);
    const meetingContainerRef = useRef(null);

    useEffect(() => {
        console.log('--- VideoCallPage useEffect triggered ---');
        console.log('  isLoggedIn:', isLoggedIn);
        console.log('  user:', user);
        console.log('  sessionId:', sessionId);
        console.log('  meetingContainerRef.current:', meetingContainerRef.current);

        // --- Before checking dependencies, log them independently for a clearer picture ---
        console.log("  Checking dependencies...");
        console.log("    !isLoggedIn:", !isLoggedIn);
        console.log("    !user:", !user);
        console.log("    !user.id:", !user?.id); // Safe check for null
        console.log("    !user.name:", !user?.name); // Safe check for null
        console.log("    !sessionId:", !sessionId);
        console.log("    !meetingContainerRef.current:", !meetingContainerRef.current);

        if (!isLoggedIn || !user || !user.id || !user.name || !sessionId || !meetingContainerRef.current) {
            console.warn("Missing required data for video call. Waiting...");
            return; // Exit if any dependencies are missing
        }
        const initMeeting = async () => {
            console.log('--- initMeeting function called ---');
            const YOUR_MANUALLY_GENERATED_KIT_TOKEN = "04AAAAAGh0GqwADPzlqHYAP+3OWZd7UwCvMyDv2lmESBmKuQF0mRIT2x3APODK06z4APqfV4ppKlMqdi0Y4pga7EukZRmBnHX+WcbG2G/blPEyzEiE3BTiYDPsvv2J7UcXxjt4W0sTZv1Lm6izPpNsV8uyCo+3+MjWn9rjlVglf/BtFRB5w3sjlH+4cxv3kSTjQbcqMfqhGfnJLy4cGaBHvLeOlax3AZ4OQQYE36N9NFGE4fOwVQvipXx0+y78H3GdH2rbBfyQQwE=";
            if (!YOUR_MANUALLY_GENERATED_KIT_TOKEN) {
                console.error("ZegoCloud Kit Token is missing. Please generate it from ZegoCloud console and paste it here.");
                return;
            }
            
            const appID = 1917417403;
            const serverSecret = '01e5dfce2849bb0c76edbe60a1549e08';
            const userID = user.id;
            const userName = user.name;
            try {
                console.log('Generating token with:', appID, sessionId, userID, userName);

                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    appID,
                    serverSecret,
                    sessionId,
                    userID,
                    userName,
                    3600 // Token expiration time
                );

                console.log('Kit Token generated:', kitToken);
                const zp = ZegoUIKitPrebuilt.create(kitToken);
                console.log("ZegoUIKitPrebuilt created");

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

                console.log("ZegoUIKitPrebuilt.joinRoom called");
            } catch (error) {
                console.error("Error initializing ZegoUIKitPrebuilt:", error);
            }
        };

        initMeeting();

    }, [sessionId, isLoggedIn, user]);

    if (!isLoggedIn || !user) {
        return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Please log in to join the call.</div>;
    }

    return (
        <div style={{ width: '100vw', height: 'calc(100vh - 80px)' }} ref={meetingContainerRef}>
            {/* ZegoCloud UI will render here */}
        </div>
    );
};

export default VideoCallPage;