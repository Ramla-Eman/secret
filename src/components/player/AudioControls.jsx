
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Volume2, 
  VolumeX 
} from "lucide-react";

export const formatTime = (milliseconds) => {
  if (!milliseconds && milliseconds !== 0) return "-:--";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const AudioControls = ({
  isPlaying,
  isRepeat,
  isShuffle,
  currentTime,
  duration,
  volume,
  isMuted,
  onPlayPause,
  onNext,
  onPrevious,
  onRepeatToggle,
  onShuffleToggle,
  onTimeChange,
  onVolumeChange,
  onMuteToggle,
}) => {
  return (
    <div className="flex flex-col items-center space-y-2 w-full">
      <div className="flex items-center space-x-3 md:space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full transition-colors ${isShuffle ? 'text-primary neon-glow' : 'text-gray-400 hover:text-white'}`}
          onClick={onShuffleToggle}
        >
          <Shuffle className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-gray-300 hover:text-white"
          onClick={onPrevious}
        >
          <SkipBack className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
        
        <Button 
          variant="default" 
          size="icon" 
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center shadow-lg neon-glow"
          onClick={onPlayPause}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 md:h-6 md:w-6" />
          ) : (
            <Play className="h-5 w-5 md:h-6 md:w-6 ml-0.5" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-gray-300 hover:text-white"
          onClick={onNext}
        >
          <SkipForward className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full transition-colors ${isRepeat ? 'text-primary neon-glow' : 'text-gray-400 hover:text-white'}`}
          onClick={onRepeatToggle}
        >
          <Repeat className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </div>
      
      <div className="flex items-center w-full max-w-xs md:max-w-md space-x-2">
        <span className="text-xs text-gray-400 w-10 text-right">
          {formatTime(currentTime)}
        </span>
        <Slider 
          value={[currentTime]} 
          max={duration || 100}
          step={1000}
          onValueChange={onTimeChange}
          className="w-full"
        />
        <span className="text-xs text-gray-400 w-10">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default AudioControls;
