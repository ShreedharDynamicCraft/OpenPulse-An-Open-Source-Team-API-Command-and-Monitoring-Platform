'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useQueryClient } from '@tanstack/react-query';
import { acceptWorkspaceInvite } from '@/modules/invites/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Users } from 'lucide-react';
import { toast } from 'sonner';

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default function InvitePage({ params }: InvitePageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isLoaded, isSignedIn, user } = useUser();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'waiting-auth'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState<string>('');
  const [attemptedAccept, setAttemptedAccept] = useState(false);

  // Get token from params
  useEffect(() => {
    params.then(({ token }) => {
      setToken(token);
    });
  }, [params]);

  // Handle invite acceptance once user is authenticated
  useEffect(() => {
    if (!isLoaded || !token) return;

    console.log('Invite page - isSignedIn:', isSignedIn, 'token:', token);

    // If not signed in, store token and redirect to sign-in
    if (!isSignedIn) {
      setStatus('waiting-auth');
      console.log('Invite page - Not signed in, storing token and redirecting to sign-in');
      // Store the invite token so we can check it after sign-in
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pendingInviteToken', token);
        console.log('Invite page - Token stored:', sessionStorage.getItem('pendingInviteToken'));
        // Redirect to sign-in page - Clerk will handle the redirect back
        window.location.href = '/sign-in';
      }
      return;
    }

    // User is signed in, attempt to accept invite (only once)
    if (isSignedIn && !attemptedAccept) {
      console.log('Invite page - Signed in, attempting to accept invite');
      setAttemptedAccept(true);
      
      // Check if we have a pending token from before sign-in
      const pendingToken = typeof window !== 'undefined' 
        ? sessionStorage.getItem('pendingInviteToken') 
        : null;
      
      console.log('Invite page - Pending token from storage:', pendingToken);
      
      if (pendingToken && pendingToken === token) {
        // Clear the stored token
        sessionStorage.removeItem('pendingInviteToken');
        console.log('Invite page - Cleared pending token');
      }
      
      acceptInvite();
    }
  }, [isLoaded, isSignedIn, token, attemptedAccept]);

  const acceptInvite = async () => {
    if (!token) return;
    
    setStatus('loading');
    
    try {
      const result = await acceptWorkspaceInvite(token);
      
      if (result.success) {
        setStatus('success');
        
        if (result.alreadyMember) {
          toast.info('You are already a member of this workspace');
        } else {
          toast.success('Successfully joined workspace!');
        }
        
        // Invalidate workspace-related queries to refresh member lists
        if (result.workspaceId) {
          queryClient.invalidateQueries({ queryKey: ['workspace-members', result.workspaceId] });
        }
        queryClient.invalidateQueries({ queryKey: ['workspace-members'] });
        queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        
        // Clear any stored token
        sessionStorage.removeItem('pendingInviteToken');
        
        // Redirect to workspace after 2 seconds
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 2000);
      } else {
        setStatus('error');
        setErrorMessage('Failed to accept invite');
      }
    } catch (error) {
      setStatus('error');
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage(message);
      
      if (message.includes('Unauthorized')) {
        toast.error('Authentication error. Please sign in again.');
        setTimeout(() => {
          router.push('/sign-in');
        }, 2000);
      } else if (message.includes('expired')) {
        toast.error('This invite link has expired');
      } else if (message.includes('Invalid')) {
        toast.error('Invalid invite link');
      } else {
        toast.error(message);
      }
    }
  };

  // Show loading while checking authentication
  if (!isLoaded || status === 'waiting-auth') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-4">
        <Card className="w-full max-w-md shadow-xl border-zinc-200 dark:border-zinc-800">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Workspace Invitation</CardTitle>
            <CardDescription>
              Redirecting to sign in...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Checking authentication...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-4">
      <Card className="w-full max-w-md shadow-xl border-zinc-200 dark:border-zinc-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Workspace Invitation</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Processing your invitation...'}
            {status === 'success' && 'Welcome to the workspace!'}
            {status === 'error' && 'Something went wrong'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Accepting invitation...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">You're all set!</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  You've been added to the workspace.
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                  Redirecting to workspace...
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Unable to Accept Invite</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  {errorMessage || 'The invitation link may be invalid or expired.'}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => router.push('/')}
                    variant="outline"
                  >
                    Go to Home
                  </Button>
                  <Button
                    onClick={() => router.push('/sign-in')}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}