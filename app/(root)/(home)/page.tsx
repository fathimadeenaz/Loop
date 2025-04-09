"use client"

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

import MeetingTypeList from "@/components/MeetingTypeList";
import DemoModal from "@/components/DemoModal";
import { useGetCalls } from "@/hooks/useGetCalls";
import UpcomingPageContent from "@/components/UpcomingPageContent";

const Home = () => {
    const { user } = useUser();
    const [now, setNow] = useState(new Date());

    const { upcomingCalls } = useGetCalls(false);
    const upcomingCall = (upcomingCalls ?? []);
    const nextMeeting = upcomingCall[upcomingCall.length - 1]?.state?.startsAt?.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const date = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(now);

    return (
        <section className="flex size-full flex-col gap-5 text-white">
            <div className="h-[303px] w-full rounded-[20px] bg-hero bg-cover">
                <div className="flex h-full flex-col justify-between max-lg:px-5 max-lg:py-8 lg:p-11">
                    <h2 className="glassmorphism max-w-[273px] rounded py-2 text-center text-base font-normal mb-6">
                        {upcomingCall.length > 0
                            ? `Upcoming Meeting at: ${nextMeeting}`
                            : "No Upcoming Meetings"}
                    </h2>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
                        <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
                    </div>
                </div>
            </div>

            <MeetingTypeList />

            <UpcomingPageContent simplified={true} />

            {(user?.username === "vifefo4696" || user?.username === "cacis78559") && (
                <DemoModal demo={user.username} />
            )}
        </section>
    );
};

export default Home;
