'use client';

import { Badge } from '@/components/ui/badge';
import { Crown, Edit, Shield } from 'lucide-react';
import { useGetCurrentMemberRole } from '../hooks/workspace-members';
import { MEMBER_ROLE } from '@prisma/client';

interface RoleBadgeProps {
  workspaceId: string;
  showIcon?: boolean;
}

export default function RoleBadge({ workspaceId, showIcon = true }: RoleBadgeProps) {
  const { data: role, isLoading } = useGetCurrentMemberRole(workspaceId);

  if (isLoading || !role) return null;

  const getRoleConfig = (role: MEMBER_ROLE) => {
    switch (role) {
      case MEMBER_ROLE.ADMIN:
        return {
          label: 'Admin',
          icon: Crown,
          className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        };
      case MEMBER_ROLE.EDITOR:
        return {
          label: 'Editor',
          icon: Edit,
          className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        };
      case MEMBER_ROLE.VIEWER:
        return {
          label: 'Viewer',
          icon: Shield,
          className: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
        };
      default:
        return {
          label: 'Member',
          icon: Shield,
          className: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
        };
    }
  };

  const config = getRoleConfig(role);
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} text-xs`}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
}
