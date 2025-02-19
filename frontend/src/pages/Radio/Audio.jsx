import { RemoteAudioTrack, Track } from "livekit-client";
import { useEffect } from "react";

const Audio = ({ track, participantIdentity }) => {
    useEffect(() => {
        if (!track) return;

        const audioElement = track.attach();
        audioElement.play().catch((error) => {
            console.error("Audio play error:", error);
        });

        return () => {
            track.detach(audioElement);
        };
    }, [track]);
    

    return (
        <div>
            <p>{participantIdentity}</p>
        </div>
    );
};

export default Audio;
