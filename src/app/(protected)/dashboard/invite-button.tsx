"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Users, Loader2, X, Shield, Mail, Check } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InviteButton({ projectId }: { projectId: string }) {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const utils = api.useUtils();
  
  const { data: teamData, isLoading: isLoadingTeam, isFetching: isFetchingTeam } = api.project.getTeamMembers.useQuery(
    { projectId }, 
    { enabled: isOpen }
  );

  const addMember = api.project.addMember.useMutation({
    onSuccess: () => {
      toast.success("Team member invited successfully");
      setEmail("");
      utils.project.getTeamMembers.invalidate({ projectId });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to invite team member");
    },
  });

  const removeMember = api.project.removeMember.useMutation({
    onSuccess: () => {
      toast.success("Team member removed successfully");
      utils.project.getTeamMembers.invalidate({ projectId });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove team member");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    addMember.mutate({ projectId, emailAddress: email });
  };

  const handleRemoveClick = (memberId: string) => {
    setMemberToRemove(memberId);
  };

  const handleConfirmRemove = () => {
    if (memberToRemove) {
      removeMember.mutate({ projectId, memberId: memberToRemove });
      setMemberToRemove(null);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border/50 bg-transparent hover:bg-accent hover:text-accent-foreground text-muted-foreground rounded-xl text-sm font-bold transition-all active:scale-[0.98] cursor-pointer focus:ring-2 focus:ring-primary/20 focus:outline-none"
      >
        <Users className="h-4 w-4" />
        Manage Team
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Team</DialogTitle>
            <DialogDescription>
              Invite new members or manage existing access.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {teamData?.isOwner && (
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="Invite by email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={addMember.isPending || !email}
                  className="min-w-20"
                >
                  {addMember.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Invite"}
                </Button>
              </form>
            )}

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">Team Members</h4>
              
              {isLoadingTeam || isFetchingTeam ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {/* Owner */}
                  {teamData?.owner && (
                    <div className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-card">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{teamData.owner.emailAddress}</span>
                          <span className="text-xs text-muted-foreground">Owner</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Members */}
                  {teamData?.members?.map((member) => (
                    <div key={member.userId} className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-card">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          {member.status === "ACCEPTED" ? (
                             <Check className="h-4 w-4 text-green-500" />
                          ) : member.status === "PENDING" ? (
                             <Mail className="h-4 w-4 text-amber-500" />
                          ) : member.status === "DECLINED" ? (
                             <X className="h-4 w-4 text-red-500" />
                          ) : (
                             <Users className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{member.user.emailAddress}</span>
                          <span className="text-xs text-muted-foreground">
                            {member.status === "PENDING" ? "Pending Invite" : member.status === "DECLINED" ? "Declined" : "Member"}
                          </span>
                        </div>
                      </div>
                      
                      {teamData.isOwner && (
                        <button
                          onClick={() => handleRemoveClick(member.userId)}
                          disabled={removeMember.isPending}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                          title="Remove member"
                        >
                          {removeMember.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  ))}

                  {teamData?.members?.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-2">
                      No other members in this project.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the user&apos;s access to the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
