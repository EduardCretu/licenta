// app/+not-found.tsx
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

// ''Page'' to reroute to /login since metro is flaky on me
export default function NotFound() {
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        // Only redirect if router has initialized and no segments exist
        if (segments.length === 0) {
          router.replace('(auth)'); // or '(dashboard)' if logged in
        }
    }, [segments]);

    return null; // nothing rendered
}