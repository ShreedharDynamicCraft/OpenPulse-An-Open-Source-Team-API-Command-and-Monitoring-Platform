import { useUser, useClerk } from "@clerk/nextjs";

// Export Clerk hooks for use throughout the app
export const useSession = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  return {
    user,
    isLoaded,
    isSignedIn,
  };
};

export { useClerk };