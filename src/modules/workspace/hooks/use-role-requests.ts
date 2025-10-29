'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  requestRoleUpgrade,
  getPendingRoleRequests,
  approveRoleRequest,
  rejectRoleRequest,
  getMyRoleRequests,
} from '../actions/role-requests';
import { MEMBER_ROLE } from '@prisma/client';

export const useRequestRoleUpgrade = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestedRole, message }: { requestedRole: MEMBER_ROLE; message?: string }) =>
      requestRoleUpgrade(workspaceId, requestedRole, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-requests', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['my-role-requests', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['pending-role-requests', workspaceId] });
    },
  });
};

export const usePendingRoleRequests = (workspaceId: string, isAdmin: boolean = true) => {
  return useQuery({
    queryKey: ['pending-role-requests', workspaceId],
    queryFn: () => getPendingRoleRequests(workspaceId),
    enabled: !!workspaceId && isAdmin, // Only fetch if admin
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useApproveRoleRequest = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => approveRoleRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-role-requests', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['current-user-role', workspaceId] });
    },
  });
};

export const useRejectRoleRequest = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, reason }: { requestId: string; reason?: string }) =>
      rejectRoleRequest(requestId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-role-requests', workspaceId] });
    },
  });
};

export const useMyRoleRequests = (workspaceId: string) => {
  return useQuery({
    queryKey: ['my-role-requests', workspaceId],
    queryFn: () => getMyRoleRequests(workspaceId),
    enabled: !!workspaceId,
  });
};
