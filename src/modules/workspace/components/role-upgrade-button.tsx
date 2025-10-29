'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowUpCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRequestRoleUpgrade, useMyRoleRequests } from '../hooks/use-role-requests';
import { MEMBER_ROLE } from '@prisma/client';
import { Badge } from '@/components/ui/badge';

interface RoleUpgradeButtonProps {
  workspaceId: string;
  currentRole: MEMBER_ROLE;
}

export default function RoleUpgradeButton({ workspaceId, currentRole }: RoleUpgradeButtonProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  const requestUpgrade = useRequestRoleUpgrade(workspaceId);
  const { data: myRequests } = useMyRoleRequests(workspaceId);

  // Check if there's a pending request
  const hasPendingRequest = myRequests?.some((req: any) => req.status === 'PENDING');

  const handleSubmit = async () => {
    try {
      await requestUpgrade.mutateAsync({
        requestedRole: MEMBER_ROLE.EDITOR,
        message: message.trim() || undefined,
      });
      toast.success('Role upgrade request sent to admins!');
      setOpen(false);
      setMessage('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send request');
    }
  };

  // Only show for viewers
  if (currentRole !== MEMBER_ROLE.VIEWER) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={hasPendingRequest}
          >
            <ArrowUpCircle className="w-4 h-4" />
            {hasPendingRequest ? 'Request Pending' : 'Request Editor Access'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Editor Access</DialogTitle>
            <DialogDescription>
              You currently have Viewer access. Request Editor permissions to create and modify collections and requests.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message to Admins (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Explain why you need Editor access..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {message.length}/500 characters
              </p>
            </div>

            {myRequests && myRequests.length > 0 && (
              <div className="space-y-2">
                <Label>Your Recent Requests</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {myRequests.slice(0, 3).map((req: any) => (
                    <div
                      key={req.id}
                      className="text-sm p-2 border rounded-md flex items-center justify-between"
                    >
                      <span className="text-muted-foreground">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                      <Badge
                        variant={
                          req.status === 'APPROVED'
                            ? 'default'
                            : req.status === 'REJECTED'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {req.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={requestUpgrade.isPending}
            >
              {requestUpgrade.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
