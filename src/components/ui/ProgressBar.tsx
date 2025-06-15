// components/ui/ProgressBar.tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

export default function ProgressBar() {
    const pathname = usePathname();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Start the progress bar when path changes
        NProgress.start();

        // Finish the progress bar after a slight delay
        timeoutRef.current = setTimeout(() => {
        NProgress.done();
        }, 300); // Adjust this if needed

        // Clean up timeout on unmount or route change
        return () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        };
    }, [pathname]);

    return null;
}
