
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, ListMusic } from "lucide-react";

const VolumeControls = ({ volume, isMuted, onVolumeChange, onMuteToggle }) => {
  return (
    <div className="flex items-center justify-end space-x-2 md:space-x-3">
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full text-gray-400 hover:text-white"
        onClick={onMuteToggle}
      >
        {isMuted || volume[0] === 0 ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </Button>
      
      <Slider 
        value={isMuted ? [0] : volume} 
        max={100}
        step={1}
        onValueChange={onVolumeChange}
        className="w-20 md:w-24"
      />
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full text-gray-400 hover:text-white ml-1 md:ml-2"
      >
        <ListMusic className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default VolumeControls;
