'use server';

import db from '@/lib/db';
import { currentUser } from '@/modules/authentication/actions';
import { MEMBER_ROLE } from '@prisma/client';

/**
 * Update a workspace member's role
 */
export const updateMemberRole = async (memberId: string, role: MEMBER_ROLE) => {
  const user = await currentUser();
  if (!user) throw new Error('Unauthorized');

  // Get the member to update
  const member = await db.workspaceMember.findUnique({
    where: { id: memberId },
    include: { workspace: true },
  });

  if (!member) throw new Error('Member not found');

  // Check if current user has permission to update roles
  const currentUserMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: member.workspaceId,
      },
    },
  });

  // Only workspace owner or admins can change roles
  const isOwner = member.workspace.ownerId === user.id;
  const isAdmin = currentUserMember?.role === MEMBER_ROLE.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new Error('You do not have permission to change roles');
  }

  // Can't change the owner's role
  if (member.workspace.ownerId === member.userId) {
    throw new Error('Cannot change the workspace owner role');
  }

  // Update the role
  const updatedMember = await db.workspaceMember.update({
    where: { id: memberId },
    data: { role },
    include: { user: true },
  });

  return updatedMember;
};

/**
 * Remove a member from a workspace
 */
export const removeMemberFromWorkspace = async (memberId: string) => {
  const user = await currentUser();
  if (!user) throw new Error('Unauthorized');

  // Get the member to remove
  const member = await db.workspaceMember.findUnique({
    where: { id: memberId },
    include: { workspace: true },
  });

  if (!member) throw new Error('Member not found');

  // Check if current user has permission to remove members
  const currentUserMember = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: member.workspaceId,
      },
    },
  });

  // Only workspace owner or admins can remove members
  const isOwner = member.workspace.ownerId === user.id;
  const isAdmin = currentUserMember?.role === MEMBER_ROLE.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new Error('You do not have permission to remove members');
  }

  // Can't remove the workspace owner
  if (member.workspace.ownerId === member.userId) {
    throw new Error('Cannot remove the workspace owner');
  }

  // Remove the member
  await db.workspaceMember.delete({
    where: { id: memberId },
  });

  return { success: true };
};

/**
 * Get current user's role in a workspace
 */
export const getCurrentUserRole = async (workspaceId: string) => {
  const user = await currentUser();
  if (!user) return null;

  const member = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  });

  // If user is the workspace owner, they have admin privileges
  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (workspace?.ownerId === user.id) {
    return MEMBER_ROLE.ADMIN;
  }

  return member?.role || null;
};

/**
 * Check if user has permission to perform an action
 */
export const checkPermission = async (
  workspaceId: string,
  requiredRole: MEMBER_ROLE
) => {
  const user = await currentUser();
  if (!user) return false;

  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
  });

  // Owner always has permission
  if (workspace?.ownerId === user.id) return true;

  const member = await db.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  });

  if (!member) return false;

  // Role hierarchy: ADMIN > EDITOR > VIEWER
  const roleHierarchy = {
    [MEMBER_ROLE.ADMIN]: 3,
    [MEMBER_ROLE.EDITOR]: 2,
    [MEMBER_ROLE.VIEWER]: 1,
  };

  return roleHierarchy[member.role] >= roleHierarchy[requiredRole];
};
