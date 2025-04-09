import { ReactNode } from "react"
import { Metadata } from "next";

import StreamVideoProvider from "@/providers/StreamClientProvider"

export const metadata: Metadata = {
    title: "Loop",
    description: "Stay in loop with the world",
    icons: {
        icon: "/icons/logo.svg",
    }
};

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main>
            <StreamVideoProvider>{children}</StreamVideoProvider>
        </main>
    )
}

export default RootLayout