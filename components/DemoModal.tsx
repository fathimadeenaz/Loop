"use client";

import { useState } from "react";
import Image from "next/image";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DemoModal = ({ demo }: { demo: string }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent className="shad-alert-dialog">
                    <AlertDialogHeader className="relative flex justify-center">
                        <AlertDialogTitle className="h2 text-center">
                            Welcome to LOOP!
                            <Image
                                src="/icons/close.svg"
                                alt="close"
                                width={20}
                                height={20}
                                onClick={() => setIsOpen(false)}
                                className="close-button"
                            />
                        </AlertDialogTitle>
                        <AlertDialogDescription className="subtitle-2  text-light-100">
                            <br />
                            As a demo user, you&apos;ve been restricted to explore LOOP&apos;s certain features and functionalities only.
                            <br /><br />
                            You&apos;re limited to start/join/schedule a total of 10 meets only.
                            <br /><br />
                            {demo === "vifefo4696" && (
                                <>
                                    To test out the &apos;Join Meeting&apos; feature, log in from another session
                                    using the credentials:<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Username: cacis78559<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  Password: cacis78559
                                    <br /><br />
                                </>
                            )}
                            <span className="h4 font-bold">Create an account to unlock all our features!</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default DemoModal;