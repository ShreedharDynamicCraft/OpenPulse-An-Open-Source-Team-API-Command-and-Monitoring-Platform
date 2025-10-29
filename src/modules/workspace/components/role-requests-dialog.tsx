'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UserCheck, UserX, Clock, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import {
  usePendingRoleRequests,
  useApproveRoleRequest,
  useRejectRoleRequest,
} from '../hooks/use-role-requests';
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

interface RoleRequestsDialogProps {
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RoleRequestsDialog({
  workspaceId,
  open,
  onOpenChange,
}: RoleRequestsDialogProps) {
  const [requestToReject, setRequestToReject] = useState<string | null>(null);
  
  const { data: requests, isLoading } = usePendingRoleRequests(workspaceId);
  const approveRequest = useApproveRoleRequest(workspaceId);
  const rejectRequest = useRejectRoleRequest(workspaceId);

  const handleApprove = async (requestId: string, userName: string) => {
    try {
      await approveRequest.mutateAsync(requestId);
      toast.success(`Approved ${userName}'s request for Editor access`);
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async () => {
    if (!requestToReject) return;
    
    try {
      await rejectRequest.mutateAsync({
        requestId: requestToReject,
        reason: 'Request declined by admin',
      });
      toast.success('Request rejected');
      setRequestToReject(null);
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Role Upgrade Requests</DialogTitle>
            <DialogDescription>
              Review and approve/reject requests from team members wanting Editor access
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Clock className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : !requests || requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserCheck className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                No pending role requests
              </p>
            </div>
          ) : (
            <ScrollArea className="max-h-[500px] pr-4">
              <div className="space-y-4">
                {requests.map((request: any) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={request.requestedBy.user.image} />
                          <AvatarFallback>
                            {request.requestedBy.user.name?.[0]?.toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {request.requestedBy.user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.requestedBy.user.email}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{request.currentRole}</Badge>
                      <span className="text-muted-foreground">→</span>
                      <Badge className="bg-blue-500">{request.requestedRole}</Badge>
                    </div>

                    {request.message && (
                      <div className="bg-muted p-3 rounded-md">
                        <div className="flex items-start gap-2 mb-1">
                          <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">
                            Message:
                          </span>
                        </div>
                        <p className="text-sm ml-6">{request.message}</p>
                      </div>
                    )}

                    <Separator />

                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRequestToReject(request.id)}
                        disabled={rejectRequest.isPending}
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleApprove(request.id, request.requestedBy.user.name)
                        }
                        disabled={approveRequest.isPending}
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!requestToReject}
        onOpenChange={() => setRequestToReject(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Role Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this role upgrade request? The user
              will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject}>
              Reject Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
