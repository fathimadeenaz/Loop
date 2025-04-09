"use client"

import { ReactNode } from "react";

import { Button } from "@/components/ui/button";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    const handleDemoClick = () => {
        alert("Use the following credentials to login:\nUsername: vifefo4696\nPassword: vifefo4696");
    };
    return (
        <main className="relative flex h-screen w-full items-center justify-center">
            {children}
            <Button className="demo-button"
                onClick={handleDemoClick}
            >
                Demo LOOP
            </Button>
        </main>
    );
}

export default AuthLayout