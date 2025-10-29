/**
 * Role Upgrade Request Actions
 * Handles Viewer → Editor role upgrade requests with admin approval
 */

'use server';

import db from '@/lib/db';
import { currentUser } from '@/modules/authentication/actions';
import { MEMBER_ROLE } from '@prisma/client';

export async function requestRoleUpgrade(
  workspaceId: string,
  requestedRole: MEMBER_ROLE,
  message?: string
) {
  const user = await currentUser();
  if (!user) throw new Error('Unauthorized');

  // Get current membership
  const membership = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  });

  if (!membership) throw new Error('Not a workspace member');
  if (membership.role !== MEMBER_ROLE.VIEWER) {
    throw new Error('Only viewers can request role upgrades');
  }
  if (requestedRole !== MEMBER_ROLE.EDITOR) {
    throw new Error('Can only request editor role');
  }

  // Check for existing pending request
  const existingRequest = await db.roleUpgradeRequest.findFirst({
    where: {
      workspaceId,
      requestedById: membership.id,
      status: 'PENDING',
    },
  });

  if (existingRequest) {
    throw new Error('You already have a pending role upgrade request');
  }

  // Create the request
  const request = await db.roleUpgradeRequest.create({
    data: {
      workspaceId,
      requestedById: membership.id,
      requestedRole,
      currentRole: membership.role,
      message,
    },
    include: {
      requestedBy: {
        include: {
          user: true,
        },
      },
    },
  });

  // Log activity
  await db.workspaceActivity.create({
    data: {
      workspaceId,
      userId: user.id,
      type: 'ROLE_REQUESTED',
      description: `${user.name} requested ${requestedRole} access`,
      metadata: {
        requestId: request.id,
        message,
      },
    },
  });

  // TODO: Create notifications for all admins
  // TODO: Send WebSocket event to admins

  return { success: true, requestId: request.id };
}

export async function getPendingRoleRequests(workspaceId: string) {
  const user = await currentUser();
  if (!user) throw new Error('Unauthorized');

  // Check if user is admin
  const membership = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  });

  if (!membership || membership.role !== MEMBER_ROLE.ADMIN) {
    throw new Error('Only admins can view role requests');
  }

  const requests = await db.roleUpgradeRequest.findMany({
    where: {
      workspaceId,
      status: 'PENDING',
    },
    include: {
      requestedBy: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return requests;
}

export async function approveRoleRequest(requestId: string) {
  const user = await currentUser();
  if (!user) throw new Error('Unauthorized');

  const request = await db.roleUpgradeRequest.findUnique({
    where: { id: requestId },
    include: {
      requestedBy: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!request) throw new Error('Request not found');

  // Check if user is admin
  const adminMembership = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: request.workspaceId,
      },
    },
  });

  if (!adminMembership || adminMembership.role !== MEMBER_ROLE.ADMIN) {
    throw new Error('Only admins can approve role requests');
  }

  // Update the member's role
  await db.workspaceMember.update({
    where: { id: request.requestedById },
    data: { role: request.requestedRole },
  });

  // Update the request status
  await db.roleUpgradeRequest.update({
    where: { id: requestId },
    data: {
      status: 'APPROVED',
      reviewedById: user.id,
      reviewedAt: new Date(),
    },
  });

  // Log activity
  await db.workspaceActivity.create({
    data: {
      workspaceId: request.workspaceId,
      userId: user.id,
      type: 'ROLE_REQUEST_APPROVED',
      description: `${user.name} approved ${request.requestedBy.user.name}'s request for ${request.requestedRole} access`,
      metadata: {
        requestId: request.id,
        newRole: request.requestedRole,
      },
    },
  });

  // TODO: Create notification for requester
  // TODO: Send WebSocket event

  return { success: true };
}

export async function rejectRoleRequest(requestId: string, reason?: string) {
  const user = await currentUser();
  if (!user) throw new Error('Unauthorized');

  const request = await db.roleUpgradeRequest.findUnique({
    where: { id: requestId },
    include: {
      requestedBy: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!request) throw new Error('Request not found');

  // Check if user is admin
  const adminMembership = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: request.workspaceId,
      },
    },
  });

  if (!adminMembership || adminMembership.role !== MEMBER_ROLE.ADMIN) {
    throw new Error('Only admins can reject role requests');
  }

  // Update the request status
  await db.roleUpgradeRequest.update({
    where: { id: requestId },
    data: {
      status: 'REJECTED',
      reviewedById: user.id,
      reviewedAt: new Date(),
    },
  });

  // Log activity
  await db.workspaceActivity.create({
    data: {
      workspaceId: request.workspaceId,
      userId: user.id,
      type: 'ROLE_REQUEST_REJECTED',
      description: `${user.name} rejected ${request.requestedBy.user.name}'s request for ${request.requestedRole} access`,
      metadata: {
        requestId: request.id,
        reason,
      },
    },
  });

  // TODO: Create notification for requester
  // TODO: Send WebSocket event

  return { success: true };
}

export async function getMyRoleRequests(workspaceId: string) {
  const user = await currentUser();
  if (!user) throw new Error('Unauthorized');

  const membership = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  });

  if (!membership) throw new Error('Not a workspace member');

  const requests = await db.roleUpgradeRequest.findMany({
    where: {
      requestedById: membership.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10, // Last 10 requests
  });

  return requests;
}
