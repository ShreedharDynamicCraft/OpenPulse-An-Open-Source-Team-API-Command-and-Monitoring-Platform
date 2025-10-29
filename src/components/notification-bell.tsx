'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Bell, UserPlus, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePendingRoleRequests } from '@/modules/workspace/hooks/use-role-requests';
import { useGetCurrentMemberRole } from '@/modules/workspace/hooks/workspace-members';
import { MEMBER_ROLE } from '@prisma/client';
import RoleRequestsDialog from '@/modules/workspace/components/role-requests-dialog';

interface NotificationBellProps {
  workspaceId: string;
}

export default function NotificationBell({ workspaceId }: NotificationBellProps) {
  const [requestsDialogOpen, setRequestsDialogOpen] = useState(false);
  
  const { data: currentRole } = useGetCurrentMemberRole(workspaceId);
  
  // Only show for admins
  const isAdmin = currentRole === MEMBER_ROLE.ADMIN;
  
  // Only fetch pending requests if user is admin
  const { data: pendingRequests } = usePendingRoleRequests(workspaceId, isAdmin);
  const pendingCount = pendingRequests?.length || 0;

  if (!isAdmin || !workspaceId) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {pendingCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                variant="destructive"
              >
                {pendingCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {pendingCount === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No new notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              <button
                onClick={() => setRequestsDialogOpen(true)}
                className="w-full px-4 py-3 hover:bg-accent rounded-sm text-left transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      {pendingCount} {pendingCount === 1 ? 'member wants' : 'members want'} Editor access
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Review {pendingCount === 1 ? 'request' : 'requests'} and approve or reject
                    </p>
                  </div>
                  <Badge variant="destructive" className="shrink-0">
                    {pendingCount}
                  </Badge>
                </div>
              </button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <RoleRequestsDialog
        workspaceId={workspaceId}
        open={requestsDialogOpen}
        onOpenChange={setRequestsDialogOpen}
      />
    </>
  );
}
