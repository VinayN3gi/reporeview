"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Loader2, MailPlus } from "lucide-react";
import { toast } from "sonner";

export function InvitationModal() {
  const { data: invitations, refetch: refetchInvitations } = api.project.getPendingInvitations.useQuery();
  const respondMutation = api.project.respondToInvitation.useMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentInvite, setCurrentInvite] = useState<any>(null);
  const utils = api.useUtils();

  useEffect(() => {
    if (invitations && invitations.length > 0) {
      setCurrentInvite(invitations[0]);
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setCurrentInvite(null);
    }
  }, [invitations]);

  const handleRespond = async (accept: boolean) => {
    if (!currentInvite) return;
    
    try {
      await respondMutation.mutateAsync({ projectId: currentInvite.projectId, accept });
      toast.success(accept ? "Invitation accepted! Welcome to the team." : "Invitation declined.");
      setIsOpen(false);
      await utils.project.getProjects.invalidate();
      await refetchInvitations();
    } catch (err) {
      toast.error("Failed to respond to invitation");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  if (!currentInvite) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center gap-2 mb-2 pt-4">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
             <MailPlus className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl">Project Invitation</DialogTitle>
          <DialogDescription className="text-center">
            You have been invited to collaborate on<br/> 
            <strong className="text-foreground text-base mt-2 inline-block">{currentInvite.project.name}</strong>
            <br/>
            <span className="text-sm mt-1 inline-block text-muted-foreground">
              by {currentInvite.project.user.firstname || ""} {currentInvite.project.user.lastname || ""} 
              ({currentInvite.project.user.emailAddress})
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-row sm:space-x-0 gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleRespond(false)}
            disabled={respondMutation.isPending}
            className="flex-1"
          >
            Decline
          </Button>
          <Button 
            onClick={() => handleRespond(true)}
            disabled={respondMutation.isPending}
            className="flex-1 flex items-center gap-2"
          >
            {respondMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Accept Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
