"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import ReactDatePicker from "react-datepicker";
import { toast } from "sonner"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

import HomeCard from "./HomeCard"
import Loader from "./Loader";
import MeetingModal from "./MeetingModal";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const initialValues = {
    dateTime: new Date(),
    description: "",
    link: "",
};

const MeetingTypeList = () => {
    const router = useRouter();
    const [meetingState, setMeetingState] = useState<
        "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
    >(undefined);
    const [values, setValues] = useState(initialValues);
    const [isDateTimePicked, setIsDateTimePicked] = useState(false);
    const [callDetail, setCallDetail] = useState<Call>();
    const client = useStreamVideoClient();
    const { user } = useUser();


    const createMeeting = async () => {

        if (!client || !user) return;

        const isDemoUser = user?.username === "vifefo4696" || user?.username === "cacis78559";

        if (isDemoUser) {
            const res = await fetch("/api/increment-meeting", { method: "POST" });
            const data = await res.json();

            if (!data.allowed) {
                toast("Meeting limit reached. Create an account with us to unlock all our features.");
                return;
            }
        }

        if (meetingState === "isScheduleMeeting" && !values.description.trim()) {
            toast("Please add a description before scheduling a meeting.");
            return;
        }

        if (!values.dateTime) {
            toast("Please select a date and time");
            return;
        }

        try {
            const id = crypto.randomUUID();
            const call = client.call("default", id);
            if (!call) throw new Error("Failed to create meeting");
            const startsAt =
                values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || "Instant Meeting";
            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description,
                    },
                },
            });
            setCallDetail(call);
            if (!values.description) {
                router.push(`/meeting/${call.id}`);
            }
            toast("Meeting Created");
        } catch (error) {
            console.error(error);
            toast("Failed to create Meeting");
        }
    };

    const shouldShowLoader = !client || !user;

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

    useEffect(() => {
        if (
            (meetingState === "isInstantMeeting" || meetingState === "isScheduleMeeting") &&
            !isDateTimePicked
        ) {
            const interval = setInterval(() => {
                setValues((prev) => ({
                    ...prev,
                    dateTime: new Date(),
                }));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [meetingState, isDateTimePicked]);


    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {shouldShowLoader ? (
                <Loader />
            ) : (
                <>
                    <HomeCard
                        img="/icons/add-meeting.svg"
                        title="New Meeting"
                        description="Start an instant meeting"
                        handleClick={() => setMeetingState("isInstantMeeting")}
                    />
                    <HomeCard
                        img="/icons/join-meeting.svg"
                        title="Join Meeting"
                        description="via Invitation Link"
                        className="bg-blue-1"
                        handleClick={() => setMeetingState("isJoiningMeeting")}
                    />
                    <HomeCard
                        img="/icons/schedule.svg"
                        title="Schedule Meeting"
                        description="Plan your meeting"
                        className="bg-purple-1"
                        handleClick={() => setMeetingState("isScheduleMeeting")}
                    />
                    <HomeCard
                        img="/icons/recordings.svg"
                        title="View Recordings"
                        description="Meeting Recordings"
                        className="bg-yellow-1"
                        handleClick={() => router.push("/recordings")}
                    />

                    {!callDetail ? (
                        <MeetingModal
                            isOpen={meetingState === "isScheduleMeeting"}
                            onClose={() => {
                                setMeetingState(undefined);
                                setCallDetail(undefined);
                                setValues(initialValues);
                                setIsDateTimePicked(false);
                            }}
                            title="Create Meeting"
                            handleClick={createMeeting}
                        >
                            <div className="flex flex-col gap-2.5">
                                <label className="text-base font-normal leading-[22.4px] text-sky-2">
                                    Add a description
                                </label>
                                <Textarea
                                    required
                                    className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    onChange={(e) =>
                                        setValues({ ...values, description: e.target.value })
                                    }
                                />
                            </div>
                            <div className="flex w-full flex-col gap-2.5">
                                <label className="text-base font-normal leading-[22.4px] text-sky-2">
                                    Select Date and Time
                                </label>
                                <ReactDatePicker
                                    selected={values.dateTime}
                                    onChange={(date) => {
                                        setValues({ ...values, dateTime: date! });
                                        setIsDateTimePicked(true);
                                    }}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={5}
                                    timeCaption="time"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    className="w-full rounded bg-dark-3 p-2 focus:outline-none"
                                />
                            </div>
                        </MeetingModal>
                    ) : (
                        <MeetingModal
                            isOpen={meetingState === "isScheduleMeeting"}
                            onClose={() => {
                                setMeetingState(undefined);
                                setCallDetail(undefined);
                                setValues(initialValues);
                                setIsDateTimePicked(false);
                            }}
                            title="Meeting Created"
                            handleClick={() => {
                                navigator.clipboard.writeText(meetingLink);
                                toast("Link Copied");
                            }}
                            image={"/icons/checked.svg"}
                            buttonIcon="/icons/copy.svg"
                            className="text-center"
                            buttonText="Copy Meeting Link"
                        />
                    )}

                    <MeetingModal
                        isOpen={meetingState === "isJoiningMeeting"}
                        onClose={() => setMeetingState(undefined)}
                        title="Type the link here"
                        className="text-center"
                        buttonText="Join Meeting"
                        handleClick={() => router.push(values.link)}
                    >
                        <Input
                            placeholder="Meeting link"
                            onChange={(e) => setValues({ ...values, link: e.target.value })}
                            className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </MeetingModal>

                    <MeetingModal
                        isOpen={meetingState === "isInstantMeeting"}
                        onClose={() => setMeetingState(undefined)}
                        title="Start an Instant Meeting"
                        className="text-center"
                        buttonText="Start Meeting"
                        handleClick={createMeeting}
                    />
                </>
            )}
        </section>
    );
};

export default MeetingTypeList;