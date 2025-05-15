
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Music } from "lucide-react";

const TrackInfo = ({ currentTrack, isLiked, onLikeToggle }) => {
  if (!currentTrack) {
    return (
      <div className="flex items-center space-x-3 md:space-x-4 opacity-50">
        <div className="h-12 w-12 md:h-14 md:w-14 rounded-lg bg-muted/30 flex items-center justify-center">
          <Music className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex flex-col">
          <div className="text-sm md:text-base font-semibold text-muted-foreground">No track selected</div>
          <div className="text-xs md:text-sm text-muted-foreground/70">- - -</div>
        </div>
      </div>
    );
  }
  
  const imageSrc = currentTrack.album?.images?.[0]?.url || "https://source.unsplash.com/random/100x100?abstract-albumart";

  return (
    <div className="flex items-center space-x-3 md:space-x-4 overflow-hidden">
      <div className="h-12 w-12 md:h-14 md:w-14 rounded-lg overflow-hidden shadow-md flex-shrink-0 border border-border/50">
        <img 
          alt={currentTrack.album?.name || currentTrack.name}
          class="h-full w-full object-cover"
         src="https://images.unsplash.com/photo-1632667113908-10f5dbafa8a1" />
      </div>
      <div className="flex flex-col overflow-hidden min-w-0">
        <h4 className="text-sm md:text-base font-semibold truncate text-foreground hover:text-primary transition-colors cursor-pointer">{currentTrack.name}</h4>
        <p className="text-xs md:text-sm text-muted-foreground truncate">
          {currentTrack.artists?.map(artist => artist.name).join(", ") || "Unknown Artist"}
        </p>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className={`rounded-full transition-all duration-200 ease-out ml-auto flex-shrink-0 ${isLiked ? 'text-accent neon-glow-accent' : 'text-muted-foreground hover:text-accent'}`}
        onClick={onLikeToggle}
      >
        <Heart className={`h-5 w-5 ${isLiked ? 'fill-accent' : ''}`} />
      </Button>
    </div>
  );
};

export default TrackInfo;
