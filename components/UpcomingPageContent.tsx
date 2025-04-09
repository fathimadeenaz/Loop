import Link from "next/link";
import CallList from "@/components/CallList";

const UpcomingPageContent = ({ simplified = false }: { simplified?: boolean }) => {
    return (
        <section className={`flex size-full flex-col gap-10 text-white ${simplified ? "mt-6" : ""}`}>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Upcoming Meetings</h1>
                {simplified && (
                    <Link href="/upcoming" className="text-lg text-sky-1">
                        See All
                    </Link>
                )}
            </div>

            <CallList type="upcoming" simplified={simplified} />
        </section>
    );
};

export default UpcomingPageContent;
