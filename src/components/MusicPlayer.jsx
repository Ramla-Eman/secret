
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import AudioControls from "@/components/player/AudioControls";
import TrackInfo from "@/components/player/TrackInfo";
import VolumeControls from "@/components/player/VolumeControls";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";

const MusicPlayer = ({ currentTrack, onNext, onPrevious, isShuffle: appIsShuffle, setIsShuffle: appSetIsShuffle, token }) => {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  
  const {
    audioRef,
    isPlaying: isLocalPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isRepeat: isLocalRepeat,
    togglePlayPause: localTogglePlayPause,
    handleTimeChange,
    handleVolumeChange: localHandleVolumeChange,
    toggleMute: localToggleMute,
    toggleRepeat: localToggleRepeatHandler,
    handleEnded,
    onLoadedMetadata,
  } = useAudioPlayer(currentTrack, onNext, onPrevious);

  const {
    deviceId,
    isPlaying: isSpotifyPlaying,
    isRepeat: isSpotifyRepeat,
    handleSpotifyPlayPause,
    handleSpotifyRepeatToggle,
    handleSpotifyShuffleToggle,
    handleSpotifyVolumeChange,
    // Add other Spotify specific controls if needed e.g. handleSpotifyNext, handleSpotifyPrevious
  } = useSpotifyPlayer(token, currentTrack, appIsShuffle, appSetIsShuffle, localTogglePlayPause, localToggleRepeatHandler, toast, onNext, onPrevious);

  const effectiveIsPlaying = token && deviceId ? isSpotifyPlaying : isLocalPlaying;
  const effectiveIsRepeat = token && deviceId ? isSpotifyRepeat.isRepeating : isLocalRepeat;

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from Liked" : "Added to Liked",
      description: `${currentTrack?.name} by ${currentTrack?.artists.map(a => a.name).join(", ")}`,
    });
  };
  
  const combinedPlayPause = async () => {
    if (token && deviceId && currentTrack?.uri) {
      await handleSpotifyPlayPause();
    } else {
      localTogglePlayPause();
    }
  };

  const combinedRepeatToggle = async () => {
    if (token && deviceId) {
      await handleSpotifyRepeatToggle();
    } else {
      localToggleRepeatHandler();
    }
  };
  
  const combinedShuffleToggle = async () => {
     if (token && deviceId) {
      await handleSpotifyShuffleToggle();
    } else {
      appSetIsShuffle(!appIsShuffle);
      toast({ title: !appIsShuffle ? "Shuffle On (Local)" : "Shuffle Off (Local)" });
    }
  };

  const combinedVolumeChange = async (newVolume) => {
    if (token && deviceId) {
      await handleSpotifyVolumeChange(newVolume);
    }
    localHandleVolumeChange(newVolume); // always update local for visual feedback
  };

  return (
    <motion.div 
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 25, delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 glass-effect border-t border-border/70 py-3.5 px-5 z-50 player-gradient"
    >
      <div className="max-w-screen-xl mx-auto grid grid-cols-[1fr_auto_1fr] md:grid-cols-[minmax(200px,1fr)_minmax(300px,2fr)_minmax(200px,1fr)] items-center gap-4 md:gap-6">
        <TrackInfo 
          currentTrack={currentTrack}
          isLiked={isLiked}
          onLikeToggle={toggleLike}
        />
        
        <AudioControls
          isPlaying={effectiveIsPlaying}
          isRepeat={effectiveIsRepeat}
          isShuffle={appIsShuffle}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={combinedPlayPause}
          onNext={onNext} // Could also be combined if Spotify next/prev is implemented
          onPrevious={onPrevious} // Could also be combined
          onRepeatToggle={combinedRepeatToggle}
          onShuffleToggle={combinedShuffleToggle}
          onTimeChange={handleTimeChange} // Time seeking for <audio> element. Spotify seeking is separate.
        />
        
        <VolumeControls
          volume={volume} // This reflects local slider state
          isMuted={isMuted} // This reflects local slider state
          onVolumeChange={combinedVolumeChange}
          onMuteToggle={localToggleMute} // Could also be combined if Spotify mute is implemented
        />
      </div>
      
      <audio 
        ref={audioRef}
        onEnded={handleEnded}
        onLoadedMetadata={onLoadedMetadata}
      />
    </motion.div>
  );
};

export default MusicPlayer;
