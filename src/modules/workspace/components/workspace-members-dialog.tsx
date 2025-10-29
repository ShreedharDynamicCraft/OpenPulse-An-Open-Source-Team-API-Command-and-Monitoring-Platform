'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Crown, Edit, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useGetWorkspaceMemebers } from '@/modules/invites/hooks/invites';
import { 
  useUpdateMemberRole, 
  useRemoveMember, 
  useGetCurrentMemberRole 
} from '@/modules/workspace/hooks/workspace-members';
import { useWorkspaceStore } from '@/modules/Layout/store';
import { MEMBER_ROLE } from '@prisma/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WorkspaceMembersDialogProps {
  workspaceId: string;
  workspaceOwnerId?: string;
}

export default function WorkspaceMembersDialog({ 
  workspaceId,
  workspaceOwnerId 
}: WorkspaceMembersDialogProps) {
  const [open, setOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  
  const { data: members, isLoading } = useGetWorkspaceMemebers(workspaceId);
  const { data: currentMemberRole } = useGetCurrentMemberRole(workspaceId);
  const updateRole = useUpdateMemberRole(workspaceId);
  const removeMember = useRemoveMember(workspaceId);

  const isAdmin = currentMemberRole === MEMBER_ROLE.ADMIN;
  const canManageMembers = isAdmin;

  const getRoleBadgeColor = (role: MEMBER_ROLE) => {
    switch (role) {
      case MEMBER_ROLE.ADMIN:
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case MEMBER_ROLE.EDITOR:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case MEMBER_ROLE.VIEWER:
        return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';
      default:
        return 'bg-zinc-100 text-zinc-700';
    }
  };

  const getRoleIcon = (role: MEMBER_ROLE) => {
    switch (role) {
      case MEMBER_ROLE.ADMIN:
        return <Crown className="w-3 h-3" />;
      case MEMBER_ROLE.EDITOR:
        return <Edit className="w-3 h-3" />;
      case MEMBER_ROLE.VIEWER:
        return <Shield className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const handleRoleChange = async (memberId: string, newRole: MEMBER_ROLE) => {
    if (!canManageMembers) {
      toast.error('You do not have permission to change roles');
      return;
    }

    try {
      await updateRole.mutateAsync({ memberId, role: newRole });
      toast.success('Member role updated successfully');
    } catch (error) {
      toast.error('Failed to update member role');
      console.error(error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!canManageMembers) {
      toast.error('You do not have permission to remove members');
      return;
    }

    try {
      await removeMember.mutateAsync(memberId);
      toast.success('Member removed from workspace');
      setMemberToRemove(null);
    } catch (error) {
      toast.error('Failed to remove member');
      console.error(error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            Manage Members
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Workspace Members</DialogTitle>
            <DialogDescription>
              Manage members and their roles in this workspace
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-zinc-500">Loading members...</p>
              </div>
            ) : members && members.length > 0 ? (
              <div className="space-y-3">
                {members.map((member: any) => {
                  const isOwner = member.userId === workspaceOwnerId;
                  const canModify = canManageMembers && !isOwner;

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.user.image || ''} />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            {member.user.name?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">
                              {member.user.name || 'Unknown User'}
                            </p>
                            {isOwner && (
                              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-xs">
                                <Crown className="w-3 h-3 mr-1" />
                                Owner
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500">
                            {member.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {canModify ? (
                          <Select
                            value={member.role || MEMBER_ROLE.VIEWER}
                            onValueChange={(value) =>
                              handleRoleChange(member.id, value as MEMBER_ROLE)
                            }
                            disabled={updateRole.isPending}
                            defaultValue={member.role || MEMBER_ROLE.VIEWER}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={MEMBER_ROLE.ADMIN}>
                                <div className="flex items-center gap-2">
                                  <Crown className="w-3 h-3" />
                                  Admin
                                </div>
                              </SelectItem>
                              <SelectItem value={MEMBER_ROLE.EDITOR}>
                                <div className="flex items-center gap-2">
                                  <Edit className="w-3 h-3" />
                                  Editor
                                </div>
                              </SelectItem>
                              <SelectItem value={MEMBER_ROLE.VIEWER}>
                                <div className="flex items-center gap-2">
                                  <Shield className="w-3 h-3" />
                                  Viewer
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className={getRoleBadgeColor(member.role)}>
                            <span className="mr-1">{getRoleIcon(member.role)}</span>
                            {member.role}
                          </Badge>
                        )}

                        {canModify && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMemberToRemove(member.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="w-12 h-12 text-zinc-400 mb-2" />
                <p className="text-sm text-zinc-500">No members found</p>
              </div>
            )}
          </ScrollArea>

          {!canManageMembers && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-xs text-amber-700 dark:text-amber-300">
                <Shield className="w-3 h-3 inline mr-1" />
                You don't have permission to manage members
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this member from the workspace?
              They will lose access to all workspace resources.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => memberToRemove && handleRemoveMember(memberToRemove)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
