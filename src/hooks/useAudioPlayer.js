
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useAudioPlayer = (currentTrack, onNext, onPrevious) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const audioRef = useRef(null);
  const animationFrameRef = useRef(null);
  const { toast } = useToast();

  const handlePlaybackError = useCallback((errorEvent) => {
    const error = errorEvent.target?.error;
    const errorMessage = error ? `Error code ${error.code}: ${error.message}` : "Unknown playback error.";
    console.error("Playback error:", errorMessage, errorEvent);
    toast({
      title: "Playback Error",
      description: `Could not play track. ${errorMessage}`,
      variant: "destructive",
    });
    setIsPlaying(false);
  }, [toast]);

  const updateProgress = useCallback(() => {
    if (audioRef.current && audioRef.current.readyState >= 2) { // HAVE_CURRENT_DATA or more
      setCurrentTime(audioRef.current.currentTime * 1000);
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('error', handlePlaybackError);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('error', handlePlaybackError);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handlePlaybackError]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.preview_url || "";
      audioRef.current.load(); // Important to load new source
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          animationFrameRef.current = requestAnimationFrame(updateProgress);
        }).catch(e => {
          // Autoplay was prevented or another error
          setIsPlaying(false);
          if (e.name !== 'AbortError') { // AbortError is common if user changes track quickly
             handlePlaybackError({ target: { error: { code: e.code, message: e.message } } });
          }
        });
      } else {
         setIsPlaying(true); // Fallback for browsers not returning a promise
         animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    } else if (!currentTrack && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentTrack, updateProgress, handlePlaybackError]);


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    if (!currentTrack) {
      toast({
        title: "No Track Selected",
        description: "Please select a track to play.",
        variant: "destructive",
      });
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          animationFrameRef.current = requestAnimationFrame(updateProgress);
        }).catch(e => {
           if (e.name !== 'AbortError') {
             handlePlaybackError({ target: { error: { code: e.code, message: e.message } } });
           }
        });
      } else {
         animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleTimeChange = (newValue) => {
    if (audioRef.current) {
      const newTimeSeconds = newValue[0] / 1000;
      audioRef.current.currentTime = newTimeSeconds;
      setCurrentTime(newValue[0]);
    }
  };
  
  const handleVolumeChange = (newValue) => {
    setVolume(newValue);
    setIsMuted(newValue[0] === 0);
  };
  
  const toggleMute = () => setIsMuted(!isMuted);
  
  const toggleRepeat = () => {
    setIsRepeat(prev => {
      if (audioRef.current) audioRef.current.loop = !prev;
      return !prev;
    });
  };
  
  const handleEnded = () => {
    if (!isRepeat) { // if repeat is on, loop handles it.
      onNext();
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration * 1000);
    }
  };

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isRepeat,
    togglePlayPause,
    handleTimeChange,
    handleVolumeChange,
    toggleMute,
    toggleRepeat,
    handleEnded,
    onLoadedMetadata,
    setIsPlaying, 
    setCurrentTime, 
    setDuration,
  };
};
