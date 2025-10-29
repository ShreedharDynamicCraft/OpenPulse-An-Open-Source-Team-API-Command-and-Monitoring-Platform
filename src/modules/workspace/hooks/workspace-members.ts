'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  updateMemberRole,
  removeMemberFromWorkspace,
  getCurrentUserRole,
} from '../actions/workspace-members';
import { MEMBER_ROLE } from '@prisma/client';

export const useUpdateMemberRole = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: MEMBER_ROLE }) =>
      updateMemberRole(memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspace-members', workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ['current-user-role', workspaceId],
      });
    },
  });
};

export const useRemoveMember = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => removeMemberFromWorkspace(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspace-members', workspaceId],
      });
    },
  });
};

export const useGetCurrentMemberRole = (workspaceId: string) => {
  return useQuery({
    queryKey: ['current-user-role', workspaceId],
    queryFn: () => getCurrentUserRole(workspaceId),
    enabled: !!workspaceId,
  });
};
