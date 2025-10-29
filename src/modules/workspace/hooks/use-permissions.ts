'use client';

import { useQuery } from '@tanstack/react-query';
import { checkPermission } from '../actions/workspace-members';
import { MEMBER_ROLE } from '@prisma/client';

/**
 * Hook to check if the current user has a specific permission level in a workspace
 */
export const usePermission = (workspaceId: string, requiredRole: MEMBER_ROLE) => {
  return useQuery({
    queryKey: ['permission', workspaceId, requiredRole],
    queryFn: () => checkPermission(workspaceId, requiredRole),
    enabled: !!workspaceId,
  });
};

/**
 * Hook to check if user can edit (EDITOR or ADMIN role)
 */
export const useCanEdit = (workspaceId: string) => {
  return usePermission(workspaceId, MEMBER_ROLE.EDITOR);
};

/**
 * Hook to check if user is admin
 */
export const useIsAdmin = (workspaceId: string) => {
  return usePermission(workspaceId, MEMBER_ROLE.ADMIN);
};
