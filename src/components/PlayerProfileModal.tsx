import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PlayerProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    player: {name:string; id:string} | null;
}

const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({open, onOpenChange, player}) => {
    if (!player) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="font-orbitron">Player Profile</DialogTitle>
          <DialogDescription className="font-rajdhani">
            You're viewing the profile for <strong>{player.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 font-rajdhani space-y-2">
          <p><strong>Name:</strong> {player.name}</p>
          <p><strong>Notification ID:</strong> {player.id}</p>
        </div>

        <div className="mt-6">
          <Button onClick={() => onOpenChange(false)} className="font-rajdhani">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
)

export default PlayerProfileModal;