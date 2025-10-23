"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '../loading'; // Re-use the loading component

// This page now acts as a redirector to a new chat session.
export default function ChatRedirector() {
    const router = useRouter();

    useEffect(() => {
        // Create a unique ID for the new chat session
        const newChatId = Date.now().toString();
        router.push(`/chat/${newChatId}`);
    }, [router]);

    // Display a loading state while redirecting
    return <Loading />;
}