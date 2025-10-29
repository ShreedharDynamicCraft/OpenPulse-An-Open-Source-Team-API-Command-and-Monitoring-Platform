'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

export default function SSOCallbackPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Wait for Clerk to fully load
    if (!isLoaded || hasRedirected) return;

    // Give Clerk a moment to complete authentication
    const timer = setTimeout(() => {
      if (isSignedIn) {
        // Check if there's a pending invite token
        const pendingToken = typeof window !== 'undefined' 
          ? sessionStorage.getItem('pendingInviteToken')
          : null;

        console.log('SSO Callback - Signed in, pending token:', pendingToken);

        setHasRedirected(true);

        if (pendingToken) {
          // Redirect to invite page
          window.location.href = `/invite/${pendingToken}`;
        } else {
          // No pending invite, go to home
          window.location.href = '/';
        }
      } else {
        console.log('SSO Callback - Not signed in yet, redirecting to sign-in');
        // If still not signed in after waiting, go back to sign-in
        setHasRedirected(true);
        window.location.href = '/sign-in';
      }
    }, 500); // Wait 500ms for Clerk to complete auth

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn, hasRedirected]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
        <p className="text-sm text-muted-foreground">Completing sign-in...</p>
      </div>
    </div>
  );
}
