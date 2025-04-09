"use client";

import { useEffect, useState } from "react";

import { useUser } from "@clerk/nextjs";
import {
    DeviceSettings,
    VideoPreview,
    useCall,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";

import Alert from "./Alert";
import { Button } from "./ui/button";

const MeetingSetup = ({
    setIsSetupComplete,
    setIsMicCamEnabled,
}: {
    setIsSetupComplete: (value: boolean) => void;
    setIsMicCamEnabled: (value: boolean) => void; // Add this prop
}) => {
    const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
    const callStartsAt = useCallStartsAt();
    const callEndedAt = useCallEndedAt();

    const { user } = useUser();
    const call = useCall();

    const isHost = user?.id === call?.state?.createdBy?.id;
    const callTimeNotArrived = callStartsAt && new Date(callStartsAt) > new Date() && !isHost;

    const callHasEnded = !!callEndedAt;

    if (!call) {
        throw new Error(
            "useStreamCall must be used within a StreamCall component.",
        );
    }

    const [isMicCamToggled, setIsMicCamToggled] = useState(false);

    // Set mic/cam state on change
    useEffect(() => {
        if (isMicCamToggled) {
            call.camera.disable();
            call.microphone.disable();
        } else {
            call.camera.enable();
            call.microphone.enable();
        }
        setIsMicCamEnabled(!isMicCamToggled); // Reflect the state change globally
    }, [isMicCamToggled, call.camera, call.microphone, setIsMicCamEnabled]);

    useEffect(() => {
        return () => {
            call.camera.disable();
            call.microphone.disable();
        };
    }, [call.camera, call.microphone]);

    if (callTimeNotArrived)
        return (
            <Alert
                title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
            />
        );

    if (callHasEnded)
        return (
            <Alert
                title="The call has been ended by the host"
                iconUrl="/icons/call-ended.svg"
            />
        );

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
            <h1 className="text-center text-2xl font-bold">Setup</h1>
            <VideoPreview />
            <div className="flex h-16 items-center justify-center gap-3">
                <label className="flex items-center justify-center gap-2 font-medium">
                    <input
                        type="checkbox"
                        checked={isMicCamToggled}
                        onChange={(e) => setIsMicCamToggled(e.target.checked)}
                    />
                    Join with mic and camera off
                </label>
                <DeviceSettings />
            </div>
            <Button
                className="rounded-md bg-green-500 px-4 py-2.5"
                onClick={() => {
                    call.join();
                    setIsSetupComplete(true);
                }}
            >
                Join meeting
            </Button>
        </div>
    );
};

export default MeetingSetup;
