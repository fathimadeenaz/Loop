import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST() {
    const { userId } = await auth();

    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const user = await (await clerkClient())?.users?.getUser(userId);
    const currentCount = Number(user.publicMetadata.meetingCount) || 0;

    if (currentCount >= 10) {
        return new Response(JSON.stringify({ allowed: false }), { status: 200 });
    }

    await (await clerkClient())?.users?.updateUser(userId, {
        publicMetadata: {
            meetingCount: currentCount + 1,
        },
    });

    return new Response(JSON.stringify({ allowed: true }), { status: 200 });
}
