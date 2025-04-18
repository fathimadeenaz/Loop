"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import Alert from "@/components/Alert";
import Loader from "@/components/Loader";
import MeetingSetup from "@/components/MeetingSetup";
import MeetingRoom from "@/components/MeetingRoom";
import { useGetCallById } from "@/hooks/useGetCallById";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";

const Meeting = () => {
    const { id } = useParams();
    const { user, isLoaded } = useUser();
    const { call, isCallLoading } = useGetCallById(id || "");
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const [isMicCamEnabled, setIsMicCamEnabled] = useState(false);

    if (!isLoaded || isCallLoading) return <Loader />;

    if (!call) return (
        <p className="text-center text-3xl font-bold text-white">
            Call Not Found
        </p>
    );

    const notAllowed = call.type === "invited" && (!user || !call.state.members.find((m) => m.user.id === user.id));

    if (notAllowed) return <Alert title="You are not allowed to join this meeting" />;

    return (
        <main className="h-screen w-full">
            <StreamCall call={call}>
                <StreamTheme>
                    {!isSetupComplete ? (
                        <MeetingSetup
                            setIsSetupComplete={setIsSetupComplete}
                            setIsMicCamEnabled={setIsMicCamEnabled} // Pass down state setter
                        />
                    ) : (
                        <MeetingRoom isMicCamEnabled={isMicCamEnabled} /> // Pass down state to MeetingRoom
                    )}
                </StreamTheme>
            </StreamCall>
        </main>
    );
};

export default Meeting;
